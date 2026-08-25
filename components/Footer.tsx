import Link from "next/link";
import Image from "next/image";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG, NAVIGATION_LINKS } from "@/data/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Col 1: Brand & Slogan */}
          <div>
            <div className="footer-brand-title">
              <Image
                src="/img/brand/origami_bird_32.png"
                alt={SITE_CONFIG.name}
                width={26}
                height={26}
                className="origami-bird-img"
              />
              <span>{SITE_CONFIG.name}</span>
            </div>
            <p className="footer-desc" style={{ fontStyle: "italic", marginBottom: "8px", color: "#FFFFFF" }}>
              «{SITE_CONFIG.slogan}»
            </p>
            <p className="footer-desc">
              {SITE_CONFIG.city}, {SITE_CONFIG.address}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="footer-col-head">Навигация</div>
            <ul className="footer-nav-links">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <div className="footer-col-head">Направления</div>
            <ul className="footer-nav-links">
              {SITE_CONFIG.productCategories.map((cat) => {
                const href = cat.toLowerCase().includes("кухн") ? "/kitchens" : "/projects";
                return (
                  <li key={cat}>
                    <Link href={href} style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      {cat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <div className="footer-col-head">Связь</div>
            <p className="footer-desc" style={{ marginBottom: "14px" }}>
              Цех на ул. Трефолева, 1П
              <br />
              Пн – Сб: с 10:00 до 20:00
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass btn-sm"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <VkIcon />
                Сообщество ВКонтакте
              </a>
              <Link href="/contacts#measure" className="btn btn-green btn-sm">
                Записаться на замер
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} «{SITE_CONFIG.name}». {SITE_CONFIG.disclaimer}
          </div>
          <div>Собственное производство с {SITE_CONFIG.foundedYear} года</div>
        </div>
      </div>
    </footer>
  );
}
