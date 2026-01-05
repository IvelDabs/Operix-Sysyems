process.env.BREVO_API_KEY;
process.env.BREVO_LIST_ID;
import fs from "fs";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = (body.email || "").toString().trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400 }
      );
    }

    const provider = process.env.NEWSLETTER_PROVIDER || "brevo";
    if (provider === "brevo") {
      const API_KEY = process.env.BREVO_API_KEY;
      const LIST_ID = process.env.BREVO_LIST_ID;
      if (!API_KEY || !LIST_ID) {
        return new Response(
          JSON.stringify({ error: "Newsletter provider not configured." }),
          { status: 500 }
        );
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
          return new Response(
            JSON.stringify({ success: true, message: "Subscribed" }),
            { status: 200 }
          );
        }

        if (resp.status === 400) {
          const msg = (data && data.message) || "";
          if (/exists|duplicate/i.test(msg)) {
            return new Response(
              JSON.stringify({ error: "This email is already subscribed." }),
              { status: 409 }
            );
          }
          return new Response(
            JSON.stringify({ error: msg || "Invalid request." }),
            { status: 400 }
          );
        }

        return new Response(
          JSON.stringify({
            error: (data && data.message) || "Subscription failed",
          }),
          { status: resp.status || 502 }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Network error while contacting provider." }),
          { status: 502 }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Newsletter provider not implemented." }),
      { status: 501 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
