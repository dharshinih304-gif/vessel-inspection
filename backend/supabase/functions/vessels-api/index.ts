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
    const path = url.pathname;
    const method = req.method;
    
    // Extract ID from path if present (e.g., /vessels-api/uuid)
    const pathSegments = path.split('/').filter(Boolean);
    const vesselId = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : null;

    console.log(`${method} request to ${path} ${vesselId ? `(ID: ${vesselId})` : ''}`);

    // GET /status
    if (method === "GET" && path.endsWith("/status")) {
      return new Response(JSON.stringify({ 
        status: "Vessel Management API running", 
        timestamp: new Date() 
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // AUTH CHECK
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get user profile for role check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'ADMIN';
    const isSuperintendent = profile?.role === 'SUPERINTENDENT';

    // CRUD OPERATIONS
    if (method === "GET") {
      if (vesselId) {
        const { data, error } = await supabase
          .from("vessels")
          .select("*, creator:profiles!vessels_createdby_fkey(name, email)")
          .eq("id", vesselId)
          .single();

        if (error) throw error;
        // Transform for frontend compatibility (vesselName -> name, etc.)
        const transformed = {
          ...data,
          name: data.vesselName,
          type: data.vesselType
        };
        return new Response(JSON.stringify(transformed), { headers: corsHeaders });
      } else {
        const { data, error } = await supabase
          .from("vessels")
          .select("*, creator:profiles!vessels_createdby_fkey(name, email)")
          .order("createdAt", { ascending: false });

        if (error) throw error;
        // Transform for frontend
        const transformed = data.map(v => ({
          ...v,
          name: v.vesselName,
          type: v.vesselType
        }));
        return new Response(JSON.stringify(transformed), { headers: corsHeaders });
      }
    }

    if (method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("vessels")
        .insert([{ ...body, createdBy: user.id }])
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201, headers: corsHeaders });
    }

    if (method === "PUT" || method === "PATCH") {
      if (!vesselId) throw new Error("Vessel ID required for update");
      const body = await req.json();

      // Check ownership or admin
      const { data: existingVessel } = await supabase
        .from("vessels")
        .select("createdBy")
        .eq("id", vesselId)
        .single();

      if (existingVessel && existingVessel.createdBy !== user.id && !isAdmin) {
        return new Response(JSON.stringify({ error: "Unauthorized to update this vessel" }), {
          status: 403,
          headers: corsHeaders,
        });
      }
      
      const { data, error } = await supabase
        .from("vessels")
        .update(body)
        .eq("id", vesselId)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (method === "DELETE") {
      if (!vesselId) throw new Error("Vessel ID required for deletion");

      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Only admins can delete vessels" }), {
          status: 403,
          headers: corsHeaders,
        });
      }
      
      const { error } = await supabase
        .from("vessels")
        .delete()
        .eq("id", vesselId);

      if (error) throw error;
      return new Response(JSON.stringify({ message: "Vessel removed successfully" }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Vessel API Error:", error);
    return new Response(JSON.stringify({ error: (error as any).message }), {
      status: error.status || 500,
      headers: corsHeaders,
    });
  }
});
