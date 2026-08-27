// Multi-tiered stepped hydrodynamic flood inundation model
// Produces stepped depth isoline polygons matching the visual format in elements.io reference

export interface FloodPolygonTier {
  id: string;
  tierLevel: number; // 1 = Shallow Fringe, 2 = Moderate, 3 = Severe/Deep, 4 = Deepest Trench
  depthRange: string;
  depthCmMin: number;
  depthCmMax: number;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
  coordinates: [number, number][]; // Lat, Lng loop
  areaName: string;
}

export interface CameraNode {
  id: string;
  name: string;
  location: string;
  coords: [number, number];
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  waterLevelCm: number;
  snapshotUrl: string;
  lastUpdated: string;
}

export interface SiteStation {
  id: string;
  name: string;
  type: 'RIVER_GAUGE' | 'SLUICE_GATE' | 'PUMP_STATION' | 'CULVERT_MONITOR';
  coords: [number, number];
  currentLevelM: number;
  thresholdLevelM: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  dischargeCusecs: number;
}

// -------------------------------------------------------------
// Multi-tiered stepped flood channels (Yamuna Riverway & City Inundation Channel)
// Styled with 4 stepped depth bands (Light Blue -> Medium Blue -> Royal Blue -> Midnight Deep Navy)
// -------------------------------------------------------------
export const FLOOD_INUNDATION_TIERS: FloodPolygonTier[] = [
  // ----------------- TIER 1: SHALLOW INUNDATION FRINGE (0–15 cm / Light Sky Blue) -----------------
  {
    id: 'TIER-1-YAMUNA-NORTH',
    tierLevel: 1,
    depthRange: '0.1 – 0.5 m (0–15 cm)',
    depthCmMin: 10,
    depthCmMax: 25,
    fillColor: '#60a5fa', // Light Sky Blue
    fillOpacity: 0.65,
    strokeColor: '#3b82f6',
    strokeWeight: 1.5,
    areaName: 'Yamuna Floodplain - Kashmere Gate to ITO Reach (Outer Fringe)',
    coordinates: [
      [28.6750, 77.2240],
      [28.6720, 77.2340],
      [28.6650, 77.2420],
      [28.6560, 77.2480],
      [28.6470, 77.2510],
      [28.6380, 77.2530],
      [28.6290, 77.2520],
      [28.6200, 77.2510],
      [28.6110, 77.2530],
      [28.6020, 77.2570],
      [28.5920, 77.2620],
      [28.5830, 77.2700],
      [28.5750, 77.2800],
      [28.5680, 77.2920],
      // Return boundary (wider buffer)
      [28.5620, 77.2850],
      [28.5700, 77.2720],
      [28.5780, 77.2610],
      [28.5860, 77.2520],
      [28.5960, 77.2470],
      [28.6060, 77.2430],
      [28.6160, 77.2420],
      [28.6250, 77.2410],
      [28.6350, 77.2420],
      [28.6440, 77.2410],
      [28.6530, 77.2370],
      [28.6620, 77.2300],
      [28.6700, 77.2210],
    ],
  },
  // Urban overflow corridor cutting across ring road & underpasses
  {
    id: 'TIER-1-URBAN-OVERFLOW',
    tierLevel: 1,
    depthRange: '0.1 – 0.5 m',
    depthCmMin: 15,
    depthCmMax: 30,
    fillColor: '#60a5fa',
    fillOpacity: 0.6,
    strokeColor: '#3b82f6',
    strokeWeight: 1.5,
    areaName: 'Vikas Marg & ITO Underpass Inundation Fan',
    coordinates: [
      [28.6330, 77.2380],
      [28.6310, 77.2470],
      [28.6260, 77.2560],
      [28.6220, 77.2650],
      [28.6170, 77.2620],
      [28.6200, 77.2510],
      [28.6240, 77.2420],
      [28.6280, 77.2360],
    ],
  },
  {
    id: 'TIER-1-BARAPULLAH-CHANNEL',
    tierLevel: 1,
    depthRange: '0.1 – 0.5 m',
    depthCmMin: 12,
    depthCmMax: 28,
    fillColor: '#60a5fa',
    fillOpacity: 0.65,
    strokeColor: '#3b82f6',
    strokeWeight: 1.5,
    areaName: 'Barapullah Stream Inundation Buffer',
    coordinates: [
      [28.5720, 77.2120],
      [28.5770, 77.2260],
      [28.5820, 77.2390],
      [28.5870, 77.2510],
      [28.5900, 77.2600],
      [28.5850, 77.2620],
      [28.5800, 77.2500],
      [28.5750, 77.2370],
      [28.5700, 77.2230],
      [28.5660, 77.2100],
    ],
  },

  // ----------------- TIER 2: MODERATE INUNDATION (15–30 cm / Medium Blue) -----------------
  {
    id: 'TIER-2-YAMUNA-MAIN',
    tierLevel: 2,
    depthRange: '0.5 – 1.0 m (15–30 cm)',
    depthCmMin: 30,
    depthCmMax: 50,
    fillColor: '#2563eb', // Medium Vibrant Blue
    fillOpacity: 0.75,
    strokeColor: '#1d4ed8',
    strokeWeight: 1.5,
    areaName: 'Yamuna River Inundation Zone (Moderate Depth)',
    coordinates: [
      [28.6730, 77.2260],
      [28.6700, 77.2330],
      [28.6630, 77.2400],
      [28.6540, 77.2450],
      [28.6450, 77.2480],
      [28.6360, 77.2500],
      [28.6270, 77.2490],
      [28.6180, 77.2480],
      [28.6090, 77.2500],
      [28.6000, 77.2540],
      [28.5900, 77.2590],
      [28.5810, 77.2670],
      [28.5730, 77.2760],
      [28.5660, 77.2880],
      // Inner boundary
      [28.5640, 77.2830],
      [28.5710, 77.2710],
      [28.5790, 77.2600],
      [28.5880, 77.2510],
      [28.5980, 77.2460],
      [28.6080, 77.2430],
      [28.6170, 77.2420],
      [28.6260, 77.2420],
      [28.6350, 77.2430],
      [28.6440, 77.2420],
      [28.6520, 77.2380],
      [28.6600, 77.2320],
      [28.6680, 77.2230],
    ],
  },
  {
    id: 'TIER-2-URBAN-OVERFLOW',
    tierLevel: 2,
    depthRange: '0.5 – 1.0 m',
    depthCmMin: 35,
    depthCmMax: 55,
    fillColor: '#2563eb',
    fillOpacity: 0.75,
    strokeColor: '#1d4ed8',
    strokeWeight: 1.5,
    areaName: 'Vikas Marg Lowland Submergence',
    coordinates: [
      [28.6310, 77.2400],
      [28.6295, 77.2460],
      [28.6255, 77.2540],
      [28.6210, 77.2610],
      [28.6185, 77.2580],
      [28.6210, 77.2500],
      [28.6245, 77.2430],
      [28.6275, 77.2380],
    ],
  },

  // ----------------- TIER 3: SEVERE INUNDATION (30–60 cm / Deep Royal Blue) -----------------
  {
    id: 'TIER-3-YAMUNA-CORE',
    tierLevel: 3,
    depthRange: '1.0 – 2.0 m (30–60 cm)',
    depthCmMin: 60,
    depthCmMax: 90,
    fillColor: '#1e40af', // Deep Royal Blue
    fillOpacity: 0.85,
    strokeColor: '#172554',
    strokeWeight: 1.5,
    areaName: 'Yamuna Active Channel Flow (Severe Depth)',
    coordinates: [
      [28.6710, 77.2280],
      [28.6680, 77.2320],
      [28.6610, 77.2380],
      [28.6520, 77.2430],
      [28.6430, 77.2460],
      [28.6340, 77.2470],
      [28.6250, 77.2460],
      [28.6160, 77.2460],
      [28.6070, 77.2480],
      [28.5980, 77.2520],
      [28.5880, 77.2570],
      [28.5790, 77.2640],
      [28.5710, 77.2730],
      [28.5640, 77.2840],
      // Return path
      [28.5630, 77.2800],
      [28.5700, 77.2690],
      [28.5770, 77.2590],
      [28.5860, 77.2500],
      [28.5960, 77.2460],
      [28.6050, 77.2430],
      [28.6140, 77.2420],
      [28.6230, 77.2420],
      [28.6320, 77.2430],
      [28.6410, 77.2420],
      [28.6490, 77.2380],
      [28.6570, 77.2330],
      [28.6650, 77.2250],
    ],
  },
  {
    id: 'TIER-3-MINTO-BRIDGE',
    tierLevel: 3,
    depthRange: '1.0 – 2.0 m',
    depthCmMin: 70,
    depthCmMax: 110,
    fillColor: '#1e40af',
    fillOpacity: 0.85,
    strokeColor: '#172554',
    strokeWeight: 1.5,
    areaName: 'Minto Road Railway Underpass Submerged Depression',
    coordinates: [
      [28.6410, 77.2245],
      [28.6395, 77.2252],
      [28.6375, 77.2258],
      [28.6360, 77.2265],
      [28.6350, 77.2270],
      [28.6358, 77.2275],
      [28.6378, 77.2268],
      [28.6400, 77.2260],
      [28.6415, 77.2252],
    ],
  },

  // ----------------- TIER 4: DEEPEST SUBMERGED TRENCH / STREAMBED (60+ cm / Midnight Navy Blue) -----------------
  {
    id: 'TIER-4-DEEP-TRENCH',
    tierLevel: 4,
    depthRange: '> 2.0 m (60+ cm Critical)',
    depthCmMin: 120,
    depthCmMax: 240,
    fillColor: '#0a192f', // Midnight Navy Blue
    fillOpacity: 0.95,
    strokeColor: '#020c1b',
    strokeWeight: 2,
    areaName: 'Yamuna River Deep Thalgweg & Barrage Sump',
    coordinates: [
      [28.6690, 77.2295],
      [28.6660, 77.2330],
      [28.6590, 77.2385],
      [28.6500, 77.2435],
      [28.6410, 77.2460],
      [28.6320, 77.2465],
      [28.6230, 77.2455],
      [28.6140, 77.2455],
      [28.6050, 77.2475],
      [28.5960, 77.2515],
      [28.5860, 77.2565],
      [28.5770, 77.2635],
      [28.5690, 77.2725],
      [28.5620, 77.2830],
      // Return tight band
      [28.5615, 77.2805],
      [28.5680, 77.2705],
      [28.5755, 77.2610],
      [28.5845, 77.2540],
      [28.5940, 77.2490],
      [28.6030, 77.2455],
      [28.6120, 77.2440],
      [28.6210, 77.2435],
      [28.6300, 77.2445],
      [28.6390, 77.2440],
      [28.6470, 77.2410],
      [28.6550, 77.2360],
      [28.6630, 77.2280],
    ],
  },
  {
    id: 'TIER-4-ITO-BARRAGE-SUMP',
    tierLevel: 4,
    depthRange: '> 2.0 m',
    depthCmMin: 140,
    depthCmMax: 260,
    fillColor: '#0a192f',
    fillOpacity: 0.95,
    strokeColor: '#020c1b',
    strokeWeight: 2,
    areaName: 'ITO Barrage Scour Basin',
    coordinates: [
      [28.6280, 77.2450],
      [28.6290, 77.2480],
      [28.6275, 77.2500],
      [28.6255, 77.2470],
    ],
  },
];

