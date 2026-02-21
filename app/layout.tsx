import type { Metadata } from "next";
import Nav from "./components/Nav";
import ParticleField from "./components/ParticleField";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM-3D Demo",
  description: "Segmentation-guided NSCLC survival demo UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-layer" />
        <ParticleField />
        <div className="site-shell">
          <div className="site-nav-wrap">
            <Nav />
          </div>
          <div className="page-wrap">{children}</div>
        </div>
      </body>
    </html>
  );
}
