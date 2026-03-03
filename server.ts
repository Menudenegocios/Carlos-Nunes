import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { supabase } from "./services/supabaseClient.js";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- MENUZAP PRO ADVANCED API ---
  
  const getUserIdFromToken = async (token: string) => {
    if (!token || !token.startsWith('MN-PRO-')) return null;
    const suffix = token.replace('MN-PRO-', '').toLowerCase();
    
    if (suffix === 'de30de30') return 'de30de30-0000-4000-a000-000000000000';

    const { data } = await supabase
      .from('profiles')
      .select('user_id')
      .ilike('user_id', `${suffix}%`)
      .single();
    
    return data?.user_id || null;
  };

  // Auth/Token Validation
  app.get("/api/menuzap/auth", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    
    if (!token || !token.startsWith('MN-PRO-')) {
      return res.status(401).json({ error: 'Token inválido ou mal formatado' });
    }

    const suffix = token.replace('MN-PRO-', '').toUpperCase();
    
    if (suffix === 'DE30DE30') {
      return res.json({ 
        status: 'authenticated', 
        userId: 'de30de30-0000-4000-a000-000000000000',
        businessName: 'Empresa de Demonstração' 
      });
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, business_name')
        .ilike('user_id', `${suffix.toLowerCase()}%`)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Usuário não encontrado no CRM' });
      }

      res.json({ 
        status: 'authenticated', 
        userId: data.user_id,
        businessName: data.business_name 
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });

  // Get All Leads for Kanban
  app.get("/api/menuzap/leads", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Erro ao buscar leads' });
    res.json({ leads: leads || [] });
  });

  // Get Lead Info & Kanban Stage
  app.get("/api/menuzap/lead-info", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const phone = req.query.phone as string;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('phone', phone)
      .single();

    res.json({ lead: lead || null });
  });

  // Move Lead Stage
  app.post("/api/menuzap/lead/move", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const { phone, stage } = req.body;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { error } = await supabase
      .from('leads')
      .update({ stage })
      .eq('user_id', userId)
      .eq('phone', phone);

    if (error) return res.status(500).json({ error: 'Erro ao mover lead' });
    res.json({ status: 'success' });
  });

  // Save Notes
  app.post("/api/menuzap/lead/notes", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const { phone, notes } = req.body;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('user_id', userId)
      .eq('phone', phone);

    if (error) return res.status(500).json({ error: 'Erro ao salvar notas' });
    res.json({ status: 'success' });
  });

  // AI Suggestion
  app.post("/api/menuzap/ai/suggest", async (req, res) => {
    const { messages, businessName } = req.body;
    
    try {
      const prompt = `Você é um assistente de vendas da empresa ${businessName}. 
      Com base no histórico de mensagens abaixo, sugira uma resposta curta, profissional e persuasiva para o cliente.
      Histórico: ${messages}
      Resposta sugerida:`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      res.json({ suggestion: response.text });
    } catch (e) {
      res.status(500).json({ error: 'Erro na IA' });
    }
  });

  // AI Summary
  app.post("/api/menuzap/ai/summary", async (req, res) => {
    const { messages } = req.body;
    
    try {
      const prompt = `Resuma os pontos principais desta conversa de WhatsApp em 3 tópicos curtos:
      Conversa: ${messages}`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      res.json({ summary: response.text });
    } catch (e) {
      res.status(500).json({ error: 'Erro na IA' });
    }
  });

  // Add Lead from WhatsApp (Original)
  app.post("/api/menuzap/lead", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const { name, phone, notes } = req.body;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { error } = await supabase.from('leads').insert({
      user_id: userId,
      name: name || 'Novo Lead WhatsApp',
      phone: phone,
      source: 'whatsapp',
      stage: 'new',
      notes: notes || 'Adicionado via Menuzap Pro',
      created_at: Date.now()
    });

    if (error) return res.status(500).json({ error: 'Erro ao salvar lead' });
    res.json({ status: 'success', message: 'Lead adicionado ao Kanban' });
  });

  // Add Schedule from WhatsApp (Original)
  app.post("/api/menuzap/schedule", async (req, res) => {
    const token = req.headers['x-menuzap-token'] as string;
    const { title, client, date, time, type } = req.body;
    const userId = await getUserIdFromToken(token);

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { error } = await supabase.from('schedule_items').insert({
      user_id: userId,
      title: title || 'Agendamento WhatsApp',
      client: client || 'Cliente WhatsApp',
      date: date,
      time: time,
      type: type || 'servico',
      status: 'pending'
    });

    if (error) return res.status(500).json({ error: 'Erro ao salvar agendamento' });
    res.json({ status: 'success', message: 'Agendamento salvo na agenda' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production setup
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
