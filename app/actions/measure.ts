export interface MeasureFormState {
  success: boolean;
  message?: string;
  errors?: {
    contact?: string;
    category?: string;
    consent?: string;
    form?: string;
  };
}

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ALLOWED_CATEGORIES = new Set([
  "Кухня",
  "Шкаф или гардеробная",
  "Корпусная мебель",
  "Комплексный заказ",
  "Консультация",
]);

export async function submitMeasureRequest(
  _prevState: MeasureFormState,
  formData: FormData
): Promise<MeasureFormState> {
  const contact = formData.get("contact")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const consent = formData.get("consent") === "on";
  const botcheck = formData.get("botcheck") === "on";
  const errors: NonNullable<MeasureFormState["errors"]> = {};

  if (contact.replace(/\D/g, "").length < 10) {
    errors.contact = "Укажите номер телефона — не менее 10 цифр";
  }
  if (!ALLOWED_CATEGORIES.has(category)) errors.category = "Выберите тип мебели";
  if (!consent) errors.consent = "Нужно согласие на обработку данных";

  if (Object.keys(errors).length > 0) return { success: false, errors };

  // Honeypot: человеку поле недоступно, а автоматический спам часто его отмечает.
  // Возвращаем нейтральный успех без отправки, чтобы не подсказывать боту причину.
  if (botcheck) return { success: true };

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    return {
      success: false,
      errors: {
        form: "Онлайн-форма ещё не подключена. Позвоните нам или напишите ВКонтакте — контакты находятся рядом с формой.",
      },
    };
  }

  const payload = new FormData();
  payload.set("access_key", accessKey);
  payload.set("subject", `Новая заявка с сайта: ${category}`);
  payload.set("from_name", "Сайт ПитерМебель");
  payload.set("Телефон", contact);
  payload.set("Тип мебели", category);
  payload.set("Пожелания", formData.get("message")?.toString().trim() || "Не указаны");
  payload.set("Ссылка на эскиз", formData.get("sketch_url")?.toString().trim() || "Не указана");
  payload.set("Источник формы", formData.get("source")?.toString().trim() || "Сайт");
  payload.set("Параметры калькулятора", formData.get("calculator_summary")?.toString().trim() || "Нет");
  payload.set("Страница", formData.get("page_url")?.toString().trim() || "Не определена");
  payload.set("Согласие", "Получено через обязательный checkbox");
  payload.set("botcheck", "");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: payload,
      signal: controller.signal,
    });
    const result = (await response.json().catch(() => ({}))) as Web3FormsResponse;

    if (!response.ok || !result.success) {
      return {
        success: false,
        errors: {
          form: "Не удалось отправить заявку. Проверьте соединение или свяжитесь с нами по телефону или ВКонтакте.",
        },
      };
    }

    return {
      success: true,
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
