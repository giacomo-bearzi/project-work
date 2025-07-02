export interface OEEData {
  lineId: string;
  plannedTime: number; // minutes (e.g., 480 for 8-hour shift)
  operationalTime: number; // minutes (planned time - downtime)
  theoreticalOutput: number; // pieces at max speed
  actualOutput: number; // pieces actually produced
  goodPieces: number; // pieces without defects
}

export interface OEEResult {
  lineId: string;
  availability: number; // 0-1
  performance: number; // 0-1
  quality: number; // 0-1
  oee: number; // 0-1
  oeePercentage: number; // 0-100
  status: 'excellent' | 'good' | 'critical';
}

export const calculateOEE = (data: OEEData): OEEResult => {
  // 1. Availability = Operational Time / Planned Time
  const availability = data.operationalTime / data.plannedTime;
  
  // 2. Performance = Actual Output / Theoretical Output
  const performance = data.actualOutput / data.theoreticalOutput;
  
  // 3. Quality = Good Pieces / Actual Output
  const quality = data.actualOutput > 0 ? data.goodPieces / data.actualOutput : 0;
  
  // 4. OEE = Availability × Performance × Quality
  const oee = availability * performance * quality;
  const oeePercentage = oee * 100;
  
  // Determine status
  let status: 'excellent' | 'good' | 'critical';
  if (oeePercentage > 85) {
    status = 'excellent';
  } else if (oeePercentage >= 60) {
    status = 'good';
  } else {
    status = 'critical';
  }
  
  return {
    lineId: data.lineId,
    availability,
    performance,
    quality,
    oee,
    oeePercentage,
    status
  };
};