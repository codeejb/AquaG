export interface StreetSegment {
  id: string;
  name: string;
  area: string;
  osmRef: string;
  category: 'highway' | 'arterial' | 'underpass' | 'radial' | 'collector' | 'avenue';
  coordinates: [number, number][]; // [lat, lng]
  baseDepthCm: number; // At T+0
  surgeSensitivity: number; // sensitivity to rainfall peaks (e.g., underpasses are 1.4x)
  drainageNodeId: string;
  speedLimitKmh?: number;
  elevM?: number;
}

export type WaterloggingSeverity = 'LOW' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface StreetWaterloggingStatus {
  depthCm: number;
  severity: WaterloggingSeverity;
  color: string;
  glowColor: string;
  label: string;
  flowVelocityMs: number;
  passability: 'ALL_VEHICLES' | 'HIGH_CLEARANCE_ONLY' | 'EMERGENCY_ONLY' | 'IMPASSABLE_CLOSED';
}

export function getWaterloggingColor(depthCm: number): {
  color: string;
  glowColor: string;
  severity: WaterloggingSeverity;
  label: string;
  passability: 'ALL_VEHICLES' | 'HIGH_CLEARANCE_ONLY' | 'EMERGENCY_ONLY' | 'IMPASSABLE_CLOSED';
} {
  if (depthCm < 15) {
    return {
      color: '#22c55e', // Green 0-15 cm
      glowColor: 'rgba(34, 197, 94, 0.4)',
      severity: 'LOW',
      label: '0–15 cm (Low / Passable)',
      passability: 'ALL_VEHICLES',
    };
  } else if (depthCm < 30) {
    return {
      color: '#facc15', // Yellow 15-30 cm
      glowColor: 'rgba(250, 204, 21, 0.45)',
      severity: 'MODERATE',
      label: '15–30 cm (Moderate Waterlogging)',
      passability: 'HIGH_CLEARANCE_ONLY',
    };
  } else if (depthCm < 60) {
    return {
      color: '#f97316', // Orange 30-60 cm
      glowColor: 'rgba(249, 115, 22, 0.55)',
      severity: 'SEVERE',
      label: '30–60 cm (Severe Waterlogging)',
      passability: 'EMERGENCY_ONLY',
    };
  } else {
    return {
      color: '#ef4444', // Red 60+ cm
      glowColor: 'rgba(239, 68, 68, 0.7)',
      severity: 'CRITICAL',
      label: '60+ cm (Critical Flood / Closed)',
      passability: 'IMPASSABLE_CLOSED',
    };
  }
}

/**
 * Calculates current water depth for a street segment given the timeline frame & scenario
 */
export function calculateStreetDepth(
  street: StreetSegment,
  timeOffsetHours: number,
  rainRateMmHr: number,
  isOkhlaRerouted: boolean = false
): number {
  // Peak multiplier curve over time (surge peaks around T+1.00hr, recedes by T+3.00hr)
  let timeFactor = 1.0;
  if (timeOffsetHours === 0) timeFactor = 1.0;
  else if (timeOffsetHours === 0.5) timeFactor = 1.15;
  else if (timeOffsetHours === 1.0) timeFactor = 1.35; // Peak surge
  else if (timeOffsetHours === 2.0) timeFactor = 1.18;
  else if (timeOffsetHours >= 3.0) timeFactor = 0.82;

  // Rainfall factor relative to baseline 48mm/hr
  const rainFactor = rainRateMmHr / 48;

  // Relief from pump rerouting if in Okhla/Mathura area
  let pumpRelief = 1.0;
  if (isOkhlaRerouted && (street.area.includes('Okhla') || street.area.includes('Mathura') || street.area.includes('Barapullah'))) {
    pumpRelief = 0.68; // 32% depth reduction when bypass is active
  }

  let calculatedDepth = street.baseDepthCm * timeFactor * Math.pow(rainFactor, 0.7) * street.surgeSensitivity * pumpRelief;
  
  return Math.max(2, Math.round(calculatedDepth));
}

