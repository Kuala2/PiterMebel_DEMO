import Link from "next/link";

interface CaseEditorialProps {
  typeLabel: string;
  summary: string;
  facts: { label: string; value: string }[];
  catalogHref: string;
  catalogLabel: string;
}

export default function CaseEditorial({
  typeLabel,
  summary,
  facts,
  catalogHref,
  catalogLabel,
}: CaseEditorialProps) {
  return (
    <section className="case-editorial-section" data-sticky-cta-suppress>
      <div className="container case-editorial-layout">
        <div className="case-editorial-copy">
          <p className="eyebrow">Подтверждённые детали</p>
          <h2>Что известно об этом проекте</h2>
          <p>{summary}</p>
          <p>
            Похожее решение адаптируют под конкретное помещение: до расчёта уточняют
            размеры, состав техники или хранения, точки коммуникаций и выбранное
            наполнение. Эти данные определяют конструкцию и итоговую спецификацию.
          </p>
        </div>

        <div className="case-editorial-facts" aria-label={`Характеристики: ${typeLabel}`}>
          <div className="case-editorial-fact">
            <span>Тип проекта</span>
            <strong>{typeLabel}</strong>
          </div>
          {facts.map((fact) => (
            <div className="case-editorial-fact" key={`${fact.label}-${fact.value}`}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
          <div className="case-editorial-actions">
            <Link href="/calculator" className="btn btn-green">Предварительный расчёт</Link>
            <Link href={catalogHref} className="btn btn-glass">{catalogLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
