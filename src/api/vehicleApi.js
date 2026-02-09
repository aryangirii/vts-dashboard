import axios from "axios";

const API_BASE =
  "https://p3hcp4pjj0.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * Convert date string to UNIX seconds
 */
function toUnix(dateStr) {
  if (!dateStr) return null;
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

export async function fetchVehicleHistory(vehicleId, fromDate, toDate) {
  let url = `${API_BASE}/api/vehicles/${vehicleId}/history`;

  const fromTs = toUnix(fromDate);
  const toTs = toUnix(toDate);

  if (fromTs && toTs) {
    url += `?from=${fromTs}&to=${toTs}`;
  }

  const res = await axios.get(url);
  return res.data;
}

export async function fetchVehicleLatest(vehicleId) {
  const res = await axios.get(
    `${API_BASE}/api/vehicles/${vehicleId}`
  );
  return res.data;
}
