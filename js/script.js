document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById("bookForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const email = data.get("email") || "";
      const type = data.get("clientType") || "";

      const subject = encodeURIComponent("Request: Free Operations Audit");
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nClient type: ${type}`
      );
      // Open mail client with prefilled message. Replace with API call when ready.
      window.location.href = `mailto:hello@operixsystems.ng?subject=${subject}&body=${body}`;
    });
  }

  const cta = document.getElementById("cta");
  if (cta) {
    cta.addEventListener("click", () => {
      document.querySelector('#book input[name="name"]').focus();
    });
  }
});
