import React, { useState } from 'react';
import { IncidentAlert } from '../types';
import { AlertTriangle, MapPin, Users, Droplets, Compass, ShieldCheck, X, Sparkles, Loader2, Radio, Navigation } from 'lucide-react';
import { runGeminiFloodAssessment, FloodAiAnalysisResult, getGeminiApiKey } from '../services/geminiFloodAdvisor';

interface IncidentDetailModalProps {
  incident: IncidentAlert | null;
  onClose: () => void;
  onDispatch: (incident: IncidentAlert) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onDispatch,
}) => {
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<FloodAiAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!incident) return null;

  const handleGenerateAiPlan = async () => {
    const key = getGeminiApiKey();
    if (!key) {
      setAiError('Gemini API Key missing. Please set your API Key in Settings or GIS Map Copilot.');
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await runGeminiFloodAssessment({
        incident: incident,
        locationName: incident.location,
        waterDepthCm: incident.depthCm,
        exposedPopulation: incident.popAtRisk,
        userQuery: `Generate tactical intervention plan for ${incident.title} at ${incident.location} with severity ${incident.severity}.`,
      });
      setAiResult(res);
    } catch (err: any) {
      setAiError(err?.message || 'Failed to generate AI plan.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#192122] border border-[#3b494c] rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-[#dce4e5] max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bac9cc] hover:text-[#c3f5ff] p-1 rounded-lg hover:bg-[#2e3638]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            incident.severity === 'CRITICAL' 
              ? 'bg-[#93000a]/40 text-[#ff5252] border border-[#ff5252]/60' 
              : 'bg-[#6f5500]/40 text-[#fec931] border border-[#fec931]/60'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded font-bold ${
                incident.severity === 'CRITICAL'
                  ? 'bg-[#ff5252]/20 text-[#ffb4ab] border border-[#ff5252]/50'
                  : 'bg-[#fec931]/20 text-[#ffeac0] border border-[#fec931]/50'
              }`}>
                {incident.severity}
              </span>
              <span className="text-xs text-[#849396] font-mono-data">{incident.id}</span>
              <span className="text-xs text-[#849396] font-mono-data">• {incident.timestamp}</span>
            </div>
            <h3 className="font-headline text-lg font-bold text-[#c3f5ff] mt-1">
              {incident.title}
            </h3>
            <div className="text-xs text-[#bac9cc] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>{incident.location} ({incident.zone})</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Bento Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40 text-center">
              <Droplets className="w-4 h-4 text-[#00e5ff] mx-auto mb-1" />
              <div className="text-[10px] text-[#bac9cc] uppercase font-mono-data">Water Depth</div>
              <div className="font-mono-data text-base font-bold text-[#fec931] mt-0.5">{incident.depthCm} cm</div>
            </div>

            <div className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40 text-center">
              <Users className="w-4 h-4 text-[#ff5252] mx-auto mb-1" />
              <div className="text-[10px] text-[#bac9cc] uppercase font-mono-data">Pop. Exposed</div>
              <div className="font-mono-data text-base font-bold text-[#dce4e5] mt-0.5">{incident.popAtRisk.toLocaleString()}</div>
            </div>

            <div className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40 text-center">
              <Compass className="w-4 h-4 text-[#00daf3] mx-auto mb-1" />
              <div className="text-[10px] text-[#bac9cc] uppercase font-mono-data">Evac Status</div>
              <div className="font-mono-data text-xs font-bold text-[#ffb4ab] mt-1">{incident.evacuationStatus}</div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="bg-[#242b2d]/60 p-4 rounded-lg border border-[#3b494c]/40">
            <h4 className="text-[11px] font-bold text-[#c3f5ff] uppercase tracking-wider mb-1.5 font-mono-data">
              Hydrometric Assessment
            </h4>
            <p className="text-xs text-[#bac9cc] leading-relaxed mb-3">
              {incident.description}
            </p>
            <div className="p-2.5 rounded bg-[#192122] border border-[#3b494c]/60 text-xs text-[#dce4e5]">
              <span className="font-bold text-[#00e5ff]">Action Required:</span> {incident.actionRequired}
            </div>
          </div>

          {/* AI Tactical Intelligence Result */}
          {aiResult && (
            <div className="p-4 rounded-lg bg-[#0d1516] border border-[#00e5ff]/50 space-y-2.5 animate-in fade-in">
              <div className="flex justify-between items-center text-[10px] font-mono-data text-[#00e5ff] font-bold pb-1.5 border-b border-[#3b494c]/40">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GEMINI AI INCIDENT DIRECTIVE</span>
                </span>
                <span className="text-[#fec931]">{aiResult.riskCategory}</span>
              </div>
              <p className="text-xs text-[#dce4e5] leading-relaxed">{aiResult.summary}</p>
              {aiResult.actionProtocol?.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-[#00e5ff] uppercase block mb-1">Priority Protocol:</span>
                  <ul className="list-disc pl-4 text-xs text-[#bac9cc] space-y-0.5">
                    {aiResult.actionProtocol.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {aiError && (
            <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ff5252]/40 text-xs text-[#ffb4ab]">
              {aiError}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center gap-2 pt-4 mt-3 border-t border-[#3b494c]/30">
          <button
            onClick={handleGenerateAiPlan}
            disabled={aiLoading}
            className="px-3.5 py-2 text-xs font-bold font-headline rounded-lg bg-[#00e5ff]/15 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{aiLoading ? 'Analyzing...' : 'AI Tactical Plan'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-lg text-[#bac9cc] hover:bg-[#242b2d] transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                onDispatch(incident);
              }}
              className="px-4 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg bg-[#ff5252] text-[#000000] hover:bg-[#ff7676] transition-all shadow-[0_0_12px_rgba(255,82,82,0.4)]"
            >
              Proceed to Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
