import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';

import authRoutes from './routes/auth.js';
import caseRoutes from './routes/cases.js';
import evidenceRoutes from './routes/evidence.js';
import relationshipRoutes from './routes/relationships.js';
import graphRoutes from './routes/graph.js';
import personRoutes from './routes/persons.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database & Seed
initDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'DERIS (Dynamic Evidence Relationship Indexing System)',
    version: '1.0.0-PROTOTYPE',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`  DERIS Backend Engine Running on http://localhost:${PORT}`);
    console.log(`========================================================`);
  });
}

export default app;
