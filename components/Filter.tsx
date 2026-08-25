"use client";

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterProps {
  options: FilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function Filter({ options, activeKey, onChange }: FilterProps) {
  return (
    <div className="catalog-tabs-bar" role="tablist" aria-label="Фильтр по категориям">
      {options.map((opt) => {
        const isActive = opt.key === activeKey;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`cat-tab ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(opt.key)}
          >
            {opt.label} {typeof opt.count === "number" && `(${opt.count})`}
          </button>
        );
      })}
    </div>
  );
}
