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
      "Проверьте предварительный бюджет в онлайн-калькуляторе или пришлите размеры и эскиз — рассчитаем проект по материалам.",
  },
  {
    number: "02",
    title: "Проект, замер и договор",
    description:
      "Подберём образцы фасадов и фурнитуры в офисе у м. «Нарвская» (пл. Стачек, 9, оф. 407) по записи, проведём замер и зафиксируем смету и сроки в договоре.",
  },
  {
    number: "03",
    title: "Изготовление в цеху",
    description:
      "Выполним раскрой, кромление с прифуговкой и присадку в своём цеху на Петергофском шоссе, 73: шкафы и корпусная мебель — 21–40 раб. дней, кухни — от 3 недель, шпон и массив — 6–8 недель.",
  },
  {
    number: "04",
    title: "Доставка и монтаж",
    description:
      "Штатная бригада бережно доставит и соберёт мебель за 1–2 дня, врежет мойку и подключит бытовую технику, сантехнику и подсветку.",
  },
];

export default function HowItWorks09() {
  return (
    <section className="how-it-works-09-section" id="steps">
      <div className="container">
        <div className="how-it-works-09-header">
          <h2 className="how-it-works-09-title">Как создаётся ваша мебель</h2>
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
