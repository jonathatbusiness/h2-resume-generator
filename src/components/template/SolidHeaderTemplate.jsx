import { forwardRef } from "react";
import styles from "./solidHeaderTemplate.module.css";
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

function parseLines(text) {
  const raw = safeText(text);
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function normalizeBullet(line) {
  return line.replace(/^[•\-\*]\s*/, "").trim();
}

function parseBulletBlocks(text) {
  const lines = parseLines(text);
  const blocks = [];
  let current = { title: "", bullets: [] };

  function pushCurrent() {
    if (current.title || current.bullets.length) blocks.push(current);
    current = { title: "", bullets: [] };
  }

  for (const line of lines) {
    const isHeading = /:\s*$/.test(line) && !/^[•\-\*]\s*/.test(line);

    if (isHeading) {
      // inicia um novo bloco
      pushCurrent();
      current.title = line.replace(/:\s*$/, "").trim();
      continue;
    }

    const bullet = normalizeBullet(line);
    if (bullet) current.bullets.push(bullet);
  }

  pushCurrent();

  return blocks;
}

const SolidHeaderTemplate = forwardRef(
  ({ visaType, data, accent = "blue" }, ref) => {
    const pi = data.personalInfo;

    const skillCatalog = getSkillCatalogByVisaType(visaType);
    const skillMap = mapById(skillCatalog);

    const accentClass = accent === "red" ? styles.accentRed : styles.accentBlue;

    return (
      <article
        ref={ref}
        className={`${styles.page} ${accentClass}`}
        aria-label="CV Preview"
      >
        {/* HEADER FULL WIDTH (cor sólida) */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerPhotoWrap}>
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

            <div className={styles.headerText}>
              <div className={styles.name}>
                {safeText(pi.fullName) || "FULL NAME"}
              </div>

              <div className={styles.contactRow}>
                <div className={styles.contactItem}>
                  <FaPhoneAlt className={styles.contactIcon} />
                  <span>{safeText(pi.phone) || "Phone"}</span>
                </div>

                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>{safeText(pi.email) || "Email"}</span>
                </div>

                <div className={styles.contactItem}>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span>{safeText(pi.location) || "Location"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY GRID */}
        <div className={styles.body}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <section className={styles.sideSection}>
              <h3 className={styles.sideTitle}>LANGUAGES</h3>
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

            <section className={styles.sideSection}>
              <h3 className={styles.sideTitle}>EDUCATION</h3>
              <p className={styles.sideMutedSoft}>
                {safeText(data.educationText) || "Add education details."}
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
          </aside>

          {/* MAIN */}
          <main className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>PROFESSIONAL PROFILE</h2>
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
                    const title = safeText(e.title) || "Job Title";
                    const company = safeText(e.company);
                    const head = company ? `${title} — ${company}` : title;

                    const blocks = parseBulletBlocks(e.descriptionText);

                    return (
                      <div key={e.id} className={styles.expItem}>
                        <div className={styles.expTop}>
                          <div className={styles.expRole}>{head}</div>
                          <div className={styles.expDates}>
                            {formatDateRange(
                              e.startDate,
                              e.endDate,
                              e.isCurrent
                            )}
                          </div>
                        </div>

                        {visaType === "H2A" ? (
                          <div className={styles.expBody}>
                            {blocks.length === 0 ? (
                              <ul className={styles.expBullets}>
                                <li>Paste bullet points here (• ...).</li>
                              </ul>
                            ) : (
                              blocks.map((b, idx) => (
                                <div key={idx} className={styles.expBlock}>
                                  {b.title ? (
                                    <div className={styles.expSubTitle}>
                                      {b.title}
                                    </div>
                                  ) : null}

                                  <ul className={styles.expBullets}>
                                    {(b.bullets.length
                                      ? b.bullets
                                      : ["Paste bullet points here (• ...)."]
                                    ).map((txt, i) => (
                                      <li key={i}>{txt}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            )}
                          </div>
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

SolidHeaderTemplate.displayName = "SolidHeaderTemplate";
export default SolidHeaderTemplate;
