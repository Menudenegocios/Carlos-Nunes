
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Configuração CRUCIAL de MIME types para o Babel no navegador
express.static.mime.define({'application/javascript': ['tsx', 'ts', 'jsx']});

// Log para debug no painel da Hostinger
console.log(">>> Iniciando servidor...");
console.log(">>> Diretório Atual (__dirname):", __dirname);
console.log(">>> Arquivos na raiz:", fs.readdirSync(__dirname).join(', '));

// Serve todos os arquivos da raiz como estáticos
app.use(express.static(__dirname));

// Rota de teste para verificar se o servidor está vivo
app.get('/api/ping', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Suporte a Single Page Application (SPA)
// IMPORTANTE: Só envia o index.html se a requisição NÃO for por um arquivo (que tenha ponto no nome)
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    console.log(">>> 404 Detectado para arquivo:", req.path);
    res.status(404).send('Arquivo não encontrado');
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`>>> Servidor Menu ADS rodando na porta ${PORT}`);
});
