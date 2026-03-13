import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace('/payment', '')

  if (path === '/asas') {
    return new Response(JSON.stringify({ status: 'success', message: 'ASAS integration placeholder via Edge Function' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  if (path === '/pagseguro') {
    return new Response(JSON.stringify({ status: 'success', message: 'PagSeguro integration placeholder via Edge Function' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  return new Response("Not found", { status: 404, headers: corsHeaders })
})
