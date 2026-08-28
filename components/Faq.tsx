"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-head-block">
          <h2 className="section-title">Часто задаваемые вопросы</h2>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className={`faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="faq-question-btn"
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-chevron-icon">
                    {isOpen ? "—" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer-pane">
                    <p className="faq-answer-text">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
