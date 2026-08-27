import React, { useState, useEffect } from 'react';
import { 
  MapLayerState, 
  BasemapMode, 
  IncidentAlert, 
  PumpStation, 
  TimelineFrame 
} from '../types';
import { LeafletFloodMap } from './LeafletFloodMap';
import { GeminiMapCopilotModal } from './GeminiMapCopilotModal';
import { getGeminiApiKey } from '../services/geminiFloodAdvisor';
import { 
  Play, 
  Pause, 
  Globe, 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle2, 
  LocateFixed,
  Waves,
  Layers,
  ChevronRight,
  ChevronLeft,
  Camera,
  MapPin,
  Droplets,
  RotateCcw,
  Sparkles,
  Key,
  FileDown,
  Mountain
} from 'lucide-react';

interface IntelligenceHubProps {
  incidents: IncidentAlert[];
  pumps: PumpStation[];
  timelineFrames: TimelineFrame[];
  activeTimelineIndex: number;
  setActiveTimelineIndex: (idx: number) => void;
  onSelectIncident: (incident: IncidentAlert) => void;
  onDispatchUnit: (incident: IncidentAlert) => void;
  onOverrideRoute: (pump: PumpStation) => void;
  onExportPdf?: () => void;
}

export const IntelligenceHub: React.FC<IntelligenceHubProps> = ({
  incidents,
  pumps,
  timelineFrames,
  activeTimelineIndex,
  setActiveTimelineIndex,
  onSelectIncident,
  onDispatchUnit,
  onOverrideRoute,
  onExportPdf,
}) => {
  // Default map layers configured for the 7 active layers in exact order
  const [layers, setLayers] = useState<MapLayerState>({
    waterlogging: true,
    floodRisk: true,
    populationPriority: true,
    drainageNetwork: true,
    pumpStations: true,
    criticalInfra: true,
    smartRouting: true,
  });

  // Default basemap mode is vector-dark matching command center dark mode
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('vector-dark');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentAlert | null>(null);
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showGeminiCopilot, setShowGeminiCopilot] = useState<boolean>(false);

  const currentFrame = timelineFrames[activeTimelineIndex] || timelineFrames[0];

  // Timeline Auto-play simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTimelineIndex((prev) => (prev + 1) % timelineFrames.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineFrames.length, setActiveTimelineIndex]);

  const toggleLayer = (layerKey: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleSelectIncidentInternal = (inc: IncidentAlert) => {
    setSelectedIncident(inc);
    onSelectIncident(inc);
  };

  const connaughtIncident = incidents.find((inc) => inc.id === 'INC-2026-0801') || incidents[0];
  const okhlaPump = pumps.find((p) => p.id === 'PUMP-A') || pumps[0];

  const currentRisk = currentFrame.overallRisk;
  const currentPop = currentFrame.popAtRisk.toLocaleString();

  return (
    <div className="flex-1 flex relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0d1516]">
      {/* -------------------- MAIN MAP AREA -------------------- */}
      <div 
        id="gis-map-canvas"
        className="flex-1 relative bg-[#0d1516] overflow-hidden"
      >
        <LeafletFloodMap
          layers={layers}
          basemapMode={basemapMode}
          currentFrame={currentFrame}
          incidents={incidents}
          pumps={pumps}
          onSelectIncident={handleSelectIncidentInternal}
          onOverrideRoute={onOverrideRoute}
          selectedIncident={selectedIncident}
          liveTimestamp="2024-09-19 20:32:58"
        />

        {/* ----------------- MAP OVERLAY CONTROLS (Top Right ACTIVE LAYERS Card & AI Copilot) ----------------- */}
        <div className="absolute top-4 right-14 flex flex-col gap-2 z-30">
          {/* Gemini AI Copilot Trigger Card */}
          <button
            onClick={() => setShowGeminiCopilot(true)}
            className="bg-[#0b1317]/95 hover:bg-[#192122] rounded-lg border border-[#00e5ff]/50 p-2.5 w-60 shadow-2xl backdrop-blur-md text-slate-100 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00e5ff] animate-pulse" />
              <span className="text-xs font-bold text-[#c3f5ff] font-headline">
                Gemini AI Copilot
              </span>
            </div>
            <span className="text-[9px] font-mono-data bg-[#10b981]/20 text-[#a7f3d0] px-2 py-0.5 rounded border border-[#10b981]/50 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              <span>KEY ACTIVE</span>
            </span>
          </button>

          <div className="bg-[#0b1317]/95 rounded-lg border border-[#1b2b34] p-3.5 w-60 shadow-2xl backdrop-blur-md text-slate-100 transition-all">
            <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-[#1b2b34]/80">
              <Layers className="w-4 h-4 text-[#00e5ff]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100 font-sans">
                ACTIVE LAYERS
              </span>
            </div>

            <div className="space-y-2 text-xs font-medium">
              {/* 1. Waterlogging */}
              <label 
                onClick={() => toggleLayer('waterlogging')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.waterlogging 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.waterlogging && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.waterlogging ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Waterlogging
                </span>
              </label>

              {/* 2. Flood Risk */}
              <label 
                onClick={() => toggleLayer('floodRisk')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.floodRisk 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.floodRisk && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.floodRisk ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Flood Risk
                </span>
              </label>

              {/* 3. Population Priority */}
              <label 
                onClick={() => toggleLayer('populationPriority')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.populationPriority 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.populationPriority && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.populationPriority ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Population Priority
                </span>
              </label>

              {/* 4. Drainage Network */}
              <label 
                onClick={() => toggleLayer('drainageNetwork')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.drainageNetwork 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.drainageNetwork && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.drainageNetwork ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Drainage Network
                </span>
              </label>

              {/* 5. Pump Stations */}
              <label 
                onClick={() => toggleLayer('pumpStations')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.pumpStations 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.pumpStations && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.pumpStations ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Pump Stations
                </span>
              </label>

              {/* 6. Critical Infra */}
              <label 
                onClick={() => toggleLayer('criticalInfra')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.criticalInfra 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.criticalInfra && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.criticalInfra ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Critical Infra
                </span>
              </label>

              {/* 7. Smart Routing */}
              <label 
                onClick={() => toggleLayer('smartRouting')}
                className="flex items-center gap-2.5 py-0.5 px-1 rounded hover:bg-[#162229] cursor-pointer transition-colors select-none group"
              >
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  layers.smartRouting 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black' 
                    : 'border-slate-500 bg-transparent hover:border-slate-400'
                }`}>
                  {layers.smartRouting && (
                    <svg className="w-3 h-3 stroke-black fill-none stroke-[3]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] tracking-wide transition-colors ${layers.smartRouting ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  Smart Routing
                </span>
              </label>
            </div>

            {onExportPdf && (
              <div className="pt-2.5 mt-2.5 border-t border-[#1b2b34]/80">
                <button
                  onClick={onExportPdf}
                  className="w-full bg-[#192122] hover:bg-[#242b2d] text-[#c3f5ff] hover:text-[#00e5ff] border border-[#00e5ff]/40 rounded-md py-1.5 px-2 text-[11px] font-bold font-headline flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,229,255,0.15)] cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Export Map PDF Report</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ----------------- BASEMAP SWITCHER (Bottom Right) ----------------- */}
        <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-30">
          <div className="bg-[#131d1e]/95 p-1 rounded-lg border border-[#242b2d] shadow-2xl flex flex-col gap-1 backdrop-blur-md">
            <button
              onClick={() => setBasemapMode('vector-dark')}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                basemapMode === 'vector-dark'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff]'
              }`}
              title="Dark Mode Map (Carto Dark Matter)"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#00e5ff] inline-block mb-0.5 shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
              <span className="text-[8px] font-bold">DARK</span>
            </button>

            <button
              onClick={() => setBasemapMode('satellite-gee')}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                basemapMode === 'satellite-gee' || basemapMode === 'satellite'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff]'
              }`}
              title="High-Resolution Satellite Imagery"
            >
              <Globe className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">SAT</span>
            </button>

            <button
              onClick={() => setBasemapMode('terrain')}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                basemapMode === 'terrain'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff]'
              }`}
              title="Topographical Contour Terrain View"
            >
              <Mountain className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">TERRAIN</span>
            </button>

            <button
              onClick={() => setBasemapMode('elements-light')}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                basemapMode === 'elements-light'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'text-[#bac9cc] hover:bg-[#192122] hover:text-[#c3f5ff]'
              }`}
              title="Voyager Light Road Map"
            >
              <MapIcon className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">LIGHT</span>
            </button>
          </div>
        </div>

        {/* ----------------- TIMELINE SLIDER (Bottom Center) ----------------- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30">
          <div className="bg-[#131d1e]/95 rounded-xl p-3.5 flex items-center gap-4 border border-[#242b2d] shadow-2xl backdrop-blur-md text-[#dce4e5]">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-[#bac9cc] hover:text-[#00e5ff] p-1.5 rounded-lg hover:bg-[#192122] transition-colors"
              title={isPlaying ? 'Pause Simulation' : 'Play Nowcast Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#00e5ff]" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Slider track */}
            <div className="flex-1 relative h-6 flex items-center">
              {/* Background Track */}
              <div className="absolute w-full h-2 bg-[#242b2d] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00e5ff] transition-all duration-300 shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                  style={{ width: `${(activeTimelineIndex / (timelineFrames.length - 1)) * 100}%` }}
                />
              </div>

              {/* Scrub Thumb */}
              <div 
                className="absolute w-4 h-4 bg-[#00e5ff] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] -translate-x-1/2 cursor-pointer transition-all duration-300 border-2 border-[#131d1e]"
                style={{ left: `${(activeTimelineIndex / (timelineFrames.length - 1)) * 100}%` }}
              />

              {/* Tick Markers */}
              <div className="absolute w-full flex justify-between text-[10px] font-mono text-[#849396] mt-6 pointer-events-none">
                {timelineFrames.map((frame, idx) => (
                  <span 
                    key={frame.timeLabel} 
                    className={`cursor-pointer pointer-events-auto transition-colors font-medium ${
                      idx === activeTimelineIndex ? 'text-[#00e5ff] font-bold' : 'hover:text-[#c3f5ff]'
                    }`}
                    onClick={() => setActiveTimelineIndex(idx)}
                  >
                    {idx === 0 ? 'NOW' : frame.offsetHours === 0.5 ? '+30m' : `+${frame.offsetHours}h`}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Timestamp Badge */}
            <span className="font-mono text-xs font-bold text-[#00e5ff] bg-[#00e5ff]/15 px-2.5 py-1 rounded border border-[#00e5ff]/40">
              T+{currentFrame.offsetHours.toFixed(2)}h
            </span>
          </div>
        </div>
      </div>

      {/* -------------------- RIGHT COMMAND SIDEBAR (Collapsible) -------------------- */}
      {isSidebarOpen && (
        <aside className="w-full md:w-[340px] lg:w-[360px] h-full bg-[#131d1e] border-l border-[#242b2d] flex flex-col z-40 shadow-2xl overflow-hidden animate-in slide-in-from-right-4 text-[#dce4e5]">
          <div className="p-4 border-b border-[#242b2d] flex items-center justify-between bg-[#192122]">
            <div>
              <h2 className="font-bold text-base text-[#c3f5ff] flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#00e5ff]" />
                <span>Flood Situation Analysis</span>
              </h2>
              <div className="text-[11px] font-semibold text-[#849396] uppercase tracking-wide">
                Yamuna & Central Corridor
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Vital Stats Bento */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#192122] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#849396] uppercase">OVERALL RISK</span>
                <span className={`text-lg font-black mt-1 ${
                  currentRisk === 'EXTREME' || currentRisk === 'HIGH' ? 'text-[#ff5252]' : 'text-[#fec931]'
                }`}>
                  {currentRisk}
                </span>
              </div>

              <div className="bg-[#192122] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#849396] uppercase">MAX DEPTH</span>
                <span className="text-lg font-black text-[#c3f5ff] font-mono mt-1">
                  {currentFrame.maxDepthCm} cm
                </span>
              </div>

              <div className="bg-[#192122] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#849396] uppercase">CRITICAL ZONES</span>
                <span className="text-lg font-black text-[#00e5ff] font-mono mt-1">
                  {String(currentFrame.criticalZones).padStart(2, '0')}
                </span>
              </div>

              <div className="bg-[#192122] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#849396] uppercase">POP AT RISK</span>
                <span className="text-lg font-black text-[#c3f5ff] font-mono mt-1">
                  {currentPop}
                </span>
              </div>
            </div>

            {/* Critical Incident Dispatches */}
            <div>
              <h3 className="text-xs font-bold text-[#ff5252] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ff5252]" />
                <span>Immediate Actions Required</span>
              </h3>

              <div className="space-y-2.5">
                {/* Connaught Place Alert */}
                <div 
                  className="bg-[#93000a]/20 rounded-lg p-3 border border-[#ff5252]/40 hover:bg-[#93000a]/30 transition-colors cursor-pointer"
                  onClick={() => handleSelectIncidentInternal(connaughtIncident)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#ffb4ab]">
                      {connaughtIncident.title}
                    </span>
                    <span className="text-[9px] bg-[#ff5252]/30 text-[#ffb4ab] px-1.5 py-0.5 rounded font-bold font-mono border border-[#ff5252]/40">
                      {connaughtIncident.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#bac9cc] mb-2.5">
                    {connaughtIncident.description}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDispatchUnit(connaughtIncident);
                      }}
                      className="flex-1 bg-[#ff5252] hover:bg-[#ff7373] text-black text-[11px] font-bold py-1.5 px-3 rounded shadow-xs transition-colors"
                    >
                      {connaughtIncident.dispatched ? 'Unit En Route' : 'Dispatch Unit'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectIncidentInternal(connaughtIncident);
                      }}
                      className="bg-[#192122] border border-[#3b494c] p-1.5 rounded text-[#bac9cc] hover:text-[#00e5ff] hover:border-[#00e5ff] transition-colors"
                      title="Focus on Map"
                    >
                      <LocateFixed className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pump Station A Override */}
                <div 
                  className="bg-[#6f5500]/20 rounded-lg p-3 border border-[#fec931]/40 hover:bg-[#6f5500]/30 transition-colors cursor-pointer"
                  onClick={() => onOverrideRoute(okhlaPump)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#ffeac0]">
                      Pump Station A (Okhla)
                    </span>
                    <span className="text-[9px] bg-[#fec931]/30 text-[#ffeac0] px-1.5 py-0.5 rounded font-bold font-mono border border-[#fec931]/40">
                      WARNING
                    </span>
                  </div>
                  <p className="text-xs text-[#bac9cc] mb-2.5">
                    Capacity at {currentFrame.pumpALoad}%. Node D17 backing up. Smart rerouting engaged.
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOverrideRoute(okhlaPump);
                    }}
                    className="w-full bg-[#192122] border border-[#00e5ff]/60 text-[#00e5ff] hover:bg-[#00e5ff]/20 text-[11px] font-bold py-1.5 rounded transition-colors"
                  >
                    Override Route
                  </button>
                </div>
              </div>
            </div>

            {/* Network Health */}
            <div className="pt-3 border-t border-[#242b2d]">
              <div className="flex items-center justify-between text-xs text-[#bac9cc] mb-1">
                <span>Telemetry Status</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Online (98%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#849396] font-mono">
                <span>142/145 IoT Sensors Active</span>
                <span>Latency: 42ms</span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Gemini AI Flood GIS Copilot Modal */}
      <GeminiMapCopilotModal
        isOpen={showGeminiCopilot}
        onClose={() => setShowGeminiCopilot(false)}
        selectedIncident={selectedIncident}
        currentFrame={currentFrame}
        pumps={pumps}
      />
    </div>
  );
};
