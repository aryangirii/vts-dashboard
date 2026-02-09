export function formatIST(timestamp) {
  if (!timestamp) return "—";

  const ms =
    timestamp.toString().length === 10
      ? timestamp * 1000
      : timestamp;

  return (
    new Date(ms).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " IST"
  );
}
