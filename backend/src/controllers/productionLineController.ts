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

// Recupera tutte le linee di produzione.
export const getAllProductionLines = async (req: Request, res: Response) => {
  try {
    await checkAndUpdateLinesForShiftStatus(req);
    const lines = await ProductionLine.find({});

    res.json(lines);
  } catch (error) {
    console.error('Errore nel recupero delle linee di produzione:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera una singola linea di produzione.
export const getProductionLineById = async (req: Request, res: Response) => {
  try {
    const line = await ProductionLine.findById(req.params.id);

    if (!line) {
      return res.status(404).json({ message: 'Linea di produzione non trovata' });
    }

    res.json(line);
  } catch (error) {
    console.error('Errore nel recupero della linea di produzione per ID:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera una singola linea di produzione tramite lineId.
export const getProductionLineByLineId = async (req: Request, res: Response) => {
  try {
    const line = await ProductionLine.findOne({ lineId: req.params.lineId });

    if (!line) {
      return res.status(404).json({ message: 'Linea di produzione non trovata' });
    }

    res.json(line);
  } catch (error) {
    console.error('Errore nel recupero della linea di produzione per lineId:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};

// Aggiorna lo status di una singola linea di produzione.
export const updateProductionLineStatus = async (lineId: string, newStatus: 'active' | 'stopped' | 'maintenance' | 'issue', req?: Request) => {
  try {
    const productionLine = await ProductionLine.findOne({ lineId });
    
    if (!productionLine) return;

    const currentTime = new Date();
    const previousStatus = productionLine.status;

    // Se al momento non siamo durante la pausa pranzo, forza lo stato a 'stopped'.
    if (shouldForceStopForLunch() && newStatus === 'active') {
      newStatus = 'stopped';
      console.log(`${lineId} forzatamente impostata a 'stopped' a causa della pausa pranzo`);
    }

    // Se al momento non siamo durante la pausa pranzo, forza lo stato a 'stopped'.
    if (!isInShift() && newStatus === 'active') {
      newStatus = 'stopped';
      console.log(`${lineId} forzatamente impostata a 'stopped' a causa di essere fuori dalle turnazioni`);
    }

    // Recupera il turno corrente.
    const currentShift = getCurrentShift();

    // Se il turno corrente è diverso dal turno precedente, resetta il tempo di fermo turno.
    if (currentShift) {
      const shiftStart = getShiftStartTime(currentTime);

      if (productionLine.lastShiftReset < shiftStart) {
        productionLine.totalStoppedTimeCurrentShift = 0;
        productionLine.lastShiftReset = currentTime;
        console.log(`Reset tempo fermo turno per ${lineId} - nuovo turno iniziato`);
      }
    }

    // Se lo status precedente era 'active' e il nuovo status non è 'active', aggiorna il log di produzione.
    if (previousStatus === 'active' && newStatus !== 'active') {
      const activeLog = await ProductionLog.findOne({
        lineId,
        status: 'active'
      });

      // Se il log di produzione è attivo, aggiorna il log di produzione.
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

    // Se il nuovo status è 'active' e lo status precedente non era 'active', crea un nuovo log di produzione.
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
      console.log(`Creazione nuovo log di produzione per ${lineId} con tasso ${productionRate} caramelle/ora`);
    }

    // Se lo status precedente era 'active' e il nuovo status è 'stopped', aggiorna il tempo di fermo turno.
    if (previousStatus === 'active' && newStatus === 'stopped') {
      const stoppedMinutes = calculateShiftStoppedTime(productionLine.lastStatusChange, currentTime);
      productionLine.totalStoppedTimeToday += stoppedMinutes;
      productionLine.totalStoppedTimeCurrentShift += stoppedMinutes;
    }

    // Aggiorna lo status della linea di produzione.
    productionLine.status = newStatus;
    productionLine.lastStatusChange = currentTime;
    productionLine.lastUpdated = currentTime;
    await productionLine.save();

    console.log(`Linea di produzione ${lineId} stato aggiornato a ${newStatus}`);
  } catch (error) {
    console.error(`Errore nell'aggiornamento dello stato della linea di produzione ${lineId}:`, error);
  }
};

// Recupera il tempo di fermo totale.
export const getTotalStoppedTime = async (req: Request, res: Response) => {
  try {
    const productionLines = await ProductionLine.find({});
    let totalStoppedTimeToday = 0;
    let totalStoppedTimeCurrentShift = 0;
    let currentlyStoppedLines = 0;

    // Calcola il tempo di fermo totale.
    for (const line of productionLines) {
      totalStoppedTimeToday += line.totalStoppedTimeToday;
      totalStoppedTimeCurrentShift += line.totalStoppedTimeCurrentShift;

      // Se lo status della linea di produzione è 'stopped', aggiorna il tempo di fermo turno.
      if (line.status === 'stopped') {
        const currentStoppedTime = calculateShiftStoppedTime(line.lastStatusChange, new Date());
        totalStoppedTimeToday += currentStoppedTime;
        totalStoppedTimeCurrentShift += currentStoppedTime;
        currentlyStoppedLines++;
      }
    }

    // Restituisce il tempo di fermo.
    res.json({
      totalStoppedTimeToday: totalStoppedTimeToday,
      totalStoppedTimeCurrentShift: totalStoppedTimeCurrentShift,
      totalStoppedTimeHours: Math.round((totalStoppedTimeToday / 60) * 100) / 100,
      totalStoppedTimeShiftHours: Math.round((totalStoppedTimeCurrentShift / 60) * 100) / 100,
      currentlyStoppedLines,
      totalLines: productionLines.length
    });
  } catch (error) {
    console.error('Errore nel recupero del tempo fermo totale:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};

// Resetta il tempo di fermo giornaliero.
export const resetDailyStoppedTime = async () => {
  try {
    await ProductionLine.updateMany({}, {
      totalStoppedTimeToday: 0,
      totalStoppedTimeCurrentShift: 0,
      lastStatusChange: new Date(),
      lastShiftReset: new Date()
    });

    console.log('Tempo fermo giornaliero e turno reset per tutte le linee di produzione');
  } catch (error) {
    console.error('Errore nel reset del tempo fermo giornaliero:', error);
  }
};

// Resetta il tempo di fermo turno.
export const resetShiftStoppedTime = async () => {
  try {
    await ProductionLine.updateMany({}, {
      totalStoppedTimeCurrentShift: 0,
      lastShiftReset: new Date()
    });
    console.log('Reset tempo fermo turno per tutte le linee di produzione');
  } catch (error) {
    console.error('Errore nel reset del tempo fermo turno:', error);
  }
};

// Inizializza i log di produzione.
const initializeActiveProductionLogs = async (req?: Request) => {
  try {
    const activeProductionLines = await ProductionLine.find({ status: 'active' });

    // Per ogni linea di produzione attiva, crea un nuovo log di produzione (se non esiste).
    for (const line of activeProductionLines) {
      // Recupera il log di produzione attivo (se esiste).
      const existingLog = await ProductionLog.findOne({
        lineId: line.lineId,
        status: 'active'
      });

      // Se il log di produzione non esiste, crea un nuovo log di produzione.
      if (!existingLog) {
        const productionRate = generateProductionRate(line.lineId);

        // Crea un nuovo log di produzione.
        const newLog = new ProductionLog({
          lineId: line.lineId,
          candiesProduced: 0,
          productionRate,
          startTime: line.lastStatusChange || new Date(),
          duration: 0,
          status: 'active'
        });

        await newLog.save();

        console.log(`Log di produzione inizializzato per ${line.lineId} con tasso ${productionRate} caramelle/ora`);
      } else {
        console.log(`Log di produzione già esistente per ${line.lineId}`);
      }
    }
  } catch (error) {
    console.error('Errore nell\'inizializzazione dei log di produzione attivi:', error);
  }
};

// Recupera le statistiche di produzione.
export const getProductionStats = async (req: Request, res: Response) => {
  try {
    await initializeActiveProductionLogs(req);
    const activeLogs = await ProductionLog.find({ status: 'active' });

    // Calcola il tasso di produzione attuale.
    let currentProductionRate = 0;
    activeLogs.forEach(log => {
      currentProductionRate += log.productionRate;
    });

    // Restituisce le statistiche di produzione.
    const result = {
      currentProductionRate,
      activeLines: activeLogs.length
    };

    console.log('Risultato statistiche produzione:', result);

    res.json(result);
  } catch (error) {
    console.error('Errore nel recupero delle statistiche di produzione:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera le statistiche di produzione per una singola linea di produzione.
export const getLineProductionStats = async (req: Request, res: Response) => {
  try {
    const { lineId } = req.params;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    // Recupera i log di produzione completati per la linea di produzione.
    const todayLogs = await ProductionLog.find({
      lineId,
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    // Recupera il log di produzione attivo (se esiste).
    const activeLog = await ProductionLog.findOne({
      lineId,
      status: 'active'
    });

    // Calcola il totale delle caramelle prodotte e il totale del tempo di produzione.
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
    console.error('Errore nel recupero delle statistiche di produzione per linea:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera i dati OEE per la card KPI.
export const getOEEData = async (req: Request, res: Response) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    // Recupera tutte le linee di produzione.
    const productionLines = await ProductionLine.find({});

    // Recupera i log di produzione completati per oggi.
    const todayLogs = await ProductionLog.find({
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    // Recupera i log di produzione attivi.
    const activeLogs = await ProductionLog.find({ status: 'active' });

    // Inizializza i risultati OEE.
    const oeeResults = [];
    const SHIFT_PLANNED_TIME = 240;
    const THEORETICAL_RATE = 1200;
    const inShift = isInShift();

    // Per ogni linea di produzione, calcola i dati OEE.
    for (const line of productionLines) {
      // Se non siamo durante un turno, aggiungi una linea di produzione con dati OEE critici.
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

      // Calcola il tempo di produzione operativo.
      const plannedTime = SHIFT_PLANNED_TIME;
      const stoppedTime = line.totalStoppedTimeCurrentShift;
      const operationalTime = Math.max(0, plannedTime - stoppedTime);
      let actualOutput = 0;
      let goodPieces = 0;

      // Recupera i log di produzione completati per la linea di produzione.
      const lineCompletedLogs = todayLogs.filter(log => log.lineId === line.lineId);
      lineCompletedLogs.forEach(log => {
        actualOutput += log.candiesProduced;
        goodPieces += log.candiesProduced;
      });

      // Recupera il log di produzione attivo (se esiste).
      const activeLog = activeLogs.find(log => log.lineId === line.lineId);

      // Se il log di produzione attivo esiste, aggiorna il totale delle caramelle prodotte.
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
    console.error('Errore nel calcolo dell\'OEE:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera le informazioni sul turno corrente.
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
    console.error('Errore nel recupero delle informazioni sulla turnazione corrente:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

// Controlla e aggiorna lo stato delle linee in base al turno.
export const checkAndUpdateLinesForShiftStatus = async (req?: Request) => {
  try {
    const productionLines = await ProductionLine.find({});
    const currentTime = new Date();

    // Per ogni linea di produzione, controlla se siamo fuori da un turno e se lo stato è 'active'.
    for (const line of productionLines) {
      // Se non siamo durante un turno e lo status della linea di produzione è 'active', aggiorna il log di produzione.
      if (!isInShift() && line.status === 'active') {
        // Recupera il log di produzione attivo (se esiste).
        const activeLog = await ProductionLog.findOne({
          lineId: line.lineId,
          status: 'active'
        });

        // Se il log di produzione attivo esiste, aggiorna il log di produzione.
        if (activeLog) {
          const durationMinutes = Math.floor((currentTime.getTime() - activeLog.startTime.getTime()) / (1000 * 60));
          const candiesProduced = calculateCandiesProduced(activeLog.productionRate, durationMinutes);
          activeLog.endTime = currentTime;
          activeLog.duration = durationMinutes;
          activeLog.candiesProduced = candiesProduced;
          activeLog.status = 'completed';
          await activeLog.save();
        }

        // Imposta lo stato della linea di produzione a 'stopped'.
        line.status = 'stopped';
        line.lastStatusChange = currentTime;
        line.lastUpdated = currentTime;

        // Salva la linea di produzione.
        await line.save();
        console.log(`Impostato ${line.lineId} a stopped a causa di essere fuori dalle turnazioni`);
      }
    }
  } catch (error) {
    console.error('Errore nella verifica e aggiornamento dello stato delle linee per la turnazione:', error);
  }
};

// Recupera la produzione oraria per una singola linea di produzione.
export const getLineHourlyProduction = async (req: Request, res: Response) => {
  try {
    // Recupera l'ID della linea di produzione.
    const { lineId } = req.params;

    // Recupera le date di oggi e domani.
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    // Recupera i log di produzione completati per la linea di produzione.
    const todayLogs = await ProductionLog.find({
      lineId,
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    // Recupera il log di produzione attivo (se esiste).
    const activeLog = await ProductionLog.findOne({
      lineId,
      status: 'active',
      startTime: { $gte: today, $lt: tomorrow }
    });

    if (activeLog) todayLogs.push(activeLog);
    const hours = [9, 10, 11, 12, 14, 15, 16, 17];
    const hourLabels = hours.map(h => (h < 10 ? `0${h}:00` : `${h}:00`));
    const hourlyProduction = hourLabels.map(label => ({ hour: label, produced: 0, target: 110 }));

    // Per ogni log di produzione, calcola la produzione oraria.
    for (const log of todayLogs) {
      let logStart = new Date(log.startTime);
      let logEnd = log.endTime ? new Date(log.endTime) : new Date(log.startTime.getTime() + log.duration * 60000);
      if (logStart < today) logStart = new Date(today);
      if (logEnd > tomorrow) logEnd = new Date(tomorrow);

      // Per ogni ora, calcola la produzione oraria.
      for (let i = 0; i < hours.length; i++) {
        const hourStart = new Date(today);
        const hour = hours[i];
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);
        const overlapStart = logStart > hourStart ? logStart : hourStart;
        const overlapEnd = logEnd < hourEnd ? logEnd : hourEnd;
        const overlapMinutes = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 60000);

        // Se la produzione oraria è maggiore di 0 e il tempo di produzione è maggiore di 0, calcola la produzione oraria.
        if (overlapMinutes > 0 && log.duration > 0) {
          const candies = log.candiesProduced * (overlapMinutes / log.duration);
          hourlyProduction[i].produced += candies;
        }
      }
    }

    // Arrotonda la produzione oraria.
    hourlyProduction.forEach(h => h.produced = Math.round(h.produced));
    res.json({
      lineId,
      hours: hourlyProduction
    });
  } catch (error) {
    console.error('Errore nel recupero della produzione oraria:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera la produzione oraria combinata per tutte le linee di produzione.
export const getCombinedHourlyProduction = async (req: Request, res: Response) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const productionLines = await ProductionLine.find({});

    const lineIds = productionLines.map(line => line.lineId);

    const numLines = lineIds.length;

    // Recupera i log di produzione completati per tutte le linee di produzione.
    const todayLogs = await ProductionLog.find({
      lineId: { $in: lineIds },
      startTime: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    // Recupera i log di produzione attivi per tutte le linee di produzione.
    const activeLogs = await ProductionLog.find({
      lineId: { $in: lineIds },
      status: 'active',
      startTime: { $gte: today, $lt: tomorrow }
    });

    // Unisce i log di produzione completati e attivi.
    todayLogs.push(...activeLogs);

    // Recupera le ore di produzione.
    const hours = [9, 10, 11, 12, 14, 15, 16, 17];
    const hourLabels = hours.map(h => (h < 10 ? `0${h}:00` : `${h}:00`));
    const hourlyProduction = hourLabels.map(label => ({ hour: label, produced: 0, target: 110 * numLines }));

    // Per ogni log di produzione, calcola la produzione oraria.
    for (const log of todayLogs) {
      let logStart = new Date(log.startTime);
      let logEnd = log.endTime ? new Date(log.endTime) : new Date(log.startTime.getTime() + log.duration * 60000);
      if (logStart < today) logStart = new Date(today);
      if (logEnd > tomorrow) logEnd = new Date(tomorrow);

      // Per ogni ora, calcola la produzione oraria.
      for (let i = 0; i < hours.length; i++) {
        const hourStart = new Date(today);
        const hour = hours[i];
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);
        const overlapStart = logStart > hourStart ? logStart : hourStart;
        const overlapEnd = logEnd < hourEnd ? logEnd : hourEnd;
        const overlapMinutes = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 60000);

        // Se la produzione oraria è maggiore di 0 e il tempo di produzione è maggiore di 0, calcola la produzione oraria.
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
    console.error('Errore nel recupero della produzione oraria combinata:', error);

    res.status(500).json({ message: 'Errore del server' });
  }
};
