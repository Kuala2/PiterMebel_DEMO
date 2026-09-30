"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { canUseAnalytics } from "@/data/legal";
import { isAnalyticsEnabled, saveAnalyticsChoice, PRIVACY_EVENT, PRIVACY_KEY } from "@/lib/privacy";

export default function PrivacySettings({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(canUseAnalytics);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setEnabled(isAnalyticsEnabled());
    const syncStorage = (event: StorageEvent) => {
      if (event.key === PRIVACY_KEY || event.key === null) sync();
    };
    sync();
    setReady(true);
    window.addEventListener(PRIVACY_EVENT, sync);
    window.addEventListener("storage", syncStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(PRIVACY_EVENT, sync);
      window.removeEventListener("storage", syncStorage);
      window.removeEventListener("focus", sync);
    };
  }, []);
  function choose(value: boolean) {
    if (!saveAnalyticsChoice(value)) {
      setError("Выбор применён, но браузер не позволил его сохранить. Настройка действует до перезагрузки страницы. Чтобы запомнить её, разрешите хранение данных этого сайта в браузере.");
      return;
    }
    setError("");
    setEnabled(isAnalyticsEnabled());
  }
  return <div className={compact ? "footer-analytics" : "privacy-settings"} data-analytics-settings={compact ? "footer" : "page"}>
    <div className="privacy-settings-actions">
      <p className="analytics-status" role="status">{!ready ? "Настройки Яндекс.Метрики" : enabled ? "Яндекс.Метрика включена для этого браузера." : "Яндекс.Метрика отключена для этого браузера."}</p>
      <button type="button" className={compact ? "footer-analytics-button" : "btn btn-glass"} disabled={!ready || !canUseAnalytics} onClick={() => choose(!enabled)}>
        {enabled ? "Отключить Яндекс.Метрику для меня" : "Включить Яндекс.Метрику для меня"}
      </button>
    </div>
    {!compact && <p className="analytics-help">Выбор действует в этом браузере, пока вы не измените его или не очистите данные сайта.
      {" "}<Link href="/analytics-consent/">Условия работы Яндекс.Метрики</Link>.</p>}
    {error && <p className="form-field-error" role="alert">{error}</p>}
    <noscript><p>JavaScript отключён: счётчик Яндекс.Метрики не загружается, изменение настройки недоступно.</p></noscript>
  </div>;
}
