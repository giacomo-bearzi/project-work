import { Request, Response } from 'express';
import ProductionLine from '../models/ProductionLine';
import { calculateStoppedTime, generateProductionRate, calculateCandiesProduced } from '../utils/stoppedTimeCalculator';
import ProductionLog from '../models/ProductionLog';
import { calculateOEE, OEEData } from '../utils/oeeCalculator';
import { 
  calculateShiftStoppedTime, 
  shouldForceStopForLunch, 
  getCurrentShift, 
  getShiftStartTime,
  isInShift,
  isLunchBreak,
  SHIFTS,
  LUNCH_BREAK,
} from '../utils/shiftCalculator';

export const getAllProductionLines = async (req: Request, res: Response) => {
  try {
    await checkAndUpdateLinesForShiftStatus(req);
    const lines = await ProductionLine.find({});
    res.json(lines);
  } catch (error) {
    console.error('Error fetching production lines:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductionLineById = async (req: Request, res: Response) => {
  try {
    const line = await ProductionLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ message: 'Production line not found' });
    }
    res.json(line);
  } catch (error) {
    console.error('Error fetching production line by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductionLineByLineId = async (req: Request, res: Response) => {
  try {
    const line = await ProductionLine.findOne({ lineId: req.params.lineId });
    if (!line) {
      return res.status(404).json({ message: 'Production line not found' });
    }
    res.json(line);
  } catch (error) {
    console.error('Error fetching production line by lineId:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProductionLineStatus = async (lineId: string, newStatus: 'active' | 'stopped' | 'maintenance' | 'issue', req?: Request) => {
  try {
    const productionLine = await ProductionLine.findOne({ lineId });
    if (!productionLine) return;

    const currentTime = new Date();
    const previousStatus = productionLine.status;

    if (shouldForceStopForLunch() && newStatus === 'active') {
      newStatus = 'stopped';
      console.log(`Forcing ${lineId} to stopped status due to lunch break`);
    }
    if (!isInShift() && newStatus === 'active') {
      newStatus = 'stopped';
      console.log(`Forcing ${lineId} to stopped status due to being outside work shifts`);
    }
    const currentShift = getCurrentShift();
    if (currentShift) {
      const shiftStart = getShiftStartTime(currentTime);
      if (productionLine.lastShiftReset < shiftStart) {
        productionLine.totalStoppedTimeCurrentShift = 0;
        productionLine.lastShiftReset = currentTime;
        console.log(`Reset shift stopped time for ${lineId} - new shift started`);
      }
    }
    if (previousStatus === 'active' && newStatus !== 'active') {
      const activeLog = await ProductionLog.findOne({
        lineId,
        status: 'active'
      });
      if (activeLog) {
        const durationMinutes = Math.floor((currentTime.getTime() - activeLog.startTime.getTime()) / (1000 * 60));
        const candiesProduced = calculateCandiesProduced(activeLog.productionRate, durationMinutes);
        activeLog.endTime = currentTime;
        activeLog.duration = durationMinutes;
        activeLog.candiesProduced = candiesProduced;
        activeLog.status = 'completed';
        await activeLog.save();
      }
    }
    if (newStatus === 'active' && previousStatus !== 'active') {
      const productionRate = generateProductionRate(lineId);
      const newLog = new ProductionLog({
        lineId,
        candiesProduced: 0,
        productionRate,
        startTime: currentTime,
        duration: 0,
        status: 'active'
      });
      await newLog.save();
      console.log(`Created new production log for ${lineId} with rate ${productionRate} candies/hour`);
    }
    if (previousStatus === 'active' && newStatus === 'stopped') {
      const stoppedMinutes = calculateShiftStoppedTime(productionLine.lastStatusChange, currentTime);
      productionLine.totalStoppedTimeToday += stoppedMinutes;
      productionLine.totalStoppedTimeCurrentShift += stoppedMinutes;
    }
    productionLine.status = newStatus;
    productionLine.lastStatusChange = currentTime;
    productionLine.lastUpdated = currentTime;
    await productionLine.save();
    console.log(`Production line ${lineId} status updated to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating production line ${lineId} status:`, error);
  }
};

export const getTotalStoppedTime = async (req: Request, res: Response) => {
  try {
    const productionLines = await ProductionLine.find({});
    let totalStoppedTimeToday = 0;
    let totalStoppedTimeCurrentShift = 0;
    let currentlyStoppedLines = 0;
    for (const line of productionLines) {
      totalStoppedTimeToday += line.totalStoppedTimeToday;
      totalStoppedTimeCurrentShift += line.totalStoppedTimeCurrentShift;
      if (line.status === 'stopped') {
        const currentStoppedTime = calculateShiftStoppedTime(line.lastStatusChange, new Date());
        totalStoppedTimeToday += currentStoppedTime;
        totalStoppedTimeCurrentShift += currentStoppedTime;
        currentlyStoppedLines++;
      }
    }
    res.json({
      totalStoppedTimeToday: totalStoppedTimeToday,
      totalStoppedTimeCurrentShift: totalStoppedTimeCurrentShift,
      totalStoppedTimeHours: Math.round((totalStoppedTimeToday / 60) * 100) / 100,
      totalStoppedTimeShiftHours: Math.round((totalStoppedTimeCurrentShift / 60) * 100) / 100,
      currentlyStoppedLines,
      totalLines: productionLines.length
    });
  } catch (error) {
    console.error('Error fetching total stopped time:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const resetDailyStoppedTime = async () => {
  try {
    await ProductionLine.updateMany({}, {
      totalStoppedTimeToday: 0,
      totalStoppedTimeCurrentShift: 0,
      lastStatusChange: new Date(),
      lastShiftReset: new Date()
    });
    console.log('Daily and shift stopped time reset for all production lines');
  } catch (error) {
    console.error('Error resetting daily stopped time:', error);
  }
};

export const resetShiftStoppedTime = async () => {
  try {
    await ProductionLine.updateMany({}, {
      totalStoppedTimeCurrentShift: 0,
      lastShiftReset: new Date()
    });
    console.log('Shift stopped time reset for all production lines');
  } catch (error) {
    console.error('Error resetting shift stopped time:', error);
  }
};

const initializeActiveProductionLogs = async (req?: Request) => {
  try {
    const activeProductionLines = await ProductionLine.find({ status: 'active' });
    for (const line of activeProductionLines) {
      const existingLog = await ProductionLog.findOne({
        lineId: line.lineId,
        status: 'active'
      });
      if (!existingLog) {
        const productionRate = generateProductionRate(line.lineId);
        const newLog = new ProductionLog({
          lineId: line.lineId,
          candiesProduced: 0,
          productionRate,
          startTime: line.lastStatusChange || new Date(),
          duration: 0,
          status: 'active'
        });
        await newLog.save();
        console.log(`Initialized production log for ${line.lineId} with rate ${productionRate} candies/hour`);
      } else {
        console.log(`Production log already exists for ${line.lineId}`);
      }
    }
  } catch (error) {
    console.error('Error initializing active production logs:', error);
  }
};

export const getProductionStats = async (req: Request, res: Response) => {
  try {
    await initializeActiveProductionLogs(req);
    const activeLogs = await ProductionLog.find({ status: 'active' });
    let currentProductionRate = 0;
    activeLogs.forEach(log => {
      currentProductionRate += log.productionRate;
    });
    const result = {
      currentProductionRate,
      activeLines: activeLogs.length
    };
    console.log('Production stats result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching production stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLineProductionStats = async (req: Request, res: Response) => {
  try {
    const { lineId } = req.params;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const todayLogs = await ProductionLog.find({
      lineId,
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });
    const activeLog = await ProductionLog.findOne({
      lineId,
      status: 'active'
    });
    let totalCandies = 0;
    let totalTime = 0;
    todayLogs.forEach(log => {
      totalCandies += log.candiesProduced;
      totalTime += log.duration;
    });
    res.json({
      lineId,
      totalCandiesToday: totalCandies,
      totalProductionTime: totalTime,
      currentProductionRate: activeLog?.productionRate || 0,
      isCurrentlyActive: !!activeLog
    });
  } catch (error) {
    console.error('Error fetching line production stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getOEEData = async (req: Request, res: Response) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const productionLines = await ProductionLine.find({});
    const todayLogs = await ProductionLog.find({
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });
    const activeLogs = await ProductionLog.find({ status: 'active' });
    const oeeResults = [];
    const SHIFT_PLANNED_TIME = 240;
    const THEORETICAL_RATE = 1200;
    const currentShift = getCurrentShift();
    const inShift = isInShift();
    for (const line of productionLines) {
      if (!inShift) {
        oeeResults.push({
          lineId: line.lineId,
          availability: 0,
          performance: 0,
          quality: 0,
          oee: 0,
          oeePercentage: 0,
          status: 'critical'
        });
        continue;
      }
      const plannedTime = SHIFT_PLANNED_TIME;
      const stoppedTime = line.totalStoppedTimeCurrentShift;
      const operationalTime = Math.max(0, plannedTime - stoppedTime);
      let actualOutput = 0;
      let goodPieces = 0;
      const lineCompletedLogs = todayLogs.filter(log => log.lineId === line.lineId);
      lineCompletedLogs.forEach(log => {
        actualOutput += log.candiesProduced;
        goodPieces += log.candiesProduced;
      });
      const activeLog = activeLogs.find(log => log.lineId === line.lineId);
      if (activeLog) {
        const currentTime = new Date();
        const durationMinutes = Math.floor((currentTime.getTime() - activeLog.startTime.getTime()) / (1000 * 60));
        const currentCandies = calculateCandiesProduced(activeLog.productionRate, durationMinutes);
        actualOutput += currentCandies;
        goodPieces += currentCandies;
      }
      const theoreticalOutput = Math.floor((operationalTime / 60) * THEORETICAL_RATE);
      const oeeData: OEEData = {
        lineId: line.lineId,
        plannedTime,
        operationalTime,
        theoreticalOutput,
        actualOutput,
        goodPieces
      };
      let oeeResult = calculateOEE(oeeData);
      oeeResult.oee = Math.min(oeeResult.oee, 1);
      oeeResult.oeePercentage = Math.min(oeeResult.oeePercentage, 100);
      oeeResults.push(oeeResult);
    }
    const overallOEE = oeeResults.length > 0
      ? oeeResults.reduce((sum, result) => sum + result.oeePercentage, 0) / oeeResults.length
      : 0;
    res.json({
      lines: oeeResults,
      overall: {
        oee: overallOEE,
        status: overallOEE > 85 ? 'excellent' : overallOEE >= 60 ? 'good' : 'critical'
      }
    });
  } catch (error) {
    console.error('Error calculating OEE:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCurrentShiftInfo = async (req: Request, res: Response) => {
  try {
    const currentShift = getCurrentShift();
    const inLunchBreak = isLunchBreak();
    res.json({
      currentShift: currentShift ? {
        id: currentShift.id,
        name: currentShift.name,
        startTime: currentShift.startTime,
        endTime: currentShift.endTime
      } : null,
      inLunchBreak,
      lunchBreak: {
        startTime: LUNCH_BREAK.startTime,
        endTime: LUNCH_BREAK.endTime
      },
      allShifts: SHIFTS
    });
  } catch (error) {
    console.error('Error fetching current shift info:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const checkAndUpdateLinesForShiftStatus = async (req?: Request) => {
  try {
    const productionLines = await ProductionLine.find({});
    const currentTime = new Date();
    for (const line of productionLines) {
      if (!isInShift() && line.status === 'active') {
        const activeLog = await ProductionLog.findOne({
          lineId: line.lineId,
          status: 'active'
        });
        if (activeLog) {
          const durationMinutes = Math.floor((currentTime.getTime() - activeLog.startTime.getTime()) / (1000 * 60));
          const candiesProduced = calculateCandiesProduced(activeLog.productionRate, durationMinutes);
          activeLog.endTime = currentTime;
          activeLog.duration = durationMinutes;
          activeLog.candiesProduced = candiesProduced;
          activeLog.status = 'completed';
          await activeLog.save();
        }
        line.status = 'stopped';
        line.lastStatusChange = currentTime;
        line.lastUpdated = currentTime;
        await line.save();
        console.log(`Set ${line.lineId} to stopped due to being outside work shifts`);
      }
    }
  } catch (error) {
    console.error('Error checking and updating lines for shift status:', error);
  }
};

export const getLineHourlyProduction = async (req: Request, res: Response) => {
  try {
    const { lineId } = req.params;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const todayLogs = await ProductionLog.find({
      lineId,
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });
    const activeLog = await ProductionLog.findOne({
      lineId,
      status: 'active',
      startTime: { $gte: today, $lt: tomorrow }
    });
    if (activeLog) todayLogs.push(activeLog);
    const hours = [8, 9, 10, 11, 13, 14, 15, 16];
    const hourLabels = hours.map(h => (h < 10 ? `0${h}:00` : `${h}:00`));
    const hourlyProduction = hourLabels.map(label => ({ hour: label, produced: 0, target: 110 }));
    for (const log of todayLogs) {
      let logStart = new Date(log.startTime);
      let logEnd = log.endTime ? new Date(log.endTime) : new Date(log.startTime.getTime() + log.duration * 60000);
      if (logStart < today) logStart = new Date(today);
      if (logEnd > tomorrow) logEnd = new Date(tomorrow);
      for (let i = 0; i < hours.length; i++) {
        const hourStart = new Date(today);
        const hour = hours[i];
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);
        const overlapStart = logStart > hourStart ? logStart : hourStart;
        const overlapEnd = logEnd < hourEnd ? logEnd : hourEnd;
        const overlapMinutes = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 60000);
        if (overlapMinutes > 0 && log.duration > 0) {
          const candies = log.candiesProduced * (overlapMinutes / log.duration);
          hourlyProduction[i].produced += candies;
        }
      }
    }
    hourlyProduction.forEach(h => h.produced = Math.round(h.produced));
    res.json({
      lineId,
      hours: hourlyProduction
    });
  } catch (error) {
    console.error('Error fetching hourly production:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCombinedHourlyProduction = async (req: Request, res: Response) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const productionLines = await ProductionLine.find({});
    const lineIds = productionLines.map(line => line.lineId);
    const numLines = lineIds.length;
    const todayLogs = await ProductionLog.find({
      lineId: { $in: lineIds },
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });
    const activeLogs = await ProductionLog.find({
      lineId: { $in: lineIds },
      status: 'active',
      startTime: { $gte: today, $lt: tomorrow }
    });
    todayLogs.push(...activeLogs);
    const hours = [8, 9, 10, 11, 13, 14, 15, 16];
    const hourLabels = hours.map(h => (h < 10 ? `0${h}:00` : `${h}:00`));
    const hourlyProduction = hourLabels.map(label => ({ hour: label, produced: 0, target: 110 * numLines }));
    for (const log of todayLogs) {
      let logStart = new Date(log.startTime);
      let logEnd = log.endTime ? new Date(log.endTime) : new Date(log.startTime.getTime() + log.duration * 60000);
      if (logStart < today) logStart = new Date(today);
      if (logEnd > tomorrow) logEnd = new Date(tomorrow);
      for (let i = 0; i < hours.length; i++) {
        const hourStart = new Date(today);
        const hour = hours[i];
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);
        const overlapStart = logStart > hourStart ? logStart : hourStart;
        const overlapEnd = logEnd < hourEnd ? logEnd : hourEnd;
        const overlapMinutes = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 60000);
        if (overlapMinutes > 0 && log.duration > 0) {
          const candies = log.candiesProduced * (overlapMinutes / log.duration);
          hourlyProduction[i].produced += candies;
        }
      }
    }
    hourlyProduction.forEach(h => h.produced = Math.round(h.produced));
    res.json({
      hours: hourlyProduction
    });
  } catch (error) {
    console.error('Error fetching combined hourly production:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
