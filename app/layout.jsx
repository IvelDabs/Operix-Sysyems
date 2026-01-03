import "./globals.css";

export const metadata = {
  title: "Operix Systems",
  description: "Logistics operations control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
