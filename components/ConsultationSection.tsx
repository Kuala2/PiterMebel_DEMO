"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PROMOS, PromoOffer } from "@/data/promos";
import { SITE_CONFIG } from "@/data/site";
import VkIcon from "@/components/VkIcon";
import { submitMeasureRequest, MeasureFormState } from "@/app/actions/measure";
import { reachGoal } from "@/lib/seo";

interface ConsultationSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  initialCategory?: "kitchens" | "wardrobes" | "customFurniture";
  defaultFurnitureType?: string;
  calculatorText?: string;
  calculatorHref?: string;
  className?: string;
}

const initialFormState: MeasureFormState = {
  success: false,
};

export default function ConsultationSection({
  id = "consult",
  title = "Понравилась модель кухни?",
  subtitle = "Рассчитаем точную смету в 3 ценовых категориях материалов или согласуем встречу в студии для выбора образцов",
  initialCategory = "kitchens",
  defaultFurnitureType = "Кухня",
  calculatorText = "Калькулятор кухни",
  calculatorHref = "/calculator",
  className = "",
}: ConsultationSectionProps) {
  // PROMO OFFERS
  const allOffers = Object.values(PROMOS).filter((o) => o.active);

  const getInitialOfferIndex = () => {
    if (initialCategory && PROMOS[initialCategory]) {
      const idx = allOffers.findIndex((o) => o.id === PROMOS[initialCategory].id);
      if (idx !== -1) return idx;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialOfferIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const isTransitioningRef = useRef(false);

  const goToOffer = useCallback((newIndex: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCycleKey((k) => k + 1);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 280);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((current) => {
      const nextIdx = (current + 1) % allOffers.length;
      goToOffer(nextIdx);
      return current;
    });
  }, [allOffers.length, goToOffer]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((current) => {
      const prevIdx = (current - 1 + allOffers.length) % allOffers.length;
      goToOffer(prevIdx);
      return current;
    });
  }, [allOffers.length, goToOffer]);

  useEffect(() => {
    if (isPaused || allOffers.length <= 1) return;
    const timer = setInterval(handleNext, 6500);
    return () => clearInterval(timer);
  }, [isPaused, allOffers.length, handleNext, cycleKey]);

  const currentOffer = allOffers[currentIndex] || allOffers[0];

  // FORM LOGIC
  const [formState, setFormState] = useState<MeasureFormState>(initialFormState);
  const [isPending, setIsPending] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitMeasureRequest(formState, formData);
    if (result.success) {
      reachGoal("zayavka");
    }
    setFormState(result);
    setIsPending(false);
  };

  return (
    <section className={`consult-architectural-section ${className}`} id={id} style={{ backgroundColor: "var(--bg-studio)" }}>
      <div className="container">
        <div className="consult-master-card">
          {/* 1. TOP ANNOUNCEMENT RIBBON: Factory Special Offer */}
          {currentOffer && (
            <div
              className="consult-promo-ribbon"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="consult-promo-left">
                <span className="consult-promo-badge-tag">
                  <span className="consult-promo-accent-dot" />
                  АКЦИЯ · {currentOffer.badge ? currentOffer.badge.toUpperCase() : "УСЛОВИЯ ФАБРИКИ"}
                </span>
                <div className={`consult-promo-title-anim ${isTransitioning ? "is-transitioning" : ""}`}>
                  <span className="consult-promo-title-text">{currentOffer.title}</span>
                </div>
              </div>

              {allOffers.length > 1 && (
                <div className="consult-promo-controls">
                  <span className="consult-promo-counter">
                    0{currentIndex + 1} / 0{allOffers.length}
                  </span>
                  <div className="consult-promo-nav-buttons">
                    <button
                      type="button"
                      className="consult-nav-arrow"
                      onClick={handlePrev}
                      aria-label="Предыдущая акция"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="consult-nav-arrow"
                      onClick={handleNext}
                      aria-label="Следующая акция"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. MAIN BODY: Headline Question + Consultation Form */}
          <div className="consult-main-body">
            {formState.success ? (
              <div className="form-success-box" style={{ padding: "40px 0", textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-green-brand)", marginBottom: "8px" }}>
                  Заявка принята
                </div>
                <h3 style={{ fontSize: "26px", fontFamily: "var(--font-main)", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px" }}>
                  Спасибо за обращение!
                </h3>
                <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: "1.6", maxWidth: "680px" }}>
                  {formState.message ||
                    "Мы свяжемся с вами в ближайшее время для уточнения деталей, предварительного расчета стоимости и согласования встречи в офисе студии."}
                </p>
                <div style={{ marginTop: "20px", fontSize: "13.5px", color: "var(--color-text-muted)" }}>
                  Студия «{SITE_CONFIG.name}» · {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи)
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="consult-form-element">
                {/* Section Header */}
                <div className="consult-header-block">
                  <h2 className="consult-headline">{title}</h2>
                  {subtitle && <p className="consult-subtitle">{subtitle}</p>}
                </div>

                {/* 3 Inputs Grid */}
                <div className="consult-fields-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="consult-name" className="form-label">
                      Ваше имя
                    </label>
                    <input
                      id="consult-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Елена"
                      className="form-input"
                      disabled={isPending}
                    />
                    {formState.errors?.name && (
                      <p style={{ color: "#FF5A5A", fontSize: "13px", marginTop: "4px" }}>{formState.errors.name}</p>
                    )}
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="consult-contact" className="form-label">
                      Телефон или ник ВКонтакте
                    </label>
                    <input
                      id="consult-contact"
                      name="contact"
                      type="text"
                      required
                      placeholder="+7 (___) ___-__-__"
                      className="form-input"
                      disabled={isPending}
                    />
                    {formState.errors?.contact && (
                      <p style={{ color: "#FF5A5A", fontSize: "13px", marginTop: "4px" }}>{formState.errors.contact}</p>
                    )}
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="consult-category" className="form-label">
                      Тип мебели
                    </label>
                    <select
                      id="consult-category"
                      name="category"
                      defaultValue={defaultFurnitureType}
                      className="form-select"
                      disabled={isPending}
                    >
                      <option value="Кухня">Кухня на заказ</option>
                      <option value="Гардеробная">Гардеробная система</option>
                      <option value="Шкаф">Шкаф-купе / распашной</option>
                      <option value="Прихожая">Прихожая / входная зона</option>
                      <option value="Стеновые панели">Реечные и стеновые панели</option>
                      <option value="Коммерческая мебель">Мебель для бизнеса</option>
                    </select>
                  </div>
                </div>

                {/* Action Row: Consent + Submit Button */}
                <div className="consult-action-row">
                  <label className="form-consent-label" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={isPending}
                    />
                    <span>
                      Даю согласие на обработку персональных данных в соответствии с{" "}
                      <Link href="/privacy" style={{ color: "var(--color-green-brand)", textDecoration: "underline" }}>
                        политикой конфиденциальности
                      </Link>{" "}
                      (ФЗ № 152-ФЗ)
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn btn-green consult-submit-btn"
                    disabled={isPending || !consent}
                    style={{
                      opacity: isPending || !consent ? 0.55 : 1,
                    }}
                  >
                    {isPending ? "Отправка..." : "Записаться на консультацию и расчет"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 3. DIRECT CONTACT CHANNELS STRIP (Refined Luxury Rows) */}
          <div className="consult-direct-strip">
            <div className="consult-direct-header">
              <span className="consult-direct-label">Прямая связь с технологом без ожидания:</span>
            </div>

            <div className="consult-direct-grid">
              {/* Phone */}
              <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="consult-direct-card">
                <div className="consult-direct-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="consult-direct-body">
                  <span className="consult-direct-val">{SITE_CONFIG.phone}</span>
                  <span className="consult-direct-desc">Звонок на производство · 9:00–21:00</span>
                </div>
                <span className="consult-direct-arrow">→</span>
              </a>

              {/* VK */}
              <a href={SITE_CONFIG.vkImUrl} target="_blank" rel="noopener noreferrer" className="consult-direct-card">
                <div className="consult-direct-icon">
                  <VkIcon />
                </div>
                <div className="consult-direct-body">
                  <span className="consult-direct-val">Чат ВКонтакте</span>
                  <span className="consult-direct-desc">Отправка эскизов · ответ за 15 мин</span>
                </div>
                <span className="consult-direct-arrow">→</span>
              </a>

              {/* Calculator */}
              <Link href={calculatorHref} className="consult-direct-card">
                <div className="consult-direct-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="0" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="16" y1="14" x2="16" y2="18" />
                    <path d="M16 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 18h.01" />
                    <path d="M8 18h.01" />
                  </svg>
                </div>
                <div className="consult-direct-body">
                  <span className="consult-direct-val">{calculatorText}</span>
                  <span className="consult-direct-desc">Расчет стоимости онлайн за 2 минуты</span>
                </div>
                <span className="consult-direct-arrow">→</span>
              </Link>
            </div>
          </div>

          {/* 4. STUDIO & PRODUCTION GEOLOCATION FOOTER */}
          <div className="consult-footer-bar">
            <span className="consult-footer-text">
              Офис студии: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи) · Собственное производство: {SITE_CONFIG.productionAddress}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
