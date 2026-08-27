import { IncidentAlert, PumpStation, DrainageNode, SensorTelemetry, ResponseUnit, TimelineFrame } from '../types';

export const INITIAL_TIMELINE_FRAMES: TimelineFrame[] = [
  {
    timeLabel: 'NOW (T+0.00)',
    offsetHours: 0,
    overallRisk: 'HIGH',
    maxDepthCm: 62,
    criticalZones: 8,
    popAtRisk: 24680,
    pumpALoad: 96,
    rainRateMmHr: 48,
    yamunaLevelM: 206.15,
  },
  {
    timeLabel: 'T+0.30',
    offsetHours: 0.5,
    overallRisk: 'HIGH',
    maxDepthCm: 68,
    criticalZones: 9,
    popAtRisk: 28120,
    pumpALoad: 98,
    rainRateMmHr: 55,
    yamunaLevelM: 206.32,
  },
  {
    timeLabel: 'T+1.00',
    offsetHours: 1.0,
    overallRisk: 'EXTREME',
    maxDepthCm: 76,
    criticalZones: 12,
    popAtRisk: 34500,
    pumpALoad: 100,
    rainRateMmHr: 62,
    yamunaLevelM: 206.58,
  },
  {
    timeLabel: 'T+2.00',
    offsetHours: 2.0,
    overallRisk: 'HIGH',
    maxDepthCm: 71,
    criticalZones: 10,
    popAtRisk: 31200,
    pumpALoad: 92,
    rainRateMmHr: 35,
    yamunaLevelM: 206.44,
  },
  {
    timeLabel: 'T+3.00',
    offsetHours: 3.0,
    overallRisk: 'MEDIUM',
    maxDepthCm: 54,
    criticalZones: 6,
    popAtRisk: 19800,
    pumpALoad: 81,
    rainRateMmHr: 18,
    yamunaLevelM: 206.05,
  },
];

export const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'INC-2026-0801',
    title: 'Connaught Place - Sec 4',
    location: 'Radial Road 2 & Inner Circle, CP',
    zone: 'Central Delhi',
    severity: 'CRITICAL',
    description: 'Water depth exceeding 50cm. Population density high. Evacuation route obstructed due to culvert overflow.',
    depthCm: 58,
    popAtRisk: 9400,
    evacuationStatus: 'Obstructed',
    actionRequired: 'Dispatch quick response dewatering team and traffic diversion unit.',
    coords: { x: 34, y: 44 },
    latLng: [28.6315, 77.2215],
    timestamp: '14:24:18',
    dispatched: false,
  },
  {
    id: 'INC-2026-0802',
    title: 'Pump Station A (Okhla)',
    location: 'Okhla Industrial Area Phase-I Outfall',
    zone: 'South-East Delhi',
    severity: 'WARNING',
    description: 'Capacity at 96%. Node D17 backing up. Smart routing engaged to Pump Station C.',
    depthCm: 44,
    popAtRisk: 6250,
    evacuationStatus: 'Rerouted',
    actionRequired: 'Monitor bypass valve V-09 and authorize pump override to Station C.',
    coords: { x: 28, y: 46 },
    latLng: [28.5355, 77.2710],
    pumpId: 'PUMP-A',
    timestamp: '14:21:05',
    dispatched: false,
  },
  {
    id: 'INC-2026-0803',
    title: 'ITO Underpass Submergence',
    location: 'Vikas Marg / Ring Road Junction',
    zone: 'East Delhi Ingress',
    severity: 'CRITICAL',
    description: 'Water depth reaching 62cm. Submerged vehicular traffic. Dual 120HP submersible pumps throttled by debris.',
    depthCm: 62,
    popAtRisk: 4800,
    evacuationStatus: 'Obstructed',
    actionRequired: 'Trash rake deployment and auxiliary mobile diesel pump dispatch.',
    coords: { x: 48, y: 38 },
    latLng: [28.6288, 77.2435],
    timestamp: '14:15:30',
    dispatched: false,
  },
  {
    id: 'INC-2026-0804',
    title: 'Yamuna Bazar Ghat Inundation',
    location: 'Old Railway Bridge Bank, North East',
    zone: 'Yamuna Floodplain',
    severity: 'WARNING',
    description: 'Yamuna river water level at 206.15m (0.82m above danger mark 205.33m). Seepage in peripheral bund wall.',
    depthCm: 48,
    popAtRisk: 3100,
    evacuationStatus: 'Active',
    actionRequired: 'Reinforce embankment sandbags and broadcast flood advisory to Sector 2 wards.',
    coords: { x: 55, y: 22 },
    latLng: [28.6650, 77.2340],
    timestamp: '14:02:11',
    dispatched: false,
  },
  {
    id: 'INC-2026-0805',
    title: 'Minto Bridge Underpass Drainage',
    location: 'Minto Road Railway Bridge',
    zone: 'Central Connaught Border',
    severity: 'ADVISORY',
    description: 'Automated barrier lowered. Sump level at 38cm, discharge running normally at 450 L/s.',
    depthCm: 38,
    popAtRisk: 1130,
    evacuationStatus: 'Clear',
    actionRequired: 'Maintain sensor telemetry monitoring.',
    coords: { x: 38, y: 36 },
    latLng: [28.6382, 77.2258],
    timestamp: '13:58:40',
    dispatched: true,
  },
];

