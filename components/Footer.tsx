import Link from "next/link";
import Image from "next/image";
import VkIcon from "@/components/VkIcon";
import TelegramIcon from "@/components/TelegramIcon";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import MaxIcon from "@/components/MaxIcon";
import { SITE_CONFIG, NAVIGATION_LINKS } from "@/data/site";
import { LEGAL_DETAILS, hasConfirmedLegalDetails } from "@/data/legal";

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
            <p className="footer-desc" style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
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
              <li>
                <Link href="/privacy/">Политика конфиденциальности</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
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
              <span style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
                {SITE_CONFIG.workHours}
              </span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={SITE_CONFIG.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{
                    width: "38px",
                    height: "38px",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <TelegramIcon size={20} />
                </a>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{
                    width: "38px",
                    height: "38px",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={20} />
                </a>
                <a
                  href={SITE_CONFIG.maxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{
                    width: "38px",
                    height: "38px",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                  aria-label="Max"
                  title="Max"
                >
                  <MaxIcon size={20} />
                </a>
                <a
                  href={SITE_CONFIG.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{
                    width: "38px",
                    height: "38px",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                  aria-label="Сообщество ВКонтакте"
                  title="ВКонтакте"
                >
                  <VkIcon size={20} />
                </a>
              </div>
              <Link href="/contacts/#measure" className="btn btn-green btn-sm">
                Записаться на консультацию
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} «{SITE_CONFIG.name}». {SITE_CONFIG.disclaimer}
            {hasConfirmedLegalDetails && (
              <span className="footer-legal-details">
                {LEGAL_DETAILS.legalStatus} {LEGAL_DETAILS.operatorLegalName} · ИНН {LEGAL_DETAILS.inn}
                {LEGAL_DETAILS.ogrnOrOgrnip ? ` · ОГРН/ОГРНИП ${LEGAL_DETAILS.ogrnOrOgrnip}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
