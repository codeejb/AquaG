import React from 'react';
import { IncidentAlert, PumpStation, SensorTelemetry } from '../types';
import { 
  Waves, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  CloudRain, 
  Compass, 
  ArrowUpRight, 
  Radio, 
  Layers, 
  Cpu,
  FileDown
} from 'lucide-react';

interface DashboardViewProps {
  incidents: IncidentAlert[];
  pumps: PumpStation[];
  sensors: SensorTelemetry[];
  onNavigateToIntel: () => void;
  onSelectIncident: (incident: IncidentAlert) => void;
  onExportPdf?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  pumps,
  sensors,
  onNavigateToIntel,
  onSelectIncident,
  onExportPdf,
}) => {
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const warningCount = incidents.filter((i) => i.severity === 'WARNING').length;
  const avgPumpLoad = Math.round(
    pumps.reduce((acc, p) => acc + p.capacityPct, 0) / pumps.length
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0d1516] max-w-7xl mx-auto w-full">
      {/* Top Banner & Quick Intel CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#192122] p-5 rounded-xl border border-[#3b494c]/60 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40">
              MUNICIPAL EMERGENCY OPERATIONS CENTER
            </span>
            <span className="text-xs text-[#849396] font-mono-data">DELHI NCR SECTOR 01</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-black text-[#c3f5ff] mt-1.5 tracking-tight">
            Monsoon Hydrological Command Matrix
          </h1>
          <p className="text-xs md:text-sm text-[#bac9cc] mt-1 max-w-2xl">
            Real-time radar precipitation telemetry, automated stormwater pumping loads, and spatial risk nowcasting across 11 metropolitan zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="bg-[#242b2d] hover:bg-[#2e3638] text-[#c3f5ff] border border-[#00e5ff]/40 font-headline font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#00e5ff]" />
              <span>Export PDF Report</span>
            </button>
          )}

          <button
            onClick={onNavigateToIntel}
            className="bg-[#00e5ff] text-[#000000] font-headline font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#9cf0ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Launch GIS Intelligence Hub</span>
          </button>
        </div>
      </div>

      {/* Metric Bento Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* River Yamuna Gauge */}
        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#bac9cc] tracking-wide">YAMUNA RIVER LEVEL</span>
            <Waves className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="my-2">
            <div className="font-mono-data text-2xl font-black text-[#ff5252]">206.15 m</div>
            <div className="text-[11px] text-[#ffb4ab] font-mono-data mt-0.5">
              +0.82m Above Danger Mark (205.33m)
            </div>
          </div>
          <div className="w-full bg-[#2e3638] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#ff5252] h-full w-[88%]" />
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#bac9cc] tracking-wide">CRITICAL WATERLOGGING</span>
            <AlertTriangle className="w-4 h-4 text-[#ff5252]" />
          </div>
          <div className="my-2">
            <div className="font-mono-data text-2xl font-black text-[#ff5252]">{criticalCount} Hotspots</div>
            <div className="text-[11px] text-[#bac9cc] font-mono-data mt-0.5">
              {warningCount} Warning zones monitored
            </div>
          </div>
          <div className="flex gap-1 text-[10px] font-mono-data">
            <span className="text-[#ff5252] font-bold">CP Sec 4</span> • <span className="text-[#ff5252]">ITO Underpass</span>
          </div>
        </div>

        {/* Pump Fleet Capacity */}
        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#bac9cc] tracking-wide">PUMP FLEET UTILIZATION</span>
            <Activity className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="my-2">
            <div className="font-mono-data text-2xl font-black text-[#fec931]">{avgPumpLoad}%</div>
            <div className="text-[11px] text-[#bac9cc] font-mono-data mt-0.5">
              Total Outflow: 12,585 L/sec
            </div>
          </div>
          <div className="w-full bg-[#2e3638] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fec931] h-full" style={{ width: `${avgPumpLoad}%` }} />
          </div>
        </div>

        {/* Telemetry Nodes */}
        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#bac9cc] tracking-wide">TELEMETRY SENSOR GRID</span>
            <Radio className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="my-2">
            <div className="font-mono-data text-2xl font-black text-[#00e5ff]">98.2% ONLINE</div>
            <div className="text-[11px] text-[#bac9cc] font-mono-data mt-0.5">
              142 Active Ultrasonic & Radar Nodes
            </div>
          </div>
          <div className="text-[10px] text-[#849396] font-mono-data">Sampling interval: 2.5s</div>
        </div>
      </div>

      {/* Main Grid: Zone Inundation Matrix & Live Radar / Sensor Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Zone Inundation Severity Matrix */}
        <div className="lg:col-span-2 bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Metropolitan Zone Flood Vulnerability Matrix
              </h3>
              <span className="text-xs text-[#bac9cc]">
                Computed via Sentinel-1 SAR backscatter & hydrodynamic runoff models
              </span>
            </div>
            <span className="text-xs font-mono-data text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-1 rounded border border-[#00e5ff]/30">
              UPDATED: REAL-TIME
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#3b494c]/40 text-[#849396] font-mono-data uppercase">
                  <th className="pb-3 font-semibold">Incident / Location</th>
                  <th className="pb-3 font-semibold">Zone</th>
                  <th className="pb-3 font-semibold">Max Depth</th>
                  <th className="pb-3 font-semibold">Pop. Exposed</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b494c]/30 font-mono-data">
                {incidents.map((inc) => (
                  <tr 
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="hover:bg-[#242b2d]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-bold text-[#dce4e5]">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          inc.severity === 'CRITICAL' ? 'bg-[#ff5252] pulse-dot' : 'bg-[#fec931]'
                        }`} />
                        <span>{inc.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#bac9cc]">{inc.zone}</td>
                    <td className="py-3 font-bold text-[#fec931]">{inc.depthCm} cm</td>
                    <td className="py-3 text-[#dce4e5]">{inc.popAtRisk.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ff5252]/50'
                          : 'bg-[#6f5500]/40 text-[#fec931] border border-[#fec931]/50'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[#00e5ff] hover:underline font-headline font-bold text-[11px]">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Key Pump Station Gauge Column */}
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Primary Outfall Pumps
              </h3>
              <Cpu className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <p className="text-xs text-[#bac9cc] mb-4">
              Real-time SCADA telemetry for major stormwater pumping installations.
            </p>

            <div className="space-y-3.5">
              {pumps.slice(0, 4).map((pump) => (
                <div key={pump.id} className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-[#dce4e5] font-mono-data">{pump.name}</span>
                    <span className={`font-mono-data font-bold ${
                      pump.capacityPct >= 90 ? 'text-[#ff5252]' : 'text-[#00e5ff]'
                    }`}>
                      {pump.capacityPct}%
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1516] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pump.capacityPct >= 90 ? 'bg-[#ff5252]' : 'bg-[#00e5ff]'
                      }`}
                      style={{ width: `${pump.capacityPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#849396] font-mono-data">
                    <span>Flow: {pump.flowRateLps} L/s</span>
                    <span>Pumps: {pump.activePumps}/{pump.totalPumps} Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToIntel}
            className="w-full mt-4 bg-[#242b2d] hover:bg-[#2e3638] text-[#00e5ff] text-xs font-semibold py-2.5 rounded-lg border border-[#00e5ff]/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Full Hydraulic Schematic</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
