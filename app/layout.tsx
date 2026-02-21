import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM-3D | Periskeletal Region–aware Imaging",
  description: "Segmentation-guided 3D deep learning for NSCLC survival prediction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
