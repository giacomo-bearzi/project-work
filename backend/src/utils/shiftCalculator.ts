export interface Shift {
  id: 'morning' | 'afternoon';
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  name: string;
}

export const SHIFTS: Shift[] = [
  { id: 'morning', startTime: '09:00', endTime: '13:00', name: 'Turno Mattina' },
  { id: 'afternoon', startTime: '14:00', endTime: '18:00', name: 'Turno Pomeriggio' }
];

export const LUNCH_BREAK = {
  startTime: '12:00',
  endTime: '13:00'
};

export const getCurrentShift = (): Shift | null => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:mm format
  
  // Check if we're in lunch break
  if (currentTime >= LUNCH_BREAK.startTime && currentTime < LUNCH_BREAK.endTime) {
    return null;
  }
  
  // Check if we're in a shift
  for (const shift of SHIFTS) {
    if (currentTime >= shift.startTime && currentTime < shift.endTime) {
      return shift;
    }
  }
  
  return null;
};

export const isInShift = (): boolean => {
  return getCurrentShift() !== null;
};

export const isLunchBreak = (): boolean => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  return currentTime >= LUNCH_BREAK.startTime && currentTime < LUNCH_BREAK.endTime;
};

export const getShiftStartTime = (date: Date = new Date()): Date => {
  const currentShift = getCurrentShift();
  if (!currentShift) {
    return date; // Return current time if not in shift
  }
  
  const [hours, minutes] = currentShift.startTime.split(':').map(Number);
  const shiftStart = new Date(date);
  shiftStart.setHours(hours, minutes, 0, 0);
  return shiftStart;
};

export const getShiftEndTime = (date: Date = new Date()): Date => {
  const currentShift = getCurrentShift();
  if (!currentShift) {
    return date; // Return current time if not in shift
  }
  
  const [hours, minutes] = currentShift.endTime.split(':').map(Number);
  const shiftEnd = new Date(date);
  shiftEnd.setHours(hours, minutes, 0, 0);
  return shiftEnd;
};

export const calculateShiftStoppedTime = (
  lastStatusChange: Date,
  currentTime: Date = new Date()
): number => {
  // If we're not in a shift, no stopped time
  if (!isInShift()) {
    return 0;
  }
  
  let totalStoppedTime = 0;
  
  // Check each shift to see if the stopped period overlaps with it
  for (const shift of SHIFTS) {
    const [shiftStartHour, shiftStartMin] = shift.startTime.split(':').map(Number);
    const [shiftEndHour, shiftEndMin] = shift.endTime.split(':').map(Number);
    
    const shiftStart = new Date(lastStatusChange);
    shiftStart.setHours(shiftStartHour, shiftStartMin, 0, 0);
    
    const shiftEnd = new Date(lastStatusChange);
    shiftEnd.setHours(shiftEndHour, shiftEndMin, 0, 0);
    
    // Calculate overlap between stopped period and this shift
    const overlapStart = new Date(Math.max(lastStatusChange.getTime(), shiftStart.getTime()));
    const overlapEnd = new Date(Math.min(currentTime.getTime(), shiftEnd.getTime()));
    
    if (overlapStart < overlapEnd) {
      const overlapDuration = overlapEnd.getTime() - overlapStart.getTime();
      totalStoppedTime += Math.floor(overlapDuration / (1000 * 60));
    }
  }
  
  return totalStoppedTime;
};

export const shouldForceStopForLunch = (): boolean => {
  return isLunchBreak();
};

export const getNextShiftStart = (): Date => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  // If we're before morning shift
  if (currentTime < SHIFTS[0].startTime) {
    const [hours, minutes] = SHIFTS[0].startTime.split(':').map(Number);
    const nextStart = new Date(now);
    nextStart.setHours(hours, minutes, 0, 0);
    return nextStart;
  }
  
  // If we're between morning shift and lunch
  if (currentTime >= SHIFTS[0].endTime && currentTime < LUNCH_BREAK.startTime) {
    const [hours, minutes] = LUNCH_BREAK.startTime.split(':').map(Number);
    const nextStart = new Date(now);
    nextStart.setHours(hours, minutes, 0, 0);
    return nextStart;
  }
  
  // If we're in lunch break
  if (isLunchBreak()) {
    const [hours, minutes] = SHIFTS[1].startTime.split(':').map(Number);
    const nextStart = new Date(now);
    nextStart.setHours(hours, minutes, 0, 0);
    return nextStart;
  }
  
  // If we're after afternoon shift, next shift is tomorrow morning
  const [hours, minutes] = SHIFTS[0].startTime.split(':').map(Number);
  const nextStart = new Date(now);
  nextStart.setDate(nextStart.getDate() + 1);
  nextStart.setHours(hours, minutes, 0, 0);
  return nextStart;
}; 