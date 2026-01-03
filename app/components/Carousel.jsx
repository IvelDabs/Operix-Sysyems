"use client";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Gain full control of operations in 30 days.",
    subtitle:
      "Reduce losses, improve delivery performance, and finally see what’s happening in your business",
    img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
    cta: { label: "Book a Free Operations Audit", action: "book" },
  },
  {
    title: "Efficiency. Cubed.",
    subtitle:
      "See how a focused operations system makes logistics exponentially more efficient.",
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
    cta: { label: "Learn how it works", href: "#what" },
  },
  {
    title: "Stop revenue leakage and control your cash flow.",
    subtitle:
      "See your entire operation clearly — every single day. Increase on-time deliveries and customer trust",
    img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
    cta: { label: "Join our network", href: "#newsletterForm" },
  },
];

export default function Carousel({ onBook }) {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    stop();
    intervalRef.current = setInterval(
      () => setActive((s) => (s + 1) % slides.length),
      6000
    );
  }
  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function show(i) {
    setActive(i % slides.length);
  }

  function prev() {
    setActive((s) => (s - 1 + slides.length) % slides.length);
  }

  function next() {
    setActive((s) => (s + 1) % slides.length);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        stop();
        prev();
      }
      if (e.key === "ArrowRight") {
        stop();
        next();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="carousel"
      id="heroCarousel"
      aria-roledescription="carousel"
      ref={containerRef}
      tabIndex={0}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <button
        className="carousel-nav prev"
        aria-label="Previous slide"
        onClick={() => {
          stop();
          prev();
        }}
      >
        ‹
      </button>
      <button
        className="carousel-nav next"
        aria-label="Next slide"
        onClick={() => {
          stop();
          next();
        }}
      >
        ›
      </button>

      <div className="carousel-track">
        {slides.map((s, i) => (
          <article
            key={i}
            className={`slide ${
              i === active
                ? "is-active"
                : i === (active - 1 + slides.length) % slides.length
                ? "is-prev"
                : ""
            }`}
            data-index={i}
            style={{ backgroundImage: `url('${s.img}')` }}
            aria-roledescription="slide"
            aria-label={s.title}
          >
            <div className="slide-overlay">
              <div className="slide-content container">
                <h1>{s.title}</h1>
                <p className="sub">{s.subtitle}</p>
                <div className="hero-actions">
                  {s.cta.action === "book" ? (
                    <button
                      className="primary-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        onBook && onBook();
                      }}
                    >
                      {s.cta.label}
                    </button>
                  ) : (
                    <a className="primary-btn" href={s.cta.href}>
                      {s.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="carousel-indicators" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className="indicator"
            data-slide-to={i}
            aria-label={`Slide ${i + 1}`}
            aria-selected={i === active}
            onClick={() => {
              stop();
              show(i);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
