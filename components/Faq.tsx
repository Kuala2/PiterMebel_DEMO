"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section" id="faq" style={{ backgroundColor: "var(--bg-dark)", paddingTop: "75px", paddingBottom: "80px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 36px" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Часто задаваемые вопросы</h2>
        </div>

        <div className="faq-list" style={{ maxWidth: "840px", margin: "0 auto" }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="faq-item"
                style={{
                  background: "var(--bg-surface)",
                  border: `1px solid ${isOpen ? "var(--border-green)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-md)",
                  marginBottom: "12px",
                  padding: "20px 24px",
                  transition: "all 0.25s ease",
                  boxShadow: isOpen ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    color: isOpen ? "var(--color-green-brand)" : "#FFFFFF",
                    fontFamily: "var(--font-main), 'Montserrat', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    gap: "16px",
                  }}
                >
                  <span>{item.question}</span>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--radius-sm)",
                      background: isOpen ? "var(--color-green-brand)" : "rgba(255,255,255,0.05)",
                      color: isOpen ? "#0D0F11" : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isOpen ? "—" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "14px",
                      borderTop: "1px solid var(--border-subtle)",
                      animation: "photoFadeIn 0.25s ease forwards",
                    }}
                  >
                    <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: "1.65" }}>
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
