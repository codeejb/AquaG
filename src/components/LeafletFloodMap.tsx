import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapLayerState, 
  BasemapMode, 
  IncidentAlert, 
  PumpStation, 
  TimelineFrame 
} from '../types';
import { 
  DELHI_STREET_NETWORK, 
  StreetSegment, 
  calculateStreetDepth, 
  getWaterloggingColor 
} from '../data/streetNetwork';
import { 
  FLOOD_INUNDATION_TIERS, 
  FloodPolygonTier, 
  FLOOD_CAMERAS, 
  CameraNode, 
  SITE_STATIONS, 
  SiteStation 
} from '../data/floodInundationModel';
import {
  CRITICAL_INFRASTRUCTURE,
  CriticalInfraItem,
  POPULATION_PRIORITY_ZONES,
  PopulationPriorityZone,
  SMART_EVACUATION_ROUTES,
  SmartRoute,
  INITIAL_DRAINAGE_NODES
} from '../data/mockData';
import { getTileLayerUrl } from '../services/mapConfig';
import { 
  Droplets, 
  Camera, 
  Activity, 
  Waves, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  X,
  Clock,
  Building2,
  Users,
  Navigation,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

interface LeafletFloodMapProps {
  layers: MapLayerState;
  basemapMode: BasemapMode;
  currentFrame: TimelineFrame;
  incidents: IncidentAlert[];
  pumps: PumpStation[];
  onSelectIncident: (incident: IncidentAlert) => void;
  onOverrideRoute: (pump: PumpStation) => void;
  selectedIncident?: IncidentAlert | null;
  liveTimestamp?: string;
  onSelectCamera?: (camera: CameraNode) => void;
  onSelectSite?: (site: SiteStation) => void;
}

export const LeafletFloodMap: React.FC<LeafletFloodMapProps> = ({
  layers,
  basemapMode,
  currentFrame,
  incidents,
  pumps,
  onSelectIncident,
  onOverrideRoute,
  selectedIncident,
  liveTimestamp = '2024-09-19 20:32:58',
  onSelectCamera,
  onSelectSite,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs corresponding to the 7 map layers
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const floodRiskGroupRef = useRef<L.LayerGroup | null>(null);
  const waterloggingGroupRef = useRef<L.LayerGroup | null>(null);
  const populationPriorityGroupRef = useRef<L.LayerGroup | null>(null);
  const drainageNetworkGroupRef = useRef<L.LayerGroup | null>(null);
  const pumpStationsGroupRef = useRef<L.LayerGroup | null>(null);
  const criticalInfraGroupRef = useRef<L.LayerGroup | null>(null);
  const smartRoutingGroupRef = useRef<L.LayerGroup | null>(null);
  const incidentLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const cameraLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const siteLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active Previews
  const [activeCameraPreview, setActiveCameraPreview] = useState<CameraNode | null>(null);
  const [activeSitePreview, setActiveSitePreview] = useState<SiteStation | null>(null);

  const [hoveredFeature, setHoveredFeature] = useState<{
    title: string;
    subtitle: string;
    depthRange: string;
    color: string;
    details?: string;
  } | null>(null);

  // Check if Okhla Pump A is currently overridden/rerouted
  const okhlaPump = pumps.find((p) => p.id === 'PUMP-A');
  const isOkhlaRerouted = Boolean(okhlaPump?.reroutedTo);

  // -------------------------------------------------------------
  // Initialize Leaflet Map
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.6295, 77.2420],
      zoom: 13,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Create Layer Groups in rendering order
    floodRiskGroupRef.current = L.layerGroup().addTo(map);
    populationPriorityGroupRef.current = L.layerGroup().addTo(map);
    drainageNetworkGroupRef.current = L.layerGroup().addTo(map);
    waterloggingGroupRef.current = L.layerGroup().addTo(map);
    smartRoutingGroupRef.current = L.layerGroup().addTo(map);
    pumpStationsGroupRef.current = L.layerGroup().addTo(map);
    criticalInfraGroupRef.current = L.layerGroup().addTo(map);
    siteLayerGroupRef.current = L.layerGroup().addTo(map);
    cameraLayerGroupRef.current = L.layerGroup().addTo(map);
    incidentLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // -------------------------------------------------------------
  // Basemap Switcher
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = getTileLayerUrl(basemapMode);
    tileLayerRef.current = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abcd',
      opacity: basemapMode === 'satellite-gee' ? 0.88 : 0.95,
    }).addTo(map);
  }, [basemapMode]);

  // -------------------------------------------------------------
  // LAYER 1: FLOOD RISK (Stepped Hydrodynamic Inundation Polygons)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = floodRiskGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.floodRisk) return;

    const scaleFactor = 1 + (currentFrame.offsetHours * 0.08) + (currentFrame.rainRateMmHr > 40 ? 0.06 : 0);

    FLOOD_INUNDATION_TIERS.forEach((tier: FloodPolygonTier) => {
      const centerLat = 28.6295;
      const centerLng = 77.2420;
      const adjustedCoords = tier.coordinates.map(([lat, lng]) => {
        const dLat = (lat - centerLat) * (scaleFactor > 1.25 ? 1.08 : scaleFactor);
        const dLng = (lng - centerLng) * (scaleFactor > 1.25 ? 1.08 : scaleFactor);
        return [centerLat + dLat, centerLng + dLng] as [number, number];
      });

      const polygon = L.polygon(adjustedCoords, {
        fillColor: tier.fillColor,
        fillOpacity: tier.fillOpacity,
        color: tier.strokeColor,
        weight: tier.strokeWeight,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polygon.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #00e5ff; letter-spacing: 0.5px; margin-bottom: 2px;">
            FLOOD RISK ZONE (TIER ${tier.tierLevel})
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 4px;">
            ${tier.areaName}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 6px 8px; border-radius: 6px; margin-top: 6px;">
            <span style="font-size: 11px; color: #849396;">Water Depth:</span>
            <span style="font-size: 13px; font-weight: 800; color: ${tier.fillColor};">
              ${tier.depthRange}
            </span>
          </div>
        </div>
      `, { className: 'elements-popup' });

      polygon.on('mouseover', () => {
        setHoveredFeature({
          title: tier.areaName,
          subtitle: `Tier ${tier.tierLevel} Flood Risk Band`,
          depthRange: tier.depthRange,
          color: tier.fillColor,
          details: `Hydrodynamic depth range: ${tier.depthCmMin}–${tier.depthCmMax} cm`,
        });
        polygon.setStyle({ fillOpacity: Math.min(tier.fillOpacity + 0.15, 1.0), weight: tier.strokeWeight + 1 });
      });

      polygon.on('mouseout', () => {
        setHoveredFeature(null);
        polygon.setStyle({ fillOpacity: tier.fillOpacity, weight: tier.strokeWeight });
      });

      group.addLayer(polygon);
    });
  }, [layers.floodRisk, currentFrame]);

  // -------------------------------------------------------------
  // LAYER 2: WATERLOGGING (Street Network Depth & Passability)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = waterloggingGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.waterlogging) return;

    DELHI_STREET_NETWORK.forEach((street: StreetSegment) => {
      const depthCm = calculateStreetDepth(
        street,
        currentFrame.offsetHours,
        currentFrame.rainRateMmHr,
        isOkhlaRerouted
      );

      const status = getWaterloggingColor(depthCm);

      const roadPolyline = L.polyline(street.coordinates, {
        color: status.color,
        weight: depthCm >= 60 ? 5.5 : depthCm >= 30 ? 4.5 : 3.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: depthCm >= 60 ? '8, 4' : undefined,
      });

      roadPolyline.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 210px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: #00e5ff; margin-bottom: 2px;">
            ${street.osmRef.toUpperCase()}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 2px;">
            ${street.name}
          </div>
          <div style="font-size: 11px; color: #849396; margin-bottom: 6px;">
            ${street.area}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 5px 8px; border-radius: 6px;">
            <span style="font-size: 11px; color: #849396;">Water Depth:</span>
            <span style="font-size: 13px; font-weight: 800; color: ${status.color};">
              ${depthCm} cm
            </span>
          </div>
          <div style="margin-top: 6px; font-size: 10px; font-weight: 600; color: ${status.color};">
            Passability: ${status.passability.replace(/_/g, ' ')}
          </div>
        </div>
      `, { className: 'elements-popup' });

      roadPolyline.on('mouseover', () => {
        setHoveredFeature({
          title: street.name,
          subtitle: `${street.area} (${street.osmRef})`,
          depthRange: `${depthCm} cm`,
          color: status.color,
          details: `Passability: ${status.passability.replace(/_/g, ' ')}`,
        });
      });

      roadPolyline.on('mouseout', () => {
        setHoveredFeature(null);
      });

      group.addLayer(roadPolyline);
    });
  }, [layers.waterlogging, currentFrame, isOkhlaRerouted]);

  // -------------------------------------------------------------
  // LAYER 3: POPULATION PRIORITY (High Vulnerability Exposure Zones)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = populationPriorityGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.populationPriority) return;

    POPULATION_PRIORITY_ZONES.forEach((zone: PopulationPriorityZone) => {
      const isPriority1 = zone.priorityLevel === 'PRIORITY_1';
      const color = isPriority1 ? '#ec4899' : '#a855f7';

      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: color,
        fillColor: color,
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4',
      });

      const iconHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;">
          <div style="background: ${color}; color: #ffffff; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.25); display: flex; items-center; gap: 4px; border: 1.5px solid #ffffff; white-space: nowrap;">
            <span>👥 ${zone.population.toLocaleString()}</span>
          </div>
        </div>
      `;

      const badgeMarker = L.marker(zone.center, {
        icon: L.divIcon({
          html: iconHtml,
          className: 'pop-priority-badge',
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        }),
      });

      const popupContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 210px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color}; text-transform: uppercase;">
            ${zone.priorityLevel.replace('_', ' ')} ZONE
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 4px;">
            ${zone.wardName}
          </div>
          <div style="font-size: 11px; color: #849396; margin-bottom: 6px;">
            Vulnerability Score: <strong>${zone.vulnerabilityScore}/10</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 5px 8px; border-radius: 6px;">
            <span style="color: #849396;">Pop Exposed:</span>
            <span style="font-weight: 700; color: ${color};">${zone.population.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px; padding: 0 8px;">
            <span style="color: #849396;">Relief Capacity:</span>
            <span style="font-weight: 600; color: #dce4e5;">${zone.shelterCapacity.toLocaleString()}</span>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, { className: 'elements-popup' });
      badgeMarker.bindPopup(popupContent, { className: 'elements-popup' });

      circle.on('mouseover', () => {
        setHoveredFeature({
          title: zone.wardName,
          subtitle: `${zone.priorityLevel.replace('_', ' ')} Population Priority`,
          depthRange: `${zone.population.toLocaleString()} residents`,
          color: color,
          details: `Vulnerability Index: ${zone.vulnerabilityScore}/10 | Relief Capacity: ${zone.shelterCapacity.toLocaleString()}`,
        });
      });
      circle.on('mouseout', () => setHoveredFeature(null));

      group.addLayer(circle);
      group.addLayer(badgeMarker);
    });
  }, [layers.populationPriority]);

  // -------------------------------------------------------------
  // LAYER 4: DRAINAGE NETWORK (Conduits, Trunk Sumps & Siphons)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = drainageNetworkGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.drainageNetwork) return;

    // Drainage Network Trunk Conduits connecting sumps
    const conduits: [number, number][][] = [
      [[28.6350, 77.2240], [28.6270, 77.2440]], // D12 to D09 (ITO)
      [[28.6270, 77.2440], [28.6280, 77.2470]], // D09 to Pump B
      [[28.5520, 77.2650], [28.5355, 77.2710]], // D17 to Pump A (Okhla)
      [[28.5520, 77.2650], [28.5720, 77.2580]], // D17 to Pump C (Mathura Road bypass)
      [[28.6650, 77.2300], [28.6670, 77.2320]], // D03 to Pump D (Yamuna Bazar)
      [[28.5750, 77.2350], [28.5850, 77.2480]], // D22 to Pump F (Barapullah)
    ];

    conduits.forEach((lineCoords) => {
      const conduitLine = L.polyline(lineCoords, {
        color: '#06b6d4',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 6',
      });
      group.addLayer(conduitLine);
    });

    // Drainage Sump Nodes (D17, D09, D03, D12, D22)
    INITIAL_DRAINAGE_NODES.forEach((node) => {
      if (!node.latLng) return;
      const isCongested = node.status === 'CONGESTED' || node.status === 'BLOCKED';
      const color = isCongested ? '#f97316' : '#06b6d4';

      const iconHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;">
          <div style="width: 22px; height: 22px; border-radius: 4px; background: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <span style="color: ${color}; font-size: 9px; font-weight: 800; font-family: monospace;">${node.id}</span>
          </div>
        </div>
      `;

      const marker = L.marker(node.latLng, {
        icon: L.divIcon({
          html: iconHtml,
          className: 'drainage-node-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color};">
            DRAINAGE TRUNK NODE
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 2px;">
            ${node.name}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 5px 8px; border-radius: 6px; margin-top: 6px;">
            <span style="font-size: 11px; color: #849396;">Flow Volume:</span>
            <span style="font-size: 13px; font-weight: 800; color: ${color}; font-mono">
              ${node.flowVolumePct}%
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #849396; margin-top: 4px;">
            <span>Pressure: ${node.pressureBar} bar</span>
            <span style="font-weight: bold; color: ${color};">${node.status}</span>
          </div>
        </div>
      `, { className: 'elements-popup' });

      marker.on('mouseover', () => {
        setHoveredFeature({
          title: node.name,
          subtitle: `Node ${node.id} Drainage Sump`,
          depthRange: `${node.flowVolumePct}% Load`,
          color: color,
          details: `Pressure: ${node.pressureBar} bar | Status: ${node.status}`,
        });
      });
      marker.on('mouseout', () => setHoveredFeature(null));

      group.addLayer(marker);
    });
  }, [layers.drainageNetwork]);

  // -------------------------------------------------------------
  // LAYER 5: PUMP STATIONS (Okhla, ITO, Mathura, Yamuna, Minto, Barapullah)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = pumpStationsGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.pumpStations) return;

    pumps.forEach((pump) => {
      const lat = pump.latLng ? pump.latLng[0] : 28.5355;
      const lng = pump.latLng ? pump.latLng[1] : 77.2710;

      const isWarning = pump.status === 'WARNING' || pump.status === 'CRITICAL';
      const color = isWarning ? '#ef4444' : '#0284c7';

      const iconHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;" class="group">
          <div style="padding: 3px 8px; border-radius: 6px; background: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.35);">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};" class="${isWarning ? 'animate-ping' : ''}"></div>
            <span style="font-size: 11px; font-weight: 800; color: #ffffff; white-space: nowrap; font-family: monospace;">
              ${pump.code.split('-')[1]} • ${pump.capacityPct}%
            </span>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: iconHtml,
          className: 'pump-marker-custom',
          iconSize: [95, 26],
          iconAnchor: [47, 13],
        }),
      });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 220px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color};">
            PUMPING FACILITY (${pump.code})
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 4px;">
            ${pump.name}
          </div>
          <div style="background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #849396;">
              <span>Capacity Utilization:</span>
              <span style="font-weight: 800; color: ${color};">${pump.capacityPct}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #849396; margin-top: 2px;">
              <span>Discharge Flow:</span>
              <span style="font-weight: 700; color: #c3f5ff;">${pump.flowRateLps.toLocaleString()} / ${pump.maxFlowLps.toLocaleString()} L/s</span>
            </div>
          </div>
          ${pump.reroutedTo ? `
            <div style="font-size: 10px; color: #00e5ff; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3); padding: 4px 6px; border-radius: 4px; margin-bottom: 6px; font-weight: 600;">
              Active Bypass: Rerouted to ${pump.reroutedTo}
            </div>
          ` : ''}
          <button 
            id="btn-override-${pump.id}" 
            style="width: 100%; background: #00e5ff; color: #000000; font-size: 11px; font-weight: 700; padding: 6px; border-radius: 6px; border: none; cursor: pointer; box-shadow: 0 0 10px rgba(0,229,255,0.3);"
          >
            Manage Route Override
          </button>
        </div>
      `, { className: 'elements-popup' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-override-${pump.id}`);
        if (btn) {
          btn.onclick = () => onOverrideRoute(pump);
        }
      });

      marker.on('mouseover', () => {
        setHoveredFeature({
          title: pump.name,
          subtitle: `Pump Station (${pump.code})`,
          depthRange: `${pump.capacityPct}% Load`,
          color: color,
          details: `Flow: ${pump.flowRateLps} L/s | Active Pumps: ${pump.activePumps}/${pump.totalPumps}`,
        });
      });
      marker.on('mouseout', () => setHoveredFeature(null));

      group.addLayer(marker);
    });
  }, [layers.pumpStations, pumps, onOverrideRoute]);

  // -------------------------------------------------------------
  // LAYER 6: CRITICAL INFRA (Hospitals, Metro hubs, Power & Water)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = criticalInfraGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.criticalInfra) return;

    CRITICAL_INFRASTRUCTURE.forEach((infra: CriticalInfraItem) => {
      const isAtRisk = infra.status === 'AT_RISK';
      const color = isAtRisk ? '#ff5252' : '#10b981';

      const iconHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;" class="group">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #192122; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" class="transition-transform group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        </div>
      `;

      const marker = L.marker(infra.latLng, {
        icon: L.divIcon({
          html: iconHtml,
          className: 'infra-marker-custom',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 210px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color}; text-transform: uppercase;">
            CRITICAL INFRASTRUCTURE • ${infra.type.replace('_', ' ')}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 4px;">
            ${infra.name}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 5px 8px; border-radius: 6px;">
            <span style="font-size: 11px; color: #849396;">Defense Status:</span>
            <span style="font-size: 12px; font-weight: 800; color: ${color};">
              ${infra.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div style="font-size: 10px; color: #849396; margin-top: 5px;">
            Flood Barrier Height: <strong style="color: #c3f5ff;">${infra.barrierHeightM} m</strong>
          </div>
        </div>
      `, { className: 'elements-popup' });

      marker.on('mouseover', () => {
        setHoveredFeature({
          title: infra.name,
          subtitle: `Critical Infra (${infra.type.replace('_', ' ')})`,
          depthRange: infra.status.replace(/_/g, ' '),
          color: color,
          details: `Barrier Height: ${infra.barrierHeightM} m | Criticality: ${infra.criticality}`,
        });
      });
      marker.on('mouseout', () => setHoveredFeature(null));

      group.addLayer(marker);
    });
  }, [layers.criticalInfra]);

  // -------------------------------------------------------------
  // LAYER 7: SMART ROUTING (Safe Evacuation Corridors & Bypasses)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = smartRoutingGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layers.smartRouting) return;

    SMART_EVACUATION_ROUTES.forEach((route: SmartRoute) => {
      const isSafe = route.status === 'SAFE';
      const color = isSafe ? '#10b981' : '#f59e0b';

      const polyline = L.polyline(route.coordinates, {
        color: color,
        weight: 5,
        opacity: 0.9,
        dashArray: isSafe ? undefined : '6, 6',
        lineCap: 'round',
      });

      polyline.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 220px; color: #dce4e5; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color};">
            SMART EVACUATION CORRIDOR
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #c3f5ff; margin-bottom: 2px;">
            ${route.name}
          </div>
          <div style="font-size: 11px; color: #849396; margin-bottom: 6px;">
            ${route.origin} ➔ ${route.destination}
          </div>
          <div style="display: flex; justify-content: space-between; background: #192122; border: 1px solid rgba(59, 73, 76, 0.5); padding: 5px 8px; border-radius: 6px;">
            <span style="font-size: 11px; color: #849396;">Corridor Capacity:</span>
            <span style="font-size: 12px; font-weight: 800; color: #00e5ff; font-mono">
              ${route.capacityVehiclesPerHour.toLocaleString()} veh/h
            </span>
          </div>
          <div style="margin-top: 5px; font-size: 10px; font-weight: bold; color: ${color};">
            Status: ${route.status}
          </div>
        </div>
      `, { className: 'elements-popup' });

      polyline.on('mouseover', () => {
        setHoveredFeature({
          title: route.name,
          subtitle: `Evacuation Corridor (${route.status})`,
          depthRange: `${route.capacityVehiclesPerHour} veh/h`,
          color: color,
          details: `${route.origin} to ${route.destination}`,
        });
      });
      polyline.on('mouseout', () => setHoveredFeature(null));

      group.addLayer(polyline);
    });
  }, [layers.smartRouting]);

  // -------------------------------------------------------------
  // INCIDENTS & GAUGES / CAMERAS (Secondary GIS layers)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const incGroup = incidentLayerGroupRef.current;
    if (!map || !incGroup) return;

    incGroup.clearLayers();

    incidents.forEach((inc) => {
      const lat = inc.latLng ? inc.latLng[0] : 28.628 + (inc.coords.y - 50) * 0.003;
      const lng = inc.latLng ? inc.latLng[1] : 77.234 + (inc.coords.x - 50) * 0.003;

      const isCritical = inc.severity === 'CRITICAL';
      const color = isCritical ? '#ff5252' : '#fec931';

      const iconHtml = `
        <div class="cursor-pointer group" style="transform: translate(-50%, -50%);">
          <div style="width: 30px; height: 30px; border-radius: 50%; background: ${color}25; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${color}80;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color};"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-inc-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on('click', () => onSelectIncident(inc));
      incGroup.addLayer(marker);
    });
  }, [incidents, onSelectIncident]);

  // Map Controls Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBearing = () => mapInstanceRef.current?.setView([28.6295, 77.2420], 13);

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#0d1516]">
      {/* -------------------- LEAFLET MAP DOM NODE -------------------- */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full bg-[#0d1516] z-10" 
        style={{ minHeight: '100%' }}
      />

      {/* -------------------------------------------------------------
          TOP-LEFT TIMESTAMP BOX
          ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 z-30 bg-[#131d1e]/95 text-[#dce4e5] px-3.5 py-1.5 rounded-md shadow-2xl border border-[#242b2d] backdrop-blur-md flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
        <span className="font-mono text-xs font-semibold tracking-tight text-[#c3f5ff]">
          {liveTimestamp}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" title="Real-time Stream" />
      </div>

      {/* -------------------------------------------------------------
          BOTTOM-LEFT STEPPED FLOOD DEPTH LEGEND
          ------------------------------------------------------------- */}
      <div className="absolute bottom-6 left-4 z-30 bg-[#131d1e]/95 text-[#dce4e5] p-3 rounded-lg shadow-2xl border border-[#242b2d] backdrop-blur-md min-w-[190px]">
        <div className="text-[10px] font-bold text-[#849396] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#242b2d] pb-1.5">
          <Droplets className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Water Depth (Inundation)</span>
        </div>

        <div className="space-y-1.5 text-xs font-medium">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-3.5 rounded-sm bg-[#0a192f] border border-[#3b494c] inline-block shadow-sm" />
              <span className="text-[#dce4e5]">&gt; 2.0 m</span>
            </div>
            <span className="text-[10px] text-[#849396] font-mono">Deep Trench</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-3.5 rounded-sm bg-[#1e40af] border border-[#3b494c] inline-block shadow-sm" />
              <span className="text-[#dce4e5]">1.0 – 2.0 m</span>
            </div>
            <span className="text-[10px] text-[#849396] font-mono">Severe</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-3.5 rounded-sm bg-[#2563eb] border border-[#3b494c] inline-block shadow-sm" />
              <span className="text-[#dce4e5]">0.5 – 1.0 m</span>
            </div>
            <span className="text-[10px] text-[#849396] font-mono">Moderate</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-3.5 rounded-sm bg-[#60a5fa] border border-[#3b494c] inline-block shadow-sm" />
              <span className="text-[#dce4e5]">0.1 – 0.5 m</span>
            </div>
            <span className="text-[10px] text-[#849396] font-mono">Shallow</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#242b2d] flex justify-between items-center text-[10px] text-[#849396] font-mono">
          <span>T+{currentFrame.offsetHours}h Nowcast</span>
          <span className="text-[#00e5ff] font-bold">{currentFrame.rainRateMmHr} mm/h</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          TOP-RIGHT MAP NAVIGATION CONTROLS
          ------------------------------------------------------------- */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
        <div className="bg-[#131d1e]/95 border border-[#242b2d] rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="p-2 text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff] transition-colors border-b border-[#242b2d]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff] transition-colors border-b border-[#242b2d]"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={handleResetBearing}
            className="p-2 text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff] transition-colors"
            title="Reset Map View"
          >
            <Compass className="w-4 h-4 text-[#00e5ff]" />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FEATURE HOVER INSPECTOR
          ------------------------------------------------------------- */}
      {hoveredFeature && (
        <div className="absolute top-16 left-4 z-30 bg-[#131d1e]/95 border border-[#242b2d] px-3.5 py-2.5 rounded-lg shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in text-[#dce4e5]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-[#c3f5ff] line-clamp-1">{hoveredFeature.title}</span>
            <span 
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap text-black"
              style={{ backgroundColor: hoveredFeature.color }}
            >
              {hoveredFeature.depthRange}
            </span>
          </div>
          <div className="text-[10px] text-[#849396] mt-0.5">{hoveredFeature.subtitle}</div>
          {hoveredFeature.details && (
            <div className="text-[10px] font-mono text-[#bac9cc] mt-1 border-t border-[#242b2d] pt-1">
              {hoveredFeature.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
