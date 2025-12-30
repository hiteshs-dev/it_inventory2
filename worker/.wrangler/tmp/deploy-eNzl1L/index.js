// src/index.js
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ITM Inventory API is running",
          time: (/* @__PURE__ */ new Date()).toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (url.pathname === "/assets" && request.method === "POST") {
      const data = await request.json();
      await env.DB.prepare(`
        INSERT INTO assets (
          role, title, name, email, batch, roll_no,
          department, designation, emp_id, location,
          asset_desc, asset_type, serial_no, purchase_date,
          brand, model, ram, processor, storage, remarks
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `).bind(
        data.role,
        data.title,
        data.name,
        data.email,
        data.batch,
        data.roll_no,
        data.department,
        data.designation,
        data.emp_id,
        data.location,
        data.asset_desc,
        data.asset_type,
        data.serial_no,
        data.purchase_date,
        data.brand,
        data.model,
        data.ram,
        data.processor,
        data.storage,
        data.remarks
      ).run();
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (url.pathname === "/assets" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM assets ORDER BY created_at DESC"
      ).all();
      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers: corsHeaders }
    );
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
