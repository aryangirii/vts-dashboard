// Realistic Mock Data for Vehicle Classification System (VCS)
// Date: 2026-02-08

const mockVcsData = {
  summaryCards: {
    totalVehicles: 15847,
    dominantType: "Car",
    peakTrafficTime: "09:00",
    avgConfidence: 94.7,
  },

  vehiclesByTime: [
    { time: "00:00", Car: 90,  Auto: 55,  Bike: 30, Bus: 8,  Truck: 6 },
    { time: "01:00", Car: 75,  Auto: 48,  Bike: 24, Bus: 6,  Truck: 5 },
    { time: "02:00", Car: 60,  Auto: 40,  Bike: 18, Bus: 5,  Truck: 4 },
    { time: "03:00", Car: 55,  Auto: 36,  Bike: 16, Bus: 4,  Truck: 3 },
    { time: "04:00", Car: 65,  Auto: 42,  Bike: 20, Bus: 5,  Truck: 4 },

    { time: "05:00", Car: 140, Auto: 90,  Bike: 55, Bus: 10, Truck: 8 },
    { time: "06:00", Car: 320, Auto: 210, Bike: 110, Bus: 25, Truck: 15 },
    { time: "07:00", Car: 540, Auto: 360, Bike: 180, Bus: 45, Truck: 28 },

    { time: "08:00", Car: 720, Auto: 480, Bike: 230, Bus: 70, Truck: 45 },
    { time: "09:00", Car: 780, Auto: 520, Bike: 245, Bus: 78, Truck: 52 },
    { time: "10:00", Car: 740, Auto: 500, Bike: 235, Bus: 72, Truck: 48 },

    { time: "11:00", Car: 690, Auto: 460, Bike: 220, Bus: 68, Truck: 45 },
    { time: "12:00", Car: 720, Auto: 480, Bike: 230, Bus: 75, Truck: 50 },
    { time: "13:00", Car: 760, Auto: 510, Bike: 245, Bus: 82, Truck: 56 },

    { time: "14:00", Car: 800, Auto: 540, Bike: 260, Bus: 90, Truck: 60 },
    { time: "15:00", Car: 770, Auto: 520, Bike: 250, Bus: 85, Truck: 58 },
    { time: "16:00", Car: 740, Auto: 500, Bike: 235, Bus: 80, Truck: 55 },

    { time: "17:00", Car: 760, Auto: 520, Bike: 240, Bus: 85, Truck: 58 },
    { time: "18:00", Car: 720, Auto: 490, Bike: 225, Bus: 78, Truck: 52 },
    { time: "19:00", Car: 650, Auto: 440, Bike: 200, Bus: 65, Truck: 45 },

    { time: "20:00", Car: 520, Auto: 360, Bike: 170, Bus: 55, Truck: 38 },
    { time: "21:00", Car: 420, Auto: 290, Bike: 135, Bus: 42, Truck: 30 },
    { time: "22:00", Car: 310, Auto: 215, Bike: 100, Bus: 30, Truck: 22 },
    { time: "23:00", Car: 210, Auto: 150, Bike: 70,  Bus: 22, Truck: 15 },
  ],

  vehicleDistribution: [
    { name: "Car",   value: 45.3, count: 7180 },
    { name: "Auto",  value: 28.4, count: 4505 },
    { name: "Bike",  value: 15.8, count: 2506 },
    { name: "Bus",   value: 7.1,  count: 1125 },
    { name: "Truck", value: 3.4,  count: 531 },
  ],

  vehicleTable: [
    {
      time: "2026-02-08 08:00",
      Bike: 230, Car: 720, Auto: 480, Bus: 70, Truck: 45,
      Total: 1545,
    },
    {
      time: "2026-02-08 09:00",
      Bike: 245, Car: 780, Auto: 520, Bus: 78, Truck: 52,
      Total: 1675,
    },
    {
      time: "2026-02-08 10:00",
      Bike: 235, Car: 740, Auto: 500, Bus: 72, Truck: 48,
      Total: 1595,
    },
    {
      time: "2026-02-08 17:00",
      Bike: 240, Car: 760, Auto: 520, Bus: 85, Truck: 58,
      Total: 1663,
    },
    {
      time: "2026-02-08 18:00",
      Bike: 225, Car: 720, Auto: 490, Bus: 78, Truck: 52,
      Total: 1565,
    },
  ],

  cameras: [
    { id: "all", name: "All Cameras" },
    { id: "cam_001", name: "Camera 001 – Main Junction" },
    { id: "cam_002", name: "Camera 002 – East Corridor" },
    { id: "cam_003", name: "Camera 003 – Office District" },
    { id: "cam_004", name: "Camera 004 – Parking Zone" },
    { id: "cam_005", name: "Camera 005 – Highway Exit" },
  ],

  confidenceByType: [
    { type: "Car",   confidence: 96.2 },
    { type: "Auto",  confidence: 94.6 },
    { type: "Bike",  confidence: 92.8 },
    { type: "Bus",   confidence: 97.1 },
    { type: "Truck", confidence: 95.4 },
  ],
};

export default mockVcsData;