// -------------------------------------------------------------
// CCTV Flood Cameras matching elements.io layout
// -------------------------------------------------------------
export const FLOOD_CAMERAS: CameraNode[] = [
  {
    id: 'CAM-01',
    name: 'CCTV-12: Minto Bridge Underpass',
    location: 'Connaught Place / Railway Bridge',
    coords: [28.6382, 77.2258],
    status: 'ONLINE',
    waterLevelCm: 56,
    snapshotUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    lastUpdated: 'Live • 10s ago',
  },
  {
    id: 'CAM-02',
    name: 'CCTV-04: ITO Barrage & Vikas Marg',
    location: 'ITO Junction West Bank',
    coords: [28.6288, 77.2465],
    status: 'ONLINE',
    waterLevelCm: 64,
    snapshotUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    lastUpdated: 'Live • 4s ago',
  },
  {
    id: 'CAM-03',
    name: 'CCTV-08: Kashmere Gate Ring Road',
    location: 'ISBT Ring Road Riverbank',
    coords: [28.6675, 77.2310],
    status: 'ONLINE',
    waterLevelCm: 68,
    snapshotUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    lastUpdated: 'Live • 1s ago',
  },
  {
    id: 'CAM-04',
    name: 'CCTV-19: Barapullah Outfall Sump',
    location: 'Sarai Kale Khan Outfall',
    coords: [28.5880, 77.2520],
    status: 'ONLINE',
    waterLevelCm: 38,
    snapshotUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    lastUpdated: 'Live • 15s ago',
  },
];

