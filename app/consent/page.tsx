import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LegalOperator from "@/components/LegalOperator";
import { LEGAL_DATE, LEGAL_VERSION, PROCESSING_SETUP, canReceiveLeads } from "@/data/legal";
import { SITE_CONFIG } from "@/data/site";
import { buildOg, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных | ПитерМебель",
  description: "Отдельное согласие для заявки на расчёт мебели, консультацию и согласование замера в ПитерМебель.",
  alternates: { canonical: "/consent/" },
  openGraph: buildOg(
    "Согласие на обработку персональных данных | ПитерМебель",
    "Отдельное согласие для заявки на расчёт мебели, консультацию и согласование замера в ПитерМебель.",
    "/consent"
  ),
};

export default function ConsentPage() {
  return <div className="privacy-page" style={{ minHeight: "100vh" }}>
    <PageHeader title="Согласие на обработку персональных данных" backTo="/privacy/" backLabel="К политике конфиденциальности" />
    <section className="article-content-section"><div className="container article-narrow">
      <p className="article-paragraph">Отдельный документ для заявок на сайте {SITE_URL}. Редакция от {LEGAL_DATE}, версия {LEGAL_VERSION}.</p>
      {!canReceiveLeads && <p className="article-paragraph">Документ подготовлен для будущего подключения заявок через Yandex Cloud.
        Сейчас формы не передают заявки и согласие через них не собирается.</p>}
      <section className="article-content-block"><h2 className="article-section-h2">Кому предоставляется согласие</h2><LegalOperator /></section>
      <section className="article-content-block"><h2 className="article-section-h2">Цель и состав данных</h2>
        <p className="article-paragraph">Я свободно, своей волей и в своём интересе разрешаю оператору обработку моих данных для ответа
          на мою заявку, уточнения пожеланий, предварительного расчёта мебели и согласования консультации или замера.</p>
        <p className="article-paragraph">Согласие относится к указанному мной телефону, категории заказа, добровольно сообщённым пожеланиям,
          ссылке на эскиз или план и персональным сведениям в этих материалах, параметрам калькулятора, названию формы,
          адресу страницы без строки запроса и фрагмента, а также записи о принятии согласия (дата, время, версия и идентификатор заявки).
          Если я добровольно указываю в обращении имя, email или адрес для замера, они обрабатываются в той же цели.</p>
      </section>
      <section className="article-content-block"><h2 className="article-section-h2">Действия и получатели</h2>
        <p className="article-paragraph">Разрешаю сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование,
          предоставление доступа указанным ниже обработчикам в пределах их функций, блокирование, удаление и уничтожение данных
          с применением средств автоматизации и без них.</p>
        <p className="article-paragraph">При отправке заявки через подключённую форму используются облачная инфраструктура Yandex Cloud и почтовые уведомления оператору
          в Яндекс Почте. Указанные ниже обработчики получают данные заявки и сведения о согласии в пределах своих функций.</p>
        {PROCESSING_SETUP.processors.length ? PROCESSING_SETUP.processors.map((p) => <p className="article-paragraph" key={p.name}>
          Обработчик по поручению: {p.name}; адрес: {p.address}; функция: {p.purpose}; базы данных: {p.databaseLocation}.
        </p>) : <p className="article-paragraph">Обработчики заявок ещё не подключены. До публикации их сведений и завершения настройки обработки согласие через форму не собирается.</p>}
        <p className="article-paragraph">Согласие не разрешает рекламные рассылки, аналитику посещений, публикацию моих данных,
          их распространение неопределённому кругу лиц или трансграничную передачу.</p>
      </section>
      <section className="article-content-block"><h2 className="article-section-h2">Срок и отзыв</h2>
        <p className="article-paragraph">Согласие действует с отправки формы до завершения обращения, моего отзыва
          или истечения {PROCESSING_SETUP.leadRetentionDays} календарных дней с отправки — в зависимости от того, что наступит раньше.
          Отозвать его можно письмом на <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> с темой «Отзыв согласия»
          и указанием телефона, использованного в заявке. После отзыва данные уничтожаются в срок до 30 дней,
          если нет самостоятельного законного основания обработки. Обязательное хранение документов по заключённому договору может продолжаться на таком основании.</p>
      </section>
      <section className="article-content-block"><h2 className="article-section-h2">Как выражается согласие</h2>
        <p className="article-paragraph">Я даю согласие, самостоятельно устанавливая отдельную, заранее не отмеченную отметку
          «Даю согласие на обработку персональных данных для ответа на заявку» и отправляя форму.
          Открытие этой страницы или продолжение просмотра сайта согласием не является.
          Отказ означает, что заявка через форму не передаётся; просмотр сайта остаётся доступным.</p>
        <p className="article-paragraph">Правила обработки и порядок реализации прав изложены в <Link href="/privacy/">политике конфиденциальности</Link>.</p>
      </section>
    </div></section>
  </div>;
}