export const INITIAL_PUMPS: PumpStation[] = [
  {
    id: 'PUMP-A',
    name: 'Pump Station A (Okhla Outfall)',
    code: 'PS-OKH-01',
    capacityPct: 96,
    flowRateLps: 2850,
    maxFlowLps: 3000,
    status: 'WARNING',
    nodeBackup: 'Node D17',
    reroutedTo: 'Station C (Mathura Road)',
    coords: { x: 28, y: 46 },
    latLng: [28.5355, 77.2710],
    activePumps: 5,
    totalPumps: 6,
    sluiceGateOpenPct: 92,
    powerSource: 'HYBRID',
  },
  {
    id: 'PUMP-B',
    name: 'Pump Station B (ITO Barrage Sump)',
    code: 'PS-ITO-02',
    capacityPct: 88,
    flowRateLps: 2200,
    maxFlowLps: 2500,
    status: 'NORMAL',
    nodeBackup: 'Node D09',
    coords: { x: 49, y: 40 },
    latLng: [28.6280, 77.2470],
    activePumps: 4,
    totalPumps: 4,
    sluiceGateOpenPct: 85,
    powerSource: 'GRID',
  },
  {
    id: 'PUMP-C',
    name: 'Pump Station C (Mathura Road Trunk)',
    code: 'PS-MTH-03',
    capacityPct: 52,
    flowRateLps: 1560,
    maxFlowLps: 3000,
    status: 'NORMAL',
    nodeBackup: 'None (Accepting reroute)',
    coords: { x: 62, y: 58 },
    latLng: [28.5720, 77.2580],
    activePumps: 3,
    totalPumps: 6,
    sluiceGateOpenPct: 60,
    powerSource: 'GRID',
  },
  {
    id: 'PUMP-D',
    name: 'Pump Station D (Yamuna Bazar Bund)',
    code: 'PS-YAM-04',
    capacityPct: 94,
    flowRateLps: 1880,
    maxFlowLps: 2000,
    status: 'WARNING',
    nodeBackup: 'Node D03',
    coords: { x: 54, y: 24 },
    latLng: [28.6670, 77.2320],
    activePumps: 4,
    totalPumps: 4,
    sluiceGateOpenPct: 100,
    powerSource: 'DIESEL_GEN',
  },
  {
    id: 'PUMP-E',
    name: 'Pump Station E (Minto Bridge automated)',
    code: 'PS-MNT-05',
    capacityPct: 65,
    flowRateLps: 975,
    maxFlowLps: 1500,
    status: 'NORMAL',
    nodeBackup: 'Node D12',
    coords: { x: 37, y: 34 },
    latLng: [28.6382, 77.2258],
    activePumps: 2,
    totalPumps: 3,
    sluiceGateOpenPct: 70,
    powerSource: 'GRID',
  },
  {
    id: 'PUMP-F',
    name: 'Pump Station F (Barapullah Nullah Interceptor)',
    code: 'PS-BRP-06',
    capacityPct: 78,
    flowRateLps: 3120,
    maxFlowLps: 4000,
    status: 'NORMAL',
    nodeBackup: 'Node D22',
    coords: { x: 45, y: 65 },
    latLng: [28.5850, 77.2480],
    activePumps: 6,
    totalPumps: 8,
    sluiceGateOpenPct: 75,
    powerSource: 'GRID',
  },
];

export const INITIAL_DRAINAGE_NODES: DrainageNode[] = [
  { id: 'D17', name: 'Trunk Sump D17 (Okhla-Connaught Ingress)', flowVolumePct: 94, pressureBar: 4.8, status: 'CONGESTED', connectedTo: ['D18', 'PUMP-A', 'PUMP-C'], coords: { x: 31, y: 49 }, latLng: [28.5520, 77.2650] },
  { id: 'D09', name: 'Node D09 (ITO Collector Junction)', flowVolumePct: 86, pressureBar: 4.2, status: 'CONGESTED', connectedTo: ['D10', 'PUMP-B'], coords: { x: 47, y: 42 }, latLng: [28.6270, 77.2440] },
  { id: 'D03', name: 'Node D03 (Kashmiri Gate River Outfall)', flowVolumePct: 91, pressureBar: 4.9, status: 'BLOCKED', connectedTo: ['PUMP-D'], coords: { x: 52, y: 22 }, latLng: [28.6650, 77.2300] },
  { id: 'D12', name: 'Node D12 (Minto Radial)', flowVolumePct: 62, pressureBar: 3.1, status: 'OPTIMAL', connectedTo: ['PUMP-E', 'D17'], coords: { x: 36, y: 38 }, latLng: [28.6350, 77.2240] },
  { id: 'D22', name: 'Node D22 (Ring Road South Trunk)', flowVolumePct: 74, pressureBar: 3.7, status: 'OPTIMAL', connectedTo: ['PUMP-F'], coords: { x: 42, y: 62 }, latLng: [28.5750, 77.2350] },
];

