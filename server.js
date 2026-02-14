
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Configuração de MIME types ANTES de servir arquivos estáticos
// Isso é essencial para que o Babel Standalone reconheça os arquivos .tsx como scripts JS
express.static.mime.define({
  'application/javascript': ['tsx', 'ts', 'jsx']
});

// 1. Serve arquivos estáticos primeiro
// Se o build da Hostinger coloca os arquivos na raiz ou na pasta atual, usamos o ponto
app.use(express.static(__dirname));

// 2. Rota de saúde/diagnóstico
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production'
  });
});

// 3. Rota curinga para SPA (Single Page Application)
// Esta rota DEVE ser a última. Se a requisição não for um arquivo físico, manda o index.html
app.get('*', (req, res) => {
  // Se a URL contém um ponto, provavelmente é um recurso não encontrado (imagem, etc)
  if (req.path.includes('.') && !req.path.endsWith('.tsx')) {
    return res.status(404).send('Recurso não encontrado');
  }
  // Para todas as outras rotas de navegação, serve o index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>>> Servidor Menu ADS rodando na porta ${PORT}`);
});
