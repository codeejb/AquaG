import React from 'react';
import { SensorTelemetry } from '../types';
import { Radio, Battery, Activity, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface TelemetryDrawerProps {
  sensors: SensorTelemetry[];
  onClose: () => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({ sensors, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#080f11]/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#192122] border-l border-[#3b494c] w-full max-w-md h-full p-5 shadow-2xl flex flex-col justify-between text-[#dce4e5]">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-[#3b494c]/40 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                  IoT Telemetry Sensor Matrix
                </h3>
                <span className="text-[10px] font-mono-data text-[#bac9cc]">
                  142/145 Nodes Reporting • 98.2% Health
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#bac9cc] hover:text-[#c3f5ff] p-1.5 rounded-lg hover:bg-[#2e3638]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sensor List */}
          <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="bg-[#242b2d] p-3.5 rounded-lg border border-[#3b494c]/40 hover:border-[#00e5ff] transition-all"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="font-mono-data text-[10px] text-[#00e5ff] font-bold">
                      {sensor.id}
                    </span>
                    <h4 className="text-xs font-bold text-[#dce4e5]">{sensor.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-[#00daf3]/20 text-[#00e5ff] border border-[#00e5ff]/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {sensor.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#bac9cc] mb-2">{sensor.location}</div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono-data bg-[#192122] p-2 rounded border border-[#3b494c]/30">
                  <div>
                    <span className="text-[#849396] block">READING</span>
                    <span className="text-sm font-bold text-[#fec931]">{sensor.value} {sensor.unit}</span>
                  </div>
                  <div>
                    <span className="text-[#849396] block">BATTERY</span>
                    <span className="text-xs font-bold text-[#dce4e5] flex items-center gap-1">
                      <Battery className="w-3 h-3 text-[#00e5ff]" />
                      {sensor.batteryPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#849396] block">LAST PING</span>
                    <span className="text-xs text-[#849396]">{sensor.lastPing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#3b494c]/30">
          <button
            onClick={onClose}
            className="w-full bg-[#242b2d] hover:bg-[#2e3638] text-[#c3f5ff] text-xs font-semibold py-2 rounded-lg border border-[#3b494c]"
          >
            Close Telemetry Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
