
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    console.log(`Surgical requests API called with method: ${method}, action: ${action}`)

    if (method === 'GET' && action === 'dashboard') {
      // Get surgical requests for dashboard
      const { data, error } = await supabaseClient.rpc('get_surgical_requests_dashboard')
      
      if (error) {
        console.error('Error fetching surgical requests:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (method === 'POST' && action === 'create') {
      const body = await req.json()
      console.log('Creating surgical request with data:', body)

      // Create surgical request from assessment
      const { data, error } = await supabaseClient.rpc('create_surgical_request_from_assessment', {
        p_assessment_id: body.assessmentId,
        p_procedure_name: body.procedureName,
        p_procedure_codes: body.procedureCodes,
        p_icd10_code: body.icd10Code,
        p_urgency_level: body.urgencyLevel,
        p_opme_materials: body.opmeMaterials || [],
        p_opme_companies: body.opmeCompanies || []
      })

      if (error) {
        console.error('Error creating surgical request:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ data, message: 'Solicitação cirúrgica criada com sucesso' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201 
        }
      )
    }

    if (method === 'PUT' && action === 'update-status') {
      const body = await req.json()
      console.log('Updating surgical request status:', body)

      const { data, error } = await supabaseClient
        .from('surgical_requests')
        .update({ 
          status: body.status,
          submitted_at: body.status === 'enviada' ? new Date().toISOString() : undefined,
          approved_at: body.status === 'aprovada' ? new Date().toISOString() : undefined,
          rejection_reason: body.rejectionReason || null
        })
        .eq('id', body.requestId)
        .select()

      if (error) {
        console.error('Error updating surgical request status:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ data, message: 'Status atualizado com sucesso' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (method === 'GET') {
      // Get specific surgical request details
      const requestId = url.searchParams.get('id')
      
      const { data, error } = await supabaseClient
        .from('surgical_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        console.error('Error fetching surgical request:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    )

  } catch (error) {
    console.error('Error in surgical-requests function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
