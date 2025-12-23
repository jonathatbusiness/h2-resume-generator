import { useEffect, useMemo, useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import {
  TEMPLATE_REGISTRY,
  getTemplateById,
  getTemplatePreviewSrc,
} from "./templateRegistry";

export default function TemplateSelector() {
  const templateId = useCVStore((s) => s.data.templateId);
  const accent = useCVStore((s) => s.data.accent);
  const actions = useCVStore((s) => s.actions);
  const [zoomSrc, setZoomSrc] = useState("");
  const [zoomTitle, setZoomTitle] = useState("");

  function openZoom(e, src, title) {
    e.preventDefault();
    e.stopPropagation();
    setZoomSrc(src);
    setZoomTitle(title);
  }

  function closeZoom() {
    setZoomSrc("");
    setZoomTitle("");
  }

  const accentOptions = useMemo(() => {
    return getTemplateById(templateId).accents || ["blue", "red"];
  }, [templateId]);

  useEffect(() => {
    function onKeyDown(ev) {
      if (ev.key === "Escape") closeZoom();
    }
    if (zoomSrc) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomSrc]);

  function selectTemplate(id) {
    actions.setTemplateId(id);

    const tpl = getTemplateById(id);
    const allowed = tpl.accents || ["blue", "red"];

    if (!allowed.includes(accent)) actions.setAccent(allowed[0] || "blue");
  }

  return (
    <div>
      <h2 className="section-title">3) Template</h2>
      <p className="muted">Escolha o modelo e a cor de destaque.</p>

      <div className="grid-2">
        {TEMPLATE_REGISTRY.map((t) => {
          const shownAccent =
            templateId === t.id ? accent : t.accents?.[0] || "blue";
          const src = getTemplatePreviewSrc(t.id, shownAccent);

          return (
            <button
              key={t.id}
              type="button"
              className={`choice-card ${
                templateId === t.id ? "is-active" : ""
              }`}
              onClick={() => selectTemplate(t.id)}
            >
              <img
                className="template-thumb"
                src={src}
                alt={`${t.title} preview`}
                onClick={(e) => openZoom(e, src, t.thumbTitle || t.title)}
              />

              <div className="choice-title">{t.title}</div>
              <div className="choice-desc">{t.description}</div>
            </button>
          );
        })}
      </div>

      <div className="divider" />

      <div className="section-subtitle">
        Escolha a cor de destaque do modelo
      </div>
      <div className="accent-row">
        {accentOptions.map((c) => (
          <button
            key={c}
            type="button"
            className={`accent-dot accent-${c} ${
              accent === c ? "is-active" : ""
            }`}
            onClick={() => actions.setAccent(c)}
            title={c}
          />
        ))}
      </div>

      <p className="muted">
        As cores de destaque alteram levemente o design original.
      </p>

      <div className="actions-row">
        <button
          type="button"
          className="secondary"
          onClick={() => actions.prevStep()}
        >
          Voltar
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => actions.nextStep()}
        >
          Continuar
        </button>
      </div>
      {zoomSrc ? (
        <div className="thumb-modal-overlay" onClick={closeZoom}>
          <div className="thumb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="thumb-modal-bar">
              <div className="thumb-modal-title">{zoomTitle}</div>
              <button
                type="button"
                className="thumb-modal-close"
                onClick={closeZoom}
              >
                Fechar
              </button>
            </div>

            <div className="thumb-modal-body">
              <img className="thumb-modal-img" src={zoomSrc} alt={zoomTitle} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
