"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { submitMeasureRequest, MeasureFormState } from "@/app/actions/measure";
import { reachGoal } from "@/lib/seo";
import { SITE_CONFIG } from "@/data/site";

const initialState: MeasureFormState = { success: false };

const CATEGORY_OPTIONS = [
  { value: "Кухня", label: "Кухня на заказ" },
  { value: "Шкаф или гардеробная", label: "Шкаф или гардеробная" },
  { value: "Корпусная мебель", label: "Корпусная мебель" },
  { value: "Комплексный заказ", label: "Мебель для нескольких зон" },
  { value: "Консультация", label: "Пока не определились" },
] as const;

interface MeasureFormProps {
  initialCategory?: string;
  source?: string;
  calculatorSummary?: string;
  showSketchLink?: boolean;
}

function normalizeCategory(value?: string) {
  const normalized = value?.toLowerCase() || "";
  if (normalized.includes("кухн")) return "Кухня";
  if (normalized.includes("шкаф") || normalized.includes("гардероб")) return "Шкаф или гардеробная";
  if (
    normalized.includes("корпус") ||
    normalized.includes("прихож") ||
    normalized.includes("панел") ||
    normalized.includes("ванн")
  ) return "Корпусная мебель";
  if (normalized.includes("комплекс") || normalized.includes("нескольк")) return "Комплексный заказ";
  return "Консультация";
}

export default function MeasureForm({
  initialCategory,
  source,
  calculatorSummary,
  showSketchLink = false,
}: MeasureFormProps) {
  const uid = useId();
  const [state, setState] = useState<MeasureFormState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [consent, setConsent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => normalizeCategory(initialCategory));
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.errors) errorSummaryRef.current?.focus();
  }, [state.errors]);

  useEffect(() => {
    setSelectedCategory(normalizeCategory(initialCategory));
  }, [initialCategory]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    setIsPending(true);
    setState(initialState);
    const formData = new FormData(event.currentTarget);
    formData.set("page_url", window.location.href);
    const result = await submitMeasureRequest(initialState, formData);
    if (result.success) reachGoal("zayavka");
    setState(result);
    setIsPending(false);
  };

  const contactId = `${uid}-contact`;
  const categoryId = `${uid}-category`;
  const messageId = `${uid}-message`;
  const sketchId = `${uid}-sketch`;
  const consentId = `${uid}-consent`;

  if (state.success) {
    return (
      <div id="measure-form" className="form-success-box" role="status" aria-live="polite">
        <div className="form-success-kicker">Заявка отправлена</div>
        <h3>Спасибо за обращение!</h3>
        <p>{state.message || "Мы свяжемся с вами в ближайшее время."}</p>
        <div className="form-success-address">
          Студия «{SITE_CONFIG.name}» · {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи)
        </div>
      </div>
    );
  }

  return (
    <div id="measure-form" style={{ width: "100%" }}>
      <form onSubmit={handleSubmit} className="measure-form" noValidate>
        <input type="hidden" name="source" value={source || initialCategory || "Общая форма"} />
        <input type="hidden" name="calculator_summary" value={calculatorSummary || ""} />
        <label className="form-honeypot" aria-hidden="true">
          Не заполняйте это поле
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
        </label>

        <div>
          <div className="form-heading">
            <h3>Запросить предварительный расчёт</h3>
            <p>Оставьте телефон — специалист уточнит детали и подготовит расчёт.</p>
          </div>

          {state.errors && (
            <div ref={errorSummaryRef} className="form-error-summary" role="alert" tabIndex={-1}>
              <strong>Проверьте форму</strong>
              <p>{state.errors.form || "Исправьте отмеченные поля и отправьте заявку ещё раз."}</p>
            </div>
          )}

          <div className="form-fields-grid">
            <div className="form-group">
              <label htmlFor={categoryId} className="form-label">
                Что хотите заказать <span className="form-required-mark" aria-hidden="true">*</span>
              </label>
              <select
                id={categoryId}
                name="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="form-select"
                disabled={isPending}
                required
                aria-invalid={Boolean(state.errors?.category)}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-contact-group">
              <label htmlFor={contactId} className="form-label">
                Телефон <span className="form-required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id={contactId}
                name="contact"
                type="tel"
                required
                minLength={10}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 921 000-00-00"
                className="form-input"
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.contact)}
                aria-describedby={state.errors?.contact ? `${contactId}-error` : undefined}
              />
              {state.errors?.contact && <p id={`${contactId}-error`} className="form-field-error">{state.errors.contact}</p>}
            </div>

            <details className="form-details form-group-wide">
              <summary>
                <span>Добавить детали проекта</span>
                <span className="form-details-note">Необязательно</span>
              </summary>
              <div className="form-details-content">
                <div className="form-group">
                  <label htmlFor={messageId} className="form-label">Коротко о проекте</label>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={3}
                    className="form-input form-textarea"
                    placeholder="Размеры, материалы, техника или удобное время для звонка"
                    disabled={isPending}
                  />
                </div>

                {showSketchLink && (
                  <div className="form-group">
                    <label htmlFor={sketchId} className="form-label">Ссылка на эскиз или план</label>
                    <input
                      id={sketchId}
                      name="sketch_url"
                      type="url"
                      inputMode="url"
                      className="form-input"
                      placeholder="Яндекс Диск, VK или другое облако"
                      disabled={isPending}
                    />
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>

        <div className="form-submit-area">
          <label htmlFor={consentId} className="form-consent-label">
            <input
              id={consentId}
              type="checkbox"
              name="consent"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              disabled={isPending}
              aria-invalid={Boolean(state.errors?.consent)}
            />
            <span>
              Согласен на обработку данных согласно <Link href="/privacy/">политике конфиденциальности</Link>
            </span>
          </label>
          {state.errors?.consent && <p className="form-field-error">{state.errors.consent}</p>}
          <button type="submit" className="btn btn-green form-submit-button" disabled={isPending}>
            {isPending ? "Отправляем…" : "Запросить расчёт"}
          </button>
        </div>
      </form>
    </div>
  );
}
