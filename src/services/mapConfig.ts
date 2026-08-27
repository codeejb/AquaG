const MAP_KEY_STORAGE = 'AQUAG_MAP_API_KEY';
const DEFAULT_MAP_API_KEY = 'cb1_2ake_1_a1a4e005a56a759aedc49f88';

export const getMapApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(MAP_KEY_STORAGE);
    if (stored) return stored;
  }
  return (import.meta as any).env?.VITE_MAP_API_KEY || DEFAULT_MAP_API_KEY;
};

export const setMapApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(MAP_KEY_STORAGE, key.trim());
    } else {
      localStorage.setItem(MAP_KEY_STORAGE, DEFAULT_MAP_API_KEY);
    }
  }
};

export interface MapTileProviderConfig {
  name: string;
  urlTemplate: string;
  attribution: string;
  maxZoom: number;
}

export const getTileLayerUrl = (mode: string, apiKeyOverride?: string): { url: string; subdomains?: string; maxZoom: number } => {
  const key = apiKeyOverride || getMapApiKey();
  const keyParam = key ? `?key=${key}` : '';

  if (mode === 'terrain') {
    return {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 19,
    };
  }

  if (mode === 'satellite' || mode === 'satellite-gee') {
    return {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 18,
    };
  }

  if (mode === 'elements-light' || mode === 'osm-bright') {
    return {
      url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${keyParam}`,
      subdomains: 'abcd',
      maxZoom: 19,
    };
  }

  // Vector Dark (Default Command Theme)
  return {
    url: `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png${keyParam}`,
    subdomains: 'abcd',
    maxZoom: 19,
  };
};
