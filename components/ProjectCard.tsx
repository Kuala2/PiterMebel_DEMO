import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({
  project,
  priority = false,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="card-gallery-wrap">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            className="card-img-slide is-active"
            style={{ objectFit: "cover", objectPosition: "center 50%" }}
          />
          <div className="card-badge-top">{project.type}</div>
        </div>

        <div className="card-body">
          <div>
            <h3 className="card-title" style={{ fontSize: "19px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "6px" }}>
              {project.title}
            </h3>
            <p style={{ fontSize: "14.5px", color: "var(--color-text-secondary)", lineHeight: "1.55" }}>
              {project.task}
            </p>
          </div>

          <div className="card-specs-list">
            <div className="card-spec-item">
              <span className="card-spec-label">Материалы</span>
              <span className="card-spec-value">{project.materials.slice(0, 2).join(", ")}</span>
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <span className="btn btn-glass btn-sm" style={{ width: "100%" }}>
              Смотреть проект
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
