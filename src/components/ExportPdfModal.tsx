import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  CheckSquare, 
  Square, 
  FileText, 
  ShieldAlert, 
  Droplets, 
  Activity, 
  CloudRain, 
  Zap, 
  Building2, 
  Navigation, 
  Loader2, 
  Check, 
  DownloadCloud,
  Layers
} from 'lucide-react';
import { 
  IncidentAlert, 
  PumpStation, 
  SensorTelemetry, 
  ResponseUnit, 
  TimelineFrame 
} from '../types';
import { downloadPdfReport, PdfExportOptions } from '../services/pdfExportService';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: IncidentAlert[];
  pumps: PumpStation[];
  sensors: SensorTelemetry[];
  units: ResponseUnit[];
  timelineFrames: TimelineFrame[];
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  incidents,
  pumps,
  sensors,
  units,
  timelineFrames,
}) => {
  const [sections, setSections] = useState({
    executiveSummary: true,
    incidents: true,
    pumpsAndDrainage: true,
    historicalClimate: true,
    powerGrid: true,
    responseUnits: true,
    criticalInfra: true,
    evacuationRoutes: true,
  });

  const [agencyName, setAgencyName] = useState<string>('Delhi Municipal Emergency Operations Center (EOC)');
  const [reportTitle, setReportTitle] = useState<string>('MUNICIPAL FLOOD & HYDROLOGICAL INTELLIGENCE DOSSIER');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = (select: boolean) => {
    setSections({
      executiveSummary: select,
      incidents: select,
      pumpsAndDrainage: select,
      historicalClimate: select,
      powerGrid: select,
      responseUnits: select,
      criticalInfra: select,
      evacuationRoutes: select,
    });
  };

  const allSelected = Object.values(sections).every(Boolean);
  const selectedCount = Object.values(sections).filter(Boolean).length;

  const handleExport = (exportAll = false) => {
    setIsGenerating(true);
    setIsSuccess(false);

    const exportOptions: PdfExportOptions = exportAll
      ? {
          includeExecutiveSummary: true,
          includeIncidents: true,
          includePumpsAndDrainage: true,
          includeHistoricalClimate: true,
          includePowerGrid: true,
          includeResponseUnits: true,
          includeCriticalInfra: true,
          includeEvacuationRoutes: true,
          agencyName,
          reportTitle,
        }
      : {
          includeExecutiveSummary: sections.executiveSummary,
          includeIncidents: sections.incidents,
          includePumpsAndDrainage: sections.pumpsAndDrainage,
          includeHistoricalClimate: sections.historicalClimate,
          includePowerGrid: sections.powerGrid,
          includeResponseUnits: sections.responseUnits,
          includeCriticalInfra: sections.criticalInfra,
          includeEvacuationRoutes: sections.evacuationRoutes,
          agencyName,
          reportTitle,
        };

    setTimeout(() => {
      try {
        downloadPdfReport(
          incidents,
          pumps,
          sensors,
          units,
          timelineFrames,
          exportOptions
        );
        setIsGenerating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1200);
      } catch (err) {
        console.error('PDF generation error:', err);
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080f11]/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#192122] border border-[#3b494c] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-[#dce4e5] max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bac9cc] hover:text-[#c3f5ff] p-1.5 rounded-lg hover:bg-[#2e3638] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#3b494c]/50">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/20 to-[#0099b8]/30 border border-[#00e5ff]/50 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40 font-bold uppercase tracking-wider">
                DOCUMENT EXPORT ENGINE
              </span>
              <span className="text-xs text-[#849396] font-mono-data">Vector PDF • A4 Paginated</span>
            </div>
            <h3 className="font-headline text-xl font-black text-[#c3f5ff] mt-0.5 tracking-tight">
              Export Comprehensive Municipal Flood Report
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          {/* Quick Info Callout */}
          <div className="bg-[#131d1e] p-3.5 rounded-xl border border-[#00e5ff]/30 flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#00e5ff] shrink-0 mt-0.5" />
            <div className="text-[#bac9cc] leading-relaxed">
              Compile live telemetry, hydrodynamic flood forecasts, emergency triage registers, SCADA drainage telemetry, 33-year climatology archives, and power grid vulnerabilities into an official PDF document.
            </div>
          </div>

          {/* Report Metadata Configuration */}
          <div className="bg-[#242b2d] p-4 rounded-xl border border-[#3b494c]/40 space-y-3">
            <h4 className="text-[11px] font-bold text-[#c3f5ff] uppercase tracking-wider font-mono-data">
              Report Metadata & Agency Headers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#bac9cc] mb-1 font-mono-data">Report Document Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg px-2.5 py-1.5 text-xs text-[#dce4e5] focus:outline-none focus:border-[#00e5ff] font-mono-data"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#bac9cc] mb-1 font-mono-data">Issuing Agency / Department</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-[#0d1516] border border-[#3b494c] rounded-lg px-2.5 py-1.5 text-xs text-[#dce4e5] focus:outline-none focus:border-[#00e5ff] font-mono-data"
                />
              </div>
            </div>
          </div>

          {/* Section Selection Checklist */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#c3f5ff] uppercase tracking-wider font-mono-data">
                  Dataset Sections to Include ({selectedCount}/8)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectAll(!allSelected)}
                className="text-[11px] font-mono-data text-[#00e5ff] hover:text-[#9cf0ff] underline cursor-pointer"
              >
                {allSelected ? 'Deselect All' : 'Select All Sections'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Section 1 */}
              <div
                onClick={() => toggleSection('executiveSummary')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.executiveSummary
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#00e5ff]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">1. Executive Summary</div>
                    <div className="text-[10px] text-[#849396]">River Yamuna gauge & key indicators</div>
                  </div>
                </div>
                {sections.executiveSummary ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 2 */}
              <div
                onClick={() => toggleSection('incidents')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.incidents
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#ff5252]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">2. Active Incidents Triage</div>
                    <div className="text-[10px] text-[#849396]">{incidents.length} Hotspots & action items</div>
                  </div>
                </div>
                {sections.incidents ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 3 */}
              <div
                onClick={() => toggleSection('pumpsAndDrainage')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.pumpsAndDrainage
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-[#00e5ff]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">3. SCADA Pumping & Siphons</div>
                    <div className="text-[10px] text-[#849396]">6 Outfall stations & 5 trunk nodes</div>
                  </div>
                </div>
                {sections.pumpsAndDrainage ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 4 */}
              <div
                onClick={() => toggleSection('historicalClimate')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.historicalClimate
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CloudRain className="w-4 h-4 text-[#00daf3]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">4. Historical Climate (1990-2022)</div>
                    <div className="text-[10px] text-[#849396]">Extreme rain records & climatology</div>
                  </div>
                </div>
                {sections.historicalClimate ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 5 */}
              <div
                onClick={() => toggleSection('responseUnits')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.responseUnits
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#00e5ff]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">5. Emergency Fleet & Crews</div>
                    <div className="text-[10px] text-[#849396]">{units.length} Tactical response units</div>
                  </div>
                </div>
                {sections.responseUnits ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 6 */}
              <div
                onClick={() => toggleSection('powerGrid')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.powerGrid
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#fec931]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">6. Urban Zones & Power Grid</div>
                    <div className="text-[10px] text-[#849396]">Substation load & drain capacity</div>
                  </div>
                </div>
                {sections.powerGrid ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 7 */}
              <div
                onClick={() => toggleSection('criticalInfra')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.criticalInfra
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#00e5ff]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">7. Critical Infrastructure</div>
                    <div className="text-[10px] text-[#849396]">Hospitals, metro, flood walls</div>
                  </div>
                </div>
                {sections.criticalInfra ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>

              {/* Section 8 */}
              <div
                onClick={() => toggleSection('evacuationRoutes')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  sections.evacuationRoutes
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-[#242b2d]/50 border-[#3b494c]/40 hover:border-[#849396]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-[#10b981]" />
                  <div>
                    <div className="font-bold text-[#dce4e5]">8. Evacuation Corridors</div>
                    <div className="text-[10px] text-[#849396]">Safe routes & traffic relief</div>
                  </div>
                </div>
                {sections.evacuationRoutes ? (
                  <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                ) : (
                  <Square className="w-4 h-4 text-[#849396]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-5 mt-4 border-t border-[#3b494c]/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-[#bac9cc] hover:bg-[#242b2d] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExport(true)}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold font-mono-data rounded-lg bg-[#242b2d] hover:bg-[#2e3638] text-[#00e5ff] border border-[#00e5ff]/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export all data sections immediately"
            >
              <DownloadCloud className="w-4 h-4 text-[#00e5ff]" />
              <span>Export All Website Data</span>
            </button>

            <button
              onClick={() => handleExport(false)}
              disabled={isGenerating || selectedCount === 0}
              className="px-5 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg bg-[#00e5ff] text-[#000000] hover:bg-[#9cf0ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Generate PDF ({selectedCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
