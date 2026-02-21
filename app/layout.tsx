import type { Metadata } from "next";
import Nav from "./components/Nav";
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
        <div className="site-shell">
          <Nav />
          <div className="page-wrap">{children}</div>
        </div>
      </body>
    </html>
  );
}