// -------------------------------------------------------------
// Site Station Markers (River gauges, Sluice gates, Outfalls)
// -------------------------------------------------------------
export const SITE_STATIONS: SiteStation[] = [
  {
    id: 'SITE-YAMUNA-ORB',
    name: 'Yamuna Old Railway Bridge Gauge (CWC-01)',
    type: 'RIVER_GAUGE',
    coords: [28.6620, 77.2360],
    currentLevelM: 206.15,
    thresholdLevelM: 205.33,
    status: 'CRITICAL',
    dischargeCusecs: 182000,
  },
  {
    id: 'SITE-ITO-SLUICE',
    name: 'ITO Barrage Sluice Gate Complex (Gate #1-#32)',
    type: 'SLUICE_GATE',
    coords: [28.6280, 77.2470],
    currentLevelM: 205.80,
    thresholdLevelM: 205.00,
    status: 'CRITICAL',
    dischargeCusecs: 145000,
  },
  {
    id: 'SITE-OKHLA-HEADWORKS',
    name: 'Okhla Headworks & Outfall Regulator',
    type: 'PUMP_STATION',
    coords: [28.5355, 77.2710],
    currentLevelM: 200.40,
    thresholdLevelM: 200.00,
    status: 'WARNING',
    dischargeCusecs: 85000,
  },
];
