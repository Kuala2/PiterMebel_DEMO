import Image from "next/image";
import Link from "next/link";
import { Kitchen } from "@/data/kitchens";

interface KitchenCardProps {
  kitchen: Kitchen;
  priority?: boolean;
}

export default function KitchenCard({
  kitchen,
  priority = false,
}: KitchenCardProps) {
  return (
    <article className="catalog-card">
      <Link href={`/kitchens/${kitchen.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="card-gallery-wrap">
          <Image
            src={kitchen.cover}
            alt={`Кухня ${kitchen.title}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 460px"
            className="card-img-slide is-active"
            style={{ objectFit: "cover", objectPosition: "center 50%" }}
          />
          <div className="card-badge-top">Модель из каталога</div>
        </div>

        <div className="card-body">
          <div>
            <h3 className="card-title" style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
              Кухня «{kitchen.title}»
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
              {kitchen.feature}
            </p>
          </div>

          <div className="card-specs-list">
            <div className="card-spec-item">
              <span className="card-spec-label">Фасад</span>
              <span className="card-spec-value">{kitchen.facade}</span>
            </div>
            <div className="card-spec-item">
              <span className="card-spec-label">Столешница</span>
              <span className="card-spec-value">{kitchen.worktop}</span>
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <span className="btn btn-glass btn-sm" style={{ width: "100%" }}>
              Подробнее о модели
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
