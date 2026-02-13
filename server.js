
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Mapeia extensões .tsx e .ts para serem lidas como JavaScript pelo navegador
express.static.mime.define({'application/javascript': ['tsx', 'ts']});

// Serve arquivos estáticos do diretório raiz onde o servidor está rodando
app.use(express.static(__dirname));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Menu ADS operando' });
});

// Suporte para Single Page Application (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>>> Servidor iniciado na porta ${PORT}`);
  console.log(`>>> Diretorio de trabalho: ${__dirname}`);
});
