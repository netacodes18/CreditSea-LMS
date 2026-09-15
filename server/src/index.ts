import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
import authRoutes from './routes/authRoutes';
import borrowerRoutes from './routes/borrowerRoutes';
import adminRoutes from './routes/adminRoutes';
import salesRoutes from './routes/salesRoutes';
import collectionRoutes from './routes/collectionRoutes';
import path from 'path';

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/collection', collectionRoutes);

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'LMS API is running' });
});

// Fallback for 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
