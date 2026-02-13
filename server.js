
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Configuração CRUCIAL de MIME types para o Babel no navegador reconhecer .tsx como JS
express.static.mime.define({'application/javascript': ['tsx', 'ts', 'jsx']});

// Log para depuração no painel da Hostinger
console.log(">>> Iniciando servidor Menu ADS...");
console.log(">>> Diretório Atual (__dirname):", __dirname);

// Tenta listar arquivos para confirmar se a cópia do build funcionou
try {
  const files = fs.readdirSync(__dirname);
  console.log(">>> Arquivos disponíveis:", files.join(', '));
} catch (err) {
  console.error(">>> Erro ao listar arquivos:", err);
}

// Serve todos os arquivos da pasta atual (__dirname) como estáticos
// Como o build copia tudo para /dist, e o server.js roda de lá, isso servirá o index.tsx corretamente
app.use(express.static(__dirname));

// Rota de saúde para monitoramento
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    dir: __dirname
  });
});

// Suporte a Single Page Application (SPA)
app.get('*', (req, res) => {
  // Se a requisição for por um arquivo (ex: .png, .tsx, .js), e chegou aqui, é pq não existe
  if (req.path.includes('.')) {
    console.log(">>> Arquivo não encontrado (404):", req.path);
    res.status(404).send('Arquivo não encontrado');
  } else {
    // Caso contrário, serve o index.html (essencial para o React Router)
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`>>> Servidor rodando com sucesso na porta ${PORT}`);
});
