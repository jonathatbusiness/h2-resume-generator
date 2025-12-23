export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone) return false;
  return phone.trim().length >= 8;
}

export function clampText(text, max) {
  const t = String(text || "");
  return t.length > max ? t.slice(0, max) : t;
}
