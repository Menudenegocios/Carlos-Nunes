
const express = require('express');
const path = require('path');
const app = express();

// Porta dinâmica para Hostinger ou 3000 local
const PORT = process.env.PORT || 3000;

// Log para depuração no painel da Hostinger
console.log('Iniciando servidor...');
console.log('Diretório atual:', __dirname);

// Middleware para servir arquivos estáticos
// Importante: Na Hostinger, o diretório raiz é onde os arquivos estão localizados
app.use(express.static(__dirname));

// Rota para verificar se o servidor está online
app.get('/health', (req, res) => {
  res.send('Servidor está rodando perfeitamente!');
});

// Middleware essencial para Single Page Application (SPA)
// Isso resolve o erro 404 ao atualizar páginas como /dashboard
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Erro ao carregar index.html:', err);
      res.status(500).send('Erro interno: Não foi possível carregar a página inicial.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
