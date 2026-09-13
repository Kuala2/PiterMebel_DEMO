import MeasureForm from "@/components/MeasureForm";
import PromoBanner from "@/components/PromoBanner";

interface LeadSectionProps {
  id?: string;
  initialCategory?: string;
  source?: string;
  calculatorSummary?: string;
  showSketchLink?: boolean;
  mode?: "standard" | "calculator";
}

export default function LeadSection({
  id = "consult",
  initialCategory,
  source,
  calculatorSummary,
  showSketchLink = false,
  mode = "standard",
}: LeadSectionProps) {
  const isCalculator = mode === "calculator";
  const normalizedCategory = initialCategory?.toLowerCase() ?? "";
  const initialPromoCategory = normalizedCategory.includes("кух")
    ? "kitchens"
    : normalizedCategory.includes("шкаф") || normalizedCategory.includes("гардероб")
      ? "wardrobes"
      : normalizedCategory.includes("корпус") || normalizedCategory.includes("мебел")
        ? "customFurniture"
        : "kitchens";
  const steps = isCalculator
    ? [
        "Получим выбранные параметры",
        "Сверим детали проекта",
        "Подготовим точную смету",
      ]
    : [
        "Уточним задачу и размеры",
        "Сверим материалы и комплектацию",
        "Подготовим предварительную смету",
      ];

  return (
    <section className="final-section lead-section" id={id}>
      <div className="container">
        <div className="final-card-container lead-card">
          <div className="final-grid">
            <div className="final-cta-block lead-copy">
              <h2 className="lead-process-title">
                {isCalculator ? "Что будет дальше" : "Как проходит расчёт"}
              </h2>

              <ol className="lead-steps" aria-label="Что произойдёт после заявки">
                {steps.map((step, index) => (
                  <li key={step}><span>0{index + 1}</span>{step}</li>
                ))}
              </ol>

              <PromoBanner
                initialCategory={initialPromoCategory}
                variant="cta-card"
                className="lead-promo-carousel"
              />
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
