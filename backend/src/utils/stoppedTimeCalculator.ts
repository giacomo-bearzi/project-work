export const calculateStoppedTime = (
  lastStatusChange: Date,
  currentTime: Date = new Date()
): number => {
  const diffInMs = currentTime.getTime() - lastStatusChange.getTime();
  return Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
};

// Production calculator functions
export const PRODUCTION_RATES = {
  'line-1': { min: 800, max: 1200 }, // candies per hour
  'line-2': { min: 900, max: 1100 },
  'line-3': { min: 750, max: 1250 }
};

export const generateProductionRate = (lineId: string): number => {
  const rates = PRODUCTION_RATES[lineId as keyof typeof PRODUCTION_RATES];
  if (!rates) return 1000; // default rate
  
  return Math.floor(Math.random() * (rates.max - rates.min + 1)) + rates.min;
};

export const calculateCandiesProduced = (
  productionRate: number, // candies per hour
  durationMinutes: number
): number => {
  const hours = durationMinutes / 60;
  return Math.floor(productionRate * hours);
}; 