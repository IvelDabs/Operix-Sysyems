import fs from "fs";
import path from "path";

// Contact route: accepts contact requests only. This route MUST NOT touch
// Brevo contact lists. It may send a transactional email via Brevo's
// Transactional Email API if `BREVO_API_KEY` is configured, otherwise it
// will still log the message to `data/contacts.jsonl`.

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || ""));
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body || {};

    // Basic validation
    if (!name || !email || !phone)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    if (!isValidEmail(email))
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400 }
      );
    const msg = String(message || "").trim();
    if (msg.length > 5000)
      return new Response(JSON.stringify({ error: "Message too long" }), {
        status: 400,
      });

    const out = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 60),
      message: msg.slice(0, 2000),
      timestamp: new Date().toISOString(),
    };

    // Attempt to send a transactional email via Brevo (Transactional Email API)
    // NOTE: This uses the same BREVO_API_KEY environment variable the project
    // already uses for contacts; it calls ONLY the transactional endpoint
    // and must NOT subscribe or touch contact lists.
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    let emailSent = false;
    if (BREVO_API_KEY) {
      try {
        const htmlContent = `
          <h2>New contact request</h2>
          <p><strong>Name:</strong> ${out.name}</p>
          <p><strong>Email:</strong> ${out.email}</p>
          <p><strong>Phone:</strong> ${out.phone}</p>
          <p><strong>Message:</strong></p>
          <p>${out.message.replace(/\n/g, "<br/>")}</p>
        `;

        const payload = {
          sender: { name: "Operix Systems", email: "contact@operixsystems.ng" },
          to: [{ email: "contact@operixsystems.ng", name: "Operix Contact" }],
          subject: `New contact request from ${out.name}`,
          htmlContent,
          textContent: `New contact request from ${out.name}\n\n${out.message}`,
        };

        const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          emailSent = true;
        } else {
          // do not fail the contact request solely because transactional email failed
          // log response for diagnostics
          try {
            const d = await resp.json();
            console.error("Brevo transactional email failed:", resp.status, d);
          } catch (e) {
            console.error(
              "Brevo transactional email failed with status",
              resp.status
            );
          }
        }
      } catch (err) {
        console.error("Failed to send transactional email:", err);
      }
    }

    // Persist the contact message locally (note: ephemeral on serverless)
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const file = path.join(dataDir, "contacts.jsonl");
      fs.appendFileSync(file, JSON.stringify(out) + "\n");
    } catch (err) {
      console.error("Failed to write contact to disk:", err);
    }

    return new Response(JSON.stringify({ ok: true, emailSent }), {
      status: 200,
    });
  } catch (err) {
    console.error("Contact route error:", err);
    return new Response(JSON.stringify({ error: "failed_to_save" }), {
      status: 500,
    });
  }
}
