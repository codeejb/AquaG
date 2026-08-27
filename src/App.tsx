import React, { useState, useEffect } from 'react';
import { TabType, IncidentAlert, PumpStation, ResponseUnit, SensorTelemetry } from './types';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_PUMPS, 
  INITIAL_SENSORS, 
  INITIAL_RESPONSE_UNITS, 
  INITIAL_TIMELINE_FRAMES 
} from './data/mockData';
import { TopNavBar } from './components/TopNavBar';
import { IntelligenceHub } from './components/IntelligenceHub';
import { DashboardView } from './components/DashboardView';
import { DrainageIntelView } from './components/DrainageIntelView';
import { AlertsView } from './components/AlertsView';
import { AnalyticsView } from './components/AnalyticsView';
import { DispatchModal } from './components/DispatchModal';
import { RouteOverrideModal } from './components/RouteOverrideModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ExportPdfModal } from './components/ExportPdfModal';

export default function App() {
  // Navigation defaults to 'map' matching elements.io format
  const [activeTab, setActiveTab] = useState<TabType>('map');

  // Live Time state matching elements.io format
  const [liveTime, setLiveTime] = useState<string>('2024-09-19 20:32:58');

  // Application Data States
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [pumps, setPumps] = useState<PumpStation[]>(INITIAL_PUMPS);
  const [sensors] = useState<SensorTelemetry[]>(INITIAL_SENSORS);
  const [units, setUnits] = useState<ResponseUnit[]>(INITIAL_RESPONSE_UNITS);
  const [timelineFrames] = useState(INITIAL_TIMELINE_FRAMES);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);

  // Modals & Drawers
  const [inspectIncident, setInspectIncident] = useState<IncidentAlert | null>(null);
  const [dispatchIncident, setDispatchIncident] = useState<IncidentAlert | null>(null);
  const [overridePump, setOverridePump] = useState<PumpStation | null>(null);
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showExportPdfModal, setShowExportPdfModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Live Clock Tick formatted as YYYY-MM-DD HH:mm:ss
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const ho = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${yr}-${mo}-${da} ${ho}:${mi}:${se}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleConfirmDispatch = (incidentId: string, unitId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, dispatched: true, assignedUnits: [...(inc.assignedUnits || []), unitId] }
          : inc
      )
    );
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, status: 'DISPATCHED', assignedIncidentId: incidentId, etaMinutes: 6 }
          : u
      )
    );
  };

  const handleConfirmOverride = (pumpId: string, targetPumpId: string) => {
    setPumps((prev) =>
      prev.map((p) => {
        if (p.id === pumpId) {
          return {
            ...p,
            capacityPct: 78,
            status: 'NORMAL',
            reroutedTo: `Station ${targetPumpId.replace('PUMP-', '')}`,
          };
        }
        if (p.id === targetPumpId) {
          return {
            ...p,
            capacityPct: Math.min(100, p.capacityPct + 22),
          };
        }
        return p;
      })
    );
  };

  const criticalAlertCount = incidents.filter((i) => i.severity === 'CRITICAL' && !i.dispatched).length;

  return (
    <div className="bg-[#0d1516] text-[#dce4e5] h-screen overflow-hidden flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveTime={liveTime}
        criticalAlertCount={criticalAlertCount}
        onOpenTelemetry={() => setShowTelemetryDrawer(true)}
        onOpenNotifications={() => setShowNotifications(!showNotifications)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenExportPdf={() => setShowExportPdfModal(true)}
      />

      {/* Main View Switching */}
      <main className="flex-1 relative flex overflow-hidden w-full h-[calc(100vh-3.5rem)] bg-[#0d1516]">
        {(activeTab === 'map' || activeTab === 'home' || activeTab === 'intelligence' || activeTab === 'sites' || activeTab === 'cameras' || activeTab === 'bookmarks') && (
          <IntelligenceHub
            incidents={incidents}
            pumps={pumps}
            timelineFrames={timelineFrames}
            activeTimelineIndex={activeTimelineIndex}
            setActiveTimelineIndex={setActiveTimelineIndex}
            onSelectIncident={(inc) => setInspectIncident(inc)}
            onDispatchUnit={(inc) => setDispatchIncident(inc)}
            onOverrideRoute={(pump) => setOverridePump(pump)}
            onExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {(activeTab === 'dashboards' || activeTab === 'dashboard') && (
          <DashboardView
            incidents={incidents}
            pumps={pumps}
            sensors={sensors}
            onNavigateToIntel={() => setActiveTab('map')}
            onSelectIncident={(inc) => setInspectIncident(inc)}
            onExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {activeTab === 'drainage' && (
          <DrainageIntelView
            pumps={pumps}
            onOverrideRoute={(pump) => setOverridePump(pump)}
            onExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            incidents={incidents}
            units={units}
            onSelectIncident={(inc) => setInspectIncident(inc)}
            onDispatchUnit={(inc) => setDispatchIncident(inc)}
            onExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            timelineFrames={timelineFrames} 
            onExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {activeTab === 'admin' && (
          <div className="flex-1 bg-[#0d1516] p-6 md:p-8 overflow-y-auto text-[#dce4e5]">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-[#192122] p-6 rounded-xl border border-[#3b494c]/60 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40">
                    GIS & HYDRO ENGINE PLATFORM CONFIGURATION
                  </span>
                </div>
                <h1 className="text-2xl font-black text-[#c3f5ff] tracking-tight">
                  System Administration & Hydrodynamic Pipeline
                </h1>
                <p className="text-xs md:text-sm text-[#bac9cc] mt-1">
                  Manage HEC-RAS 2D overland flow mesh parameters, OpenStreetMap vector layer synchronization, and SCADA IoT telemetry pipelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-[#3b494c]/50 rounded-xl bg-[#192122] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#c3f5ff] text-sm">Hydrodynamic Modeling Engine (2D Mesh)</span>
                      <span className="text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                        ONLINE • 60 FPS
                      </span>
                    </div>
                    <p className="text-xs text-[#bac9cc] mb-4">
                      HEC-RAS 2D shallow water hydrodynamic solver operating on 5m digital elevation models (DEM) with live Doppler radar precipitation nowcasts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#3b494c]/40 flex justify-between items-center text-xs text-[#849396]">
                    <span>Solver Latency: <strong className="text-[#c3f5ff]">14ms</strong></span>
                    <span>Mesh Nodes: <strong className="text-[#c3f5ff]">128,400</strong></span>
                  </div>
                </div>

                <div className="p-5 border border-[#3b494c]/50 rounded-xl bg-[#192122] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#c3f5ff] text-sm">OpenStreetMap & GIS Vector Ingestion</span>
                      <span className="text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                        SYNCED
                      </span>
                    </div>
                    <p className="text-xs text-[#bac9cc] mb-4">
                      Real-time road network topology, underpass elevation notches, stormwater drainage culverts, and emergency corridor geometries.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#3b494c]/40 flex justify-between items-center text-xs text-[#849396]">
                    <span>Vector Segments: <strong className="text-[#c3f5ff]">84 Arterials</strong></span>
                    <span>Last Sync: <strong className="text-[#c3f5ff]">Just now</strong></span>
                  </div>
                </div>

                <div className="p-5 border border-[#3b494c]/50 rounded-xl bg-[#192122] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#c3f5ff] text-sm">SCADA Sensor & Pump Telemetry</span>
                      <span className="text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                        6 OF 6 ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-[#bac9cc] mb-4">
                      Direct MODBUS/DNP3 industrial telemetry feeds tracking pump motor RPMs, sump discharge volumes, water head pressure, and sluice gate states.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#3b494c]/40 flex justify-between items-center text-xs text-[#849396]">
                    <span>Telemetry Rate: <strong className="text-[#c3f5ff]">1.0 Hz</strong></span>
                    <span>Total Flow: <strong className="text-[#c3f5ff]">41,200 L/s</strong></span>
                  </div>
                </div>

                <div className="p-5 border border-[#3b494c]/50 rounded-xl bg-[#192122] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#c3f5ff] text-sm">CAP Emergency Alerting Gateway</span>
                      <span className="text-[10px] font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                        READY
                      </span>
                    </div>
                    <p className="text-xs text-[#bac9cc] mb-4">
                      Common Alerting Protocol (CAP v1.2) integration for immediate multi-agency broadcast to NDMA, Delhi Traffic Police, and DMRC Metro Transit.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#3b494c]/40 flex justify-between items-center text-xs text-[#849396]">
                    <span>Agencies Linked: <strong className="text-[#c3f5ff]">4 Authorities</strong></span>
                    <span>Queue Status: <strong className="text-[#c3f5ff]">0 Pending</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {dispatchIncident && (
        <DispatchModal
          incident={dispatchIncident}
          units={units}
          onClose={() => setDispatchIncident(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {overridePump && (
        <RouteOverrideModal
          pump={overridePump}
          pumps={pumps}
          onClose={() => setOverridePump(null)}
          onConfirmOverride={handleConfirmOverride}
        />
      )}

      {inspectIncident && (
        <IncidentDetailModal
          incident={inspectIncident}
          onClose={() => setInspectIncident(null)}
          onDispatch={(inc) => setDispatchIncident(inc)}
        />
      )}

      {showTelemetryDrawer && (
        <TelemetryDrawer
          sensors={sensors}
          onClose={() => setShowTelemetryDrawer(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showExportPdfModal && (
        <ExportPdfModal
          isOpen={showExportPdfModal}
          onClose={() => setShowExportPdfModal(false)}
          incidents={incidents}
          pumps={pumps}
          sensors={sensors}
          units={units}
          timelineFrames={timelineFrames}
        />
      )}

      {/* Quick Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-14 right-4 w-80 bg-[#192122] border border-[#3b494c] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in text-[#dce4e5]">
          <div className="flex justify-between items-center pb-2 border-b border-[#3b494c]/50 mb-3">
            <span className="font-bold text-xs text-[#c3f5ff]">
              Active Priority Alerts ({incidents.length})
            </span>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-[#849396] hover:text-[#c3f5ff] text-xs p-1 rounded hover:bg-[#242b2d]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  setInspectIncident(inc);
                  setShowNotifications(false);
                }}
                className="p-2.5 rounded-lg bg-[#242b2d] hover:bg-[#2e3638] cursor-pointer transition-colors border border-[#3b494c]/40"
              >
                <div className="flex justify-between font-bold text-[#c3f5ff]">
                  <span>{inc.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    inc.severity === 'CRITICAL' ? 'bg-[#ff5252]/20 text-[#ffb4ab] border border-[#ff5252]/40' : 'bg-[#fec931]/20 text-[#ffeac0] border border-[#fec931]/40'
                  }`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="text-[11px] text-[#bac9cc] mt-1 line-clamp-1">{inc.description}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setActiveTab('alerts');
              setShowNotifications(false);
            }}
            className="w-full mt-3 bg-[#00e5ff] hover:bg-[#9cf0ff] text-black text-center text-xs py-1.5 rounded-lg font-bold font-headline transition-colors shadow-[0_0_10px_rgba(0,229,255,0.3)]"
          >
            Open Alerts Center
          </button>
        </div>
      )}
    </div>
  );
}