export const INITIAL_SENSORS: SensorTelemetry[] = [
  { id: 'SEN-101', name: 'Ultrasonic Depth S1 (Connaught Pl)', type: 'ULTRASONIC_DEPTH', location: 'Inner Circle CP', value: 58, unit: 'cm', status: 'ONLINE', batteryPct: 94, lastPing: '3s ago', coords: { x: 34, y: 43 }, latLng: [28.6315, 77.2215] },
  { id: 'SEN-102', name: 'Radar Flow Meter R4 (Yamuna Br.)', type: 'RADAR_FLOW', location: 'Old Railway Bridge', value: 3.8, unit: 'm/s', status: 'ONLINE', batteryPct: 88, lastPing: '1s ago', coords: { x: 53, y: 21 }, latLng: [28.6650, 77.2350] },
  { id: 'SEN-103', name: 'Pluviometer PG-02 (Palam AWS)', type: 'RAIN_GAUGE', location: 'Palam Weather Station', value: 48, unit: 'mm/h', status: 'ONLINE', batteryPct: 99, lastPing: '12s ago', coords: { x: 18, y: 62 }, latLng: [28.5850, 77.1150] },
  { id: 'SEN-104', name: 'Hydraulic Pressure Transducer PT-9', type: 'RADAR_FLOW', location: 'ITO Culvert #4', value: 62, unit: 'cm', status: 'ONLINE', batteryPct: 76, lastPing: '5s ago', coords: { x: 48, y: 39 }, latLng: [28.6290, 77.2430] },
  { id: 'SEN-105', name: 'Soil Moisture / Saturation SM-12', type: 'SOIL_SATURATION', location: 'Lodi Estate Green Zone', value: 92, unit: '%', status: 'ONLINE', batteryPct: 89, lastPing: '8s ago', coords: { x: 39, y: 55 }, latLng: [28.5900, 77.2220] },
];

export const INITIAL_RESPONSE_UNITS: ResponseUnit[] = [
  { id: 'UNIT-QRT-1', name: 'SDRF Quick Reaction Bravo', type: 'SDRF_RESCUE', personnel: 12, status: 'STATIONED', coords: { x: 30, y: 35 }, latLng: [28.6400, 77.2150] },
  { id: 'UNIT-PMP-4', name: 'Heavy Duty 3000GPM Mobile Pump 04', type: 'HIGH_CAP_PUMP', personnel: 4, status: 'STATIONED', coords: { x: 26, y: 52 }, latLng: [28.5600, 77.2500] },
  { id: 'UNIT-BOAT-2', name: 'Inflatable Flood Evacuation Craft 02', type: 'EVAC_BOAT', personnel: 6, status: 'DISPATCHED', assignedIncidentId: 'INC-2026-0804', etaMinutes: 8, coords: { x: 50, y: 26 }, latLng: [28.6620, 77.2350] },
  { id: 'UNIT-MED-1', name: 'Emergency Medical Field Unit M-01', type: 'MEDICAL_QRT', personnel: 8, status: 'STATIONED', coords: { x: 42, y: 48 }, latLng: [28.6050, 77.2300] },
];

export interface CriticalInfraItem {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'METRO_STATION' | 'POWER_STATION' | 'WATER_TREATMENT' | 'GOV_BUILDING';
  status: 'OPERATIONAL' | 'AT_RISK' | 'FLOOD_DEFENDED';
  latLng: [number, number];
  barrierHeightM: number;
  criticality: 'CRITICAL' | 'HIGH';
}

