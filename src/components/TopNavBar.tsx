import React, { useState } from 'react';
import { TabType } from '../types';
import { 
  Map as MapIcon, 
  Droplets, 
  ShieldAlert, 
  TrendingUp, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  User, 
  Search, 
  Activity,
  X,
  FileDown,
  Moon
} from 'lucide-react';

interface TopNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  liveTime: string;
  criticalAlertCount: number;
  onOpenTelemetry?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenExportPdf?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  liveTime,
  criticalAlertCount,
  onOpenTelemetry,
  onOpenNotifications,
  onOpenSettings,
  onOpenExportPdf,
}) => {
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Meaningful, high-utility working navigation tabs
  const navTabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'map', label: 'Flood GIS Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'drainage', label: 'Drainage & SCADA', icon: <Droplets className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts & Triage', icon: <ShieldAlert className="w-4 h-4" />, badge: criticalAlertCount },
    { id: 'analytics', label: 'Hydro Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'dashboards', label: 'Command Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin GIS', icon: <Settings className="w-4 h-4" /> },
  ];

  const quickLocations = [
    { name: 'ITO Underpass Junction', type: 'Severe Waterlogging', tab: 'map' as TabType },
    { name: 'Yamuna Bazar Pushta Outfall', type: 'River Surge Area', tab: 'map' as TabType },
    { name: 'Okhla Sump Pumping Facility (PUMP-A)', type: 'SCADA Station', tab: 'drainage' as TabType },
    { name: 'Minto Road Railway Bridge', type: 'Critical Underpass', tab: 'alerts' as TabType },
    { name: 'LNJP Hospital Drainage Siphon', type: 'Critical Infrastructure', tab: 'map' as TabType },
    { name: 'Sarai Kale Khan Floodplain Relief', type: 'Evacuation Zone', tab: 'analytics' as TabType },
  ];

  const filteredLocations = quickLocations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="flex justify-between items-center px-4 md:px-6 h-14 w-full z-50 bg-[#131d1e] border-b border-[#242b2d] shadow-lg sticky top-0 text-[#dce4e5] select-none">
      {/* Brand Logo matching dark command center */}
      <div className="flex items-center gap-5 lg:gap-7">
        <div 
          onClick={() => setActiveTab('map')}
          className="cursor-pointer flex items-center gap-2 font-bold text-lg text-[#c3f5ff] tracking-tight hover:opacity-90 transition-opacity"
        >
          {/* Cyan circular wave logo */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-[#00e5ff] flex items-center justify-center text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            <Droplets className="w-4 h-4 text-black" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[#c3f5ff] font-black text-lg tracking-tight font-sans">Aqua</span>
            <span className="text-[#00e5ff] font-black text-lg tracking-tight font-sans">G</span>
            <span className="ml-1.5 text-[9px] font-mono font-bold bg-[#00e5ff]/15 text-[#00e5ff] px-1.5 py-0.5 rounded border border-[#00e5ff]/40 uppercase tracking-wider">
              GIS 4.2
            </span>
          </div>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navTabs.map((tab) => {
            const isSelected = 
              activeTab === tab.id || 
              (tab.id === 'map' && activeTab === 'intelligence') || 
              (tab.id === 'dashboards' && activeTab === 'dashboard');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 rounded-md ${
                  isSelected
                    ? 'text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                    : 'text-[#bac9cc] hover:text-[#c3f5ff] hover:bg-[#192122]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#ff5252] text-white rounded-full font-bold shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Utility & Operational Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Search */}
        <button 
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#bac9cc] bg-[#192122] hover:bg-[#242b2d] hover:text-[#c3f5ff] transition-colors text-xs font-medium border border-[#3b494c]/60 cursor-pointer"
          title="Search flood zones, nodes & stations"
        >
          <Search className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span className="hidden sm:inline text-[11px] text-[#bac9cc] font-normal">Quick Search...</span>
          <kbd className="hidden sm:inline text-[9px] font-mono bg-[#0d1516] px-1 py-0.5 rounded border border-[#3b494c] text-[#849396]">⌘K</kbd>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onOpenExportPdf}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#c3f5ff] bg-[#192122] hover:bg-[#242b2d] hover:text-[#00e5ff] transition-colors text-xs font-semibold border border-[#00e5ff]/40 shadow-xs cursor-pointer group"
          title="Export Complete Flood & Hydro Data to PDF"
        >
          <FileDown className="w-3.5 h-3.5 text-[#00e5ff] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-[11px]">Export PDF</span>
        </button>

        {/* Live Telemetry Drawer Toggle */}
        <button
          onClick={onOpenTelemetry}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#00e5ff] bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 transition-colors text-xs font-semibold border border-[#00e5ff]/30 cursor-pointer"
          title="Open SCADA Hydro Telemetry"
        >
          <Activity className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span className="hidden lg:inline text-[11px]">Telemetry</span>
        </button>

        {/* Emergency Alerts Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-md text-[#bac9cc] hover:text-[#c3f5ff] hover:bg-[#192122] transition-colors relative cursor-pointer"
          title="Emergency alert notifications"
        >
          <Bell className="w-4 h-4" />
          {criticalAlertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff5252] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono animate-pulse">
              {criticalAlertCount}
            </span>
          )}
        </button>

        {/* Dark Mode Badge */}
        <div 
          className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono-data bg-[#0d1516] border border-[#3b494c]/60 text-[#00e5ff]"
          title="Command Center Dark Mode Active"
        >
          <Moon className="w-3 h-3 text-[#00e5ff]" />
          <span>DARK MODE</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md text-[#bac9cc] hover:text-[#c3f5ff] hover:bg-[#192122] transition-colors cursor-pointer"
          title="GIS and Map Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#242b2d]">
          <div className="w-7 h-7 rounded-full bg-[#192122] border border-[#3b494c] text-[#00e5ff] flex items-center justify-center text-xs font-semibold shadow-xs">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-[#080f11]/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#192122] rounded-xl shadow-2xl border border-[#3b494c] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 text-[#dce4e5]">
            <div className="p-3 border-b border-[#3b494c]/60 flex items-center gap-2 bg-[#131d1e]">
              <Search className="w-4 h-4 text-[#00e5ff]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flood hotspots, pump facilities, evacuation routes..."
                className="w-full text-sm outline-hidden text-[#dce4e5] placeholder:text-[#849396] bg-transparent"
              />
              <button 
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="p-1 text-[#bac9cc] hover:text-[#c3f5ff] rounded hover:bg-[#242b2d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-72 overflow-y-auto divide-y divide-[#242b2d]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#849396] px-2 py-1.5">
                Target Hotspots & SCADA Facilities
              </div>
              {filteredLocations.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTab(loc.tab);
                    setShowSearchModal(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center justify-between p-2.5 hover:bg-[#242b2d] rounded-lg cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#c3f5ff] group-hover:text-[#00e5ff]">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-[#849396]">{loc.type}</div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#0d1516] text-[#00e5ff] border border-[#00e5ff]/30 group-hover:bg-[#00e5ff]/20">
                    Go to {loc.tab.toUpperCase()}
                  </span>
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <div className="p-4 text-center text-xs text-[#849396]">
                  No matching locations found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
