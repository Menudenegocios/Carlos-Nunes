const API_BASE_URL = 'https://ais-dev-w2a7jxyi3yzmolfvmfwmxy-13842340585.us-east5.run.app/api/menuzap';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_CALL') {
    console.log('API_CALL recebida:', request.endpoint);
    
    fetch(`${API_BASE_URL}${request.endpoint}`, {
      method: request.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-menuzap-token': request.token
      },
      body: request.body ? JSON.stringify(request.body) : null
    })
    .then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : { error: 'Resposta não é JSON' };
      
      console.log('Resposta do servidor:', response.status, data);
      sendResponse({ ok: response.ok, data, status: response.status });
    })
    .catch(error => {
      console.error('Erro no fetch:', error);
      sendResponse({ ok: false, error: 'Falha na conexão com o servidor: ' + error.message });
    });
    
    return true; // Mantém o canal aberto para resposta assíncrona
  }
});
