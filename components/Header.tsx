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
    { href: "/wardrobes", label: "ШКАФЫ" },
    { href: "/custom-furniture", label: "КОРПУСНАЯ МЕБЕЛЬ" },
    { href: "/production", label: "ПРОИЗВОДСТВО" },
    { href: "/calculator", label: "КАЛЬКУЛЯТОР" },
    { href: "/contacts", label: "КОНТАКТЫ" },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`site-header ${isScrolled || !isHome ? "is-scrolled" : ""}`}
    >
      <div className="container">
        <div className="header-inner">
          {/* Logo: Origami Bird */}
          <Link href="/" className="brand-link" aria-label={SITE_CONFIG.name} onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/img/brand/logo_bird.svg"
              alt={SITE_CONFIG.name}
              width={36}
              height={36}
              priority
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

          {/* Right: CTA & Phone */}
          <div className="header-right">
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="header-phone-link desktop-only"
              aria-label={`Позвонить в студию ${SITE_CONFIG.phone}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{SITE_CONFIG.phone}</span>
            </a>

            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="header-phone-icon-btn mobile-only"
              aria-label={`Позвонить ${SITE_CONFIG.phone}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            <Link href="/contacts#measure" className="btn btn-green btn-sm header-desktop-btn">
              Консультация и расчет
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
        <div className="mobile-nav-links">
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
        </div>
        <div className="mobile-nav-bottom">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="mobile-phone-cta"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{SITE_CONFIG.phone}</span>
          </a>
          <p className="mobile-work-hours">
            {SITE_CONFIG.workHours} · {SITE_CONFIG.metro}
          </p>
          <Link
            href="/contacts#measure"
            className="btn btn-green"
            style={{ width: "100%", padding: "14px 20px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Консультация и расчет
          </Link>
        </div>
      </div>
    </header>
  );
}
