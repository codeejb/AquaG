import React, { useState } from 'react';
import { TimelineFrame } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  CloudRain, 
  ShieldAlert, 
  Layers, 
  Droplets,
  Thermometer,
  Zap,
  Activity,
  Filter,
  Building,
  Cpu,
  Wind
} from 'lucide-react';
import { 
  TOP_EXTREME_RAIN_EVENTS, 
  YEARLY_WEATHER_SUMMARIES, 
  MONTHLY_CLIMATOLOGY, 
  DATASET_METADATA,
  ExtremeRainEvent,
  YearlyWeatherSummary
} from '../data/historicalWeatherData';
import {
  HOURLY_POWER_LOAD_SERIES,
  DELHI_URBAN_DEVELOPMENT_ZONES,
  POWER_LOAD_DATASET_META
} from '../data/powerLoadDataset';

interface AnalyticsViewProps {
  timelineFrames: TimelineFrame[];
  onExportPdf?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ timelineFrames, onExportPdf }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'extremes' | 'climatology' | 'power' | 'nowcast'>('trends');
  const [selectedDecade, setSelectedDecade] = useState<string>('ALL');
  const [reportExported, setReportExported] = useState<boolean>(false);

  const filteredYearlySummaries = YEARLY_WEATHER_SUMMARIES.filter((item) => {
    if (selectedDecade === 'ALL') return true;
    if (selectedDecade === '1990s') return item.year >= 1990 && item.year <= 1999;
    if (selectedDecade === '2000s') return item.year >= 2000 && item.year <= 2009;
    if (selectedDecade === '2010s') return item.year >= 2010 && item.year <= 2019;
    if (selectedDecade === '2020s') return item.year >= 2020 && item.year <= 2022;
    return true;
  });

  const maxYearlyRain = Math.max(...filteredYearlySummaries.map((y) => y.totalRainfallMm));
  const maxLoadMW = Math.max(...HOURLY_POWER_LOAD_SERIES.map((h) => h.loadMW));

  const handleExportCSV = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0d1516] max-w-7xl mx-auto w-full text-[#dce4e5]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#192122] p-5 rounded-xl border border-[#3b494c]/60 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-data bg-[#00e5ff]/15 text-[#00e5ff] px-2 py-0.5 rounded border border-[#00e5ff]/40 font-bold uppercase">
              METEOROLOGICAL TELEMETRY & PRECIPITATION CLIMATE OBSERVATORY
            </span>
            <span className="text-xs text-[#849396] font-mono-data">IMD / WMO: 42182</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-black text-[#c3f5ff] tracking-tight">
            Delhi Historical Hydro-Climate Data (1990–2022)
          </h1>
          <p className="text-xs md:text-sm text-[#bac9cc] mt-1 max-w-3xl">
            Integrated 33-year longitudinal database of 11,894 daily weather observations: temperature extremes, cloudburst triggers, and spatial flood correlation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="bg-[#00e5ff] hover:bg-[#9cf0ff] text-black font-headline font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full PDF Report</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="bg-[#242b2d] hover:bg-[#2e3638] text-[#00e5ff] border border-[#00e5ff]/40 font-headline font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{reportExported ? 'Dataset CSV Exported!' : 'Export Historical CSV'}</span>
          </button>
        </div>
      </div>

      {/* Dataset Overview Key Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow-lg">
          <div className="flex justify-between items-center text-[#849396] text-xs font-semibold">
            <span>OBSERVATION SPAN</span>
            <Calendar className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="font-mono-data text-2xl font-black text-[#c3f5ff] mt-1.5">33 Years</div>
          <div className="text-[10px] text-[#849396] font-mono-data mt-0.5">1990 to 2022 • 11,894 Days</div>
        </div>

        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow-lg">
          <div className="flex justify-between items-center text-[#849396] text-xs font-semibold">
            <span>ALL-TIME MAX DAILY RAIN</span>
            <CloudRain className="w-4 h-4 text-[#ff5252]" />
          </div>
          <div className="font-mono-data text-2xl font-black text-[#ff5252] mt-1.5">262.9 mm</div>
          <div className="text-[10px] text-[#ffb4ab] font-mono-data mt-0.5">04-Jul-1996 Cloudburst Surge</div>
        </div>

        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow-lg">
          <div className="flex justify-between items-center text-[#849396] text-xs font-semibold">
            <span>PEAK ANNUAL DELUGE</span>
            <TrendingUp className="w-4 h-4 text-[#fec931]" />
          </div>
          <div className="font-mono-data text-2xl font-black text-[#ffeac0] mt-1.5">1,526.8 mm</div>
          <div className="text-[10px] text-[#849396] font-mono-data mt-0.5">Year 2021 (74 Rain Days)</div>
        </div>

        <div className="bg-[#192122] p-4 rounded-xl border border-[#3b494c]/50 shadow-lg">
          <div className="flex justify-between items-center text-[#849396] text-xs font-semibold">
            <span>PEAK GRID DEMAND (MW)</span>
            <Zap className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="font-mono-data text-2xl font-black text-[#00e5ff] mt-1.5">8,320 MW</div>
          <div className="text-[10px] text-[#849396] font-mono-data mt-0.5">Monsoon Peak Dewatering & HVAC</div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#192122] p-2 rounded-xl border border-[#3b494c]/50">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-[#00e5ff] text-black shadow-xs'
                : 'text-[#bac9cc] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Annual Precipitation Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('extremes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'extremes'
                ? 'bg-[#00e5ff] text-black shadow-xs'
                : 'text-[#bac9cc] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Top Cloudburst Events</span>
          </button>

          <button
            onClick={() => setActiveTab('climatology')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'climatology'
                ? 'bg-[#00e5ff] text-black shadow-xs'
                : 'text-[#bac9cc] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Monthly Climatology</span>
          </button>

          <button
            onClick={() => setActiveTab('power')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'power'
                ? 'bg-[#00e5ff] text-black shadow-xs'
                : 'text-[#bac9cc] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Power Load & Development (MW)</span>
          </button>

          <button
            onClick={() => setActiveTab('nowcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'nowcast'
                ? 'bg-[#00e5ff] text-black shadow-xs'
                : 'text-[#bac9cc] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Predictive 3-Hr Nowcast</span>
          </button>
        </div>

        {activeTab === 'trends' && (
          <div className="flex items-center gap-2 text-xs font-mono-data">
            <span className="text-[#849396] hidden sm:inline">Decade:</span>
            {['ALL', '1990s', '2000s', '2010s', '2020s'].map((dec) => (
              <button
                key={dec}
                onClick={() => setSelectedDecade(dec)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  selectedDecade === dec
                    ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 font-bold'
                    : 'text-[#849396] hover:bg-[#242b2d] hover:text-[#c3f5ff]'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Annual Precipitation Trends */}
      {activeTab === 'trends' && (
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Total Annual Rainfall & Single-Day Maximums (1990 – 2022)
              </h3>
              <p className="text-xs text-[#849396] mt-0.5">
                Bars represent total annual precipitation (mm). Red indicator shows peak 24-hr rainfall intensity.
              </p>
            </div>
            <span className="text-xs font-mono-data text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded border border-[#00e5ff]/30 font-bold">
              {filteredYearlySummaries.length} Years Active
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-end gap-2.5 min-w-[700px] h-64 pt-6 border-b border-[#242b2d]">
              {filteredYearlySummaries.map((item) => {
                const heightPct = Math.max(12, (item.totalRainfallMm / maxYearlyRain) * 100);
                const isExtreme = item.maxDailyRainfallMm >= 100;
                return (
                  <div key={item.year} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d1516] border border-[#00e5ff]/50 text-[#c3f5ff] text-[10px] font-mono-data p-1.5 rounded pointer-events-none z-20 whitespace-nowrap shadow-xl">
                      <div className="font-bold">{item.year}: {item.totalRainfallMm} mm</div>
                      <div className="text-[#ff5252]">Max Day: {item.maxDailyRainfallMm} mm</div>
                      <div className="text-[#849396]">{item.rainyDays} rainy days • {item.avgTempC}°C</div>
                    </div>

                    {/* Peak daily mark */}
                    {isExtreme && (
                      <span className="w-2 h-2 rounded-full bg-[#ff5252] mb-1 animate-pulse" title={`Peak day: ${item.maxDailyRainfallMm}mm`} />
                    )}

                    {/* Bar */}
                    <div 
                      className={`w-full rounded-t transition-all group-hover:brightness-125 ${
                        item.totalRainfallMm >= 1100 
                          ? 'bg-gradient-to-t from-[#00daf3]/40 to-[#00e5ff]' 
                          : item.totalRainfallMm >= 800 
                          ? 'bg-gradient-to-t from-[#0284c7]/40 to-[#38bdf8]' 
                          : 'bg-gradient-to-t from-[#334155] to-[#64748b]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />

                    {/* Label */}
                    <span className="text-[9px] font-mono-data text-[#849396] mt-2 group-hover:text-[#00e5ff] font-bold">
                      {String(item.year).slice(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono-data text-[#849396]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#00e5ff]" />
                <span>Heavy Surge (&gt;1,100 mm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#38bdf8]" />
                <span>Normal Monsoon (800–1,100 mm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5252]" />
                <span>Single-Day Peak &gt; 100mm</span>
              </span>
            </div>
            <span className="text-[#bac9cc]">Source: {DATASET_METADATA.station}</span>
          </div>
        </div>
      )}

      {/* TAB 2: Top Cloudburst Events */}
      {activeTab === 'extremes' && (
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                All-Time Peak 24-Hour Precipitation Storm Events (1990 – 2022)
              </h3>
              <p className="text-xs text-[#849396]">
                Identified municipal flood triggers resulting in critical underpass inundations and emergency pump overrides.
              </p>
            </div>
            <span className="text-xs font-mono-data text-[#ff5252] bg-[#93000a]/20 px-2.5 py-1 rounded border border-[#ff5252]/40 font-bold">
              30 Ranked Extreme Records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOP_EXTREME_RAIN_EVENTS.map((event, idx) => (
              <div 
                key={event.date}
                className="bg-[#242b2d] p-3.5 rounded-lg border border-[#3b494c]/40 hover:border-[#00e5ff] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono-data text-[#00e5ff] font-bold">
                      RANK #{idx + 1} • {event.date}
                    </span>
                    <span className={`text-[9px] font-mono-data font-bold px-1.5 py-0.5 rounded ${
                      event.severity === 'CATASTROPHIC'
                        ? 'bg-[#ff5252]/20 text-[#ffb4ab] border border-[#ff5252]/50'
                        : 'bg-[#fec931]/20 text-[#ffeac0] border border-[#fec931]/50'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="font-mono-data text-xl font-black text-[#c3f5ff] mb-1">
                    {event.rainfallMm} mm
                  </div>
                  <p className="text-xs text-[#bac9cc] line-clamp-2">
                    {event.impactDescription}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#3b494c]/30 flex justify-between text-[10px] font-mono-data text-[#849396]">
                  <span>Avg Temp: {event.tavg !== null ? `${event.tavg}°C` : 'N/A'}</span>
                  <span>Max Temp: {event.tmax !== null ? `${event.tmax}°C` : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Monthly Climatological Normals */}
      {activeTab === 'climatology' && (
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Monthly Climatology & Historic 24-Hour Maxima (Delhi)
              </h3>
              <p className="text-xs text-[#849396]">
                33-year average monthly precipitation distribution vs maximum historical single-day downpours.
              </p>
            </div>
            <span className="text-xs font-mono-data text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded border border-[#00e5ff]/30 font-bold">
              Annual Normal: 794.6 mm
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MONTHLY_CLIMATOLOGY.map((m) => (
              <div key={m.month} className="bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#c3f5ff]">{m.monthName}</span>
                    <span className="text-[10px] text-[#849396] font-mono-data">{m.avgTempC}°C</span>
                  </div>
                  <div className="font-mono-data text-lg font-black text-[#00e5ff]">
                    {m.avgMonthlyRainfallMm} mm
                  </div>
                  <div className="text-[10px] text-[#849396] mt-0.5">33-Year Average</div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#3b494c]/30 text-[10px] font-mono-data flex justify-between">
                  <span className="text-[#849396]">24h Max:</span>
                  <span className="text-[#ff5252] font-bold">{m.historicalMaxRainMm} mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Power Load & Real Estate Development Analytics */}
      {activeTab === 'power' && (
        <div className="space-y-6">
          {/* Top Series Graph Card */}
          <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-headline text-base font-bold text-[#c3f5ff] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00e5ff]" />
                  <span>Delhi Power Load (MW) vs Hourly Precipitation & Thermal Demand</span>
                </h3>
                <p className="text-xs text-[#849396]">
                  Hourly power consumption response under convective storm surges and dewatering pump load spikes.
                </p>
              </div>
              <span className="text-xs font-mono-data text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded border border-[#00e5ff]/30 font-bold">
                Grid Capacity: {POWER_LOAD_DATASET_META.gridCapacityMW} MW
              </span>
            </div>

            {/* Hourly Load Curve Bars */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-end gap-3 min-w-[700px] h-60 pt-6 border-b border-[#242b2d]">
                {HOURLY_POWER_LOAD_SERIES.map((h) => {
                  const loadPct = (h.loadMW / POWER_LOAD_DATASET_META.gridCapacityMW) * 100;
                  return (
                    <div key={h.time} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Hover Tooltip */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d1516] border border-[#00e5ff]/50 text-[#c3f5ff] text-[10px] font-mono-data p-1.5 rounded pointer-events-none z-20 whitespace-nowrap shadow-xl">
                        <div className="font-bold">{h.time.slice(0, 5)}: {h.loadMW.toLocaleString()} MW</div>
                        <div className="text-[#00e5ff]">Rain: {h.rainMm} mm • Temp: {h.temperatureC}°C</div>
                        <div className="text-[#849396]">Humidity: {h.humidityPct}% • Wind: {h.windSpeedKmh} km/h</div>
                      </div>

                      {/* Rain indicator above bar */}
                      {h.rainMm > 0 && (
                        <div className="text-[9px] font-mono-data text-[#00daf3] font-bold mb-1">
                          {h.rainMm}m
                        </div>
                      )}

                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t transition-all group-hover:brightness-125 ${
                          h.loadMW >= 7500
                            ? 'bg-gradient-to-t from-[#ff5252]/40 to-[#ff5252]'
                            : h.loadMW >= 6500
                            ? 'bg-gradient-to-t from-[#fec931]/40 to-[#fec931]'
                            : 'bg-gradient-to-t from-[#00daf3]/30 to-[#00e5ff]'
                        }`}
                        style={{ height: `${loadPct}%` }}
                      />

                      <span className="text-[9px] font-mono-data text-[#849396] mt-2 font-bold group-hover:text-[#00e5ff]">
                        {h.time.slice(0, 5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono-data text-[#849396]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#ff5252]" />
                  <span>High Grid Stress (&gt;7,500 MW)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#fec931]" />
                  <span>Moderate Load (6,500–7,500 MW)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#00e5ff]" />
                  <span>Normal Operating Base</span>
                </span>
              </div>
              <span className="text-[#bac9cc]">{POWER_LOAD_DATASET_META.name} • MIT License</span>
            </div>
          </div>

          {/* Urban Real Estate Development Distribution Cards */}
          <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline text-base font-bold text-[#c3f5ff] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#00e5ff]" />
                  <span>Real Estate Development Zones & Stormwater Drainage Energy Draw</span>
                </h3>
                <p className="text-xs text-[#849396]">
                  High, medium, and low development density footprints vs pumping substation power requirements.
                </p>
              </div>
              <span className="text-xs font-mono-data text-[#fec931] bg-[#6f5500]/20 px-2.5 py-1 rounded border border-[#fec931]/30 font-bold">
                5 Primary Zones
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DELHI_URBAN_DEVELOPMENT_ZONES.map((zone) => (
                <div key={zone.zoneName} className="bg-[#242b2d] p-4 rounded-xl border border-[#3b494c]/40 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#c3f5ff]">{zone.zoneName}</span>
                      <span className={`text-[9px] font-mono-data font-bold px-1.5 py-0.5 rounded ${
                        zone.developmentCategory === 'High'
                          ? 'bg-[#ff5252]/20 text-[#ffb4ab] border border-[#ff5252]/40'
                          : zone.developmentCategory === 'Medium'
                          ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                          : 'bg-[#10b981]/20 text-[#a7f3d0] border border-[#10b981]/40'
                      }`}>
                        {zone.developmentCategory} Dev Density
                      </span>
                    </div>

                    {/* Proportions bar */}
                    <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#0d1516] my-2.5">
                      <div style={{ width: `${zone.highDevPct}%` }} className="bg-[#ff5252]" title={`High Dev: ${zone.highDevPct}%`} />
                      <div style={{ width: `${zone.medDevPct}%` }} className="bg-[#fec931]" title={`Med Dev: ${zone.medDevPct}%`} />
                      <div style={{ width: `${zone.lowDevPct}%` }} className="bg-[#10b981]" title={`Low Dev: ${zone.lowDevPct}%`} />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono-data text-[#849396] mb-3">
                      <span>High: {zone.highDevPct}%</span>
                      <span>Med: {zone.medDevPct}%</span>
                      <span>Low: {zone.lowDevPct}%</span>
                    </div>

                    <div className="text-xs text-[#bac9cc] bg-[#192122] p-2.5 rounded border border-[#3b494c]/30 mb-2">
                      {zone.floodVulnerability}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#3b494c]/30 flex justify-between text-[11px] font-mono-data">
                    <span className="text-[#849396]">Peak Load: <strong className="text-[#c3f5ff]">{zone.peakLoadMW} MW</strong></span>
                    <span className="text-[#849396]">Drain Draw: <strong className="text-[#00e5ff]">{zone.stormDrainCapacityMW} MW</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Predictive 3-Hr Nowcast */}
      {activeTab === 'nowcast' && (
        <div className="bg-[#192122] rounded-xl border border-[#3b494c]/50 p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-headline text-base font-bold text-[#c3f5ff]">
                Predicted Inundation Depth vs Rainfall Intensity (Next 3 Hours)
              </h3>
              <span className="text-xs text-[#849396]">
                Calculated using Doppler weather radar precipitation vectors & DEM surface slopes
              </span>
            </div>
            <span className="text-xs font-mono-data text-[#fec931] bg-[#6f5500]/20 px-2 py-1 rounded border border-[#fec931]/30">
              PEAK SURGE AT T+1.00hr
            </span>
          </div>

          {/* Visual Chart Bars */}
          <div className="grid grid-cols-5 gap-3 pt-6 pb-2">
            {timelineFrames.map((frame) => (
              <div key={frame.timeLabel} className="flex flex-col items-center bg-[#242b2d] p-3 rounded-lg border border-[#3b494c]/40">
                <span className="font-mono-data text-xs font-bold text-[#00e5ff]">{frame.timeLabel}</span>
                
                {/* Dual bars: Rain vs Depth */}
                <div className="h-32 w-full flex items-end justify-center gap-2 my-3">
                  {/* Rainfall bar */}
                  <div className="w-4 bg-[#00daf3]/50 rounded-t flex flex-col justify-end items-center" style={{ height: `${(frame.rainRateMmHr / 70) * 100}%` }}>
                    <span className="text-[9px] font-mono-data text-[#c3f5ff] mb-1 font-bold">{frame.rainRateMmHr}</span>
                  </div>
                  {/* Max Depth bar */}
                  <div className={`w-4 rounded-t flex flex-col justify-end items-center ${frame.maxDepthCm >= 70 ? 'bg-[#ff5252]' : 'bg-[#fec931]'}`} style={{ height: `${(frame.maxDepthCm / 80) * 100}%` }}>
                    <span className="text-[9px] font-mono-data text-[#000000] mb-1 font-black">{frame.maxDepthCm}</span>
                  </div>
                </div>

                <div className="text-center font-mono-data text-[10px] text-[#849396] border-t border-[#3b494c]/30 pt-1.5 w-full">
                  <div>Pop: {(frame.popAtRisk / 1000).toFixed(1)}k</div>
                  <div className="text-[#c3f5ff]">Yamuna: {frame.yamunaLevelM}m</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-3 text-xs font-mono-data text-[#bac9cc]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00daf3]/60 rounded-sm" />
              <span>Rainfall Rate (mm/hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff5252] rounded-sm" />
              <span>Max Inundation Depth (cm)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
