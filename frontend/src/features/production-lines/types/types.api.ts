export interface ApiProductionLine {
  _id: string;
  lineId: 'line-1' | 'line-2' | 'line-3';
  name: string;
  status: 'active' | 'stopped' | 'maintenance' | 'issue';
  lastUpdate: string;
  __v: number;
}
