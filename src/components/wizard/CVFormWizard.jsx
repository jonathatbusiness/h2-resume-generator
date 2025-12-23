import { useMemo, useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import {
  buildExperiencePrompt,
  buildProfilePrompt,
} from "../../utils/promptBuilder";
import { FaImage } from "react-icons/fa";

import {
  LANGUAGE_OPTIONS,
  LANGUAGE_LEVELS,
  getSkillCatalogByVisaType,
  mapById,
} from "../../utils/cvDictionaries";

async function copyToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  return ok;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

export default function CVFormWizard() {
  const visaType = useCVStore((s) => s.visaType);
  const data = useCVStore((s) => s.data);
  const actions = useCVStore((s) => s.actions);

  const [toast, setToast] = useState("");
  const [profileCopyLabel, setProfileCopyLabel] = useState("Copiar instrução");
  const [expCopyLabelById, setExpCopyLabelById] = useState({});

  const canAddMoreExp = data.experiences.length < 4;

  const skillCatalog = getSkillCatalogByVisaType(visaType);
  const skillMap = useMemo(() => mapById(skillCatalog), [skillCatalog]);

  const selectedSkillsText = useMemo(() => {
    if (data.skills.length === 0) return "None selected";
    return data.skills
      .map((id) => (skillMap[id] ? skillMap[id].label : id))
      .join(", ");
  }, [data.skills]);

  const skillsLimitReached = data.skills.length >= 16;

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1600);
  }

  function handleBack() {
    actions.prevStep();
  }

  function handlePersonalChange(e) {
    const { name, value } = e.target;
    actions.updatePersonalInfo({ [name]: value });
  }

  async function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    actions.setPhotoDataUrl(dataUrl);
    showToast("Foto carregada.");
  }

  async function handleCopyProfilePrompt() {
    const prompt = buildProfilePrompt({
      visaType,
      skills: data.skills,
      profileText: data.profileText,
    });

    const ok = await copyToClipboard(prompt);

    if (ok) {
      setProfileCopyLabel("Instruções copiadas");
      window.setTimeout(() => setProfileCopyLabel("Copiar instrução"), 2200);
      showToast("Instruções copiadas.");
    } else {
      showToast("Não foi possível copiar.");
    }
  }

  async function handleCopyExperiencePrompt(exp) {
    const prompt = buildExperiencePrompt({
      visaType,
      jobTitle: exp.title,
      skills: data.skills,
      descriptionText: exp.descriptionText,
    });

    const ok = await copyToClipboard(prompt);

    if (ok) {
      setExpCopyLabelById((prev) => ({
        ...prev,
        [exp.id]: "Instruções copiadas",
      }));

      window.setTimeout(() => {
        setExpCopyLabelById((prev) => ({
          ...prev,
          [exp.id]: "Copiar instrução",
        }));
      }, 2200);

      showToast("Instruções copiadas.");
    } else {
      showToast("Não foi possível copiar.");
    }
  }

  return (
    <div>
      <div className="wizard-top">
        <div>
          <h2 className="section-title">2) Dados do currículo</h2>
          <p className="muted">
            Tipo de visto selecionado: <strong>{visaType}</strong>
          </p>

          <p className="muted">
            Preencha em inglês. Se preferir, você pode escrever em português e
            usar o botão abaixo para copiar instruções e melhorar o texto usando
            uma IA externa.
          </p>
        </div>

        {toast ? <div className="toast">{toast}</div> : null}
      </div>

      {/* Personal info + photo */}
      <h3 className="section-subtitle">Contato</h3>

      <div className="contact-grid">
        <div className="photo-uploader">
          <label className="photo-card" title="Clique para adicionar uma foto">
            {data.personalInfo.photoDataUrl ? (
              <img
                src={data.personalInfo.photoDataUrl}
                alt="Profile"
                className="photo-img"
              />
            ) : (
              <div className="photo-placeholder">
                <div className="photo-icon">
                  <FaImage />
                </div>
                <div className="photo-text">Clique para adicionar uma foto</div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-input"
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            <span className="label">Nome completo</span>
            <input
              name="fullName"
              value={data.personalInfo.fullName}
              onChange={handlePersonalChange}
              placeholder="Ex: John Smith"
            />
          </label>

          <label className="field">
            <span className="label">Telefone</span>
            <input
              name="phone"
              value={data.personalInfo.phone}
              onChange={handlePersonalChange}
              placeholder="Ex: +55 (11) 1234-5678"
            />
          </label>

          <label className="field">
            <span className="label">E-mail</span>
            <input
              name="email"
              value={data.personalInfo.email}
              onChange={handlePersonalChange}
              placeholder="Ex: nome@email.com"
            />
          </label>

          <label className="field">
            <span className="label">Localização</span>
            <input
              name="location"
              value={data.personalInfo.location}
              onChange={handlePersonalChange}
              placeholder="Ex: Estado, País"
            />
          </label>
        </div>
      </div>

      {/* Languages */}
      <div className="divider" />

      <h3 className="section-subtitle">Idiomas</h3>
      <p className="muted">Adicione idiomas e selecione o nível.</p>

      <div className="row">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang.id}
            type="button"
            className="chip"
            onClick={() => actions.addLanguage(lang.value)}
          >
            + {lang.label}
          </button>
        ))}
      </div>

      {/* Education */}

      {data.languages.length === 0 ? (
        <p className="muted">Nenhum idioma inserido ainda.</p>
      ) : (
        <div className="list">
          {data.languages.map((l) => (
            <div key={l.id} className="list-row">
              <div className="list-main">
                <div className="list-title">{l.name}</div>

                <select
                  value={l.level}
                  onChange={(e) =>
                    actions.updateLanguage(l.id, { level: e.target.value })
                  }
                >
                  {LANGUAGE_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="danger"
                onClick={() => actions.removeLanguage(l.id)}
                title="Remove language"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      <h3 className="section-subtitle">Formação</h3>
      <p className="muted">
        Texto livre. Idealmente em inglês. Se preferir, escreva em português e
        use uma IA externa com seu próprio prompt.
      </p>

      <label className="field">
        <span className="label">Formação</span>
        <textarea
          value={data.educationText}
          onChange={(e) => actions.updateEducationText(e.target.value)}
          placeholder="Exemplo: High School - Completed. SENAC - Cattle handling course (40 hours)..."
          rows={4}
        />
      </label>

      {/* Skills */}
      <div className="divider" />

      <h3 className="section-subtitle">Habilidades</h3>
      <p className="muted">
        Selecione até <strong>16</strong> habilidades (
        {visaType === "H2A" ? "lista H2-A" : "lista H2-B"}).
      </p>

      <div className="skills-grid">
        {skillCatalog.map((skill) => {
          const checked = data.skills.includes(skill.id);
          const disabled = !checked && skillsLimitReached;

          return (
            <label
              key={skill.id}
              className={`skill-item ${disabled ? "is-disabled" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => actions.toggleSkill(skill.id)}
              />
              <span>{skill.label}</span>
            </label>
          );
        })}
      </div>

      <p className="muted">
        Selecionadas ({data.skills.length}/16):{" "}
        <strong>{selectedSkillsText}</strong>
      </p>

      {skillsLimitReached ? (
        <p className="limit-hint">Limite máximo de 16 habilidades atingido.</p>
      ) : null}

      {/* Profile */}
      <div className="divider" />

      <h3 className="section-subtitle">Perfil</h3>
      <p className="muted">
        Escreva o perfil em inglês. Se você escreveu em português, use o botão
        abaixo para copiar instruções e gerar uma versão melhor em inglês usando
        uma IA externa.
      </p>

      <label className="field">
        <span className="label">Texto de perfil</span>
        <textarea
          value={data.profileText}
          onChange={(e) => actions.updateProfileText(e.target.value)}
          placeholder="Exemplo: Dedicated and reliable professional with experience in cleaning, customer support, and daily operations..."
          rows={5}
        />
        <span className="hint">Recommended: 500–800 characters.</span>
      </label>

      <div className="below-block-actions">
        <button
          type="button"
          className="secondary"
          onClick={handleCopyProfilePrompt}
        >
          {profileCopyLabel}
        </button>
      </div>

      {/* Experiences */}
      <div className="divider" />

      <div className="section-header-row">
        <div>
          <h3 className="section-subtitle">Experiência profissional (até 4)</h3>
          <p className="muted">
            Para H2-A, o resultado final deve ser em bullet points. Para H2-B, o
            resultado final deve ser em parágrafos curtos.
          </p>
        </div>

        <button
          type="button"
          className="primary"
          onClick={actions.addExperience}
          disabled={!canAddMoreExp}
          title={!canAddMoreExp ? "Máximo 4 experiências." : ""}
        >
          + Adicionar
        </button>
      </div>

      {data.experiences.length === 0 ? (
        <p className="muted">Adicione pelo menos 1 experiência.</p>
      ) : (
        <div className="exp-list">
          {data.experiences.map((exp, idx) => (
            <div key={exp.id} className="exp-card">
              <div className="exp-top">
                <div className="exp-title">Experiência {idx + 1}</div>

                <div className="exp-actions">
                  <button
                    type="button"
                    className="danger"
                    onClick={() => actions.removeExperience(exp.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span className="label">Cargo</span>
                  <input
                    value={exp.title}
                    onChange={(e) =>
                      actions.updateExperience(exp.id, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Exemplo: Housekeeper / Farm Laborer"
                  />
                </label>

                <label className="field">
                  <span className="label">Empresa</span>
                  <input
                    value={exp.company}
                    onChange={(e) =>
                      actions.updateExperience(exp.id, {
                        company: e.target.value,
                      })
                    }
                    placeholder="Exemplo: Hotel / Farm / Company"
                  />
                </label>

                <label className="field">
                  <span className="label">Início (MM/AAAA)</span>
                  <input
                    value={exp.startDate}
                    onChange={(e) =>
                      actions.updateExperience(exp.id, {
                        startDate: e.target.value,
                      })
                    }
                    placeholder="Exemplo: 01/2023"
                  />
                </label>

                <label className="field">
                  <span className="label">Fim (MM/AAAA)</span>
                  <input
                    value={exp.endDate}
                    onChange={(e) =>
                      actions.updateExperience(exp.id, {
                        endDate: e.target.value,
                      })
                    }
                    placeholder="Exemplo: 10/2024"
                    disabled={exp.isCurrent}
                  />
                </label>
              </div>

              <label className="skill-item" style={{ marginTop: 10 }}>
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={(e) =>
                    actions.updateExperience(exp.id, {
                      isCurrent: e.target.checked,
                    })
                  }
                />
                <span>Trabalho atual</span>
              </label>

              <label className="field" style={{ marginTop: 10 }}>
                <span className="label">Descrição</span>
                <textarea
                  value={exp.descriptionText}
                  onChange={(e) =>
                    actions.updateExperience(exp.id, {
                      descriptionText: e.target.value,
                    })
                  }
                  placeholder={
                    visaType === "H2A"
                      ? "Cole os bullet points aqui (• ...). Ou escreva um texto simples e use o botão abaixo para gerar os bullets."
                      : "Escreva parágrafos curtos aqui. Ou escreva um texto simples e use o botão abaixo para melhorar o conteúdo."
                  }
                  rows={4}
                />
                <span className="hint">Recomendado: 300–600 caracteres.</span>
              </label>

              <div className="below-block-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => handleCopyExperiencePrompt(exp)}
                >
                  {expCopyLabelById[exp.id] || "Copiar instrução"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
          disabled={data.experiences.length === 0}
          title={
            data.experiences.length === 0 ? "Pelo menos 1 experiência." : ""
          }
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
