import { supabase } from './supabaseClient';

export const paymentService = {
  createAsaasCustomer: async (customerData: { name: string, email: string, cpfCnpj: string, phone?: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Usuário não autenticado.');

    const response = await fetch('/api/asaas/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(customerData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar cliente no Asaas');
    return data;
  },

  createAsaasSubscription: async (planId: string, billingType: 'PIX' | 'CREDIT_CARD', cycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Usuário não autenticado.');

    const response = await fetch('/api/asaas/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ planId, billingType, cycle })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao criar assinatura no Asaas');
    return data;
  },

  createAsaasPayment: async (paymentData: { value: number, billingType: 'PIX' | 'CREDIT_CARD', description: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Usuário não autenticado.');

    const response = await fetch('/api/asaas/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao criar pagamento no Asaas');
    return data;
  }
};
