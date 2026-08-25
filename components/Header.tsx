"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Multi-page navigation structure (Главная accessed via Logo)
  const navLinks = [
    { href: "/kitchens", label: "КУХНИ" },
    { href: "/projects", label: "ОБЪЕКТЫ" },
    { href: "/production", label: "ПРОИЗВОДСТВО" },
    { href: "/calculator", label: "КАЛЬКУЛЯТОР" },
    { href: "/contacts", label: "КОНТАКТЫ" },
  ];

  return (
    <header
      className={`site-header ${isScrolled || !isHome ? "is-scrolled" : ""}`}
    >
      <div className="container">
        <div className="header-inner">
          {/* Logo: Origami Bird */}
          <Link href="/" className="brand-link" aria-label={SITE_CONFIG.name}>
            <Image
              src="/img/brand/origami_bird_32.png"
              alt={SITE_CONFIG.name}
              width={36}
              height={36}
              className="origami-bird-img"
            />
            <span className="brand-title">{SITE_CONFIG.name}</span>
          </Link>

          {/* Multi-page Navigation */}
          <nav className="header-nav" aria-label="Основная навигация">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA */}
          <div className="header-right">
            <Link href="/contacts" className="btn btn-green btn-sm">
              Рассчитать проект
            </Link>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Переключить меню"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "is-open" : ""}`}>
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
        <div style={{ marginTop: "16px" }}>
          <Link
            href="/contacts"
            className="btn btn-green"
            style={{ width: "100%" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Рассчитать проект
          </Link>
        </div>
      </div>
    </header>
  );
}
