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
    <div id="measure" style={{ width: "100%" }}>
      {state.success ? (
        <div className="form-success-box">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-green-brand)", marginBottom: "8px" }}>
            Заявка принята
          </div>
          <h3 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 600, color: "#FFFFFF", marginBottom: "10px" }}>
            Спасибо за обращение!
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
            {state.message ||
              "Мы свяжемся с вами в ближайшее время для согласования удобного времени бесплатного выезда мастера по Санкт-Петербургу."}
          </p>
          <div style={{ marginTop: "14px", fontSize: "11px", color: "var(--color-text-muted)" }}>
            Студия «{SITE_CONFIG.name}» · {SITE_CONFIG.address} ({SITE_CONFIG.metro})
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "22px", color: "#FFFFFF", margin: 0 }}>
              Запись на бесплатный замер
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
              <option value="Прихожая">Прихожая / шкаф</option>
              <option value="Шкафы и стеллажи">Шкафы и стеллажи</option>
              <option value="Стеновые панели">Реечные и стеновые панели</option>
              <option value="Коммерческая мебель">Мебель для бизнеса</option>
            </select>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              className="btn btn-green"
              disabled={isPending}
              style={{ width: "100%", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Отправка..." : "Записаться на бесплатный замер"}
            </button>
            <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "10px", textAlign: "center", lineHeight: "1.4" }}>
              Бесплатный выезд мастера для лазерного замера помещения и составления 3D-проекта.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
