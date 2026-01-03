// Small script for dynamic year and CTA smooth scrolling
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const target = this.getAttribute("href");
    if (target === "#") return;
    const el = document.querySelector(target);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Simple focus for Book Audit button
const bookBtn = document.getElementById("bookAudit");
if (bookBtn) {
  bookBtn.addEventListener("click", () => {
    // placeholder for analytics or tracking
    console.log("Book Audit clicked");
  });
}

// Simple hero carousel
(function initHeroCarousel() {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const prevBtn = carousel.querySelector(".carousel-nav.prev");
  const nextBtn = carousel.querySelector(".carousel-nav.next");
  const indicators = Array.from(carousel.querySelectorAll(".indicator"));
  let active = 0;
  let interval = null;

  function show(index) {
    slides.forEach((s, i) => {
      s.classList.remove("is-active", "is-prev");
      if (i === index) s.classList.add("is-active");
      if (i === (index - 1 + slides.length) % slides.length)
        s.classList.add("is-prev");
    });
    indicators.forEach((btn, i) => {
      btn.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    active = index;
  }

  function next() {
    show((active + 1) % slides.length);
  }
  function prev() {
    show((active - 1 + slides.length) % slides.length);
  }

  nextBtn.addEventListener("click", () => {
    pause();
    next();
  });
  prevBtn.addEventListener("click", () => {
    pause();
    prev();
  });

  indicators.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      pause();
      show(i);
    });
  });

  function start() {
    interval = setInterval(() => {
      next();
    }, 6000);
  }
  function pause() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  carousel.addEventListener("mouseenter", pause);
  carousel.addEventListener("mouseleave", () => {
    if (!interval) start();
  });

  document.addEventListener("keydown", (e) => {
    if (!carousel.matches(":hover")) return;
    if (e.key === "ArrowLeft") {
      pause();
      prev();
    }
    if (e.key === "ArrowRight") {
      pause();
      next();
    }
  });

  // initialise
  show(0);
  start();
})();

// Track clicks on primary CTAs for simple analytics
document.querySelectorAll(".primary-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    try {
      const label = (btn.textContent || "").trim();
      console.log("CTA clicked:", label);
    } catch (err) {
      /* ignore */
    }
  });
});

// Modal behaviour for contact form
const contactModal = document.getElementById("contactModal");
const contactOverlay = document.getElementById("contactOverlay");
const contactClose = document.getElementById("contactClose");
const modalCancel = document.getElementById("modal-cancel");
const fmBtn = document.getElementById("fm-btn");
function openContactModal() {
  if (!contactModal) return;
  contactModal.classList.add("open");
  contactModal.setAttribute("aria-hidden", "false");
  // lock scroll
  document.documentElement.style.overflow = "hidden";
  // focus first input
  const first = contactModal.querySelector('input[name="name"]');
  if (first) first.focus();
}
function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove("open");
  contactModal.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  // reset form when closed
  const f = document.getElementById("contactForm");
  if (f) f.reset();
}

if (fmBtn) {
  fmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openContactModal();
  });
}
const bookBtn2 = document.getElementById("bookAudit");
if (bookBtn2) {
  bookBtn2.addEventListener("click", (e) => {
    e.preventDefault();
    openContactModal();
  });
}
if (contactOverlay) contactOverlay.addEventListener("click", closeContactModal);
if (contactClose) contactClose.addEventListener("click", closeContactModal);
if (modalCancel) modalCancel.addEventListener("click", closeContactModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeContactModal();
});

// Contact form submit handler (posts to /api/contact)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // perform validation first
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const resultEl = document.getElementById("contactResult");
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formData = {
      name: contactForm.name.value.trim(),
      company: contactForm.company.value.trim(),
      email: contactForm.email.value.trim(),
      phone: contactForm.phone.value.trim(),
      message: contactForm.message.value.trim(),
      source: window.location.href,
      timestamp: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    resultEl.textContent = "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        resultEl.textContent =
          "Thanks — we received your request. We'll reach out shortly.";
        contactForm.reset();
        // hide the modal after success
        closeContactModal();
      } else {
        const json = await res.json().catch(() => ({}));
        resultEl.textContent =
          json.error || "Sorry — something went wrong. Try again later.";
      }
    } catch (err) {
      resultEl.textContent = "Network error — please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

// Newsletter subscription flow (client)
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  const emailInput = document.getElementById("newsletter_email");
  const submitBtn = document.getElementById("newsletterSubmit");
  const msgEl = document.getElementById("newsletterMsg");

  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous state
    msgEl.className = "newsletter-msg";
    msgEl.textContent = "";

    // Basic HTML5 validation
    if (!emailInput.checkValidity()) {
      newsletterForm.reportValidity();
      return;
    }

    const email = emailInput.value.trim();
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Signing up...";

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        msgEl.classList.add("success");
        msgEl.textContent =
          "Thanks — check your email to confirm subscription.";
        newsletterForm.reset();
      } else if (res.status === 409) {
        msgEl.classList.add("error");
        msgEl.textContent = "You are already subscribed.";
      } else {
        msgEl.classList.add("error");
        msgEl.textContent =
          json.error || "Unable to subscribe right now. Try again later.";
      }
    } catch (err) {
      msgEl.classList.add("error");
      msgEl.textContent = "Network error — please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
