import Image from "next/image";
import { MATERIALS } from "@/data/materials";

export default function MaterialList() {
  return (
    <div className="materials-grid">
      {MATERIALS.map((material) => (
        <div key={material.id} className="mat-card">
          <div className="mat-photo-wrap">
            <Image
              src={material.image}
              alt={material.title}
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              style={{ objectFit: "cover" }}
            />
            <span className="mat-tag-pill">
              {material.tag}
            </span>
          </div>
          <div className="mat-body">
            <div className="mat-subtitle">{material.subtitle}</div>
            <h3 className="mat-title">{material.title}</h3>
            <p className="mat-desc">{material.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
