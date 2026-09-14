"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

interface CatalogTab {
  key: string;
  label: string;
}

interface CatalogTabsProps {
  tabs: CatalogTab[];
  activeKey: string;
  onChange: (key: string) => void;
  label: string;
}

export default function CatalogTabs({ tabs, activeKey, onChange, label }: CatalogTabsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ start: false, end: false });

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setScrollState({
      start: scroller.scrollLeft > 4,
      end: maxScroll - scroller.scrollLeft > 4,
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(scroller);
    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState, tabs.length]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    const nextButton = scrollerRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[nextIndex];
    nextButton?.focus();
    nextButton?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div
      className={`catalog-tabs-shell${scrollState.start ? " can-scroll-start" : ""}${scrollState.end ? " can-scroll-end" : ""}`}
      data-sticky-cta-suppress
    >
      <div
        ref={scrollerRef}
        className="catalog-tabs-bar"
        role="tablist"
        aria-label={label}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeKey === tab.key}
            className={`cat-tab ${activeKey === tab.key ? "is-active" : ""}`}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="catalog-tabs-hint" aria-hidden="true">
        Проведите по списку, чтобы увидеть все категории
      </p>
    </div>
  );
}
