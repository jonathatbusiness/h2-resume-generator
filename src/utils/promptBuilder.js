import { getSkillCatalogByVisaType, mapById } from "./cvDictionaries";

function normalizeVisaType(visaType) {
  return visaType === "H2A" ? "H2-A" : "H2-B";
}

function formatSkills(skills, visaType) {
  if (!skills || skills.length === 0) return "None provided";

  const catalog = getSkillCatalogByVisaType(visaType);
  const map = mapById(catalog);

  return skills.map((id) => (map[id] ? map[id].value : id)).join(", ");
}

export function buildProfilePrompt({ visaType, skills, profileText }) {
  const vt = normalizeVisaType(visaType);

  return `
Rewrite the following profile for a ${vt} resume (temporary work in the USA).

PRIMARY SKILLS TO INCORPORATE: ${formatSkills(skills, visaType)}

CURRENT TEXT (can be English or Portuguese):
${profileText || "[empty]"}

INSTRUCTIONS:
- Return ONLY in English (no explanations).
- Keep it concise and resume-appropriate.
- Highlight reliability, work ethic, safety awareness, teamwork, and attention to detail.
- Use clear, simple wording suitable for H2 workers.
- If the current text is weak or too short, improve it by adding realistic details aligned with the skills.
FORMAT:
- One paragraph (4–6 lines max).
`.trim();
}

export function buildExperiencePrompt({
  visaType,
  jobTitle,
  skills,
  descriptionText,
}) {
  const vt = normalizeVisaType(visaType);

  if (vt === "H2-A") {
    return `
Rewrite the following job description for a H2-A (agricultural) resume.

JOB TITLE: ${jobTitle || "[not provided]"}
RELEVANT SKILLS TO USE: ${formatSkills(skills, visaType)}

CURRENT TEXT (can be English or Portuguese):
${descriptionText || "[empty]"}

INSTRUCTIONS:
- Return ONLY in English (no explanations).
- Output MUST be 5–7 bullet points.
- Each bullet 1–2 lines, starting with a strong past-tense action verb (e.g., Operated, Maintained, Harvested, Planted, Monitored, Repaired, Installed, Managed, Conducted).
- Base tasks on the selected skills; add typical farm duties when reasonable (safety, efficiency, equipment, cleaning/maintenance).
FORMAT (exactly like this):
• Bullet 1...
• Bullet 2...
• Bullet 3...
`.trim();
  }

  return `
Rewrite the following job description for a H2-B (non-agricultural) resume.

JOB TITLE: ${jobTitle || "[not provided]"}
RELEVANT SKILLS TO USE: ${formatSkills(skills)}

CURRENT TEXT (can be English or Portuguese):
${descriptionText || "[empty]"}

INSTRUCTIONS:
- Return ONLY in English (no explanations).
- Output as 1 paragraph (or at most 2 short paragraphs).
- Max 4–5 lines.
- Use past-tense action verbs (Performed, Maintained, Assisted, Organized, Handled, Supported, Ensured).
- Base tasks on the selected skills; add realistic duties aligned with the role when reasonable.
- No bullet points.
`.trim();
}
