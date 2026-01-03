# Operix Systems — One-page Website

Files created in this folder:

- `index.html` — single-page marketing site
- `css/styles.css` — styles
- `js/script.js` — small client-side behavior

How to view locally:

1. Open `index.html` in a browser (double-click or right-click -> Open with)
2. To test email booking, ensure you have a mail client configured; the form uses `mailto:`.

Next steps:

- Replace the `mailto:` with a backend endpoint to capture leads
- Add branding assets and real contact details
  OPERIX SYSTEMS — One Page Marketing Site

This folder contains a simple one-page marketing website for a Logistics Operations Control service focused on Lagos.

Files

- `index.html` — main page
- `styles.css` — styles
- `script.js` — small interactive behaviors

Preview locally

- Open `index.html` in your browser by double-clicking the file, or serve it with Python's simple HTTP server.

PowerShell example:

```powershell
# from the `logix-control` folder
python -m http.server 8000;
# then open http://localhost:8000 in your browser
```

Open in VS Code

- In Visual Studio Code choose `File` → `Open Folder...` and select the `logix-control` folder created in the workspace root.

Next steps

- Replace `hello@example.com` and the WhatsApp number with real contact details.
- Add analytics, a lead capture form, or a deployment pipeline (Netlify, Vercel, GitHub Pages).

## React / Next.js Migration Notes

This project was migrated to Next.js (App Router) to enable an incremental React migration while preserving existing functionality.

- Run locally:

```bash
cd Logix-Control
npm install
npm run dev
```

- Production build:

```bash
npm run build
npm start
```

- Important environment variables (set in Vercel or local env):

  - `BREVO_API_KEY` — Brevo API key (server-side only)
  - `BREVO_LIST_ID` — Brevo list numeric id
  - `NEWSLETTER_PROVIDER` — optional (defaults to `brevo`)

- Serverless API routes were preserved under `/app/api`:

  - `/api/subscribe` — proxies signups to Brevo (must remain server-side; no secrets in client)
  - `/api/contact` — accepts contact submissions and appends to `data/contacts.jsonl` (note: serverless FS may be ephemeral on some hosts)

- What's next:
  - Incrementally replace DOM-based JS in `script.js` with React components/state (carousel, modal) — the newsletter flow is already ported to a React component.

Run with lightweight backend

1. Install dependencies (Node.js 16+ recommended):

```bash
cd Logix-Control
npm install
```

2. Start the server (serves static site and handles contact submissions):

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

Contact submissions are appended to `data/contacts.jsonl` as JSON lines.
