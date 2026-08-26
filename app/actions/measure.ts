export interface MeasureFormState {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    contact?: string;
    category?: string;
    address?: string;
  };
}

export async function submitMeasureRequest(
  prevState: MeasureFormState,
  formData: FormData
): Promise<MeasureFormState> {
  // Simulate network latency for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  const name = formData.get("name")?.toString().trim() || "";
  const contact = formData.get("contact")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const address = formData.get("address")?.toString().trim() || "";

  const errors: MeasureFormState["errors"] = {};

  if (!name || name.length < 2) {
    errors.name = "Пожалуйста, укажите ваше имя";
  }

  if (!contact || contact.length < 5) {
    errors.contact = "Укажите контакт для связи (телефон или ник в мессенджере)";
  }

  if (!category) {
    errors.category = "Выберите тип мебели";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    };
  }

  return {
    success: true,
    message: "Спасибо! Заявка на бесплатный замер успешно принята. Мы свяжемся с вами в ближайшее время для согласования удобного времени выезда мастера."
  };
}
