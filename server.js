
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware CRÍTICO: Força o MIME-type para arquivos TypeScript/React
// Isso resolve o erro 404 e o erro de "carregamento de recurso" na Hostinger
app.use((req, res, next) => {
  if (req.url.endsWith('.tsx') || req.url.endsWith('.ts') || req.url.endsWith('.jsx')) {
    const filePath = path.join(__dirname, req.url.split('?')[0]);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/javascript');
      return res.sendFile(filePath);
    }
  }
  next();
});

// Serve arquivos estáticos (Imagens, CSS, JS)
app.use(express.static(__dirname));

// Rota de diagnóstico para testar se o servidor está ativo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Menu ADS operando normalmente.' });
});

// Suporte para SPA (Single Page Application)
// Redireciona qualquer rota não encontrada para o index.html
app.get('*', (req, res) => {
  // Evita entrar em loop se o arquivo não existir
  if (req.path.includes('.') && !req.path.endsWith('.tsx')) {
    return res.status(404).send('Arquivo não encontrado');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>>> Servidor Menu ADS iniciado com sucesso.`);
  console.log(`>>> Rodando em: http://localhost:${PORT}`);
});
