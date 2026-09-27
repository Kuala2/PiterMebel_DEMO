import { canReceiveLeads, LEGAL_VERSION } from "@/data/legal";
import { pageAddress } from "@/lib/privacy";

export interface MeasureFormState {
  success: boolean;
  /** True only after the delivery service accepts a real request. */
  deliveryAccepted?: boolean;
  message?: string;
  errors?: {
    contact?: string;
    category?: string;
    consent?: string;
    form?: string;
  };
}

interface LeadResponse {
  success?: boolean;
  message?: string;
}

const ALLOWED_CATEGORIES = new Set([
  "Кухня",
  "Шкаф или гардеробная",
  "Корпусная мебель",
  "Комплексный заказ",
  "Дизайн-проект",
  "Консультация",
]);

export async function submitMeasureRequest(
  _prevState: MeasureFormState,
  formData: FormData
): Promise<MeasureFormState> {
  const contact = formData.get("contact")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const consent = formData.get("consent") === "on";
  const botcheck = Boolean(formData.get("website")?.toString().trim()) || formData.get("confirm_order") === "on";
  const errors: NonNullable<MeasureFormState["errors"]> = {};

  if (contact.replace(/\D/g, "").length < 10) {
    errors.contact = "Укажите номер телефона — не менее 10 цифр";
  }
  if (!ALLOWED_CATEGORIES.has(category)) errors.category = "Выберите тип мебели";
  if (!consent) errors.consent = "Нужно согласие на обработку данных";
  if (consent && formData.get("consent_version") !== LEGAL_VERSION) errors.consent = "Обновите страницу и ознакомьтесь с актуальным согласием";

  if (Object.keys(errors).length > 0) return { success: false, errors };

  // Не показываем человеку ложное подтверждение, если поле заполнил автозаполнитель.
  if (botcheck) return { success: false, errors: { form: "Не удалось отправить заявку. Обновите страницу и попробуйте ещё раз." } };

  // Same-origin is a transport restriction, not proof of Russian hosting.
  // A reviewed Russian backend must be deployed separately from the static export.
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim();
  if (!canReceiveLeads || !endpoint || !/^\/api\/[a-zA-Z0-9/_-]+$/.test(endpoint)) {
    return {
      success: false,
      errors: {
        form: "Онлайн-форма ещё не подключена. Позвоните нам или напишите ВКонтакте — контакты находятся рядом с формой.",
      },
    };
  }

  const payload = new FormData();
  payload.set("subject", `Новая заявка с сайта: ${category}`);
  payload.set("from_name", "Сайт ПитерМебель");
  payload.set("Телефон", contact);
  payload.set("Тип мебели", category);
  payload.set("Пожелания", formData.get("message")?.toString().trim() || "Не указаны");
  payload.set("Ссылка на эскиз", formData.get("sketch_url")?.toString().trim() || "Не указана");
  payload.set("Источник формы", formData.get("source")?.toString().trim() || "Сайт");
  payload.set("Параметры калькулятора", formData.get("calculator_summary")?.toString().trim() || "Нет");
  payload.set("Страница", pageAddress(formData.get("page_url")?.toString() || ""));
  payload.set("consent", "true");
  payload.set("consent_version", LEGAL_VERSION);
  payload.set("consent_document", "/consent/");
  payload.set("consent_client_at", new Date().toISOString());
  payload.set("website", "");
  payload.set("confirm_order", "");
  payload.set("submission_id", formData.get("submission_id")?.toString() || "");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      signal: controller.signal,
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
    const result = (await response.json().catch(() => ({}))) as LeadResponse;

    if (!response.ok || result.success !== true) {
      return {
        success: false,
        errors: {
          form: "Не удалось отправить заявку. Проверьте соединение или свяжитесь с нами по телефону или ВКонтакте.",
        },
      };
    }

    return {
      success: true,
      deliveryAccepted: true,
      message: "Заявка отправлена. Специалист свяжется с вами, чтобы уточнить параметры и подготовить предварительный расчёт.",
    };
  } catch {
    return {
      success: false,
      errors: {
        form: "Связь с сервисом заявок прервалась. Попробуйте ещё раз или воспользуйтесь телефоном или ВКонтакте.",
      },
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
