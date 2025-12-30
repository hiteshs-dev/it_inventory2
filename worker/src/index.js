export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ITM Inventory API is running",
          time: new Date().toISOString()
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // CREATE ASSET (FORM SUBMIT)
    if (url.pathname === "/assets" && request.method === "POST") {
      try {
        const data = await request.json();

        const stmt = env.DB.prepare(`
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
        `);

        await stmt.bind(
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
          { headers: { "Content-Type": "application/json" } }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // GET ALL ASSETS (Dashboard later)
    if (url.pathname === "/assets" && request.method === "GET") {
      const result = await env.DB
        .prepare("SELECT * FROM assets ORDER BY created_at DESC")
        .all();

      return new Response(JSON.stringify(result.results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
};
