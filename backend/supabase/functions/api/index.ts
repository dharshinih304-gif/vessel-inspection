import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const databaseUrl = Deno.env.get('DATABASE_URL') ?? ''
    const sql = postgres(databaseUrl)

    // --- AUTO-CREATE TABLES ---
    await sql`
      CREATE TABLE IF NOT EXISTS public."Users" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER', 'SUPERINTENDENT')),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS public."Vessels" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "vesselName" TEXT NOT NULL,
        "vesselType" TEXT NOT NULL,
        "imoNumber" TEXT UNIQUE NOT NULL,
        "createdBy" UUID REFERENCES public."Users"(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS public."Reports" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "vesselId" UUID REFERENCES public."Vessels"(id),
        title TEXT NOT NULL,
        "inspectionDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
        description TEXT,
        attachments TEXT[] DEFAULT '{}',
        "createdBy" UUID REFERENCES public."Users"(id),
        "approvedBy" UUID REFERENCES public."Users"(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/api/', '').replace('/api/', '')
    const method = req.method

    // --- API LOGIC (using postgres direct) ---
    
    if (path === 'vessels' && method === 'GET') {
      const data = await sql`SELECT * FROM public."Vessels"`
      return new Response(JSON.stringify(data), { headers: corsHeaders })
    }

    if (path === 'reports' && method === 'GET') {
      const data = await sql`SELECT r.*, v."vesselName" FROM public."Reports" r LEFT JOIN public."Vessels" v ON r."vesselId" = v.id`
      return new Response(JSON.stringify(data), { headers: corsHeaders })
    }

    // Default response
    return new Response(JSON.stringify({ 
      message: 'Sellamsoft API Edge Function',
      database: 'Connected to db.dobpdssgdfaiharnmpdf.supabase.co',
      status: 'Tables verified/created'
    }), { headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})
