import { useCVStore } from "../store/useCVStore";
import VisaTypeSelector from "../components/wizard/VisaTypeSelector";
import CVFormWizard from "../components/wizard/CVFormWizard";
import TemplateSelector from "../components/template/TemplateSelector";
import TemplatePreview from "../components/template/TemplatePreview";

export default function Generator() {
  const step = useCVStore((s) => s.step);
  const resetAll = useCVStore((s) => s.actions.resetAll);

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Gerador de Currículo</h1>
        <p className="app-subtitle">H2-A / H2-B</p>

        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (
                window.confirm(
                  "Isso irá apagar todos os dados preenchidos. Deseja recomeçar do zero?"
                )
              ) {
                resetAll();
              }
            }}
          >
            Recomeçar do zero
          </button>
        </div>
      </header>

      <section className="app-card">
        {step === 1 && <VisaTypeSelector />}
        {step === 2 && <CVFormWizard />}
        {step === 3 && <TemplateSelector />}
        {step === 4 && <TemplatePreview />}
      </section>
    </main>
  );
}
