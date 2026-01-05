import dynamic from "next/dynamic";
const ClientArea = dynamic(() => import("./components/ClientArea"), {
  ssr: false,
});
const FooterArea = dynamic(() => import("./components/FooterArea"), {
  ssr: false,
});
// Client UI is mounted dynamically via ClientArea (ssr: false)

function Nav() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">OPERIX SYSTEMS</div>
        <nav className="nav">
          <a href="#how">How It Works</a>
          <a href="#what">What We Do</a>
          <a href="#who">Who It's For</a>
          <a className="cta" href="#contact">
            Book Audit
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function Page() {
  return (
    <main>
      <Nav />
      <ClientArea />

      <section id="what" className="section">
        <div className="container what-grid">
          <div className="what-text">
            <h2>What We Do</h2>
            <hr className="section-rule" />
            <p>
              OPERIX SYSTEMS provides an innovative new approach to managing
              logistics control, helping logistics companies gain full control
              of their operationsin 30 days by turning chaos into clarity. We
              install a complete Logistics Operations Control System that gives
              business owners the tools to run daily business operations with
              confidence.
            </p>
            <p>
              Our installation delivers simple, practical workflows and
              dashboards that handles workflow chaos allowing you focus on
              moving goods and protecting margin. Providing:
            </p>
            <ul className="what-list">
              <li>Daily visibility of deliveries and fleet activity</li>
              <li>Clear records of income, expenses, and driver performance</li>
              <li>Fewer customer complaints and lost parcels</li>
              <li>Less stress and tighter profit control</li>
            </ul>
          </div>

          <div className="what-image">
            <div className="placeholder">Image placeholder</div>
          </div>
        </div>
      </section>

      <section id="who" className="section light">
        <div className="container">
          <h2>Who It's For</h2>
          <p>
            Courier companies, fleet owners, dispatch services, and transport
            businesses that are ready to grow.
          </p>
          <div className="who-grid">
            <div className="who-item">Courier companies</div>
            <div className="who-item">Truck owners & fleet managers</div>
            <div className="who-item">Dispatch services</div>
            <div className="who-item">Inter-state transport companies</div>
            <div className="who-item">Delivery businesses</div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <h2>How It Works</h2>
          <ol className="steps">
            <li>
              <strong>Free 30-minute Operations Audit</strong>
              <p>
                We review your current workflows, identify the main sources of
                loss, and propose a compact installation plan.
              </p>
            </li>
            <li>
              <strong>30-day system installation</strong>
              <p>
                Full system installation, driver onboarding, live dashboards,
                and performance tracking — completed in 30 days.
              </p>
            </li>
            <li>
              <strong>Monthly support & optimization</strong>
              <p>
                We monitor performance, fix gaps, and help you scale operations
                month-to-month.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ClientArea contains hero/carousel. FooterArea is client-only and mounted last. */}
      <FooterArea />
    </main>
  );
}
