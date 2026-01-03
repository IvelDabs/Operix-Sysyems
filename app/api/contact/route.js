import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message, company, source, timestamp } =
      body || {};
    if (!name || !email || !phone)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );

    const out = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 60),
      company: company ? String(company).slice(0, 200) : "",
      message: message ? String(message).slice(0, 2000) : "",
      source: source || "",
      timestamp: timestamp || new Date().toISOString(),
    };

    // Write to data/contacts.jsonl in repository (note: serverless runtimes may have ephemeral fs)
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const file = path.join(dataDir, "contacts.jsonl");
    fs.appendFileSync(file, JSON.stringify(out) + "\n");

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "failed_to_save" }), {
      status: 500,
    });
  }
}
