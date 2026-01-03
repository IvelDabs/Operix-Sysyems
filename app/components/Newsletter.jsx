"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle|loading|success|error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please provide a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage("Thanks — check your email to confirm subscription.");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("error");
        setMessage("You are already subscribed.");
      } else {
        setStatus("error");
        setMessage(
          json.error || "Unable to subscribe right now. Try again later."
        );
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <div className="newsletter-block">
      <h4>Stay Updated</h4>
      <p>Sign up for our newsletter. We won't share your email address.</p>
      <form
        id="newsletterForm"
        className="newsletter-form"
        onSubmit={handleSubmit}
        aria-labelledby="newsletterLabel"
      >
        <label
          id="newsletterLabel"
          htmlFor="newsletter_email"
          className="visually-hidden"
        >
          Email address
        </label>
        <input
          id="newsletter_email"
          type="email"
          name="newsletter_email"
          placeholder="Email Address"
          required
          autoComplete="email"
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="signup-btn"
          id="newsletterSubmit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div
        id="newsletterMsg"
        className={`newsletter-msg ${
          status === "success" ? "success" : status === "error" ? "error" : ""
        }`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </div>
  );
}
