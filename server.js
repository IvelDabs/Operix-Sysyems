const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message, company, source, timestamp } =
    req.body || {};
  if (!name || !email || !phone)
    return res.status(400).json({ error: "Missing required fields" });

  const out = {
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone).slice(0, 60),
    company: company ? String(company).slice(0, 200) : "",
    message: message ? String(message).slice(0, 2000) : "",
    source: source || "",
    timestamp: timestamp || new Date().toISOString(),
  };

  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, "contacts.jsonl");
  fs.appendFile(file, JSON.stringify(out) + "\n", (err) => {
    if (err) {
      console.error("Failed to write contact:", err);
      return res.status(500).json({ error: "failed_to_save" });
    }
    return res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`Operix Systems server running on http://localhost:${PORT}`);
});
