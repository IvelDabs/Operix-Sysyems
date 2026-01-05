"use client";
import Carousel from "./Carousel";

export default function ClientArea() {
  // When the Carousel 'book' CTA is clicked, dispatch a global event
  function handleBook() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-contact-modal"));
    }
  }

  return (
    <>
      <section className="hero">
        <Carousel onBook={handleBook} />
      </section>
    </>
  );
}
