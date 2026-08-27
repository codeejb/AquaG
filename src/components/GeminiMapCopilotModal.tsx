import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Loader2, 
  Droplets, 
  Navigation, 
  Radio, 
  SlidersHorizontal 
} from 'lucide-react';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  runGeminiFloodAssessment, 
  FloodAiAnalysisResult 
} from '../services/geminiFloodAdvisor';
import { IncidentAlert, TimelineFrame, PumpStation } from '../types';

interface GeminiMapCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIncident?: IncidentAlert | null;
  currentFrame?: TimelineFrame;
  pumps?: PumpStation[];
}

export const GeminiMapCopilotModal: React.FC<GeminiMapCopilotModalProps> = ({
  isOpen,
  onClose,
  selectedIncident,
  currentFrame,
  pumps,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FloodAiAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = getGeminiApiKey();
    setApiKey(key || 'cb1_2ake_1_a1a4e005a56a759aedc49f88');
    setIsKeySaved(true);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const keyToSave = apiKey.trim() || 'cb1_2ake_1_a1a4e005a56a759aedc49f88';
    setGeminiApiKey(keyToSave);
    setApiKey(keyToSave);
    setIsKeySaved(true);
    setError(null);
  };

  const handleRunAssessment = async (customPrompt?: string) => {
    const activeKey = apiKey.trim() || getGeminiApiKey() || 'Feescb1_2ake_1_a1a4e005a56a759aedc49f88';
    setLoading(true);
    setError(null);

    try {
      const assessment = await runGeminiFloodAssessment({
        incident: selectedIncident || undefined,
        timelineFrame: currentFrame,
        pumps: pumps,
        userQuery: customPrompt || query || 'Evaluate current waterlogging risks and provide tactical dewatering and evacuation guidance.',
        waterDepthCm: selectedIncident?.depthCm || currentFrame?.maxDepthCm || 58,
        rainfallRateMmHr: currentFrame?.rainRateMmHr || 48,
        exposedPopulation: selectedIncident?.popAtRisk || currentFrame?.popAtRisk || 24680,
        locationName: selectedIncident?.location || 'Central Delhi Floodplain Corridor',
      }, apiKey);

      setResult(assessment);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate assessment. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/85 backdrop-blur-md animate-in fade-in text-[#dce4e5]">
      <div className="bg-[#192122] border border-[#3b494c] rounded-xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#3b494c]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-lg font-bold text-[#c3f5ff]">
                  Gemini AI Hydro Copilot
                </h3>
                <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40 font-bold">
                  GEMINI 2.5
                </span>
              </div>
              <span className="text-xs text-[#849396] font-mono-data">
                Real-time Flood GIS Incident Decision Intelligence
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#bac9cc] hover:text-[#c3f5ff] p-1.5 rounded-lg hover:bg-[#242b2d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* API Key Configuration Bar */}
          <div className="bg-[#242b2d] p-3.5 rounded-lg border border-[#3b494c]/40 space-y-2">
            <div className="flex justify-between items-center text-[#bac9cc]">
              <label className="font-bold text-[11px] flex items-center gap-1.5 text-[#c3f5ff]">
                <Key className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Google Gemini API Key</span>
              </label>
              {isKeySaved && (
                <span className="text-[10px] text-[#10b981] font-mono-data flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>API Key Configured</span>
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter AIzaSy... Gemini API Key"
                className="flex-1 bg-[#0d1516] border border-[#3b494c] rounded-lg px-3 py-1.5 font-mono-data text-xs text-[#dce4e5] focus:border-[#00e5ff] focus:outline-none"
              />
              <button
                onClick={handleSaveKey}
                className="bg-[#00e5ff] hover:bg-[#9cf0ff] text-black font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                Save Key
              </button>
            </div>
            <p className="text-[10px] text-[#849396]">
              Your key is saved locally in your browser to power live GIS situation analysis, evacuation modeling, and telemetry synthesis.
            </p>
          </div>

          {/* Context Banner */}
          {selectedIncident && (
            <div className="bg-[#0d1516] p-3 rounded-lg border border-[#00e5ff]/30 flex justify-between items-center font-mono-data">
              <div>
                <span className="text-[10px] text-[#00e5ff] font-bold">TARGET INCIDENT</span>
                <div className="font-bold text-[#c3f5ff] text-xs">{selectedIncident.title}</div>
                <div className="text-[10px] text-[#849396]">{selectedIncident.location} • {selectedIncident.depthCm} cm depth</div>
              </div>
              <button
                onClick={() => handleRunAssessment(`Analyze immediate critical threat for ${selectedIncident.title} with water depth ${selectedIncident.depthCm}cm`)}
                disabled={loading}
                className="bg-[#00e5ff]/15 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/40 text-xs px-3 py-1.5 rounded font-bold transition-all"
              >
                Triage Incident
              </button>
            </div>
          )}

          {/* Quick Prompt Presets */}
          <div>
            <span className="text-[10px] font-mono-data text-[#849396] uppercase font-bold mb-1.5 block">
              Quick Tactical GIS Directives:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Forecast Okhla Sump pump surcharge & recommend bypass route',
                'Generate Ring Road & Minto Bridge evacuation corridor diversion',
                'Simulate 100mm cloudburst surge impact on Central Delhi culverts',
                'Synthesize multi-agency alert broadcast protocol for NDMA'
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setQuery(preset);
                    handleRunAssessment(preset);
                  }}
                  disabled={loading}
                  className="text-left p-2 rounded-lg bg-[#242b2d] hover:bg-[#2e3638] border border-[#3b494c]/30 text-[11px] text-[#bac9cc] hover:text-[#c3f5ff] transition-all flex items-start gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#00e5ff] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAssessment()}
              placeholder="Ask Gemini AI copilot for flood countermeasures or tactical instructions..."
              className="flex-1 bg-[#0d1516] border border-[#3b494c] rounded-lg px-3 py-2 text-xs text-[#dce4e5] focus:border-[#00e5ff] focus:outline-none font-sans"
            />
            <button
              onClick={() => handleRunAssessment()}
              disabled={loading}
              className="bg-[#00e5ff] hover:bg-[#9cf0ff] disabled:opacity-50 text-black font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{loading ? 'Analyzing...' : 'Generate'}</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#93000a]/20 border border-[#ff5252]/40 rounded-lg text-[#ffb4ab] text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Assessment Result Card */}
          {result && (
            <div className="bg-[#0d1516] p-4 rounded-xl border border-[#00e5ff]/50 space-y-3 shadow-xl animate-in fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-[#3b494c]/40 font-mono-data">
                <span className="text-[10px] text-[#00e5ff] font-bold">
                  AI TACTICAL DECISION BRIEFING
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  result.riskCategory === 'CRITICAL'
                    ? 'bg-[#ff5252]/20 text-[#ffb4ab] border border-[#ff5252]/50'
                    : 'bg-[#fec931]/20 text-[#ffeac0] border border-[#fec931]/50'
                }`}>
                  {result.riskCategory} RISK
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#c3f5ff] mb-1">Situational Summary:</h4>
                <p className="text-xs text-[#dce4e5] leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {result.actionProtocol?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#00e5ff] mb-1.5 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Immediate Action Protocol:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#bac9cc] pl-4 list-disc">
                    {result.actionProtocol.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.trafficDiversions?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#fec931] mb-1.5 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Traffic & Arterial Diversions:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#bac9cc] pl-4 list-disc">
                    {result.trafficDiversions.map((div, i) => (
                      <li key={i}>{div}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.pumpDirectives?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#00daf3] mb-1.5 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>SCADA Pump & Sluice Directives:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#bac9cc] pl-4 list-disc">
                    {result.pumpDirectives.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#3b494c]/30 flex justify-between items-center text-[10px] font-mono-data text-[#849396]">
          <span>SDK: @google/genai v2.4.0</span>
          <span>Engine: Google DeepMind Gemini</span>
        </div>
      </div>
    </div>
  );
};
