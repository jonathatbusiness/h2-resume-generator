import { forwardRef } from "react";
import styles from "./blueSidebarImageHeaderTemplate.module.css";
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

const BlueSidebarImageHeaderTemplate = forwardRef(
  ({ visaType, data, accent = "blue" }, ref) => {
    const pi = data.personalInfo;

    const skillCatalog = getSkillCatalogByVisaType(visaType);
    const skillMap = mapById(skillCatalog);

    const headerBgSrc = "/assets/header/template5-header.png";

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
              {pi.photoDataUrl ? (
                <div
                  className={styles.headerPhoto}
                  style={{ backgroundImage: `url(${pi.photoDataUrl})` }}
                  aria-label="Profile photo"
                />
              ) : (
                <div className={styles.headerPhotoPlaceholder}>Photo</div>
              )}
            </div>

            <div className={styles.headerRight}>
              <div className={styles.name}>
                {safeText(pi.fullName) || "FULL NAME"}
              </div>

              <div className={styles.headerContactRow}>
                <div className={styles.headerContactItem}>
                  <FaPhoneAlt className={styles.headerIcon} />
                  <span>{safeText(pi.phone) || "Phone"}</span>
                </div>

                <div className={styles.headerContactItem}>
                  <FaEnvelope className={styles.headerIcon} />
                  <span>{safeText(pi.email) || "Email"}</span>
                </div>

                <div className={styles.headerContactItem}>
                  <FaMapMarkerAlt className={styles.headerIcon} />
                  <span>{safeText(pi.location) || "Location"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className={styles.body}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <section className={styles.sideSection}>
              <h3 className={styles.sideTitle}>PROFILE</h3>
              <p className={styles.sideParagraph}>
                {safeText(data.profileText) || "Add your profile text."}
              </p>
            </section>

            <section className={styles.sideSection}>
              <h3 className={styles.sideTitle}>SKILLS</h3>
              {data.skills.length ? (
                <ul className={styles.sideBullets}>
                  {data.skills.map((id) => (
                    <li key={id}>{skillMap[id]?.value || id}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.sideMuted}>Select up to 16 skills.</p>
              )}
            </section>

            <section className={styles.sideSection}>
              <h3 className={styles.sideTitle}>LANGUAGE</h3>
              {data.languages.length ? (
                <ul className={styles.sideList}>
                  {data.languages.map((l) => (
                    <li key={l.id} className={styles.sideItem}>
                      {l.name} — {l.level}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.sideMuted}>Add languages.</p>
              )}
            </section>
          </aside>

          {/* MAIN */}
          <main className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>EXPERIENCE</h2>

              {data.experiences.length === 0 ? (
                <p className={styles.muted}>Add at least one experience.</p>
              ) : (
                <div className={styles.expList}>
                  {data.experiences.map((e) => {
                    const role = safeText(e.title) || "Job Title";
                    const company = safeText(e.company);
                    const header = company ? `${role} — ${company}` : role;

                    const bullets = parseBullets(e.descriptionText);

                    return (
                      <div key={e.id} className={styles.expItem}>
                        <div className={styles.expTop}>
                          <div className={styles.expRole}>{header}</div>
                          <div className={styles.expDates}>
                            {formatDateRange(
                              e.startDate,
                              e.endDate,
                              e.isCurrent
                            )}
                          </div>
                        </div>

                        {visaType === "H2A" ? (
                          <ul className={styles.expBullets}>
                            {(bullets.length
                              ? bullets
                              : ["Paste bullet points here (• ...)."]
                            ).map((b, i) => (
                              <li key={i}>{b}</li>
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
        </div>
      </article>
    );
  }
);

BlueSidebarImageHeaderTemplate.displayName = "BlueSidebarImageHeaderTemplate";
export default BlueSidebarImageHeaderTemplate;
