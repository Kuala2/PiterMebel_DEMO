import MeasureForm from "@/components/MeasureForm";
import { PROMOS } from "@/data/promos";
import { SITE_CONFIG } from "@/data/site";

interface LeadSectionProps {
  id?: string;
  initialCategory?: string;
  title?: string;
  description?: string;
  source?: string;
  calculatorSummary?: string;
  showSketchLink?: boolean;
  mode?: "standard" | "calculator";
}

export default function LeadSection({
  id = "consult",
  initialCategory,
  title,
  description,
  source,
  calculatorSummary,
  showSketchLink = false,
  mode = "standard",
}: LeadSectionProps) {
  const isCalculator = mode === "calculator";
  const isKitchen = initialCategory?.toLowerCase().includes("кухн") ?? false;
  const steps = isCalculator
    ? [
        "Конфигурация приложится автоматически",
        "Специалист сверит детали проекта",
        "Вы получите точную смету",
      ]
    : [
        "Уточним размеры и пожелания",
        "Подберём материалы и комплектацию",
        "Подготовим предварительную смету",
      ];

  return (
    <section className="final-section lead-section" id={id}>
      <div className="container">
        <div className="final-card-container lead-card">
          <div className="final-grid">
            <div className="final-cta-block lead-copy">
              <div className="lead-status">
                <span className="lead-status-mark" aria-hidden="true">✓</span>
                {isCalculator ? "Параметры сохранены" : "Как проходит расчёт"}
              </div>

              <div>
                <h2 className="final-headline">
                  {title || (isCalculator ? "Осталось проверить расчёт" : "Рассчитаем ваш проект")}
                </h2>
                <p className="lead-desc">
                  {description || (isCalculator
                    ? "Передадим выбранную конфигурацию специалисту. Он уточнит детали и назовёт точную стоимость."
                    : "Специалист разберётся в задаче и подготовит расчёт без обязательств с вашей стороны.")}
                </p>
              </div>

              <ol className="lead-steps" aria-label="Что произойдёт после заявки">
                {steps.map((step, index) => (
                  <li key={step}><span>0{index + 1}</span>{step}</li>
                ))}
              </ol>

              <div className="lead-offers" aria-label="Актуальные условия заказа">
                <div className="lead-offer">
                  <span>{PROMOS.wardrobes.badge}</span>
                  <strong>{PROMOS.wardrobes.valueTag}</strong>
                </div>
                {isKitchen && (
                  <div className="lead-offer lead-offer-secondary">
                    <span>{PROMOS.kitchens.badge}</span>
                    <strong>{PROMOS.kitchens.valueTag}</strong>
                  </div>
                )}
              </div>

              <p className="lead-contact">
                Хотите обсудить сразу? <a href={`tel:${SITE_CONFIG.phoneRaw}`}>{SITE_CONFIG.phone}</a>
                <span aria-hidden="true">·</span>
                <a href={SITE_CONFIG.vkImUrl} target="_blank" rel="noopener noreferrer">Написать в VK</a>
              </p>
            </div>

            <div className="final-info-block">
              <MeasureForm
                initialCategory={initialCategory}
                source={source}
                calculatorSummary={calculatorSummary}
                showSketchLink={showSketchLink}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
