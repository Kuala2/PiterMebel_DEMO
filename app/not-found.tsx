import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container not-found-content">
        <p className="eyebrow">Ошибка 404</p>
        <h1>Такой страницы нет</h1>
        <p>Возможно, адрес изменился или в ссылке есть опечатка.</p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-green">На главную</Link>
          <Link href="/kitchens/" className="btn btn-glass">Смотреть кухни</Link>
        </div>
      </div>
    </section>
  );
}

