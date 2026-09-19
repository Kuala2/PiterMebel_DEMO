import React from "react";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Консультация и расчёт",
    description:
      "Расскажите, какая мебель нужна, и пришлите размеры или эскиз — подготовим предварительный расчёт.",
  },
  {
    number: "02",
    title: "Проект, замер и договор",
    description:
      "Проработаем планировку, подберём материалы, выполним замер и зафиксируем смету и сроки в договоре.",
  },
  {
    number: "03",
    title: "Изготовление в цеху",
    description:
      "Подготовим детали по проекту, обработаем торцы и укомплектуем мебель выбранной фурнитурой.",
  },
  {
    number: "04",
    title: "Доставка и монтаж",
    description:
      "Привезём и установим мебель, выполним согласованные подключения техники, сантехники и электрики.",
  },
];

export default function HowItWorks09() {
  return (
    <section className="how-it-works-09-section" id="steps">
      <div className="container">
        <div className="how-it-works-09-header">
          <h2 className="how-it-works-09-title">Как создается ваша мебель</h2>
        </div>

        <div className="how-it-works-09-track">

          <ol className="how-it-works-09-list">
            {STEPS.map((step) => (
              <li key={step.number} className="how-it-works-09-step">
                <div className="how-it-works-09-circle-wrap">
                  <div className="how-it-works-09-circle">
                    <span>{step.number}</span>
                  </div>
                </div>

                <div className="how-it-works-09-content">
                  <h3 className="how-it-works-09-step-title">{step.title}</h3>
                  <p className="how-it-works-09-step-desc">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
