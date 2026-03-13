import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "npm:@google/genai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY")

    const genAI = new GoogleGenAI({ apiKey })
    const body = await req.json()
    const { messages } = body

    const prompt = `Resuma os pontos principais desta conversa de WhatsApp em 3 tópicos curtos:
Conversa: ${messages}`

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    })

    return new Response(JSON.stringify({ summary: response.text }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Erro na IA' }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
