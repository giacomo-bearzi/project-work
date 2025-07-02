export interface ApiProductionLine {
  _id: string;
  lineId: 'line-1' | 'line-2' | 'line-3';
  name: string;
  status: 'active' | 'stopped' | 'maintenance' | 'issue';
  lastUpdate: string;
  __v: number;
}

export interface ProductionStats {
  currentProductionRate: number;
  activeLines: number;
}

export interface HourlyProduction {
  hour: string; // e.g. '08:00'
  produced: number;
  target: number;
}

export interface LineHourlyProductionResponse {
  lineId: string;
  hours: HourlyProduction[];
}