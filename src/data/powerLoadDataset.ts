export interface HourlyPowerLoadRecord {
  date: string;
  time: string;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  rainMm: number;
  publicHoliday: number;
  weeklyHoliday: number;
  festival: number;
  realEstateDevelopment: 'High' | 'Medium' | 'Low';
  lowDevAreaPct: number;
  medDevAreaPct: number;
  highDevAreaPct: number;
  loadMW: number;
}

export interface ZoneDevelopmentProfile {
  zoneName: string;
  developmentCategory: 'High' | 'Medium' | 'Low';
  lowDevPct: number;
  medDevPct: number;
  highDevPct: number;
  peakLoadMW: number;
  stormDrainCapacityMW: number;
  floodVulnerability: string;
}

export const HOURLY_POWER_LOAD_SERIES: HourlyPowerLoadRecord[] = [
  { date: '2024-07-15', time: '00:00:00', temperatureC: 29.4, humidityPct: 82, windSpeedKmh: 12.4, rainMm: 0.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 5420.5 },
  { date: '2024-07-15', time: '02:00:00', temperatureC: 28.6, humidityPct: 86, windSpeedKmh: 10.2, rainMm: 1.5, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 5180.2 },
  { date: '2024-07-15', time: '04:00:00', temperatureC: 27.8, humidityPct: 91, windSpeedKmh: 15.6, rainMm: 12.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 4950.8 },
  { date: '2024-07-15', time: '06:00:00', temperatureC: 27.2, humidityPct: 94, windSpeedKmh: 22.1, rainMm: 28.5, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'Medium', lowDevAreaPct: 25.0, medDevAreaPct: 50.0, highDevAreaPct: 25.0, loadMW: 5640.4 },
  { date: '2024-07-15', time: '08:00:00', temperatureC: 28.1, humidityPct: 90, windSpeedKmh: 28.4, rainMm: 45.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 6890.1 },
  { date: '2024-07-15', time: '10:00:00', temperatureC: 30.5, humidityPct: 84, windSpeedKmh: 24.5, rainMm: 62.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 10.0, medDevAreaPct: 30.0, highDevAreaPct: 60.0, loadMW: 7420.6 },
  { date: '2024-07-15', time: '12:00:00', temperatureC: 32.8, humidityPct: 78, windSpeedKmh: 18.2, rainMm: 35.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 10.0, medDevAreaPct: 30.0, highDevAreaPct: 60.0, loadMW: 7950.4 },
  { date: '2024-07-15', time: '14:00:00', temperatureC: 34.2, humidityPct: 72, windSpeedKmh: 14.8, rainMm: 18.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 10.0, medDevAreaPct: 30.0, highDevAreaPct: 60.0, loadMW: 8320.0 },
  { date: '2024-07-15', time: '16:00:00', temperatureC: 33.6, humidityPct: 76, windSpeedKmh: 16.5, rainMm: 8.5, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'Medium', lowDevAreaPct: 20.0, medDevAreaPct: 45.0, highDevAreaPct: 35.0, loadMW: 8040.5 },
  { date: '2024-07-15', time: '18:00:00', temperatureC: 31.8, humidityPct: 81, windSpeedKmh: 13.2, rainMm: 2.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'Medium', lowDevAreaPct: 20.0, medDevAreaPct: 45.0, highDevAreaPct: 35.0, loadMW: 7680.2 },
  { date: '2024-07-15', time: '20:00:00', temperatureC: 30.4, humidityPct: 85, windSpeedKmh: 11.0, rainMm: 0.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 7150.8 },
  { date: '2024-07-15', time: '22:00:00', temperatureC: 29.8, humidityPct: 87, windSpeedKmh: 9.5, rainMm: 0.0, publicHoliday: 0, weeklyHoliday: 0, festival: 0, realEstateDevelopment: 'High', lowDevAreaPct: 15.0, medDevAreaPct: 35.0, highDevAreaPct: 50.0, loadMW: 6380.0 },
];

export const DELHI_URBAN_DEVELOPMENT_ZONES: ZoneDevelopmentProfile[] = [
  {
    zoneName: 'Connaught Place & Central Corridor',
    developmentCategory: 'High',
    lowDevPct: 5.0,
    medDevPct: 25.0,
    highDevPct: 70.0,
    peakLoadMW: 1420.5,
    stormDrainCapacityMW: 185.0,
    floodVulnerability: 'High Impervious Surface • Rapid Runoff',
  },
  {
    zoneName: 'Okhla Industrial & Sump Hub',
    developmentCategory: 'High',
    lowDevPct: 10.0,
    medDevPct: 30.0,
    highDevPct: 60.0,
    peakLoadMW: 1890.2,
    stormDrainCapacityMW: 320.0,
    floodVulnerability: 'Heavy Industrial Dewatering Draw',
  },
  {
    zoneName: 'ITO Vikas Marg & Riverfront',
    developmentCategory: 'Medium',
    lowDevPct: 25.0,
    medDevPct: 50.0,
    highDevPct: 25.0,
    peakLoadMW: 980.4,
    stormDrainCapacityMW: 140.0,
    floodVulnerability: 'River Inundation Barrier Sensitivity',
  },
  {
    zoneName: 'Sarai Kale Khan & South Fringe',
    developmentCategory: 'Medium',
    lowDevPct: 35.0,
    medDevPct: 45.0,
    highDevPct: 20.0,
    peakLoadMW: 760.8,
    stormDrainCapacityMW: 95.0,
    floodVulnerability: 'Low-Lying Drainage Backup Zone',
  },
  {
    zoneName: 'North-East Pushta & Floodplains',
    developmentCategory: 'Low',
    lowDevPct: 65.0,
    medDevPct: 25.0,
    highDevPct: 10.0,
    peakLoadMW: 430.0,
    stormDrainCapacityMW: 60.0,
    floodVulnerability: 'Vulnerable Population Exposure',
  },
];

export const POWER_LOAD_DATASET_META = {
  name: 'Delhi Power Load with Weather & Development',
  creator: 'Pratik Chougule (Kaggle / Croissant 1.0)',
  url: 'https://www.kaggle.com/datasets/pratikyuvrajchougule/delhi-datset',
  license: 'MIT',
  recordAttributes: [
    'Date (YYYY-MM-DD)',
    'Time (HH:MM:SS)',
    'Temperature (°C)',
    'Humidity (%)',
    'Wind Speed (km/h)',
    'Rain (mm)',
    'Public Holiday (0/1)',
    'Weekly Holiday (0/1)',
    'Festival (0/1)',
    'Real Estate Development (High/Medium/Low)',
    'Low/Medium/High Dev Area (%)',
    'Power Load (MW)',
  ],
  gridCapacityMW: 8500,
  peakRecordedLoadMW: 8320,
};
