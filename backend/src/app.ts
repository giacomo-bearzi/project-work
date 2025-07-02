import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import issueRoutes from './routes/issues';
import productionLineRoutes from './routes/productionLines';
import taskRoutes from './routes/tasks';
import subLineRoutes from './routes/subLines';
import machineRoutes from './routes/machines';
import temperatureLogRoutes from './routes/temperatureLogs';
import consumptionLogRoutes from './routes/consumptionLogs';
import powerLogRoutes from './routes/powerLogs';
import co2EmissionLogRoutes from './routes/co2EmissionLogs';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import cron from 'node-cron';
import { resetDailyStoppedTime, resetShiftStoppedTime, updateProductionLineStatus } from './controllers/productionLineController';
import { getCurrentShift, shouldForceStopForLunch } from './utils/shiftCalculator';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true, // Abilita l'interfaccia GraphiQL per testare le query
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/production-lines', productionLineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sub-lines', subLineRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/temperature-logs', temperatureLogRoutes);
app.use('/api/consumption-logs', consumptionLogRoutes);
app.use('/api/power-logs', powerLogRoutes);
app.use('/api/co2-emission-logs', co2EmissionLogRoutes);

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project-work')
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error details:', err);
        process.exit(1); // Termina il processo se non riesce a connettersi al database
    });

// Reset stopped time at midnight every day
cron.schedule('0 0 * * *', () => {
  resetDailyStoppedTime();
});

// Reset shift stopped time at shift start times
cron.schedule('0 8 * * *', () => {
  console.log('Morning shift starting - resetting shift stopped time');
  resetShiftStoppedTime();
});

cron.schedule('0 13 * * *', () => {
  console.log('Afternoon shift starting - resetting shift stopped time');
  resetShiftStoppedTime();
});

// Enforce lunch break - stop all lines at 12:00
cron.schedule('0 12 * * *', async () => {
  console.log('Lunch break starting - stopping all production lines');
  try {
    // Get all active production lines and stop them
    const { default: ProductionLine } = await import('./models/ProductionLine');
    const activeLines = await ProductionLine.find({ status: 'active' });
    
    for (const line of activeLines) {
      await updateProductionLineStatus(line.lineId, 'stopped');
    }
    
    console.log(`Stopped ${activeLines.length} production lines for lunch break`);
  } catch (error) {
    console.error('Error enforcing lunch break:', error);
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error details:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message || 'Unknown error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;