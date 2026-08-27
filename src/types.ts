export type TabType = 
  | 'home'
  | 'map'
  | 'sites'
  | 'cameras'
  | 'dashboards'
  | 'bookmarks'
  | 'admin'
  | 'dashboard'
  | 'intelligence'
  | 'drainage'
  | 'alerts'
  | 'analytics';

export type BasemapMode = 'elements-light' | 'osm-bright' | 'satellite-gee' | 'vector-dark' | 'terrain' | 'satellite';

export interface MapLayerState {
  waterlogging: boolean;
  floodRisk: boolean;
  populationPriority: boolean;
  drainageNetwork: boolean;
  pumpStations: boolean;
  criticalInfra: boolean;
  smartRouting: boolean;
}

export interface IncidentAlert {
  id: string;
  title: string;
  location: string;
  zone: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  description: string;
  depthCm: number;
  popAtRisk: number;
  evacuationStatus: 'Obstructed' | 'Clear' | 'Rerouted' | 'Active';
  actionRequired: string;
  coords: { x: number; y: number }; // Percentage 0-100 on map
  latLng?: [number, number]; // Real GPS [lat, lng]
  pumpId?: string;
  timestamp: string;
  assignedUnits?: string[];
  dispatched?: boolean;
}

export interface PumpStation {
  id: string;
  name: string;
  code: string;
  capacityPct: number;
  flowRateLps: number;
  maxFlowLps: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  nodeBackup: string;
  reroutedTo?: string;
  coords: { x: number; y: number };
  latLng?: [number, number];
  activePumps: number;
  totalPumps: number;
  sluiceGateOpenPct: number;
  powerSource: 'GRID' | 'DIESEL_GEN' | 'HYBRID';
}

export interface DrainageNode {
  id: string;
  name: string;
  flowVolumePct: number;
  pressureBar: number;
  status: 'OPTIMAL' | 'CONGESTED' | 'BLOCKED';
  connectedTo: string[];
  coords: { x: number; y: number };
  latLng?: [number, number];
}

export interface SensorTelemetry {
  id: string;
  name: string;
  type: 'ULTRASONIC_DEPTH' | 'RADAR_FLOW' | 'RAIN_GAUGE' | 'SOIL_SATURATION';
  location: string;
  value: number;
  unit: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  batteryPct: number;
  lastPing: string;
  coords: { x: number; y: number };
  latLng?: [number, number];
}

export interface ResponseUnit {
  id: string;
  name: string;
  type: 'SDRF_RESCUE' | 'HIGH_CAP_PUMP' | 'EVAC_BOAT' | 'MEDICAL_QRT';
  personnel: number;
  status: 'STATIONED' | 'DISPATCHED' | 'ON_SITE' | 'RETURNING';
  assignedIncidentId?: string;
  etaMinutes?: number;
  coords: { x: number; y: number };
  latLng?: [number, number];
}

export interface TimelineFrame {
  timeLabel: string;
  offsetHours: number;
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  maxDepthCm: number;
  criticalZones: number;
  popAtRisk: number;
  pumpALoad: number;
  rainRateMmHr: number;
  yamunaLevelM: number;
}
