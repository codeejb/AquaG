import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Database, Radio, Check, X, Key, Sparkles, Moon, FileDown } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/geminiFloodAdvisor';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [criticalDepthThreshold, setCriticalDepthThreshold] = useState<number>(50);
  const [yamunaDangerLevel, setYamunaDangerLevel] = useState<number>(205.33);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [autoSluiceActuation, setAutoSluiceActuation] = useState<boolean>(true);
  const [capBroadcastEnabled, setCapBroadcastEnabled] = useState<boolean>(true);
  const [themeMode, setThemeMode] = useState<string>('dark');
  const [autoPdfDownload, setAutoPdfDownload] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    setGeminiKey(getGeminiApiKey());
  }, []);

  const handleSave = () => {
    setGeminiApiKey(geminiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#192122] border border-[#3b494c] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-[#dce4e5]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bac9cc] hover:text-[#c3f5ff] p-1 rounded-lg hover:bg-[#2e3638]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#3b494c]/40">
          <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
              Command System Configuration
            </h3>
            <span className="text-[10px] font-mono-data text-[#849396]">
              AquaG v4.2-EOC • Delhi Municipal GIS Node
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono-data">
          <div>
            <label className="block text-[#c3f5ff] font-bold mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>Google Gemini API Key (Flood AI Copilot)</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... API Key"
              className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2 text-[#dce4e5] focus:border-[#00e5ff] focus:outline-none"
            />
            <span className="text-[10px] text-[#849396] mt-1 block">
              Enables real-time AI hydraulic reasoning and tactical dispatch recommendations.
            </span>
          </div>

          <div>
            <label className="block text-[#bac9cc] mb-1">
              Critical Waterlogging Alert Depth Threshold (cm)
            </label>
            <input
              type="number"
              value={criticalDepthThreshold}
              onChange={(e) => setCriticalDepthThreshold(Number(e.target.value))}
              className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2 text-[#dce4e5] focus:border-[#00e5ff] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#bac9cc] mb-1">
              Yamuna River Danger Mark Datum (m MSL)
            </label>
            <input
              type="number"
              step="0.01"
              value={yamunaDangerLevel}
              onChange={(e) => setYamunaDangerLevel(Number(e.target.value))}
              className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg p-2 text-[#dce4e5] focus:border-[#00e5ff] focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-[#3b494c]/30 space-y-3">
            <div>
              <label className="block text-[#c3f5ff] font-bold mb-1 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Command Center Visual Theme</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    themeMode === 'dark'
                      ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff] font-bold'
                      : 'bg-[#0d1516] border-[#3b494c] text-[#bac9cc]'
                  }`}
                >
                  <span>Dark Command Matrix</span>
                  {themeMode === 'dark' && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('high-contrast')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    themeMode === 'high-contrast'
                      ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff] font-bold'
                      : 'bg-[#0d1516] border-[#3b494c] text-[#bac9cc]'
                  }`}
                >
                  <span>Cyber Neon Dark</span>
                  {themeMode === 'high-contrast' && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#dce4e5]">Automated Sluice Gate Actuation</span>
              <input
                type="checkbox"
                checked={autoSluiceActuation}
                onChange={(e) => setAutoSluiceActuation(e.target.checked)}
                className="form-checkbox text-[#00e5ff] bg-[#0d1516] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#dce4e5]">CAP Cell Broadcast Direct Relay</span>
              <input
                type="checkbox"
                checked={capBroadcastEnabled}
                onChange={(e) => setCapBroadcastEnabled(e.target.checked)}
                className="form-checkbox text-[#00e5ff] bg-[#0d1516] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#dce4e5]">Include AI Directives in Quick PDF Export</span>
              <input
                type="checkbox"
                checked={autoPdfDownload}
                onChange={(e) => setAutoPdfDownload(e.target.checked)}
                className="form-checkbox text-[#00e5ff] bg-[#0d1516] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-[#3b494c]/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-[#bac9cc] hover:bg-[#242b2d]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg bg-[#00e5ff] text-[#000000] hover:bg-[#9cf0ff] transition-all flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
