// VCS Reactive Data Processor
// Generates realistic, filter-responsive data for the VCS dashboard.
// All values change logically when date range, camera, or grouping changes.

const VEHICLE_TYPES = ["Car", "Auto", "Bike", "Bus", "Truck"];

const CAMERA_PROFILES = {
  all:     { factor: 1.0,  label: "All Cameras" },
  cam_001: { factor: 0.32, label: "Camera 001 - Main Junction" },
  cam_002: { factor: 0.26, label: "Camera 002 - East Corridor" },
  cam_003: { factor: 0.22, label: "Camera 003 - Office District" },
  cam_004: { factor: 0.18, label: "Camera 004 - Parking Zone" },
  cam_005: { factor: 0.14, label: "Camera 005 - Highway Exit" },
};

const CAMERAS = Object.entries(CAMERA_PROFILES).map(([id, p]) => ({
  id,
  name: p.label,
}));

// Deterministic pseudo-random seeded by a numeric hash
function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Hourly traffic profile (0-23h). Returns a multiplier 0..1
const HOURLY_PROFILE = [
  0.06, 0.04, 0.03, 0.03, 0.04, 0.10, 0.30, 0.55,
  0.80, 0.90, 0.85, 0.75, 0.80, 0.85, 0.92, 0.88,
  0.82, 0.85, 0.78, 0.62, 0.48, 0.35, 0.22, 0.12,
];

// Base peak counts per vehicle type at peak hour
const BASE_PEAKS = { Car: 780, Auto: 520, Bike: 245, Bus: 82, Truck: 56 };

function parseDate(str) {
  return new Date(str + "T00:00:00");
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function getDaysBetween(from, to) {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

// Generate hourly data for a single day
function generateDayHourly(dateStr, cameraFactor, rand) {
  const rows = [];
  for (let h = 0; h < 24; h++) {
    const profile = HOURLY_PROFILE[h];
    const noise = 0.85 + rand() * 0.3; // 0.85–1.15 variation
    const row = { time: `${String(h).padStart(2, "0")}:00` };
    VEHICLE_TYPES.forEach((type) => {
      const base = BASE_PEAKS[type] * profile * cameraFactor * noise;
      // Add per-type variation
      const typeNoise = 0.9 + rand() * 0.2;
      row[type] = Math.round(base * typeNoise);
    });
    rows.push(row);
  }
  return rows;
}

// Generate full daily data for a date range
function generateDayRows(dateStr, cameraFactor, rand) {
  const hourly = generateDayHourly(dateStr, cameraFactor, rand);
  const totals = { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 };
  hourly.forEach((row) => {
    VEHICLE_TYPES.forEach((t) => {
      totals[t] += row[t];
    });
  });
  return { hourly, totals };
}

export function processVcsData(raw, { dateFrom, dateTo, cameraId, timeGrouping }) {
  const from = parseDate(dateFrom);
  const to = parseDate(dateTo);
  const dayCount = getDaysBetween(from, to);
  const cameraFactor = (CAMERA_PROFILES[cameraId] || CAMERA_PROFILES.all).factor;

  // Seed from filter combination for deterministic but changing results
  const seed = hashString(`${dateFrom}-${dateTo}-${cameraId}-${timeGrouping}`);
  const rand = seedRandom(seed);

  // Generate data for each day in the range
  const allDays = [];
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(from.getTime() + i * 86400000);
    const dateStr = formatDate(d);
    const dayData = generateDayRows(dateStr, cameraFactor, rand);
    allDays.push({ dateStr, ...dayData });
  }

  // Build trend series
  let vehiclesByTime;
  if (timeGrouping === "daily" || dayCount > 1) {
    if (timeGrouping === "hourly" && dayCount === 1) {
      vehiclesByTime = allDays[0].hourly;
    } else if (timeGrouping === "hourly" && dayCount <= 3) {
      // Show hourly but label with date prefix
      vehiclesByTime = [];
      allDays.forEach((day) => {
        day.hourly.forEach((row) => {
          vehiclesByTime.push({
            ...row,
            time: `${day.dateStr.slice(5)} ${row.time}`,
          });
        });
      });
    } else {
      // Daily aggregation
      vehiclesByTime = allDays.map((day) => ({
        time: day.dateStr,
        ...day.totals,
      }));
    }
  } else {
    vehiclesByTime = allDays[0].hourly;
  }

  // Category totals
  const categoryTotals = { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 };
  allDays.forEach((day) => {
    VEHICLE_TYPES.forEach((t) => {
      categoryTotals[t] += day.totals[t];
    });
  });

  const grandTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Summary / KPI
  let dominantType = "Car";
  let dominantCount = 0;
  Object.entries(categoryTotals).forEach(([type, count]) => {
    if (count > dominantCount) {
      dominantType = type;
      dominantCount = count;
    }
  });

  let peakTime = "";
  let peakTotal = 0;
  vehiclesByTime.forEach((row) => {
    const sum = VEHICLE_TYPES.reduce((acc, t) => acc + (row[t] || 0), 0);
    if (sum > peakTotal) {
      peakTotal = sum;
      peakTime = row.time;
    }
  });

  // Confidence varies slightly with camera and date
  const baseConfidence = 94.7;
  const confOffset = (rand() - 0.5) * 4; // +/- 2%
  const avgConfidence = Math.min(99, Math.max(88, baseConfidence + confOffset));

  const summaryCards = {
    totalVehicles: grandTotal,
    dominantType,
    peakTrafficTime: peakTime,
    avgConfidence: Number(avgConfidence.toFixed(1)),
  };

  // Distribution
  const vehicleDistribution = VEHICLE_TYPES.map((name) => ({
    name,
    value: grandTotal > 0 ? Number(((categoryTotals[name] / grandTotal) * 100).toFixed(1)) : 0,
    count: categoryTotals[name],
  }));

  // Table data: generate rows for all hours across all days
  const vehicleTable = [];
  allDays.forEach((day) => {
    day.hourly.forEach((row) => {
      const total = VEHICLE_TYPES.reduce((acc, t) => acc + row[t], 0);
      vehicleTable.push({
        time: `${day.dateStr} ${row.time}`,
        Bike: row.Bike,
        Car: row.Car,
        Auto: row.Auto,
        Bus: row.Bus,
        Truck: row.Truck,
        Total: total,
      });
    });
  });

  return {
    summaryCards,
    vehiclesByTime,
    vehicleDistribution,
    vehicleTable,
    cameras: CAMERAS,
  };
}

export default processVcsData;
