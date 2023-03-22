import "./globals.css";
import "react-notion-x/src/styles.css";

import Link from "next/link";

import { Nav } from "@/app/components/Nav";

const Header = () => {
  return (
    <div style={{ padding: 20, boxShadow: "0 2px 6px 1px rgba(0, 0, 0, 0.1)" }}>
      <Link
        style={{
          color: "inherit",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
        href="/"
      >
        <img src="logo_gouvernement.svg" />
        <h4>Orion, pilotage de la carte des formations</h4>
      </Link>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <main
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <div>
            <Header />
            <Nav />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
