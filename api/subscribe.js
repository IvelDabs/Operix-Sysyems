module.exports = async (req, res) => {
  // Vercel Serverless Function to proxy newsletter signup to Brevo (Sendinblue)
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const email = (body.email || "").toString().trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  const provider = process.env.NEWSLETTER_PROVIDER || "brevo";

  if (provider === "brevo") {
    const API_KEY = process.env.BREVO_API_KEY;
    const LIST_ID = process.env.BREVO_LIST_ID; // numeric id
    if (!API_KEY || !LIST_ID) {
      res.status(500).json({ error: "Newsletter provider not configured." });
      return;
    }

    try {
      const resp = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [Number(LIST_ID)],
          updateEnabled: false,
        }),
      });

      const data = await resp.json().catch(() => null);

      if (resp.status === 201) {
        res.status(200).json({ success: true, message: "Subscribed" });
        return;
      }

      // Map common provider responses to friendly messages
      if (resp.status === 400) {
        const msg = (data && data.message) || "";
        if (/exists|duplicate/i.test(msg)) {
          res.status(409).json({ error: "This email is already subscribed." });
          return;
        }
        res.status(400).json({ error: msg || "Invalid request." });
        return;
      }

      // Generic error mapping
      res
        .status(resp.status || 502)
        .json({ error: (data && data.message) || "Subscription failed" });
    } catch (err) {
      res
        .status(502)
        .json({ error: "Network error while contacting provider." });
    }

    return;
  }

  // For other providers: not implemented here
  res.status(501).json({ error: "Newsletter provider not implemented." });
};
