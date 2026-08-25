import Image from "next/image";
import { StepItem } from "@/data/steps";

interface StepListProps {
  steps: StepItem[];
  detailed?: boolean;
}

export default function StepList({ steps, detailed = false }: StepListProps) {
  if (detailed) {
    return (
      <div className="standards-grid">
        {steps.map((step) => (
          <div key={step.number} className="standard-card">
            {step.image && (
              <div className="standard-photo">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: "cover", objectPosition: "center 50%" }}
                />
              </div>
            )}
            <div className="standard-body">
              <div className="standard-stage">Этап {step.number}</div>
              <h3 className="standard-title">{step.title}</h3>
              <p className="standard-desc">{step.fullDesc || step.shortDesc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="steps-grid">
      {steps.map((step) => (
        <div key={step.number} className="step-card">
          <div className="step-number">{step.number}</div>
          <h3 className="step-title">{step.title}</h3>
          <p className="step-desc">{step.shortDesc}</p>
        </div>
      ))}
    </div>
  );
}
