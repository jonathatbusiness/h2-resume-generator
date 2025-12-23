import { forwardRef } from "react";
import styles from "./flagTemplate.module.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  getSkillCatalogByVisaType,
  mapById,
  LANGUAGE_LEVELS,
} from "../../utils/cvDictionaries";

function safeText(v) {
  return String(v || "").trim();
}

function parseBullets(text) {
  const raw = safeText(text);
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);
}

const FlagTemplate = forwardRef(({ visaType, data, accent = "blue" }, ref) => {
  const pi = data.personalInfo;
  const skillCatalog = getSkillCatalogByVisaType(visaType);
  const skillMap = mapById(skillCatalog);

  const levelLabelByValue = {};
  for (const l of LANGUAGE_LEVELS) levelLabelByValue[l.value] = l.value; // CV usa value (EN)

  const accentClass =
    accent === "red"
      ? styles.accentRed
      : accent === "green"
      ? styles.accentGreen
      : styles.accentBlue;

  const bullets = (exp) => parseBullets(exp.descriptionText);

  return (
    <article
      ref={ref}
      className={`${styles.page} ${accentClass} ${
        accent === "red" ? styles.swapStripes : ""
      }`}
      aria-label="CV Preview"
    >
      <div className={styles.flagLeft} />
      <div className={styles.stars} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.name}>
            {safeText(pi.fullName) || "FULL NAME"}
          </div>

          <div className={styles.contact}>
            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.icon} />{" "}
              {safeText(pi.phone) || "Phone"}
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.icon} />{" "}
              {safeText(pi.email) || "Email"}
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.icon} />{" "}
              {safeText(pi.location) || "Location"}
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
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
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>LANGUAGE</h3>
            {data.languages.length ? (
              <ul className={styles.list}>
                {data.languages.map((l) => (
                  <li key={l.id}>
                    {l.name} - {l.level}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Add languages.</p>
            )}
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>EDUCATION</h3>
            <p className={styles.mutedSoft}>
              {safeText(data.educationText) || "Add education details."}
            </p>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>SKILLS</h3>
            {data.skills.length ? (
              <ul className={styles.list}>
                {data.skills.map((id) => (
                  <li key={id}>{skillMap[id]?.value || id}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Select up to 16 skills.</p>
            )}
          </section>
        </aside>

        <main className={styles.main}>
          <section className={styles.mainCard}>
            <h3 className={styles.mainTitle}>PROFILE</h3>
            <p className={styles.text}>
              {safeText(data.profileText) || "Add your profile text."}
            </p>
          </section>

          <section className={styles.mainCard}>
            <h3 className={styles.mainTitle}>WORK EXPERIENCE</h3>

            {data.experiences.length ? (
              <div className={styles.expList}>
                {data.experiences.map((e) => (
                  <div key={e.id} className={styles.expItem}>
                    <div className={styles.expHead}>
                      <div className={styles.expRole}>
                        {safeText(e.title) || "Job Title"}{" "}
                        {safeText(e.company) ? `— ${safeText(e.company)}` : ""}
                      </div>
                      <div className={styles.expDates}>
                        {safeText(e.startDate)}
                        {e.startDate && (e.isCurrent || e.endDate) ? " — " : ""}
                        {e.isCurrent ? "Present" : safeText(e.endDate)}
                      </div>
                    </div>

                    {visaType === "H2A" ? (
                      <ul className={styles.expBullets}>
                        {(bullets(e).length
                          ? bullets(e)
                          : ["Paste bullet points here (• ...)."]
                        ).map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.text}>
                        {safeText(e.descriptionText) ||
                          "Add your job description."}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.muted}>Add at least one experience.</p>
            )}
          </section>
        </main>
      </div>
    </article>
  );
});

FlagTemplate.displayName = "FlagTemplate";

export default FlagTemplate;
