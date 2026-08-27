import React, { useState } from 'react';
import { PumpStation, DrainageNode } from '../types';
import { INITIAL_DRAINAGE_NODES } from '../data/mockData';
import { Activity, Gauge, Zap, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle, RefreshCw, FileDown } from 'lucide-react';

interface DrainageIntelViewProps {
  pumps: PumpStation[];
  onOverrideRoute: (pump: PumpStation) => void;
  onExportPdf?: () => void;
}

export const DrainageIntelView: React.FC<DrainageIntelViewProps> = ({
  pumps,
  onOverrideRoute,
  onExportPdf,
}) => {
  const [nodes, setNodes] = useState<DrainageNode[]>(INITIAL_DRAINAGE_NODES);
  const [selectedPump, setSelectedPump] = useState<PumpStation>(pumps[0]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0d1516] max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#192122] p-5 rounded-xl border border-[#3b494c]/60 shadow-xl">
        <div>
          <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40">
            SCADA HYDRAULIC CONTROL & DRAINAGE INTELLIGENCE
          </span>
          <h1 className="font-headline text-2xl font-black text-[#c3f5ff] mt-1 tracking-tight">
            Stormwater Drainage Network & Sump Telemetry
          </h1>
          <p className="text-xs md:text-sm text-[#bac9cc] mt-0.5">
            Active monitoring of 6 major arterial outfall pumps, 5 trunk junction nodes, and automated backflow prevention sluices.
          </p>
        </div>

        {onExportPdf && (
          <button
            onClick={onExportPdf}
            className="bg-[#242b2d] hover:bg-[#2e3638] text-[#00e5ff] border border-[#00e5ff]/40 font-headline font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer shrink-0"
          >
            <FileDown className="w-4 h-4 text-[#00e5ff]" />
            <span>Export SCADA PDF</span>
          </button>
        )}
      </div>

      {/* Pump Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pumps.map((pump) => {
          const isWarning = pump.capacityPct >= 90;
          return (
            <div
              key={pump.id}
              onClick={() => setSelectedPump(pump)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedPump.id === pump.id
                  ? 'bg-[#192122] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-[#192122]/70 border-[#3b494c]/50 hover:border-[#849396]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono-data text-[#849396] uppercase">{pump.code}</span>
                  <h4 className="text-sm font-bold text-[#dce4e5] font-headline">{pump.name}</h4>
                </div>
                <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded font-bold ${
                  isWarning 
                    ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ff5252]/50 animate-pulse'
                    : 'bg-[#00daf3]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                }`}>
                  {pump.status}
                </span>
              </div>

              {/* Load Bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs font-mono-data mb-1">
                  <span className="text-[#bac9cc]">Hydraulic Load</span>
                  <span className={`font-bold ${isWarning ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`}>
                    {pump.capacityPct}%
                  </span>
                </div>
                <div className="w-full bg-[#0d1516] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isWarning ? 'bg-[#ff5252]' : 'bg-[#00e5ff]'
                    }`}
                    style={{ width: `${pump.capacityPct}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-data bg-[#242b2d] p-2.5 rounded-lg border border-[#3b494c]/40 mb-3">
                <div>
                  <span className="text-[#849396] block text-[9px]">FLOW RATE</span>
                  <span className="text-[#dce4e5] font-bold">{pump.flowRateLps} / {pump.maxFlowLps} L/s</span>
                </div>
                <div>
                  <span className="text-[#849396] block text-[9px]">ACTIVE UNITS</span>
                  <span className="text-[#00e5ff] font-bold">{pump.activePumps} / {pump.totalPumps} Online</span>
                </div>
                <div>
                  <span className="text-[#849396] block text-[9px]">SLUICE GATE</span>
                  <span className="text-[#fec931] font-bold">{pump.sluiceGateOpenPct}% Open</span>
                </div>
                <div>
                  <span className="text-[#849396] block text-[9px]">POWER MODE</span>
                  <span className="text-[#dce4e5] font-bold">{pump.powerSource}</span>
                </div>
              </div>

              {isWarning ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOverrideRoute(pump);
                  }}
                  className="w-full bg-[#ff5252] text-[#000000] font-headline font-bold text-xs py-1.5 rounded uppercase hover:bg-[#ff7676] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Smart Bypass</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOverrideRoute(pump);
                  }}
                  className="w-full bg-[#242b2d] border border-[#3b494c] text-[#bac9cc] hover:text-[#00e5ff] hover:border-[#00e5ff] font-mono-data text-xs py-1.5 rounded transition-colors"
                >
                  Adjust Flow Valves
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Trunk Node Sensor Pressure Grid */}
      <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl">
        <h3 className="font-headline text-base font-bold text-[#c3f5ff] mb-1">
          Trunk Drainage Collector Nodes
        </h3>
        <p className="text-xs text-[#bac9cc] mb-4">
          Real-time piezometric pressure and flow volume at central stormwater junctions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {nodes.map((node) => (
            <div key={node.id} className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono-data text-xs font-bold text-[#00e5ff]">{node.id}</span>
                  <span className={`text-[9px] font-mono-data px-1.5 py-0.2 rounded ${
                    node.status === 'BLOCKED'
                      ? 'bg-[#93000a]/50 text-[#ffb4ab]'
                      : node.status === 'CONGESTED'
                      ? 'bg-[#6f5500]/50 text-[#fec931]'
                      : 'bg-[#00daf3]/20 text-[#00e5ff]'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#dce4e5] font-medium line-clamp-2">{node.name}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#3b494c]/30 font-mono-data text-xs flex justify-between">
                <div>
                  <span className="text-[9px] text-[#849396] block">VOLUME</span>
                  <span className="font-bold text-[#dce4e5]">{node.flowVolumePct}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#849396] block">PRESSURE</span>
                  <span className="font-bold text-[#fec931]">{node.pressureBar} bar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