// -------------------------------------------------------------
// Real OpenStreetMap Delhi Road Geometries
// Coordinates traced from OpenStreetMap for Delhi NCR key corridors
// -------------------------------------------------------------
export const DELHI_STREET_NETWORK: StreetSegment[] = [
  // 1. Minto Road & Railway Underpass (Infamous historical low point)
  {
    id: 'ST-MNT-01',
    name: 'Minto Road Underpass (Railway Bridge)',
    area: 'Central Delhi / CP North',
    osmRef: 'Minto Road / DDU Marg Link',
    category: 'underpass',
    baseDepthCm: 56,
    surgeSensitivity: 1.45,
    drainageNodeId: 'D12',
    speedLimitKmh: 40,
    elevM: 211.2,
    coordinates: [
      [28.6415, 77.2248],
      [28.6398, 77.2253],
      [28.6382, 77.2258],
      [28.6368, 77.2263],
      [28.6352, 77.2268],
    ],
  },

  // 2. Connaught Place - Inner Circle
  {
    id: 'ST-CP-IN',
    name: 'Connaught Place - Inner Circle (Rajiv Chowk)',
    area: 'Connaught Place',
    osmRef: 'Inner Circle',
    category: 'radial',
    baseDepthCm: 42,
    surgeSensitivity: 1.25,
    drainageNodeId: 'D12',
    speedLimitKmh: 30,
    elevM: 214.8,
    coordinates: [
      [28.6328, 77.2195],
      [28.6338, 77.2206],
      [28.6335, 77.2223],
      [28.6322, 77.2235],
      [28.6305, 77.2234],
      [28.6293, 77.2221],
      [28.6295, 77.2201],
      [28.6308, 77.2188],
      [28.6328, 77.2195],
    ],
  },

  // 3. Connaught Place - Outer Circle (Connaught Circus)
  {
    id: 'ST-CP-OUT',
    name: 'Connaught Circus (Outer Circle)',
    area: 'Connaught Place',
    osmRef: 'Connaught Circus / Outer Circle',
    category: 'radial',
    baseDepthCm: 34,
    surgeSensitivity: 1.2,
    drainageNodeId: 'D12',
    speedLimitKmh: 40,
    elevM: 215.1,
    coordinates: [
      [28.6346, 77.2185],
      [28.6360, 77.2203],
      [28.6356, 77.2232],
      [28.6333, 77.2255],
      [28.6298, 77.2255],
      [28.6276, 77.2232],
      [28.6278, 77.2195],
      [28.6302, 77.2168],
      [28.6332, 77.2168],
      [28.6346, 77.2185],
    ],
  },

  // 4. Radial Road 2 (Kasturba Gandhi Marg)
  {
    id: 'ST-RAD-02',
    name: 'Kasturba Gandhi Marg (KG Marg)',
    area: 'Connaught Place to India Gate',
    osmRef: 'Radial Road 2',
    category: 'radial',
    baseDepthCm: 28,
    surgeSensitivity: 1.1,
    drainageNodeId: 'D12',
    speedLimitKmh: 50,
    elevM: 216.0,
    coordinates: [
      [28.6305, 77.2225],
      [28.6272, 77.2242],
      [28.6241, 77.2258],
      [28.6205, 77.2274],
      [28.6172, 77.2289],
    ],
  },

  // 5. Radial Road 1 (Janpath Road)
  {
    id: 'ST-RAD-01',
    name: 'Janpath Road (CP to Rajpath)',
    area: 'Central Delhi',
    osmRef: 'Janpath',
    category: 'radial',
    baseDepthCm: 18,
    surgeSensitivity: 1.05,
    drainageNodeId: 'D12',
    speedLimitKmh: 50,
    elevM: 216.4,
    coordinates: [
      [28.6293, 77.2212],
      [28.6260, 77.2208],
      [28.6215, 77.2202],
      [28.6170, 77.2196],
      [28.6130, 77.2190],
    ],
  },

  // 6. Barakhamba Road (Radial Road 3 to Mandi House)
  {
    id: 'ST-RAD-03',
    name: 'Barakhamba Road (CP to Mandi House)',
    area: 'Central Delhi',
    osmRef: 'Barakhamba Rd',
    category: 'radial',
    baseDepthCm: 22,
    surgeSensitivity: 1.1,
    drainageNodeId: 'D12',
    speedLimitKmh: 50,
    elevM: 215.8,
    coordinates: [
      [28.6322, 77.2235],
      [28.6295, 77.2282],
      [28.6268, 77.2325],
      [28.6250, 77.2355],
    ],
  },

  // 7. ITO Junction & Vikas Marg Ingress (Critical Culvert)
  {
    id: 'ST-ITO-01',
    name: 'ITO Junction & Vikas Marg Bridge Approach',
    area: 'East Delhi Ingress / Yamuna West',
    osmRef: 'Vikas Marg / Bahadur Shah Zafar Marg',
    category: 'arterial',
    baseDepthCm: 64,
    surgeSensitivity: 1.5,
    drainageNodeId: 'D09',
    speedLimitKmh: 50,
    elevM: 208.5,
    coordinates: [
      [28.6275, 77.2385],
      [28.6288, 77.2415],
      [28.6298, 77.2465],
      [28.6305, 77.2530],
      [28.6312, 77.2610],
      [28.6318, 77.2690],
    ],
  },

  // 8. Ring Road - Kashmere Gate & Nigambodh Ghat (Yamuna Riverbank Flood Zone)
  {
    id: 'ST-RNG-01',
    name: 'Ring Road (ISBT Kashmere Gate to Nigambodh Ghat)',
    area: 'North-East Yamuna Bank',
    osmRef: 'Mahatma Gandhi Marg (Ring Road)',
    category: 'highway',
    baseDepthCm: 68,
    surgeSensitivity: 1.6,
    drainageNodeId: 'D03',
    speedLimitKmh: 60,
    elevM: 206.8,
    coordinates: [
      [28.6720, 77.2280],
      [28.6675, 77.2310],
      [28.6620, 77.2360],
      [28.6565, 77.2410],
      [28.6510, 77.2445],
    ],
  },

  // 9. Ring Road - Shanti Van & Rajghat Corridor
  {
    id: 'ST-RNG-02',
    name: 'Ring Road (Shanti Van to ITO Bypass)',
    area: 'Central-East Riverfront',
    osmRef: 'Ring Road / Rajghat',
    category: 'highway',
    baseDepthCm: 52,
    surgeSensitivity: 1.35,
    drainageNodeId: 'D09',
    speedLimitKmh: 60,
    elevM: 207.9,
    coordinates: [
      [28.6510, 77.2445],
      [28.6445, 77.2465],
      [28.6360, 77.2475],
      [28.6288, 77.2468],
    ],
  },

  // 10. Ring Road - Pragati Maidan / Bhairon Marg to Sarai Kale Khan
  {
    id: 'ST-RNG-03',
    name: 'Ring Road (Pragati Maidan / Bhairon Marg to IP Flyover)',
    area: 'Central-East Corridor',
    osmRef: 'Ring Road / Bhairon Marg Junction',
    category: 'highway',
    baseDepthCm: 48,
    surgeSensitivity: 1.3,
    drainageNodeId: 'D09',
    speedLimitKmh: 60,
    elevM: 208.2,
    coordinates: [
      [28.6288, 77.2468],
      [28.6210, 77.2475],
      [28.6140, 77.2485],
      [28.6045, 77.2510],
      [28.5940, 77.2540],
    ],
  },

  // 11. Bhairon Marg Tunnel Approach (Pragati Maidan)
  {
    id: 'ST-BHR-01',
    name: 'Bhairon Marg Tunnel & Underpass Approach',
    area: 'Pragati Maidan / Zoo',
    osmRef: 'Bhairon Marg',
    category: 'underpass',
    baseDepthCm: 58,
    surgeSensitivity: 1.4,
    drainageNodeId: 'D09',
    speedLimitKmh: 45,
    elevM: 209.0,
    coordinates: [
      [28.6140, 77.2485],
      [28.6135, 77.2420],
      [28.6130, 77.2355],
      [28.6125, 77.2295],
    ],
  },

  // 12. Mathura Road (Sundar Nagar to Ashram Chowk)
  {
    id: 'ST-MTH-01',
    name: 'Mathura Road (Sundar Nagar to Ashram Chowk)',
    area: 'South-East Delhi',
    osmRef: 'Mathura Road (NH-19)',
    category: 'arterial',
    baseDepthCm: 38,
    surgeSensitivity: 1.25,
    drainageNodeId: 'D17',
    speedLimitKmh: 50,
    elevM: 211.5,
    coordinates: [
      [28.6015, 77.2440],
      [28.5910, 77.2475],
      [28.5800, 77.2525],
      [28.5705, 77.2600],
    ],
  },

  // 13. Ashram Chowk & Underpass Junction
  {
    id: 'ST-ASH-01',
    name: 'Ashram Chowk & Underpass Slip Roads',
    area: 'South-East Junction',
    osmRef: 'Ashram Flyover / Ring Road',
    category: 'underpass',
    baseDepthCm: 54,
    surgeSensitivity: 1.35,
    drainageNodeId: 'D17',
    speedLimitKmh: 40,
    elevM: 210.0,
    coordinates: [
      [28.5750, 77.2560],
      [28.5705, 77.2600],
      [28.5665, 77.2640],
    ],
  },

  // 14. Okhla Industrial Area Phase-I Arterial (Pump A catchment)
  {
    id: 'ST-OKH-01',
    name: 'Okhla Phase-I Outfall Road (Maa Anandmayee Marg)',
    area: 'Okhla Industrial Area',
    osmRef: 'Maa Anandmayee Marg',
    category: 'collector',
    baseDepthCm: 46,
    surgeSensitivity: 1.3,
    drainageNodeId: 'D17',
    speedLimitKmh: 40,
    elevM: 212.0,
    coordinates: [
      [28.5450, 77.2680],
      [28.5380, 77.2720],
      [28.5310, 77.2760],
      [28.5240, 77.2800],
    ],
  },

  // 15. Barapullah Elevated Nullah Surface Roads
  {
    id: 'ST-BRP-01',
    name: 'Barapullah Corridor / Nullah Service Roads',
    area: 'South Delhi (INA to Sarai Kale Khan)',
    osmRef: 'Barapullah Elevated Road',
    category: 'arterial',
    baseDepthCm: 32,
    surgeSensitivity: 1.2,
    drainageNodeId: 'D22',
    speedLimitKmh: 60,
    elevM: 213.0,
    coordinates: [
      [28.5750, 77.2150],
      [28.5790, 77.2280],
      [28.5830, 77.2410],
      [28.5880, 77.2520],
      [28.5910, 77.2580],
    ],
  },

  // 16. Ring Road - South Ext & Lajpat Nagar (Safe/Low Sector)
  {
    id: 'ST-RNG-04',
    name: 'Ring Road (AIIMS / South Ext to Lajpat Nagar)',
    area: 'South Delhi',
    osmRef: 'Mahatma Gandhi Marg (South)',
    category: 'highway',
    baseDepthCm: 12, // 🟢 Low (0-15 cm)
    surgeSensitivity: 0.9,
    drainageNodeId: 'D22',
    speedLimitKmh: 60,
    elevM: 218.5,
    coordinates: [
      [28.5685, 77.2100],
      [28.5695, 77.2220],
      [28.5700, 77.2340],
      [28.5705, 77.2460],
      [28.5705, 77.2600],
    ],
  },

  // 17. Ashoka Road & India Gate Hexagon Ring
  {
    id: 'ST-IND-01',
    name: 'India Gate C-Hexagon Ring & Tilak Marg',
    area: 'Central Lutyens Delhi',
    osmRef: 'C-Hexagon / Tilak Marg',
    category: 'avenue',
    baseDepthCm: 10, // 🟢 Low (0-15 cm)
    surgeSensitivity: 0.85,
    drainageNodeId: 'D12',
    speedLimitKmh: 50,
    elevM: 217.2,
    coordinates: [
      [28.6160, 77.2295],
      [28.6145, 77.2325],
      [28.6115, 77.2325],
      [28.6095, 77.2295],
      [28.6115, 77.2265],
      [28.6145, 77.2265],
      [28.6160, 77.2295],
      [28.6220, 77.2350],
      [28.6250, 77.2380],
    ],
  },

  // 18. Kartavya Path / Rajpath (High elevation green sector)
  {
    id: 'ST-KRT-01',
    name: 'Kartavya Path (Rashtrapati Bhavan to India Gate)',
    area: 'Central Lutyens Delhi',
    osmRef: 'Kartavya Path',
    category: 'avenue',
    baseDepthCm: 6, // 🟢 Low (0-15 cm)
    surgeSensitivity: 0.7,
    drainageNodeId: 'D12',
    speedLimitKmh: 40,
    elevM: 222.0,
    coordinates: [
      [28.6145, 77.2000],
      [28.6140, 77.2080],
      [28.6135, 77.2180],
      [28.6129, 77.2295],
    ],
  },

  // 19. Netaji Subhash Marg (Old Delhi / Red Fort approach)
  {
    id: 'ST-NSM-01',
    name: 'Netaji Subhash Marg (Delhi Gate to Red Fort)',
    area: 'Old Delhi',
    osmRef: 'Netaji Subhash Marg',
    category: 'arterial',
    baseDepthCm: 36,
    surgeSensitivity: 1.2,
    drainageNodeId: 'D03',
    speedLimitKmh: 40,
    elevM: 212.8,
    coordinates: [
      [28.6405, 77.2400],
      [28.6465, 77.2405],
      [28.6530, 77.2400],
      [28.6580, 77.2390],
    ],
  },

  // 20. Delhi-Meerut Expressway Ingress (Near Akshardham)
  {
    id: 'ST-DME-01',
    name: 'Delhi-Meerut Expressway / NH-9 Akshardham Stretch',
    area: 'Trans-Yamuna East',
    osmRef: 'NH-9 / DME',
    category: 'highway',
    baseDepthCm: 26,
    surgeSensitivity: 1.15,
    drainageNodeId: 'D09',
    speedLimitKmh: 80,
    elevM: 209.5,
    coordinates: [
      [28.6150, 77.2750],
      [28.6180, 77.2880],
      [28.6210, 77.3010],
      [28.6250, 77.3150],
    ],
  },

  // 21. Outer Ring Road - Wazirabad to Majnu Ka Tila
  {
    id: 'ST-ORR-01',
    name: 'Outer Ring Road (Majnu Ka Tila Flood Vulnerable Reach)',
    area: 'North Delhi Riverbank',
    osmRef: 'Outer Ring Road (North)',
    category: 'highway',
    baseDepthCm: 62,
    surgeSensitivity: 1.55,
    drainageNodeId: 'D03',
    speedLimitKmh: 65,
    elevM: 206.5,
    coordinates: [
      [28.7100, 77.2230],
      [28.7000, 77.2270],
      [28.6900, 77.2300],
      [28.6800, 77.2320],
      [28.6720, 77.2280],
    ],
  },

  // 22. DND Flyway Ingress & Sluice Gate Approach
  {
    id: 'ST-DND-01',
    name: 'DND Flyway Approach & Yamuna Outfall Corridor',
    area: 'South-East Yamuna Bridge',
    osmRef: 'Delhi-Noida Direct Flyway',
    category: 'highway',
    baseDepthCm: 22,
    surgeSensitivity: 1.1,
    drainageNodeId: 'D17',
    speedLimitKmh: 70,
    elevM: 211.0,
    coordinates: [
      [28.5800, 77.2600],
      [28.5820, 77.2720],
      [28.5835, 77.2840],
      [28.5840, 77.2980],
    ],
  },

  // 23. Sansad Marg (Parliament Street - Safe sector)
  {
    id: 'ST-SAN-01',
    name: 'Sansad Marg (Parliament Street)',
    area: 'Central Lutyens Delhi',
    osmRef: 'Sansad Marg',
    category: 'radial',
    baseDepthCm: 8, // 🟢 Low
    surgeSensitivity: 0.8,
    drainageNodeId: 'D12',
    speedLimitKmh: 40,
    elevM: 220.0,
    coordinates: [
      [28.6295, 77.2185],
      [28.6250, 77.2155],
      [28.6200, 77.2120],
      [28.6170, 77.2090],
    ],
  },

  // 24. Sikandra Road & Mandi House Roundabout
  {
    id: 'ST-MAN-01',
    name: 'Sikandra Road & Mandi House Roundabout',
    area: 'Central Delhi',
    osmRef: 'Sikandra Road / Bhagwan Das Rd',
    category: 'arterial',
    baseDepthCm: 24,
    surgeSensitivity: 1.15,
    drainageNodeId: 'D12',
    speedLimitKmh: 45,
    elevM: 214.5,
    coordinates: [
      [28.6250, 77.2355],
      [28.6240, 77.2385],
      [28.6225, 77.2415],
      [28.6205, 77.2440],
    ],
  },
];
