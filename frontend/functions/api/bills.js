export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM bills").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (request.method === "POST") {
    const data = await request.json();

    await env.DB.prepare(`
      INSERT INTO bills (bill_name, amount, due_date, frequency, emails)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(
      data.bill_name,
      data.amount,
      data.due_date,
      data.frequency,
      data.emails.join(",")
    )
    .run();

    return new Response("Bill Added Successfully");
  }
}
