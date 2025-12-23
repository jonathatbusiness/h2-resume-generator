import { useMemo, useRef, useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import { getTemplateById } from "./templateRegistry";
import { exportElementToPdf } from "../../utils/pdfExport";

export default function TemplatePreview() {
  const visaType = useCVStore((s) => s.visaType);
  const data = useCVStore((s) => s.data);
  const actions = useCVStore((s) => s.actions);

  const templateRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const isCompleteEnough = useMemo(() => {
    return (
      data.personalInfo.fullName.trim().length > 0 &&
      data.personalInfo.email.trim().length > 0 &&
      data.personalInfo.photoDataUrl.trim().length > 0 &&
      data.experiences.length > 0
    );
  }, [data]);

  const TemplateComponent = getTemplateById(data.templateId).component;

  return (
    <div>
      <div className="preview-top">
        <div>
          <h2 className="section-title">4) Preview</h2>
          <p className="muted">
            Confira o layout antes de gerar o PDF. Visto:{" "}
            <strong>{visaType}</strong>
          </p>
        </div>

        <div className="preview-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => actions.prevStep()}
          >
            Voltar
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => actions.goToStep(2)}
          >
            Editar dados
          </button>

          <button
            type="button"
            className="primary"
            disabled={!isCompleteEnough || isExporting}
            title={
              !isCompleteEnough
                ? "Preencha nome, email, foto e ao menos 1 experiência."
                : ""
            }
            onClick={async () => {
              try {
                setIsExporting(true);

                const fullName = (data.personalInfo.fullName || "cv")
                  .trim()
                  .replace(/\s+/g, "_")
                  .replace(/[^\w\-]/g, "");

                await exportElementToPdf({
                  element: templateRef.current,
                  filename: `${fullName}_${
                    visaType === "H2A" ? "H2A" : "H2B"
                  }.pdf`,
                });
              } finally {
                setIsExporting(false);
              }
            }}
          >
            {isExporting ? "Gerando..." : "Gerar PDF"}
          </button>
        </div>
      </div>

      <div className="preview-shell">
        <div className="a4-preview">
          <TemplateComponent
            ref={templateRef}
            visaType={visaType}
            data={data}
            accent={data.accent}
          />
        </div>
      </div>
    </div>
  );
}
