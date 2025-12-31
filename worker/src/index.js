export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ================== CORS ================== */
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    /* ================== HEALTH CHECK ================== */
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ITM Inventory API is running",
          time: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ================== ADD ASSET ================== */
    if (url.pathname === "/assets" && request.method === "POST") {
      const data = await request.json();

      // ✅ DUPLICATE SERIAL CHECK
      const { results: existing } = await env.DB.prepare(
        "SELECT id FROM assets WHERE serial_no = ?"
      ).bind(data.serial_no).all();

      if (existing.length) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Serial number already exists"
          }),
          { status: 409, headers: corsHeaders }
        );
      }

      await env.DB.prepare(`
        INSERT INTO assets (
          role, title, name, email, batch, roll_no,
          department, designation, emp_id, location,
          platform, mac_address,
          asset_desc, asset_type, serial_no, purchase_date,
          brand, model, ram, processor, storage, remarks
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `).bind(
        data.role,
        data.title,
        data.name,
        data.email,
        data.batch || "",
        data.roll_no || "",
        data.department || "",
        data.designation || "",
        data.emp_id || "",
        data.location || "",
        data.platform || "",
        data.mac_address || "",
        data.asset_desc,
        data.asset_type,
        data.serial_no,
        data.purchase_date || "",
        data.brand || "",
        data.model || "",
        data.ram || "",
        data.processor || "",
        data.storage || "",
        data.remarks || ""
      ).run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ================== GET ASSETS ================== */
    if (url.pathname === "/assets" && request.method === "GET") {
      const search = url.searchParams.get("search") || "";
      const role = url.searchParams.get("role");
      const batch = url.searchParams.get("batch");

      let query = "SELECT * FROM assets WHERE 1=1";
      const params = [];

      if (search) {
        query += " AND (name LIKE ? OR serial_no LIKE ? OR asset_type LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (role) {
        query += " AND role = ?";
        params.push(role);
      }

      if (batch) {
        query += " AND batch = ?";
        params.push(batch);
      }

      query += " ORDER BY created_at DESC";

      const { results } = await env.DB.prepare(query).bind(...params).all();

      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ================== UPDATE ASSET ================== */
    if (url.pathname.startsWith("/assets/") && request.method === "PUT") {
      const id = url.pathname.split("/")[2];
      const data = await request.json();

      // ✅ DUPLICATE SERIAL CHECK (IGNORE SAME ID)
      const { results: dup } = await env.DB.prepare(
        "SELECT id FROM assets WHERE serial_no = ? AND id != ?"
      ).bind(data.serial_no, id).all();

      if (dup.length) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Serial number already exists"
          }),
          { status: 409, headers: corsHeaders }
        );
      }

      await env.DB.prepare(`
        UPDATE assets SET
          role = ?, title = ?, name = ?, email = ?,
          batch = ?, roll_no = ?, department = ?, designation = ?, emp_id = ?, location = ?,
          platform = ?, mac_address = ?,
          asset_desc = ?, asset_type = ?, serial_no = ?, purchase_date = ?,
          brand = ?, model = ?, ram = ?, processor = ?, storage = ?, remarks = ?
        WHERE id = ?
      `).bind(
        data.role,
        data.title,
        data.name,
        data.email,
        data.batch || "",
        data.roll_no || "",
        data.department || "",
        data.designation || "",
        data.emp_id || "",
        data.location || "",
        data.platform || "",
        data.mac_address || "",
        data.asset_desc,
        data.asset_type,
        data.serial_no,
        data.purchase_date || "",
        data.brand || "",
        data.model || "",
        data.ram || "",
        data.processor || "",
        data.storage || "",
        data.remarks || "",
        id
      ).run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ================== DELETE ASSET ================== */
    if (url.pathname.startsWith("/assets/") && request.method === "DELETE") {
      const id = url.pathname.split("/")[2];

      await env.DB.prepare(
        "DELETE FROM assets WHERE id = ?"
      ).bind(id).run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ================== EXPORT CSV ================== */
    if (url.pathname === "/export" && request.method === "GET") {
      const role = url.searchParams.get("role");
      const batch = url.searchParams.get("batch");

      let query = "SELECT * FROM assets WHERE role = ?";
      const params = [role];

      if (batch && batch !== "all") {
        query += " AND batch = ?";
        params.push(batch);
      }

      const { results } = await env.DB.prepare(query).bind(...params).all();

      let csv = "";
      if (results.length) {
        csv += Object.keys(results[0]).join(",") + "\n";
        results.forEach(row => {
          csv += Object.values(row)
            .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(",") + "\n";
        });
      }

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="assets_${role}_${batch || "all"}.csv"`,
        },
      });
    }

    /* ================== 404 ================== */
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers: corsHeaders }
    );
  },
};
