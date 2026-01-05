"use client";
import { useEffect, useRef, useState } from "react";

export default function ContactModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dialogRef = useRef(null);
  const firstRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (open) {
      // save active element to restore focus later
      triggerRef.current = document.activeElement;
      // focus first field when open
      setTimeout(() => firstRef.current && firstRef.current.focus(), 0);
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      if (triggerRef.current && typeof triggerRef.current.focus === "function")
        triggerRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // simple focus trap
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Send a minimal, explicit payload for contact requests only.
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
    };
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(
          "Thanks — we received your request. We'll reach out shortly."
        );
        form.reset();
        setTimeout(() => onClose && onClose(), 900);
      } else {
        setMessage(
          json.error || "Sorry — something went wrong. Try again later."
        );
      }
    } catch (err) {
      setMessage("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal open"
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-dialog" role="document" ref={dialogRef}>
        <button
          className="modal-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        <form id="contactForm" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            ref={firstRef}
          />
          <input name="company" type="text" placeholder="Company name" />
          <input name="email" type="email" placeholder="Email" required />
          <input
            name="phone"
            type="tel"
            placeholder="Phone or WhatsApp"
            required
          />
          <textarea
            name="message"
            rows="3"
            placeholder="Brief message (or questions)"
          ></textarea>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              id="modal-submit"
              className="primary-btn large"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            <button
              type="button"
              className="primary-btn"
              id="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
          <div id="contactResult" aria-live="polite" style={{ marginTop: 8 }}>
            {message}
          </div>
        </form>
      </div>
    </div>
  );
}
