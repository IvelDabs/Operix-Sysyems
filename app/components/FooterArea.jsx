"use client"
import { useState, useEffect } from 'react'
import ContactModal from './ContactModal'
import Newsletter from './Newsletter'
import SiteScripts from './SiteScripts'

export default function FooterArea() {
  const [modalOpen, setModalOpen] = useState(false)
  function openModal() { setModalOpen(true) }
  function closeModal() { setModalOpen(false) }

  useEffect(() => {
    function onOpen() { openModal() }
    window.addEventListener('open-contact-modal', onOpen)
    return () => window.removeEventListener('open-contact-modal', onOpen)
  }, [])

  return (
    <>
      <section id="contact" className="section cta-section">
        <div className="container">
          <h2>Book a Free Operations Audit</h2>
          <p>Ready to reduce losses and run with clarity? Book a free 30-minute audit and we'll show you a clear improvement plan.</p>
          <div id="contactResult" className="contact-result" aria-live="polite"></div>
          <button type="button" id="fm-btn" className="primary-btn large" onClick={openModal}>Book a Free Operations Audit</button>
          <p className="small muted">Your information is kept private and used only to schedule your audit.</p>
          <p className="muted">Message us on WhatsApp at <a href="https://wa.me/2348145739449" target="_blank">+2348145739449</a></p>
        </div>
      </section>

      <footer className="site-footer" id="site-footer">
        <div className="footer-top">
          <div className="container footer-top-grid">
            <div className="contact-block">
              <h4>Contact Us</h4>
              <address>
                Ikeja, Lagos State, <br />
                phone: <a href="tel:+2348145739449">+2348145739449</a><br />
                email: <a href="mailto:contact@operixsystems.ng">contact@operixsystems.ng</a>
              </address>
            </div>

            <Newsletter />
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-grid">
            <div className="copyright">© <span id="year">2026</span> OPERIX SYSTEMS, ALL RIGHTS RESERVED.</div>
            <div className="socials">
              <a href="https://wa.me/2348145739449" aria-label="WhatsApp" className="social" target="_blank"><img src="/images/whatsapp-icon-with-ios7-style-11.png" alt="WhatsApp"/></a>
              <a href="#" aria-label="Instagram" className="social" target="_blank"><img src="/images/Instagram_icon.png.webp" alt="Instagram"/></a>
              <a href="#" aria-label="LinkedIn" className="social" target="_blank"><img src="/images/LinkedIn_icon.svg.png" alt="LinkedIn"/></a>
            </div>

            <div className="back-to-top"><a href="#top" aria-label="Back to top">▴</a></div>
          </div>
        </div>
      </footer>

      <ContactModal open={modalOpen} onClose={closeModal} />
      <SiteScripts />
    </>
  )
}
