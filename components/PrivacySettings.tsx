"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { canUseAnalytics } from "@/data/legal";
import { hasAnalyticsConsent, saveAnalyticsChoice, PRIVACY_EVENT } from "@/lib/privacy";

export default function PrivacySettings() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent());
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PRIVACY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  function choose(value: boolean) {
    if (!saveAnalyticsChoice(value)) {
      setError("Не удалось сохранить выбор. Разрешите хранилище сайта в браузере; аналитика без сохранённого согласия не включается.");
      return;
    }
    setError("");
    setEnabled(hasAnalyticsConsent());
  }
  return <div className="privacy-settings">
    <p className="article-paragraph" role="status">{enabled ? "Аналитика включена по вашему согласию." : "Аналитика отключена."}
      {!canUseAnalytics && " Подключение сервиса пока не завершено."}</p>
    <p className="article-paragraph">Отдельное <Link href="/analytics-consent/">согласие на обработку данных для аналитики</Link>.
      Выбор можно изменить здесь в любое время.</p>
    <div className="privacy-settings-actions">
      <button type="button" className="btn btn-glass" onClick={() => choose(false)}>Отключить аналитику</button>
      <button type="button" className="btn btn-glass" disabled={!canUseAnalytics || enabled} onClick={() => choose(true)}>Дать согласие на аналитику</button>
    </div>
    {error && <p className="form-field-error" role="alert">{error}</p>}
  </div>;
}