export const CRITICAL_INFRASTRUCTURE: CriticalInfraItem[] = [
  { id: 'INFRA-1', name: 'LNJP Hospital Complex', type: 'HOSPITAL', status: 'FLOOD_DEFENDED', latLng: [28.6360, 77.2405], barrierHeightM: 1.8, criticality: 'CRITICAL' },
  { id: 'INFRA-2', name: 'Rajiv Chowk Metro Hub', type: 'METRO_STATION', status: 'OPERATIONAL', latLng: [28.6328, 77.2197], barrierHeightM: 2.2, criticality: 'CRITICAL' },
  { id: 'INFRA-3', name: 'Kashmere Gate ISBT & Metro', type: 'METRO_STATION', status: 'AT_RISK', latLng: [28.6675, 77.2285], barrierHeightM: 1.2, criticality: 'CRITICAL' },
  { id: 'INFRA-4', name: 'IP Power Generating Substation', type: 'POWER_STATION', status: 'FLOOD_DEFENDED', latLng: [28.6250, 77.2510], barrierHeightM: 2.5, criticality: 'CRITICAL' },
  { id: 'INFRA-5', name: 'Wazirabad Water Treatment Plant', type: 'WATER_TREATMENT', status: 'AT_RISK', latLng: [28.7120, 77.2310], barrierHeightM: 1.5, criticality: 'CRITICAL' },
  { id: 'INFRA-6', name: 'Delhi Secretariat & PWD HQ', type: 'GOV_BUILDING', status: 'OPERATIONAL', latLng: [28.6310, 77.2460], barrierHeightM: 2.0, criticality: 'HIGH' },
  { id: 'INFRA-7', name: 'AIIMS Trauma Center', type: 'HOSPITAL', status: 'OPERATIONAL', latLng: [28.5672, 77.2100], barrierHeightM: 3.0, criticality: 'CRITICAL' },
];

export interface PopulationPriorityZone {
  id: string;
  wardName: string;
  population: number;
  vulnerabilityScore: number; // 1-10
  priorityLevel: 'PRIORITY_1' | 'PRIORITY_2' | 'PRIORITY_3';
  center: [number, number];
  radiusMeters: number;
  shelterCapacity: number;
}

export const POPULATION_PRIORITY_ZONES: PopulationPriorityZone[] = [
  { id: 'POP-1', wardName: 'Yamuna Pushta Floodplain Settlement', population: 18500, vulnerabilityScore: 9.4, priorityLevel: 'PRIORITY_1', center: [28.6580, 77.2380], radiusMeters: 900, shelterCapacity: 12000 },
  { id: 'POP-2', wardName: 'Chandni Chowk - Daryaganj Core', population: 42000, vulnerabilityScore: 8.8, priorityLevel: 'PRIORITY_1', center: [28.6510, 77.2320], radiusMeters: 1100, shelterCapacity: 25000 },
  { id: 'POP-3', wardName: 'Sarai Kale Khan Transport Settlement', population: 14200, vulnerabilityScore: 7.9, priorityLevel: 'PRIORITY_2', center: [28.5900, 77.2580], radiusMeters: 800, shelterCapacity: 9000 },
  { id: 'POP-4', wardName: 'Jamia Nagar / Okhla Flood Margin', population: 26400, vulnerabilityScore: 8.2, priorityLevel: 'PRIORITY_2', center: [28.5600, 77.2800], radiusMeters: 1200, shelterCapacity: 16000 },
  { id: 'POP-5', wardName: 'Connaught Place & Barakhamba Transit', population: 9800, vulnerabilityScore: 6.5, priorityLevel: 'PRIORITY_3', center: [28.6300, 77.2220], radiusMeters: 750, shelterCapacity: 15000 },
];

export interface SmartRoute {
  id: string;
  name: string;
  status: 'SAFE' | 'CONGESTED' | 'BLOCKED';
  origin: string;
  destination: string;
  coordinates: [number, number][];
  capacityVehiclesPerHour: number;
}

export const SMART_EVACUATION_ROUTES: SmartRoute[] = [
  {
    id: 'ROUTE-1',
    name: 'Ring Road Northern Safe Bypass',
    status: 'SAFE',
    origin: 'Yamuna Bazar',
    destination: 'Civil Lines Relief Camp',
    coordinates: [
      [28.6650, 77.2340],
      [28.6700, 77.2300],
      [28.6750, 77.2250],
      [28.6810, 77.2210],
    ],
    capacityVehiclesPerHour: 4200,
  },
  {
    id: 'ROUTE-2',
    name: 'Barakhamba - Mathura Elevated Relief Corridor',
    status: 'SAFE',
    origin: 'Connaught Place',
    destination: 'Lodhi Colony High Grounds',
    coordinates: [
      [28.6315, 77.2215],
      [28.6200, 77.2250],
      [28.6050, 77.2280],
      [28.5900, 77.2300],
    ],
    capacityVehiclesPerHour: 3800,
  },
  {
    id: 'ROUTE-3',
    name: 'Vikas Marg Eastbound Diversion',
    status: 'CONGESTED',
    origin: 'ITO Junction',
    destination: 'Laxmi Nagar Elevated Hub',
    coordinates: [
      [28.6288, 77.2435],
      [28.6300, 77.2550],
      [28.6320, 77.2700],
    ],
    capacityVehiclesPerHour: 2100,
  },
];

