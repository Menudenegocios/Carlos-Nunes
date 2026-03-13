import { supabase } from './supabaseClient';

export const paymentService = {
  createCheckoutSession: async (planId: string, billingCycle: 'semestral' | 'anual') => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Call our backend to create a Stripe Checkout session
    let response: Response;
    try {
      response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          planId,
          billingCycle
        })
      });
    } catch (networkError) {
      throw new Error('Servidor de pagamento indisponível. Verifique se o servidor backend está rodando (node server.mjs).');
    }

    // Handle empty or non-JSON responses
    const text = await response.text();
    
    if (!text) {
      throw new Error('Servidor de pagamento não respondeu. Verifique se o servidor backend está rodando na porta 3000 (node server.mjs).');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      if (text.trim().startsWith('<!DOCTYPE html>')) {
        throw new Error('O servidor retornou uma página HTML em vez de JSON. Isso geralmente indica um erro de roteamento no servidor ou que o backend (node server.mjs) não está respondendo corretamente na rota /api.');
      }
      throw new Error(`Resposta inválida do servidor: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao criar sessão de checkout');
    }

    return data; // Expecting { id: 'cs_test_...', url: '...' }
  }
};
