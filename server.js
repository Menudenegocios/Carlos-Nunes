
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Configura o Express para servir arquivos .tsx e .ts com o MIME type correto de JavaScript
// Isso é crucial para que o navegador não bloqueie o carregamento dos módulos
express.static.mime.define({'application/javascript': ['tsx', 'ts']});

// Serve arquivos estáticos da raiz
app.use(express.static(__dirname));

// Rota de saúde para teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Menu ADS rodando' });
});

// Redireciona todas as outras rotas para o index.html (Suporte a SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>>> Servidor rodando na porta ${PORT}`);
  console.log(`>>> Diretório: ${__dirname}`);
});
