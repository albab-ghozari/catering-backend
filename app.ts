import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Inisialisasi dotenv
dotenv.config();

// Inisialisasi express
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/order';

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);

export default app;
