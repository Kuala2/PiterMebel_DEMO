import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LegalOperator from "@/components/LegalOperator";
import { LEGAL_DATE, LEGAL_VERSION } from "@/data/legal";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "Согласие на аналитику | ПитерМебель",
  description: "Добровольное согласие на обработку технических данных сервисом Яндекс Метрика.",
  alternates: { canonical: "/analytics-consent/" },
};

export default function AnalyticsConsentPage() {
  return <div className="privacy-page" style={{ minHeight: "100vh" }}>
    <PageHeader title="Согласие на аналитику" backTo="/privacy/#cookies" backLabel="К настройкам аналитики" />
    <section className="article-content-section"><div className="container article-narrow">
      <p className="article-paragraph">Отдельное добровольное согласие. Редакция от {LEGAL_DATE}, версия {LEGAL_VERSION}.</p>
      <LegalOperator />
      <p className="article-paragraph">Нажимая «Дать согласие на аналитику», я свободно разрешаю указанному оператору обрабатывать
        технические данные о моём посещении для оценки посещаемости и улучшения удобства сайта с использованием Яндекс Метрики.</p>
      <p className="article-paragraph">Данные: IP-адрес, cookie-идентификаторы, характеристики браузера и устройства, адреса просмотренных страниц
        без строки запроса и фрагмента, время и события взаимодействия. Телефон, текст обращения и содержимое полей формы в Метрику не передаются.
        Вебвизор и карта кликов отключены.</p>
      <p className="article-paragraph">Разрешённые действия: автоматизированные сбор, запись, систематизация, накопление, хранение,
        извлечение, использование для статистики, передача сервису Яндекс Метрика, обезличивание, блокирование, удаление и уничтожение.
        Получатель: ООО «ЯНДЕКС», 119021, Россия, Москва, ул. Льва Толстого, д. 16;
        обработка сервисом описана в <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">политике Яндекса</a>.</p>
      <p className="article-paragraph">Согласие действует до отзыва, но не более 180 дней с момента выбора. Отозвать его можно
        кнопкой «Отключить аналитику» в <Link href="/privacy/#cookies">настройках</Link>.
        Для удаления уже переданных данных можно написать на <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
        При отсутствии другого законного основания применяются сроки прекращения обработки и уничтожения по статье 21 № 152-ФЗ.</p>
      <p className="article-paragraph">Отказ не ограничивает функции сайта. Это согласие не включает рекламу, обработку заявки или
        распространение персональных данных. Продолжение просмотра сайта не считается согласием.</p>
    </div></section>
  </div>;
}
