export interface ApiGetProductionLine {
  _id: string;
  lineId: string;
  name: string;
  status: 'active' | 'stopped' | 'maintenance' | 'issue';
  lastUpdate: string;
  __v: number;
}

export interface ApiGetProductionStats {
  currentProductionRate: number;
  activeLines: number;
}

export interface ApiGetHourlyProduction {
  hour: string;
  produced: number;
  target: number;
}

export interface ApiGetLineHourlyProduction {
  lineId: string;
  hours: ApiGetHourlyProduction[];
}

export interface ApiGetOEELineResult {
  lineId: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  oeePercentage: number;
  status: 'excellent' | 'good' | 'critical';
}

export interface ApiGetOEEData {
  lines: ApiGetOEELineResult[];
  overall: {
    oee: number;
    status: 'excellent' | 'good' | 'critical';
  };
}

  
