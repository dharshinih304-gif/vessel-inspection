import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const method = req.method;
    
    // Auth Check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error("Invalid or expired token");
    }

    // Get table and action from request
    let tableName: string | null = null;
    let payload: any = null;
    let queryParams: any = {};

    if (method === "GET") {
      tableName = url.searchParams.get("table");
      const vesselId = url.searchParams.get("vesselId");
      if (vesselId) queryParams.vessel_id = vesselId;
    } else {
      const body = await req.json();
      tableName = body.table;
      payload = body.data;
    }

    if (!tableName) {
      throw new Error("Table name is required");
    }

    console.log(`${method} request for table: ${tableName}`);

    // Handle Operations
    if (method === "GET") {
      let query = supabase.from(tableName).select("*");
      
      if (queryParams.vessel_id) {
        query = query.eq("vessel_id", queryParams.vessel_id);
      }
      
      // Default order by s_no/item_no if it's an inspection table
      if (tableName !== 'reports' && tableName !== 'users' && tableName !== 'profiles') {
        if (tableName === 'machinery_arrangements' || tableName === 'pollution_prevention_for_tankers') {
          query = query.order("item_no", { ascending: true });
        } else {
          query = query.order("s_no", { ascending: true });
        }
      } else if (tableName === 'reports') {
        query = query.order("createdAt", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (method === "POST") {
      const { data, error } = await supabase
        .from(tableName)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201, headers: corsHeaders });
    }

    if (method === "PUT" || method === "PATCH") {
      const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (method === "DELETE") {
      const id = url.searchParams.get("id") || payload?.id;
      if (!id) throw new Error("ID required for deletion");
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ message: "Row deleted successfully" }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Dynamic API Error:", error);
    return new Response(JSON.stringify({ error: (error as any).message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
