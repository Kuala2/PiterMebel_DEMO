import React from "react";

interface StepItem {
  title: string;
  desc: string;
  details: string[];
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    title: "Подбор техники и доставка",
    desc: "Подбираем технику точно под проект кухни и привозим вместе с гарнитуром.",
    details: [
      "Габариты и вентиляционные зазоры",
      "Доставка за один рейс с мебелью",
      "Заводская посадка в модули",
    ],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    title: "Подготовка коммуникаций",
    desc: "Штатный мастер готовит электрику и сантехнику по чертежу до монтажа, а в день сборки бригада выполняет чистовое подключение.",
    details: [
      "Штробление и вывод розеток по утверждённому плану",
      "Подводка водоснабжения и слива под проектную технику",
      "Чистовая уборка помещения после подготовки стен",
      "Полное подключение оборудования в день сборки",
    ],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Монтаж и запуск под ключ",
    desc: "Бригада собирает кухню и сразу подключает всё к воде и электричеству.",
    details: [
      "Врезка мойки и варочной панели",
      "Подключение приборов и подсветки",
      "Готовность в день установки",
    ],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function HowItWorks01() {
  return (
    <section
      className="how-it-works-section"
      id="all-in-one"
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <div className="how-it-works-header">
          <h2 id="how-it-works-title" className="how-it-works-title">
            Всё под ключ: от проекта розеток до подключения техники
          </h2>
          <p className="how-it-works-subtitle">
            Вам не нужно искать других специалистов: проектируем, готовим коммуникации, доставляем и подключаем всё под ключ одной командой.
          </p>
        </div>

        <ol className="how-it-works-grid">
          {STEPS.map((step) => (
            <li key={step.title} className="how-it-works-card">
              {/* Clockwise animated border trace on hover without shine */}
              <svg
                className="how-it-works-border-svg"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx="16"
                  pathLength="100"
                />
              </svg>

              <div className="how-it-works-icon-box" aria-hidden="true">
                {step.icon}
              </div>

              <h3 className="how-it-works-card-title">{step.title}</h3>
              <p className="how-it-works-card-desc">{step.desc}</p>

              <ul
                className="how-it-works-details"
                aria-label={`Особенности: ${step.title}`}
              >
                {step.details.map((detail) => (
                  <li key={detail} className="how-it-works-detail-item">
                    <span
                      className="how-it-works-detail-bullet"
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="how-it-works-guarantee">
          <p className="how-it-works-guarantee-text">
            <strong className="how-it-works-guarantee-strong">
              Единая ответственность:
            </strong>{" "}
            Вам не нужно искать других специалистов: проектируем, готовим коммуникации, доставляем и подключаем всё под ключ одной командой. Если розетка не совпала или слив упёрся в ящик — за это отвечаем мы, а не отделочники.
          </p>
        </div>
      </div>
    </section>
  );
}
