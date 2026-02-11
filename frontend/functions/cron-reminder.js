export async function scheduled(event, env) {
  const { results } = await env.DB.prepare("SELECT * FROM bills").all();

  const today = new Date();

  for (let bill of results) {
    const dueDate = new Date(bill.due_date);

    const monthBefore = new Date(dueDate);
    monthBefore.setMonth(monthBefore.getMonth() - 1);

    const weekBefore = new Date(dueDate);
    weekBefore.setDate(weekBefore.getDate() - 7);

    if (isSameDay(today, monthBefore) || isSameDay(today, weekBefore)) {

      const emails = bill.emails.split(",");

      for (let email of emails) {
        await fetch("https://api.mailchannels.net/tx/v1/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email }]
            }],
            from: {
              email: "reminder@yourdomain.com",
              name: "IT Bill Reminder"
            },
            subject: `Reminder: ${bill.bill_name} Due Soon`,
            content: [{
              type: "text/plain",
              value: `
Bill Name: ${bill.bill_name}
Amount: ₹${bill.amount}
Due Date: ${bill.due_date}

Please make the payment.
`
            }]
          })
        });
      }
    }

    // Update next due date after payment cycle
    if (today > dueDate) {
      const newDue = calculateNextDue(dueDate, bill.frequency);

      await env.DB.prepare(`
        UPDATE bills SET due_date = ? WHERE id = ?
      `).bind(newDue.toISOString().split("T")[0], bill.id).run();
    }
  }
}

function isSameDay(d1, d2) {
  return d1.toDateString() === d2.toDateString();
}

function calculateNextDue(date, frequency) {
  const newDate = new Date(date);

  if (frequency === "Monthly") newDate.setMonth(newDate.getMonth() + 1);
  if (frequency === "Quarterly") newDate.setMonth(newDate.getMonth() + 3);
  if (frequency === "Half-Yearly") newDate.setMonth(newDate.getMonth() + 6);
  if (frequency === "Annually") newDate.setFullYear(newDate.getFullYear() + 1);

  return newDate;
}
