import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import issueRoutes from './routes/issues';
import productionLineRoutes from './routes/productionLines';
import taskRoutes from './routes/tasks';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
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