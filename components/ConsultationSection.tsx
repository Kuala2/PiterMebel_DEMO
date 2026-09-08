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
          {/* LEFT: Active Studio Promo + Fast Contact Channels + Address */}
          <div
            className="consult-info-pane"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Promo Widget */}
            {currentOffer && (
              <div className="consult-promo-widget">
                <div className="consult-promo-head">
                  <span className="consult-promo-tag">
                    АКЦИЯ · {currentOffer.badge ? currentOffer.badge.toUpperCase() : "УСЛОВИЯ ФАБРИКИ"}
                  </span>
                  {allOffers.length > 1 && (
                    <div className="consult-promo-nav">
                      <span className="consult-promo-counter">
                        0{currentIndex + 1} / 0{allOffers.length}
                      </span>
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
                  )}
                </div>
                <div className={`consult-promo-title-anim ${isTransitioning ? "is-transitioning" : ""}`}>
                  <div className="consult-promo-title">{currentOffer.title}</div>
                </div>
              </div>
            )}

            {/* Direct Channels Cluster */}
            <div className="consult-buttons-cluster">
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="btn btn-green"
                style={{ width: "100%", height: "46px" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {SITE_CONFIG.phone}
              </a>
              <div className="consult-buttons-row">
                <a
                  href={SITE_CONFIG.vkImUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ gap: "8px" }}
                >
                  <VkIcon />
                  ВКонтакте
                </a>
                <Link href={calculatorHref} className="btn btn-glass">
                  {calculatorText}
                </Link>
              </div>
            </div>

            {/* Address Footnote */}
            <div className="consult-address-footnote">
              Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи) · Производство: {SITE_CONFIG.productionAddress}
            </div>
          </div>

          {/* RIGHT: Main Headline + Form fields */}
          <div className="consult-form-pane">
            {formState.success ? (
              <div className="form-success-box" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-green-brand)", marginBottom: "8px" }}>
                  Заявка принята
                </div>
                <h3 style={{ fontSize: "24px", fontFamily: "var(--font-main)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "10px" }}>
                  Спасибо за обращение!
                </h3>
                <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: "1.55" }}>
                  {formState.message ||
                    "Мы свяжемся с вами в ближайшее время для уточнения деталей, предварительного расчета стоимости и согласования встречи в офисе студии."}
                </p>
                <div style={{ marginTop: "16px", fontSize: "13px", color: "var(--color-text-muted)" }}>
                  Студия «{SITE_CONFIG.name}» · {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи)
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <div>
                  <h2 className="consult-headline">
                    {title}
                  </h2>

                  <div className="form-group">
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

                  <div className="form-group">
                    <label htmlFor="consult-contact" className="form-label">
                      Контакт для связи
                    </label>
                    <input
                      id="consult-contact"
                      name="contact"
                      type="text"
                      required
                      placeholder="Номер телефона или ник ВКонтакте"
                      className="form-input"
                      disabled={isPending}
                    />
                    {formState.errors?.contact && (
                      <p style={{ color: "#FF5A5A", fontSize: "13px", marginTop: "4px" }}>{formState.errors.contact}</p>
                    )}
                  </div>

                  <div className="form-group">
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

                <div style={{ marginTop: "14px" }}>
                  <label className="form-consent-label">
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
                      <Link href="/privacy">политикой конфиденциальности</Link> (ФЗ № 152-ФЗ)
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="btn btn-green"
                    disabled={isPending || !consent}
                    style={{ width: "100%", height: "46px", borderRadius: 0, marginTop: "12px", opacity: isPending || !consent ? 0.55 : 1 }}
                  >
                    {isPending ? "Отправка..." : "Записаться на консультацию и расчет"}
                  </button>
                  <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "10px", textAlign: "left", lineHeight: "1.45" }}>
                    С вами свяжется специалист фабрики, чтобы обсудить пожелания для предварительного расчета и согласовать визит в офис.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
