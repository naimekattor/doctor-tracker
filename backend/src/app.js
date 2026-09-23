import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Standard Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Doctor Tracker API is running',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;