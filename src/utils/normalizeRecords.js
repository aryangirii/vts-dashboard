export function normalizeRecords(records, limit = 12) {
  if (!Array.isArray(records)) return [];

  const normalized = records
    .map((r) => {
      const lat = Number(r.lat);
      const lng = Number(r.lng);
      const timestamp = Number(r.timestamp);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        !Number.isFinite(timestamp)
      ) {
        return null;
      }

      return {
        ...r,
        lat,
        lng,
        timestamp,
      };
    })
    .filter(Boolean);

  normalized.sort((a, b) => b.timestamp - a.timestamp);

  const limited = normalized.slice(0, limit);

  return limited.reverse();
}
