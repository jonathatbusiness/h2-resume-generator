import { useEffect, useMemo, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useCVStore } from "../../store/useCVStore";
import ProfessionalTemplate from "./ProfessionalTemplate";
import FlagTemplate from "./FlagTemplate";
import BrazilUsaTemplate from "./BrazilUsaTemplate";
import { exportElementToPdf } from "../../utils/pdfExport";

export default function TemplatePreview() {
  const visaType = useCVStore((s) => s.visaType);
  const data = useCVStore((s) => s.data);
  const actions = useCVStore((s) => s.actions);

  const exportRef = useRef(null);
  const viewerRef = useRef(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fitScale, setFitScale] = useState(1);

  const isCompleteEnough = useMemo(() => {
    return (
      data.personalInfo.fullName.trim().length > 0 &&
      data.personalInfo.email.trim().length > 0 &&
      data.personalInfo.photoDataUrl.trim().length > 0 &&
      data.experiences.length > 0
    );
  }, [data]);

  const TemplateComponent =
    data.templateId === "template2"
      ? FlagTemplate
      : data.templateId === "template3"
      ? BrazilUsaTemplate
      : ProfessionalTemplate;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const apply = () => setIsMobile(mq.matches);

    apply();

    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const A4_W = 794;
    const A4_H = 1123;

    const computeFit = () => {
      const el = viewerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pad = 12;
      const availW = Math.max(0, rect.width - pad * 2);
      const availH = Math.max(0, rect.height - pad * 2);

      if (availW <= 0 || availH <= 0) return;

      const s = Math.min(availW / A4_W, availH / A4_H);
      const clamped = Math.max(0.18, Math.min(s, 1));
      setFitScale(clamped);
    };

    computeFit();
    window.addEventListener("resize", computeFit);

    return () => {
      window.removeEventListener("resize", computeFit);
    };
  }, [isMobile, data.templateId]);

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
                  element: exportRef.current,
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
        <div className="export-sandbox" aria-hidden="true">
          <TemplateComponent
            ref={exportRef}
            visaType={visaType}
            data={data}
            accent={data.accent}
          />
        </div>

        {isMobile ? (
          <div className="cv-viewer" ref={viewerRef}>
            <div className="cv-viewer-header">
              <div className="cv-viewer-hint">
                Visualização interativa. Arraste para navegar e amplie para ver
                os detalhes.
              </div>
            </div>

            <TransformWrapper
              key={`mobile-viewer-${data.templateId}-${fitScale}`}
              initialScale={fitScale}
              minScale={fitScale}
              maxScale={2.6}
              centerOnInit
              limitToBounds
              doubleClick={{ disabled: false, step: 0.35 }}
              pinch={{ step: 6 }}
              panning={{ velocityDisabled: true }}
              wheel={{ disabled: true }}
            >
              {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                <>
                  <div className="cv-viewer-toolbar">
                    <button
                      type="button"
                      className="cv-viewer-btn"
                      onClick={() => zoomOut()}
                      aria-label="Diminuir zoom"
                    >
                      –
                    </button>

                    <button
                      type="button"
                      className="cv-viewer-btn"
                      onClick={() => zoomIn()}
                      aria-label="Aumentar zoom"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="cv-viewer-btn cv-viewer-btn-wide"
                      onClick={() => {
                        resetTransform();
                        setTimeout(() => centerView(fitScale), 0);
                      }}
                    >
                      Ajustar à tela
                    </button>
                  </div>

                  <div className="cv-viewer-stage">
                    <TransformComponent
                      wrapperStyle={{ width: "100%", height: "100%" }}
                      contentStyle={{ width: "794px", height: "1123px" }}
                    >
                      <TemplateComponent
                        visaType={visaType}
                        data={data}
                        accent={data.accent}
                      />
                    </TransformComponent>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
        ) : (
          <div className="a4-preview">
            <TemplateComponent
              visaType={visaType}
              data={data}
              accent={data.accent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
