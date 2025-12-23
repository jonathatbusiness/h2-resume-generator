import { forwardRef } from "react";
import styles from "./brazilUsaTemplate.module.css";
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
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);
}

const BrazilUsaTemplate = forwardRef(
  ({ visaType, data, accent = "blue" }, ref) => {
    const pi = data.personalInfo;

    const skillCatalog = getSkillCatalogByVisaType(visaType);
    const skillMap = mapById(skillCatalog);

    const headerBgSrc = "/assets/header/template3-header.png";

    const accentClass = accent === "red" ? styles.accentRed : styles.accentBlue;

    return (
      <article
        ref={ref}
        className={`${styles.page} ${accentClass}`}
        aria-label="CV Preview"
      >
        {/* HEADER FULL WIDTH */}
        <header
          className={styles.header}
          style={{ backgroundImage: `url(${headerBgSrc})` }}
        >
          <div className={styles.headerOverlay} />

          <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
              <div className={styles.headerPhotoWrap}>
                {pi.photoDataUrl ? (
                  <div
                    className={styles.headerPhoto}
                    style={{ backgroundImage: `url(${pi.photoDataUrl})` }}
                  />
                ) : (
                  <div className={styles.headerPhotoPlaceholder}>Photo</div>
                )}
              </div>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.name}>
                {safeText(pi.fullName) || "FULL NAME"}
              </div>
            </div>
          </div>
        </header>

        {/* BODY GRID */}
        <div className={styles.body}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {/* CONTACT */}
            <div className={styles.sideSection}>
              <h3 className={styles.sideTitle}>CONTACT</h3>

              <div className={styles.sideContact}>
                <div className={styles.contactItem}>
                  <FaPhoneAlt /> {safeText(pi.phone) || "Phone"}
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope /> {safeText(pi.email) || "Email"}
                </div>
                <div className={styles.contactItem}>
                  <FaMapMarkerAlt /> {safeText(pi.location) || "Location"}
                </div>
              </div>
            </div>

            {/* LANGUAGES */}
            <div className={styles.sideSection}>
              <h3 className={styles.sideTitle}>LANGUAGES</h3>
              {data.languages.length ? (
                <ul className={styles.sideList}>
                  {data.languages.map((l) => (
                    <li key={l.id}>
                      {l.name} — {l.level}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.sideMuted}>Add languages.</p>
              )}
            </div>

            {/* SKILLS */}
            <div className={styles.sideSection}>
              <h3 className={styles.sideTitle}>SKILLS</h3>
              {data.skills.length ? (
                <ul className={styles.bulletList}>
                  {data.skills.map((id) => (
                    <li key={id}>{skillMap[id]?.value || id}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.sideMuted}>Select skills.</p>
              )}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>PROFILE</h2>
              <p className={styles.paragraph}>
                {safeText(data.profileText) || "Add your profile text."}
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>WORK EXPERIENCE</h2>

              {data.experiences.map((e) => (
                <div key={e.id} className={styles.expItem}>
                  <div className={styles.expTop}>
                    <div className={styles.expRole}>
                      {safeText(e.title) || "Job Title"}
                      {safeText(e.company) ? ` — ${safeText(e.company)}` : ""}
                    </div>

                    <div className={styles.expDates}>
                      {formatDateRange(e.startDate, e.endDate, e.isCurrent)}
                    </div>
                  </div>

                  <ul className={styles.expBullets}>
                    {parseBullets(e.descriptionText).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </main>
        </div>
      </article>
    );
  }
);

BrazilUsaTemplate.displayName = "BrazilUsaTemplate";
export default BrazilUsaTemplate;
