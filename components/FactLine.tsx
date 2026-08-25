import { SITE_CONFIG } from "@/data/site";

export default function FactLine() {
  return (
    <section className="transition">
      <div className="wrap">
        <strong>Один проект — один результат</strong>
        <p>
          Собственный цех с {SITE_CONFIG.foundedYear} года · {SITE_CONFIG.address} ({SITE_CONFIG.metro}) · {SITE_CONFIG.clientCount}
        </p>
        <span className="demo">Бесплатный выезд на замер</span>
      </div>
    </section>
  );
}
