export function parsePrice(value) {
  if (value === undefined || value === null) return 0;
  try {
    const cleaned = String(value).replace(/[^0-9.-]+/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  } catch (e) {
    return 0;
  }
}

export function formatTenge(value) {
  const n = parsePrice(value);
  return `₸${n.toLocaleString('en-US')}`;
}
