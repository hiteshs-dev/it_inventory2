export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ADD ENTRY
    if (request.method === "POST" && url.pathname === "/add") {
      const data = await request.json();

      await env.DB.prepare(`
        INSERT INTO assets (
          role, title, name, email, batch, roll_no,
          department, designation, emp_id, location,
          asset_desc, asset_type, serial_no, purchase_date,
          brand, model, ram, processor, storage, remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.role, data.title, data.name, data.email, data.batch, data.rollNo,
        data.dept, data.designation, data.empId, data.location,
        data.assetDesc, data.assetType, data.assetId, data.purchaseDate,
        data.brand, data.model, data.ram, data.processor, data.hdd, data.remarks
      ).run();

      return Response.json({ success: true });
    }

    // GET ALL DATA
    if (request.method === "GET" && url.pathname === "/list") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM assets ORDER BY created_at DESC"
      ).all();

      return Response.json(results);
    }

    // DOWNLOAD EXCEL (CSV)
    if (request.method === "GET" && url.pathname === "/export") {
      const { results } = await env.DB.prepare("SELECT * FROM assets").all();

      let csv = Object.keys(results[0] || {}).join(",") + "\n";
      results.forEach(r => {
        csv += Object.values(r).map(v => `"${v ?? ""}"`).join(",") + "\n";
      });

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=inventory.csv"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
