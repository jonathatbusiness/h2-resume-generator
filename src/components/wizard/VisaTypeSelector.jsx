import { useCVStore } from "../../store/useCVStore";

export default function VisaTypeSelector() {
  const visaType = useCVStore((s) => s.visaType);
  const actions = useCVStore((s) => s.actions);

  const canContinue = visaType === "H2A" || visaType === "H2B";

  function handleSelect(type) {
    actions.setVisaType(type);
  }

  function handleContinue() {
    if (!canContinue) return;
    actions.nextStep();
  }

  return (
    <div>
      <h2 className="section-title">1) Tipo de visto</h2>
      <p className="muted">
        Selecione o tipo de visto para aplicar o padrão correto do currículo.
      </p>

      <div className="grid-2">
        <button
          type="button"
          className={`choice-card ${visaType === "H2A" ? "is-active" : ""}`}
          onClick={() => handleSelect("H2A")}
        >
          <div className="choice-title">H2-A</div>
          <div className="choice-desc">
            Trabalho agrícola. Descrições no formato de bullet points.
          </div>
        </button>

        <button
          type="button"
          className={`choice-card ${visaType === "H2B" ? "is-active" : ""}`}
          onClick={() => handleSelect("H2B")}
        >
          <div className="choice-title">H2-B</div>
          <div className="choice-desc">
            Trabalho não-agrícola. Descrições em parágrafos curtos.
          </div>
        </button>
      </div>

      <div className="actions-row">
        <button
          type="button"
          className="primary"
          onClick={handleContinue}
          disabled={!canContinue}
          title={!canContinue ? "Selecione H2-A ou H2-B para continuar." : ""}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
