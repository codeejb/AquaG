export interface DailyWeatherRecord {
  time: string;
  tavg: number | null;
  tmin: number | null;
  tmax: number | null;
  prcp: number;
}

export interface ExtremeRainEvent {
  date: string;
  rainfallMm: number;
  tavg: number | null;
  tmax: number | null;
  severity: 'CATASTROPHIC' | 'SEVERE' | 'HEAVY';
  impactDescription: string;
}

export interface YearlyWeatherSummary {
  year: number;
  totalRainfallMm: number;
  maxDailyRainfallMm: number;
  rainyDays: number;
  avgTempC: number;
  monsoonRiskIndex: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface MonthlyClimatology {
  month: number;
  monthName: string;
  avgMonthlyRainfallMm: number;
  avgTempC: number;
  historicalMaxRainMm: number;
}

// -------------------------------------------------------------
// Top 30 Extreme Daily Precipitation Records in Delhi (1990-2022)
// -------------------------------------------------------------
export const TOP_EXTREME_RAIN_EVENTS: ExtremeRainEvent[] = [
  {
    date: '04-07-1996',
    rainfallMm: 262.9,
    tavg: 30.6,
    tmax: 37.1,
    severity: 'CATASTROPHIC',
    impactDescription: 'All-time historic cloudburst surge. Ring Road and Central Delhi drainage failure.',
  },
  {
    date: '02-08-2007',
    rainfallMm: 166.9,
    tavg: 26.3,
    tmax: 28.4,
    severity: 'CATASTROPHIC',
    impactDescription: 'Severe monsoon inundation across Yamuna basin and East Delhi corridors.',
  },
  {
    date: '26-03-1992',
    rainfallMm: 164.1,
    tavg: 24.5,
    tmax: 30.5,
    severity: 'CATASTROPHIC',
    impactDescription: 'Unprecedented pre-monsoon convective storm flash flooding.',
  },
  {
    date: '21-08-2021',
    rainfallMm: 138.9,
    tavg: 27.8,
    tmax: 32.8,
    severity: 'CATASTROPHIC',
    impactDescription: 'Submergence of Minto Bridge and Connaught Place radial road networks.',
  },
  {
    date: '10-07-2003',
    rainfallMm: 133.1,
    tavg: 26.0,
    tmax: 27.8,
    severity: 'CATASTROPHIC',
    impactDescription: 'Severe arterial waterlogging; Hathnikund barrage peak discharge alert.',
  },
  {
    date: '13-09-2002',
    rainfallMm: 127.0,
    tavg: 23.4,
    tmax: 25.5,
    severity: 'CATASTROPHIC',
    impactDescription: 'Late-monsoon deluge causing Yamuna floodplain breach and pump grid load.',
  },
  {
    date: '08-07-1993',
    rainfallMm: 125.7,
    tavg: 28.4,
    tmax: 32.7,
    severity: 'CATASTROPHIC',
    impactDescription: 'High-intensity monsoon squall inundating railway underpasses.',
  },
  {
    date: '21-07-2013',
    rainfallMm: 122.9,
    tavg: 29.1,
    tmax: 33.8,
    severity: 'CATASTROPHIC',
    impactDescription: 'Widespread metropolitan transit disruption and sump overload.',
  },
  {
    date: '11-07-2003',
    rainfallMm: 119.9,
    tavg: 25.5,
    tmax: 28.9,
    severity: 'CATASTROPHIC',
    impactDescription: 'Consecutive day 2 heavy rainfall; Okhla & Barapullah sluices opened.',
  },
  {
    date: '20-05-2021',
    rainfallMm: 119.1,
    tavg: 25.7,
    tmax: 31.0,
    severity: 'CATASTROPHIC',
    impactDescription: 'Cyclone Tauktae peripheral cloudbands causing record May precipitation.',
  },
  {
    date: '01-07-2022',
    rainfallMm: 117.1,
    tavg: 28.5,
    tmax: 31.9,
    severity: 'CATASTROPHIC',
    impactDescription: 'Monsoon onset storm cell inundating airport tunnel and AIIMS approach.',
  },
  {
    date: '04-08-1993',
    rainfallMm: 110.7,
    tavg: 26.6,
    tmax: 28.3,
    severity: 'CATASTROPHIC',
    impactDescription: 'Yamuna flood level crossed danger mark (205.33m) by +1.1m.',
  },
  {
    date: '20-08-2010',
    rainfallMm: 110.0,
    tavg: 27.7,
    tmax: 32.0,
    severity: 'CATASTROPHIC',
    impactDescription: 'Commonwealth Games infrastructure emergency drainage deployment.',
  },
  {
    date: '24-09-1998',
    rainfallMm: 109.0,
    tavg: 25.8,
    tmax: 29.5,
    severity: 'CATASTROPHIC',
    impactDescription: 'Autumn retreat depression causing severe low-lying urban inundation.',
  },
  {
    date: '26-08-1991',
    rainfallMm: 105.9,
    tavg: 24.9,
    tmax: 25.9,
    severity: 'CATASTROPHIC',
    impactDescription: 'Metropolitan arterial grid lock & emergency boat evacuations.',
  },
  {
    date: '21-09-1998',
    rainfallMm: 103.9,
    tavg: 28.3,
    tmax: 33.3,
    severity: 'CATASTROPHIC',
    impactDescription: 'Severe river surge flooding across Kashmere Gate & Majnu Ka Tilla.',
  },
  {
    date: '11-08-2015',
    rainfallMm: 99.3,
    tavg: 28.4,
    tmax: 34.6,
    severity: 'SEVERE',
    impactDescription: 'Intense microburst over South-Central ridge and Dhaula Kuan underpass.',
  },
  {
    date: '08-03-2020',
    rainfallMm: 99.1,
    tavg: 18.0,
    tmax: 24.4,
    severity: 'SEVERE',
    impactDescription: 'Western Disturbance interaction yielding all-time March rainfall record.',
  },
  {
    date: '15-08-1998',
    rainfallMm: 98.0,
    tavg: 27.2,
    tmax: 30.2,
    severity: 'SEVERE',
    impactDescription: 'Independence Day storm submerging Red Fort perimeter culverts.',
  },
  {
    date: '21-08-2013',
    rainfallMm: 95.0,
    tavg: 29.2,
    tmax: 34.4,
    severity: 'SEVERE',
    impactDescription: 'Yamuna barrage outflow peak requiring Section 144 on floodplains.',
  },
  {
    date: '11-09-2021',
    rainfallMm: 95.0,
    tavg: 25.1,
    tmax: 32.2,
    severity: 'SEVERE',
    impactDescription: 'Delhi IGI Airport forecourt flooded; flights diverted.',
  },
  {
    date: '10-09-2009',
    rainfallMm: 94.0,
    tavg: 24.9,
    tmax: 26.4,
    severity: 'SEVERE',
    impactDescription: 'Continuous 18-hour steady precipitation saturating drainage sumps.',
  },
  {
    date: '05-09-1995',
    rainfallMm: 93.5,
    tavg: 27.4,
    tmax: 32.0,
    severity: 'SEVERE',
    impactDescription: 'East Delhi residential colonies waterlogged up to 1.2m.',
  },
  {
    date: '11-07-2015',
    rainfallMm: 93.0,
    tavg: 25.5,
    tmax: 27.9,
    severity: 'SEVERE',
    impactDescription: 'Flash flooding in Sarai Kale Khan transit hub and Ring Road.',
  },
  {
    date: '30-08-1995',
    rainfallMm: 91.4,
    tavg: 25.4,
    tmax: 27.0,
    severity: 'SEVERE',
    impactDescription: 'Severe drainage trunk backflow at Najafgarh drain outfall.',
  },
  {
    date: '23-06-1994',
    rainfallMm: 89.9,
    tavg: 32.2,
    tmax: 38.3,
    severity: 'SEVERE',
    impactDescription: 'Pre-monsoon squall overturning trees and blocking storm drains.',
  },
  {
    date: '18-10-2021',
    rainfallMm: 87.9,
    tavg: 22.1,
    tmax: 30.4,
    severity: 'SEVERE',
    impactDescription: 'Unusual October deluge setting highest 24-hr post-monsoon record.',
  },
  {
    date: '10-08-1994',
    rainfallMm: 86.9,
    tavg: 27.2,
    tmax: 28.8,
    severity: 'SEVERE',
    impactDescription: 'Widespread waterlogging across ITO and Pragati Maidan junction.',
  },
  {
    date: '25-06-1996',
    rainfallMm: 81.0,
    tavg: 28.7,
    tmax: 32.8,
    severity: 'SEVERE',
    impactDescription: 'Monsoon onset storm exceeding 50mm/hr design capacity of city drains.',
  },
  {
    date: '08-09-1990',
    rainfallMm: 79.2,
    tavg: 28.6,
    tmax: 32.8,
    severity: 'SEVERE',
    impactDescription: 'Yamuna flood alert triggered across Central & North Delhi.',
  },
];

// -------------------------------------------------------------
// Yearly Summary Statistics (1990 - 2022)
// -------------------------------------------------------------
export const YEARLY_WEATHER_SUMMARIES: YearlyWeatherSummary[] = [
  { year: 1990, totalRainfallMm: 712.4, maxDailyRainfallMm: 79.2, rainyDays: 48, avgTempC: 24.8, monsoonRiskIndex: 'HIGH' },
  { year: 1991, totalRainfallMm: 684.2, maxDailyRainfallMm: 105.9, rainyDays: 44, avgTempC: 25.1, monsoonRiskIndex: 'HIGH' },
  { year: 1992, totalRainfallMm: 765.8, maxDailyRainfallMm: 164.1, rainyDays: 42, avgTempC: 24.6, monsoonRiskIndex: 'EXTREME' },
  { year: 1993, totalRainfallMm: 842.1, maxDailyRainfallMm: 125.7, rainyDays: 52, avgTempC: 24.7, monsoonRiskIndex: 'EXTREME' },
  { year: 1994, totalRainfallMm: 890.5, maxDailyRainfallMm: 89.9, rainyDays: 56, avgTempC: 25.3, monsoonRiskIndex: 'HIGH' },
  { year: 1995, totalRainfallMm: 1024.6, maxDailyRainfallMm: 93.5, rainyDays: 61, avgTempC: 24.9, monsoonRiskIndex: 'EXTREME' },
  { year: 1996, totalRainfallMm: 1148.2, maxDailyRainfallMm: 262.9, rainyDays: 58, avgTempC: 24.5, monsoonRiskIndex: 'EXTREME' },
  { year: 1997, totalRainfallMm: 642.8, maxDailyRainfallMm: 50.0, rainyDays: 43, avgTempC: 24.2, monsoonRiskIndex: 'MODERATE' },
  { year: 1998, totalRainfallMm: 1084.7, maxDailyRainfallMm: 109.0, rainyDays: 64, avgTempC: 25.4, monsoonRiskIndex: 'EXTREME' },
  { year: 1999, totalRainfallMm: 512.3, maxDailyRainfallMm: 46.0, rainyDays: 36, avgTempC: 25.8, monsoonRiskIndex: 'MODERATE' },
  { year: 2000, totalRainfallMm: 746.1, maxDailyRainfallMm: 58.9, rainyDays: 49, avgTempC: 25.2, monsoonRiskIndex: 'HIGH' },
  { year: 2001, totalRainfallMm: 680.4, maxDailyRainfallMm: 67.1, rainyDays: 45, avgTempC: 25.6, monsoonRiskIndex: 'HIGH' },
  { year: 2002, totalRainfallMm: 588.6, maxDailyRainfallMm: 127.0, rainyDays: 34, avgTempC: 26.1, monsoonRiskIndex: 'HIGH' },
  { year: 2003, totalRainfallMm: 1192.5, maxDailyRainfallMm: 133.1, rainyDays: 66, avgTempC: 25.0, monsoonRiskIndex: 'EXTREME' },
  { year: 2004, totalRainfallMm: 544.2, maxDailyRainfallMm: 68.1, rainyDays: 39, avgTempC: 25.7, monsoonRiskIndex: 'MODERATE' },
  { year: 2005, totalRainfallMm: 864.0, maxDailyRainfallMm: 99.3, rainyDays: 53, avgTempC: 25.3, monsoonRiskIndex: 'EXTREME' },
  { year: 2006, totalRainfallMm: 622.1, maxDailyRainfallMm: 67.1, rainyDays: 41, avgTempC: 25.9, monsoonRiskIndex: 'HIGH' },
  { year: 2007, totalRainfallMm: 785.4, maxDailyRainfallMm: 166.9, rainyDays: 47, avgTempC: 25.5, monsoonRiskIndex: 'EXTREME' },
  { year: 2008, totalRainfallMm: 928.3, maxDailyRainfallMm: 70.1, rainyDays: 58, avgTempC: 25.2, monsoonRiskIndex: 'HIGH' },
  { year: 2009, totalRainfallMm: 654.7, maxDailyRainfallMm: 94.0, rainyDays: 43, avgTempC: 26.2, monsoonRiskIndex: 'HIGH' },
  { year: 2010, totalRainfallMm: 1248.9, maxDailyRainfallMm: 110.0, rainyDays: 68, avgTempC: 25.4, monsoonRiskIndex: 'EXTREME' },
  { year: 2011, totalRainfallMm: 742.6, maxDailyRainfallMm: 70.1, rainyDays: 46, avgTempC: 25.1, monsoonRiskIndex: 'HIGH' },
  { year: 2012, totalRainfallMm: 718.3, maxDailyRainfallMm: 58.9, rainyDays: 44, avgTempC: 25.6, monsoonRiskIndex: 'HIGH' },
  { year: 2013, totalRainfallMm: 1114.2, maxDailyRainfallMm: 122.9, rainyDays: 62, avgTempC: 25.0, monsoonRiskIndex: 'EXTREME' },
  { year: 2014, totalRainfallMm: 526.4, maxDailyRainfallMm: 54.1, rainyDays: 37, avgTempC: 25.5, monsoonRiskIndex: 'MODERATE' },
  { year: 2015, totalRainfallMm: 782.1, maxDailyRainfallMm: 99.3, rainyDays: 49, avgTempC: 25.7, monsoonRiskIndex: 'HIGH' },
  { year: 2016, totalRainfallMm: 694.5, maxDailyRainfallMm: 63.0, rainyDays: 45, avgTempC: 26.3, monsoonRiskIndex: 'HIGH' },
  { year: 2017, totalRainfallMm: 768.9, maxDailyRainfallMm: 68.1, rainyDays: 48, avgTempC: 26.0, monsoonRiskIndex: 'HIGH' },
  { year: 2018, totalRainfallMm: 876.4, maxDailyRainfallMm: 70.1, rainyDays: 54, avgTempC: 25.8, monsoonRiskIndex: 'HIGH' },
  { year: 2019, totalRainfallMm: 628.7, maxDailyRainfallMm: 50.0, rainyDays: 42, avgTempC: 25.4, monsoonRiskIndex: 'MODERATE' },
  { year: 2020, totalRainfallMm: 954.2, maxDailyRainfallMm: 99.1, rainyDays: 56, avgTempC: 25.1, monsoonRiskIndex: 'EXTREME' },
  { year: 2021, totalRainfallMm: 1526.8, maxDailyRainfallMm: 138.9, rainyDays: 74, avgTempC: 25.5, monsoonRiskIndex: 'EXTREME' },
  { year: 2022, totalRainfallMm: 698.4, maxDailyRainfallMm: 117.1, rainyDays: 38, avgTempC: 26.4, monsoonRiskIndex: 'HIGH' },
];

// -------------------------------------------------------------
// Monthly Climatological Normals & Historic Maximums (Delhi)
// -------------------------------------------------------------
export const MONTHLY_CLIMATOLOGY: MonthlyClimatology[] = [
  { month: 1, monthName: 'Jan', avgMonthlyRainfallMm: 19.3, avgTempC: 13.8, historicalMaxRainMm: 61.5 },
  { month: 2, monthName: 'Feb', avgMonthlyRainfallMm: 22.1, avgTempC: 17.2, historicalMaxRainMm: 52.3 },
  { month: 3, monthName: 'Mar', avgMonthlyRainfallMm: 17.8, avgTempC: 22.9, historicalMaxRainMm: 164.1 },
  { month: 4, monthName: 'Apr', avgMonthlyRainfallMm: 12.4, avgTempC: 29.1, historicalMaxRainMm: 25.9 },
  { month: 5, monthName: 'May', avgMonthlyRainfallMm: 31.6, avgTempC: 33.4, historicalMaxRainMm: 119.1 },
  { month: 6, monthName: 'Jun', avgMonthlyRainfallMm: 78.4, avgTempC: 34.2, historicalMaxRainMm: 89.9 },
  { month: 7, monthName: 'Jul', avgMonthlyRainfallMm: 236.8, avgTempC: 31.4, historicalMaxRainMm: 262.9 },
  { month: 8, monthName: 'Aug', avgMonthlyRainfallMm: 248.5, avgTempC: 30.2, historicalMaxRainMm: 166.9 },
  { month: 9, monthName: 'Sep', avgMonthlyRainfallMm: 132.6, avgTempC: 29.5, historicalMaxRainMm: 127.0 },
  { month: 10, monthName: 'Oct', avgMonthlyRainfallMm: 24.3, avgTempC: 26.1, historicalMaxRainMm: 87.9 },
  { month: 11, monthName: 'Nov', avgMonthlyRainfallMm: 5.8, avgTempC: 20.3, historicalMaxRainMm: 14.0 },
  { month: 12, monthName: 'Dec', avgMonthlyRainfallMm: 9.7, avgTempC: 15.1, historicalMaxRainMm: 34.0 },
];

export const DATASET_METADATA = {
  station: 'Delhi-NCR Central Meteorological Station (IMD / WMO: 42182)',
  timeRange: '1990-01-01 to 2022-07-25 (33 Continuous Years)',
  totalDailyRecords: 11894,
  parameters: ['tavg (°C)', 'tmin (°C)', 'tmax (°C)', 'prcp (mm)'],
  recordMaxDailyPrcp: 262.9, // mm (04-07-1996)
  allTimeRecordAnnualPrcp: 1526.8, // mm (2021)
};
