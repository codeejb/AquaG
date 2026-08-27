import React, { useState } from 'react';
import { IncidentAlert, ResponseUnit } from '../types';
import { ShieldAlert, Truck, Anchor, Activity, Clock, MapPin, CheckCircle, X } from 'lucide-react';

interface DispatchModalProps {
  incident: IncidentAlert | null;
  units: ResponseUnit[];
  onClose: () => void;
  onConfirmDispatch: (incidentId: string, unitId: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  incident,
  units,
  onClose,
  onConfirmDispatch,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || '');
  const [priorityNote, setPriorityNote] = useState<string>('Immediate high-water barrier deployment & traffic diversion.');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  if (!incident) return null;

  const handleDispatch = () => {
    setIsDeploying(true);
    setTimeout(() => {
      onConfirmDispatch(incident.id, selectedUnitId);
      setIsDeploying(false);
      onClose();
    }, 800);
  };

  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#192122] border border-[#ff5252]/50 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-[#dce4e5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bac9cc] hover:text-[#c3f5ff] p-1 rounded-lg hover:bg-[#2e3638]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-[#3b494c]/40 pb-4">
          <div className="w-10 h-10 rounded-lg bg-[#93000a]/40 border border-[#ff5252]/60 flex items-center justify-center text-[#ff5252]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#ffb4ab]">
              Tactical Quick Response Dispatch
            </span>
            <h3 className="font-headline text-lg font-bold text-[#c3f5ff]">
              Deploy Units to {incident.title}
            </h3>
          </div>
        </div>

        {/* Incident Summary Card */}
        <div className="bg-[#242b2d] p-3.5 rounded-lg border border-[#3b494c]/50 mb-5">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-[#bac9cc] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00e5ff]" />
              {incident.location}
            </span>
            <span className="font-mono-data text-[#ff5252] font-bold">
              Depth: {incident.depthCm}cm
            </span>
          </div>
          <p className="text-xs text-[#bac9cc] leading-relaxed">
            {incident.description}
          </p>
        </div>

        {/* Response Unit Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#bac9cc] mb-2 font-mono-data">
            Available Emergency Units
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {units.map((unit) => {
              const isSelected = unit.id === selectedUnitId;
              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#00e5ff]/10 border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                      : 'bg-[#242b2d]/60 border-[#3b494c]/50 hover:border-[#849396]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {unit.type === 'HIGH_CAP_PUMP' ? (
                      <Activity className="w-4 h-4 text-[#00e5ff]" />
                    ) : unit.type === 'EVAC_BOAT' ? (
                      <Anchor className="w-4 h-4 text-[#00e5ff]" />
                    ) : (
                      <Truck className="w-4 h-4 text-[#00e5ff]" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#dce4e5]">{unit.name}</div>
                      <div className="text-[10px] text-[#bac9cc]">
                        Personnel: {unit.personnel} • Type: {unit.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[#2e3638] text-[#c3f5ff] border border-[#3b494c]">
                      {unit.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Instructions */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#bac9cc] mb-1.5 font-mono-data">
            Mission Directives & Radio Callout
          </label>
          <textarea
            value={priorityNote}
            onChange={(e) => setPriorityNote(e.target.value)}
            rows={2}
            className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2.5 text-xs text-[#dce4e5] focus:outline-none focus:border-[#00e5ff] font-mono-data"
          />
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
            onClick={handleDispatch}
            disabled={isDeploying}
            className="px-5 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg bg-[#ff5252] text-[#000000] hover:bg-[#ff7676] transition-all shadow-[0_0_12px_rgba(255,82,82,0.4)] flex items-center gap-2"
          >
            {isDeploying ? (
              <span>Transmitting Order...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Deployment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
