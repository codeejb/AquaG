import React, { useState } from 'react';
import { IncidentAlert, ResponseUnit } from '../types';
import { 
  AlertTriangle, 
  Send, 
  Radio, 
  ShieldAlert, 
  Filter, 
  CheckCircle, 
  Users, 
  MapPin, 
  Volume2,
  FileDown
} from 'lucide-react';

interface AlertsViewProps {
  incidents: IncidentAlert[];
  units: ResponseUnit[];
  onSelectIncident: (incident: IncidentAlert) => void;
  onDispatchUnit: (incident: IncidentAlert) => void;
  onExportPdf?: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  incidents,
  units,
  onSelectIncident,
  onDispatchUnit,
  onExportPdf,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('Central Delhi & Yamuna Basin');
  const [broadcastMsg, setBroadcastMsg] = useState<string>(
    'URGENT MUNICIPAL FLOOD ADVISORY: Flash waterlogging in Connaught Place Sec 4 and ITO Underpass. Divert vehicular traffic to Ring Road South. Emergency evacuation routes clear towards AIIMS corridor.'
  );
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0d1516] max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#192122] p-5 rounded-xl border border-[#3b494c]/60 shadow-xl">
        <div>
          <span className="text-[10px] font-mono-data bg-[#ff5252]/15 text-[#ffb4ab] px-2 py-0.5 rounded border border-[#ff5252]/40 font-bold uppercase">
            EMERGENCY INCIDENT COMMAND & CITIZEN ALERT BROADCASTER
          </span>
          <h1 className="font-headline text-2xl font-black text-[#c3f5ff] mt-1 tracking-tight">
            Active Flood Incidents & Tactical Triage
          </h1>
          <p className="text-xs md:text-sm text-[#bac9cc] mt-0.5">
            Real-time incident dispatch console, CAP emergency alert broadcasting, and multi-agency response unit tracking.
          </p>
        </div>

        {onExportPdf && (
          <button
            onClick={onExportPdf}
            className="bg-[#242b2d] hover:bg-[#2e3638] text-[#00e5ff] border border-[#00e5ff]/40 font-headline font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer shrink-0"
          >
            <FileDown className="w-4 h-4 text-[#00e5ff]" />
            <span>Export Incidents PDF</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incident Feed & Filters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between bg-[#192122] p-3 rounded-lg border border-[#3b494c]/40 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00e5ff]" />
              <span className="font-bold text-[#bac9cc]">Filter Severity:</span>
            </div>
            <div className="flex gap-1.5 font-mono-data text-[11px]">
              {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterSeverity === sev
                      ? 'bg-[#00e5ff] text-[#000000] font-bold'
                      : 'bg-[#242b2d] text-[#bac9cc] hover:bg-[#2e3638]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Cards */}
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 hover:border-[#00e5ff] transition-all cursor-pointer shadow group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      incident.severity === 'CRITICAL' ? 'bg-[#ff5252] pulse-dot' : 'bg-[#fec931]'
                    }`} />
                    <h4 className="text-sm font-bold text-[#dce4e5] font-headline group-hover:text-[#c3f5ff]">
                      {incident.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 font-mono-data">
                    <span className="text-xs text-[#849396]">{incident.timestamp}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      incident.severity === 'CRITICAL'
                        ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ff5252]/50'
                        : 'bg-[#6f5500]/40 text-[#fec931] border border-[#fec931]/50'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#bac9cc] flex items-center gap-1.5 mb-2 font-mono-data">
                  <MapPin className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>{incident.location} ({incident.zone})</span>
                </div>

                <p className="text-xs text-[#bac9cc] leading-relaxed mb-3">
                  {incident.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#3b494c]/30">
                  <div className="flex gap-4 font-mono-data text-xs">
                    <span className="text-[#fec931] font-bold">Depth: {incident.depthCm}cm</span>
                    <span className="text-[#dce4e5]">Pop. at Risk: {incident.popAtRisk.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDispatchUnit(incident);
                      }}
                      className="bg-[#ff5252] hover:bg-[#ff7676] text-[#000000] text-xs font-bold font-headline px-3 py-1.5 rounded uppercase transition-colors"
                    >
                      {incident.dispatched ? 'Unit Dispatched' : 'Dispatch Unit'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Emergency Public Warning Broadcaster */}
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-[#ff5252]" />
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Emergency Public Broadcast (CAP)
              </h3>
            </div>
            <p className="text-xs text-[#bac9cc] mb-4">
              Direct integration with NDMA Common Alerting Protocol, Emergency Cell Broadcast, and Delhi Police VMS gantries.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-[#849396] font-mono-data uppercase mb-1">
                  Target Geographic Perimeter
                </label>
                <input
                  type="text"
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2 text-xs text-[#dce4e5] focus:outline-none focus:border-[#00e5ff] font-mono-data"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#849396] font-mono-data uppercase mb-1">
                  Advisory Message (SMS / Siren Alert)
                </label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2.5 text-xs text-[#dce4e5] focus:outline-none focus:border-[#00e5ff] font-mono-data leading-relaxed"
                />
              </div>
            </div>

            {broadcastSent && (
              <div className="p-2.5 bg-[#00e5ff]/15 border border-[#00e5ff] rounded-lg text-xs text-[#c3f5ff] flex items-center gap-2 mb-3 font-mono-data">
                <CheckCircle className="w-4 h-4 text-[#00e5ff]" />
                <span>Broadcast disseminated to 140,000+ active mobile cells!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSendBroadcast}
            className="w-full bg-[#ff5252] hover:bg-[#ff7676] text-[#000000] font-headline font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-[0_0_12px_rgba(255,82,82,0.4)] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Transmit Emergency Broadcast</span>
          </button>
        </div>
      </div>
    </div>
  );
};
