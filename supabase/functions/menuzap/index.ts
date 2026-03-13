import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-menuzap-token',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const token = req.headers.get('x-menuzap-token')
  const url = new URL(req.url)
  const path = url.pathname.replace('/menuzap', '')

  if (!token || !token.startsWith('MN-PRO-')) {
    return new Response(JSON.stringify({ error: 'Token inválido ou mal formatado' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  const suffix = token.replace('MN-PRO-', '').toLowerCase()
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  let userId = null
  let businessName = null

  if (suffix === 'de30de30') {
    userId = 'de30de30-0000-4000-a000-000000000000'
    businessName = 'Empresa de Demonstração'
  } else {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('user_id, business_name')
        .ilike('user_id', `${suffix}%`)
        .single()

      if (error || !data) {
        return new Response(JSON.stringify({ error: 'Usuário não encontrado no CRM' }), { 
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      userId = data.user_id
      businessName = data.business_name
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), { 
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }
  }

  // --- ROUTES LOGIC ---
  if (req.method === 'GET' && path === '/auth') {
    return new Response(JSON.stringify({ status: 'authenticated', userId, businessName }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (req.method === 'GET' && path === '/leads') {
    const { data: leads, error } = await supabaseAdmin.from('leads').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) return new Response(JSON.stringify({ error: 'Erro ao buscar leads' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify({ leads: leads || [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (req.method === 'GET' && path === '/lead-info') {
    const phone = url.searchParams.get('phone')
    const { data: lead } = await supabaseAdmin.from('leads').select('*').eq('user_id', userId).eq('phone', phone).single()
    return new Response(JSON.stringify({ lead: lead || null }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (req.method === 'POST') {
    const body = await req.json()
    
    if (path === '/lead/move') {
      const { error } = await supabaseAdmin.from('leads').update({ stage: body.stage }).eq('user_id', userId).eq('phone', body.phone)
      if (error) return new Response(JSON.stringify({ error: 'Erro ao mover lead' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ status: 'success' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/lead/notes') {
      const { error } = await supabaseAdmin.from('leads').update({ notes: body.notes }).eq('user_id', userId).eq('phone', body.phone)
      if (error) return new Response(JSON.stringify({ error: 'Erro ao salvar notas' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ status: 'success' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/lead') {
      const { error } = await supabaseAdmin.from('leads').insert({
        user_id: userId,
        name: body.name || 'Novo Lead WhatsApp',
        phone: body.phone,
        source: 'whatsapp',
        stage: 'new',
        notes: body.notes || 'Adicionado via Menuzap Pro'
      })
      if (error) return new Response(JSON.stringify({ error: 'Erro ao salvar lead' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ status: 'success', message: 'Lead adicionado' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/schedule') {
      const { error } = await supabaseAdmin.from('schedule_items').insert({
        user_id: userId,
        title: body.title || 'Agendamento WhatsApp',
        client: body.client || 'Cliente WhatsApp',
        date: body.date,
        time: body.time,
        type: body.type || 'servico',
        status: 'pending'
      })
      if (error) return new Response(JSON.stringify({ error: 'Erro ao salvar agendamento' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ status: 'success', message: 'Agendamento salvo' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
  }

  return new Response("Route not found", { status: 404, headers: corsHeaders })
})
