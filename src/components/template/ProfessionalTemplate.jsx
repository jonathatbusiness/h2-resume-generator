import { forwardRef } from "react";
import styles from "./professionalTemplate.module.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { getSkillCatalogByVisaType, mapById } from "../../utils/cvDictionaries";

function safeText(v) {
  return String(v || "").trim();
}

function formatDateRange(start, end, isCurrent) {
  const s = safeText(start);
  const e = isCurrent ? "Present" : safeText(end);
  if (!s && !e) return "";
  if (s && !e) return s;
  if (!s && e) return e;
  return `${s} — ${e}`;
}

function parseBullets(text) {
  const raw = safeText(text);
  if (!raw) return [];
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1 && raw.includes("•")) {
    return raw
      .split("•")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return lines;
}

const ProfessionalTemplate = forwardRef(
  ({ visaType, data, accent = "blue" }, ref) => {
    const pi = data.personalInfo;
    const skillCatalog = getSkillCatalogByVisaType(visaType);
    const skillMap = mapById(skillCatalog);

    const accentClass = accent === "red" ? styles.accentRed : styles.accentBlue;
    const invertIcons = accent === "blue" ? styles.iconsRed : styles.iconsBlue;

    return (
      <article
        ref={ref}
        className={`${styles.page} ${accentClass}`}
        aria-label="CV Preview"
      >
        <aside className={styles.sidebar}>
          <div className={styles.photoWrap}>
            {pi.photoDataUrl ? (
              <div
                className={styles.photo}
                style={{ backgroundImage: `url(${pi.photoDataUrl})` }}
                aria-label="Profile photo"
              />
            ) : (
              <div className={styles.photoPlaceholder}>Photo</div>
            )}
          </div>

          <div className={styles.sideSection}>
            <h3 className={styles.sideTitle}>LANGUAGES</h3>
            {data.languages.length === 0 ? (
              <p className={styles.sideMuted}>Add at least one language.</p>
            ) : (
              <ul className={styles.sideList}>
                {data.languages.map((l) => (
                  <li key={l.id} className={styles.sideItem}>
                    <strong>{l.name}</strong> — {l.level}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.sideSection}>
            <h3 className={styles.sideTitle}>EDUCATION</h3>
            <p className={styles.sideMuted}>
              {safeText(data.educationText) || "Add education details."}
            </p>
          </div>

          <div className={styles.sideSection}>
            <h3 className={styles.sideTitle}>SKILLS</h3>
            {data.skills.length === 0 ? (
              <p className={styles.sideMuted}>Select up to 16 skills.</p>
            ) : (
              <ul className={styles.bulletList}>
                {data.skills.map((id) => (
                  <li key={id}>{skillMap[id]?.value || id}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className={styles.content}>
          <header className={styles.header}>
            <div className={styles.name}>
              {safeText(pi.fullName) || "FULL NAME"}
            </div>

            <div className={`${styles.contactRow} ${invertIcons}`}>
              <span className={styles.contactItem}>
                <FaPhoneAlt className={styles.icon} />{" "}
                {safeText(pi.phone) || "Phone"}
              </span>
              <span className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />{" "}
                {safeText(pi.email) || "Email"}
              </span>
              <span className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.icon} />{" "}
                {safeText(pi.location) || "Location"}
              </span>
            </div>

            <div className={styles.visaTag}>
              {visaType === "H2A" ? "H2-A" : "H2-B"}
            </div>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>PROFILE</h2>
            <p className={styles.paragraph}>
              {safeText(data.profileText) || "Add your profile text."}
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>WORK EXPERIENCE</h2>

            {data.experiences.length === 0 ? (
              <p className={styles.muted}>Add at least one experience.</p>
            ) : (
              <div className={styles.expList}>
                {data.experiences.map((e) => {
                  const bullets = parseBullets(e.descriptionText);

                  return (
                    <div key={e.id} className={styles.expItem}>
                      <div className={styles.expTop}>
                        <div className={styles.expRole}>
                          <strong>{safeText(e.title) || "Job Title"}</strong>
                          {safeText(e.company) ? (
                            <span> — {safeText(e.company)}</span>
                          ) : null}
                        </div>

                        <div className={styles.expDates}>
                          {formatDateRange(e.startDate, e.endDate, e.isCurrent)}
                        </div>
                      </div>

                      {visaType === "H2A" ? (
                        <ul className={styles.expBullets}>
                          {(bullets.length
                            ? bullets
                            : ["Paste bullet points here (• ...)."]
                          ).map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className={styles.expDesc}>
                          {safeText(e.descriptionText) ||
                            "Add your job description."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </article>
    );
  }
);

ProfessionalTemplate.displayName = "ProfessionalTemplate";

export default ProfessionalTemplate;
