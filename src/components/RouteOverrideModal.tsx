import React, { useState } from 'react';
import { PumpStation } from '../types';
import { RefreshCw, ArrowRight, Gauge, Check, X, ShieldAlert, Zap } from 'lucide-react';

interface RouteOverrideModalProps {
  pump: PumpStation | null;
  pumps: PumpStation[];
  onClose: () => void;
  onConfirmOverride: (pumpId: string, targetPumpId: string) => void;
}

export const RouteOverrideModal: React.FC<RouteOverrideModalProps> = ({
  pump,
  pumps,
  onClose,
  onConfirmOverride,
}) => {
  const [targetPumpId, setTargetPumpId] = useState<string>('PUMP-C');
  const [divertPct, setDivertPct] = useState<number>(65);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  if (!pump) return null;

  const targetPump = pumps.find((p) => p.id === targetPumpId) || pumps[2];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      onConfirmOverride(pump.id, targetPumpId);
      setIsApplying(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#192122] border border-[#00e5ff]/50 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-[#dce4e5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bac9cc] hover:text-[#c3f5ff] p-1 rounded-lg hover:bg-[#2e3638]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-[#3b494c]/40 pb-4">
          <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/50 flex items-center justify-center text-[#00e5ff]">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#00e5ff]">
              Hydraulic Flow Bypass Override
            </span>
            <h3 className="font-headline text-lg font-bold text-[#c3f5ff]">
              Reroute Hydraulic Flow: {pump.name}
            </h3>
          </div>
        </div>

        {/* Current Sump Status */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#242b2d] p-3 rounded-lg border border-[#ff5252]/40">
            <span className="text-[10px] text-[#bac9cc] font-mono-data uppercase">Source Sump (Critical)</span>
            <div className="text-sm font-bold text-[#dce4e5] mt-1">{pump.code}</div>
            <div className="text-xs text-[#ff5252] font-mono-data font-bold mt-0.5">
              Load: {pump.capacityPct}% ({pump.flowRateLps} L/s)
            </div>
            <div className="text-[10px] text-[#849396] mt-1">Backlog at {pump.nodeBackup}</div>
          </div>

          <div className="bg-[#242b2d] p-3 rounded-lg border border-[#00e5ff]/40">
            <span className="text-[10px] text-[#bac9cc] font-mono-data uppercase">Target Buffer Sump</span>
            <div className="text-sm font-bold text-[#dce4e5] mt-1">{targetPump.name}</div>
            <div className="text-xs text-[#00e5ff] font-mono-data font-bold mt-0.5">
              Current Headroom: {100 - targetPump.capacityPct}% (avail: {targetPump.maxFlowLps - targetPump.flowRateLps} L/s)
            </div>
            <div className="text-[10px] text-[#849396] mt-1">Direct conduit via Mathura Trunk</div>
          </div>
        </div>

        {/* Flow Divert Slider */}
        <div className="bg-[#242b2d] p-4 rounded-lg border border-[#3b494c]/50 mb-5">
          <div className="flex justify-between items-center text-xs mb-2 font-mono-data">
            <span className="text-[#bac9cc]">Diverted Discharge Volume:</span>
            <span className="text-[#00e5ff] font-bold text-sm">{divertPct}% ({Math.round(pump.flowRateLps * (divertPct / 100))} L/s)</span>
          </div>

          <input
            type="range"
            min={20}
            max={90}
            value={divertPct}
            onChange={(e) => setDivertPct(Number(e.target.value))}
            className="w-full h-2 bg-[#0d1516] rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
          />
          <div className="flex justify-between text-[10px] text-[#849396] font-mono-data mt-1">
            <span>20% (Conservative)</span>
            <span>65% (Recommended)</span>
            <span>90% (Maximum Relief)</span>
          </div>
        </div>

        {/* Target selection list */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#bac9cc] mb-2 font-mono-data">
            Select Alternate Drain Outlet
          </label>
          <div className="space-y-2">
            {pumps
              .filter((p) => p.id !== pump.id)
              .map((p) => (
                <div
                  key={p.id}
                  onClick={() => setTargetPumpId(p.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    targetPumpId === p.id
                      ? 'bg-[#00e5ff]/10 border-[#00e5ff]'
                      : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span className="font-medium text-[#dce4e5]">{p.name}</span>
                  </div>
                  <span className="font-mono-data text-[10px] text-[#bac9cc]">
                    Cap: {p.capacityPct}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#3b494c]/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-[#bac9cc] hover:bg-[#242b2d] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="px-5 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg bg-[#00e5ff] text-[#000000] hover:bg-[#9cf0ff] transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)] flex items-center gap-2"
          >
            {isApplying ? (
              <span>Actuating Sluice Valves...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Execute Hydraulic Bypass</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
