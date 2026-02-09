// VCS data processing utilities
// Transforms raw mock data into dashboard-ready aggregates

const CAMERA_FACTORS = {
  all: 1,
  cam_001: 0.32,
  cam_002: 0.26,
  cam_003: 0.22,
  cam_004: 0.18,
  cam_005: 0.14,
};

function parseDate(value) {
  // Expecting ISO date (yyyy-mm-dd)
  return new Date(value + "T00:00:00");
}

function getDayCount(dateFrom, dateTo) {
  const from = parseDate(dateFrom);
  const to = parseDate(dateTo);
  const diffMs = to.getTime() - from.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const raw = Math.floor(diffMs / oneDay) + 1;
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function getCameraFactor(cameraId) {
  return CAMERA_FACTORS[cameraId] ?? 0.4;
}

function scaleValue(value, dayCount, cameraFactor) {
  return Math.round(value * dayCount * cameraFactor);
}

function buildTrendSeries(rawVehiclesByTime, dayCount, cameraFactor, timeGrouping, dateFrom) {
  // Base hourly series scaled by camera / days
  const hourly = rawVehiclesByTime.map((entry) => {
    const scaled = {};
    ["Car", "Auto", "Bike", "Bus", "Truck"].forEach((k) => {
      scaled[k] = scaleValue(entry[k], dayCount, cameraFactor);
    });
    return {
      time: entry.time,
      ...scaled,
    };
  });

  if (timeGrouping === "hourly") {
    return hourly;
  }

  // Daily aggregation – one point per day in range
  const baseTotals = hourly.reduce(
    (acc, row) => {
      ["Car", "Auto", "Bike", "Bus", "Truck"].forEach((k) => {
        acc[k] += row[k];
      });
      return acc;
    },
    { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 }
  );

  const from = parseDate(dateFrom);
  const days = [];
  for (let i = 0; i < dayCount; i += 1) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const label = d.toISOString().slice(0, 10);
    days.push({
      time: label,
      ...baseTotals,
    });
  }
  return days;
}

function buildCategoryTotals(trendSeries) {
  const totals = { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 };
  trendSeries.forEach((row) => {
    ["Car", "Auto", "Bike", "Bus", "Truck"].forEach((k) => {
      totals[k] += row[k];
    });
  });
  return totals;
}

function buildSummary(trendSeries, categoryTotals, raw) {
  const totalVehicles = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  let dominantType = "Car";
  let dominantCount = 0;
  Object.entries(categoryTotals).forEach(([type, count]) => {
    if (count > dominantCount) {
      dominantType = type;
      dominantCount = count;
    }
  });

  let peakTrafficTime = "";
  let peakTotal = 0;
  trendSeries.forEach((row) => {
    const sum =
      row.Car + row.Auto + row.Bike + row.Bus + row.Truck;
    if (sum > peakTotal) {
      peakTotal = sum;
      peakTrafficTime = row.time;
    }
  });

  // Keep confidence based on original statistics
  const avgConfidence = raw.summaryCards?.avgConfidence ?? 0;

  return {
    totalVehicles,
    dominantType,
    peakTrafficTime,
    avgConfidence,
  };
}

function buildDistribution(categoryTotals) {
  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(categoryTotals).map(([name, count]) => {
    const value = Number(((count / total) * 100).toFixed(1));
    return { name, value, count };
  });
}

function buildTable(rawTable, dayCount, cameraFactor) {
  if (!Array.isArray(rawTable)) return [];

  return rawTable.map((row) => {
    const scaled = {};
    ["Bike", "Car", "Auto", "Bus", "Truck"].forEach((k) => {
      scaled[k] = scaleValue(row[k], dayCount, cameraFactor);
    });
    const Total =
      scaled.Bike +
      scaled.Car +
      scaled.Auto +
      scaled.Bus +
      scaled.Truck;

    return {
      ...row,
      ...scaled,
      Total,
    };
  });
}

export function processVcsData(raw, { dateFrom, dateTo, cameraId, timeGrouping }) {
  const dayCount = getDayCount(dateFrom, dateTo);
  const cameraFactor = getCameraFactor(cameraId);

  const timeGroupingSafe = timeGrouping === "daily" ? "daily" : "hourly";

  const trendSeries = buildTrendSeries(
    raw.vehiclesByTime,
    dayCount,
    cameraFactor,
    timeGroupingSafe,
    dateFrom
  );

  const categoryTotals = buildCategoryTotals(trendSeries);
  const summaryCards = buildSummary(trendSeries, categoryTotals, raw);
  const vehicleDistribution = buildDistribution(categoryTotals);
  const vehicleTable = buildTable(raw.vehicleTable, dayCount, cameraFactor);

  return {
    summaryCards,
    vehiclesByTime: trendSeries,
    vehicleDistribution,
    vehicleTable,
    cameras: raw.cameras,
  };
}

export default processVcsData;

