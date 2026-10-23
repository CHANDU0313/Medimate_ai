import { Router } from 'express';
import { isAIConfigured } from '../services/geminiService.js';

const router = Router();

router.get('/', (req, res) => {
  const aiConnected = isAIConfigured();
  res.json({
    status: 'ok',
    aiConnected,
    demoMode: !aiConnected,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    service: 'MediMate AI - Healthcare Education API'
  });
});

export default router;
