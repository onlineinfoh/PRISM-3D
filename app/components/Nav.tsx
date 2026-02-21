"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/inference", label: "Inference" },
  { href: "/about", label: "About Us" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="site-nav">
      <div className="site-brand">
        <img className="brand-mark" src="/prism_logo.png" alt="PRISM-3D logo" />
        <div>
          <div className="brand-title">PRISM-3D</div>
          <div className="brand-subtitle">Periskeletal imaging intelligence</div>
        </div>
      </div>
      <nav className="site-links" aria-label="Main navigation">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`site-link ${active ? "active" : ""}`}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
