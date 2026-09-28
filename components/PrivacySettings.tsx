"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { canUseAnalytics } from "@/data/legal";
import { hasAnalyticsConsent, saveAnalyticsChoice, PRIVACY_EVENT } from "@/lib/privacy";

export default function PrivacySettings() {
  const [enabled, setEnabled] = useState(canUseAnalytics);
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
      setError("Не удалось сохранить выбор. Разрешите хранилище сайта (localStorage) в настройках браузера, чтобы запомнить настройку аналитики.");
      return;
    }
    setError("");
    setEnabled(hasAnalyticsConsent());
  }
  return <div className="privacy-settings">
    <p className="article-paragraph" role="status">{enabled ? "Статус: Яндекс.Метрика активна." : "Статус: Яндекс.Метрика отключена для этого браузера."}</p>
    <p className="article-paragraph">Подробнее об условиях: <Link href="/analytics-consent/">согласие на обработку данных веб-аналитики</Link>.
      Вы можете отключить или снова включить аналитику в любое время:</p>
    <div className="privacy-settings-actions">
      <button type="button" className="btn btn-glass" disabled={!enabled} onClick={() => choose(false)}>Отключить аналитику</button>
      <button type="button" className="btn btn-glass" disabled={!canUseAnalytics || enabled} onClick={() => choose(true)}>Включить аналитику</button>
    </div>
    {error && <p className="form-field-error" role="alert">{error}</p>}
  </div>;
}
