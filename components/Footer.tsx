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
                src="/img/brand/logo_bird.svg"
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
            <p className="footer-desc" style={{ fontSize: "14.5px", color: "#B2B8C2", lineHeight: 1.6 }}>
              Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro})<br />
              Цех: {SITE_CONFIG.productionAddress}
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
            <div className="footer-col-head">Каталог</div>
            <ul className="footer-nav-links">
              {SITE_CONFIG.productCategories.map((cat) => {
                let href = "/custom-furniture";
                if (cat.toLowerCase().includes("кухн")) href = "/kitchens";
                else if (cat.toLowerCase().includes("шкаф") || cat.toLowerCase().includes("гардероб")) href = "/wardrobes";
                return (
                  <li key={cat}>
                    <Link href={href} style={{ fontSize: "14.5px", color: "#B2B8C2" }}>
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
            <p className="footer-desc" style={{ marginBottom: "10px" }}>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "16px", textDecoration: "none" }}
              >
                {SITE_CONFIG.phone}
              </a>
              <br />
              <span style={{ fontSize: "13.5px", color: "#9EABC0" }}>
                {SITE_CONFIG.workHours}
              </span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.06)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <VkIcon />
                Сообщество ВКонтакте
              </a>
              <Link href="/contacts#measure" className="btn btn-green btn-sm">
                Записаться на консультацию
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} «{SITE_CONFIG.name}». {SITE_CONFIG.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
}
