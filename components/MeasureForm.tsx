"use client";

import { useState } from "react";
import { submitMeasureRequest, MeasureFormState } from "@/app/actions/measure";
import { SITE_CONFIG } from "@/data/site";

const initialState: MeasureFormState = {
  success: false,
};

interface MeasureFormProps {
  initialCategory?: string;
}

export default function MeasureForm({ initialCategory }: MeasureFormProps) {
  const [state, setState] = useState<MeasureFormState>(initialState);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitMeasureRequest(state, formData);
    setState(result);
    setIsPending(false);
  };

  return (
    <div id="measure-form" style={{ width: "100%" }}>
      {state.success ? (
        <div className="form-success-box">
          <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-green-brand)", marginBottom: "8px" }}>
            Заявка принята
          </div>
          <h3 style={{ fontSize: "22px", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "10px" }}>
            Спасибо за обращение!
          </h3>
          <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: "1.55" }}>
            {state.message ||
              "Мы свяжемся с вами в ближайшее время для уточнения деталей, предварительного расчета стоимости и согласования встречи в офисе студии."}
          </p>
          <div style={{ marginTop: "14px", fontSize: "13px", color: "var(--color-text-muted)" }}>
            Студия «{SITE_CONFIG.name}» · {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи)
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div>
            <div style={{ marginBottom: "18px" }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                Запись на консультацию и расчет
              </h3>
            </div>

            <div className="form-group">
              <label htmlFor="form-name" className="form-label">
                Ваше имя
              </label>
              <input
                id="form-name"
                name="name"
                type="text"
                required
                placeholder="Елена"
                className="form-input"
                disabled={isPending}
              />
              {state.errors?.name && (
                <p style={{ color: "#FF5A5A", fontSize: "11px", marginTop: "4px" }}>{state.errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="form-contact" className="form-label">
                Контакт для связи
              </label>
              <input
                id="form-contact"
                name="contact"
                type="text"
                required
                placeholder="Номер телефона или ник ВКонтакте"
                className="form-input"
                disabled={isPending}
              />
              {state.errors?.contact && (
                <p style={{ color: "#FF5A5A", fontSize: "11px", marginTop: "4px" }}>{state.errors.contact}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="form-category" className="form-label">
                Тип мебели
              </label>
              <select
                id="form-category"
                name="category"
                defaultValue={initialCategory || "Кухня"}
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

          <div style={{ marginTop: "18px" }}>
            <button
              type="submit"
              className="btn btn-green"
              disabled={isPending}
              style={{ width: "100%", height: "44px", borderRadius: 0, opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Отправка..." : "Записаться на консультацию"}
            </button>
            <p style={{ fontSize: "13.5px", color: "var(--color-text-secondary)", marginTop: "10px", textAlign: "left", lineHeight: "1.5" }}>
              С вами свяжется специалист, чтобы обсудить пожелания для предварительного расчета и согласовать визит в офис.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
