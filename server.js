
const express = require('express');
const path = require('path');
const app = express();

// Porta dinâmica para Hostinger ou 3000 local
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos do diretório raiz
// Isso permite que o index.tsx, App.tsx e outros sejam encontrados pelo navegador
app.use(express.static(__dirname));

// Rota para API Keys (Opcional: se precisar passar variáveis para o front de forma segura)
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
  });
});

// Middleware essencial para Single Page Application (SPA)
// Qualquer rota que não seja um arquivo físico (como /dashboard ou /login) 
// será redirecionada para o index.html, onde o React Router assume o controle.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Diretório base: ${__dirname}`);
});
