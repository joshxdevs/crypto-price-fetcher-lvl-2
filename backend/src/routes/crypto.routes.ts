import { Router } from 'express';
import {
  getBtcPrice,
  getEthPrice,
  getSolPrice,
  getNews,
  getHealth,
} from '../controllers/crypto.controller';

const router = Router();

// ─── Health ────────────────────────────────────────────────────────────────────
router.get('/health', getHealth);

// ─── Prices ────────────────────────────────────────────────────────────────────
router.get('/price/btc', getBtcPrice);
router.get('/price/eth', getEthPrice);
router.get('/price/sol', getSolPrice);

// ─── News ──────────────────────────────────────────────────────────────────────
router.get('/news', getNews);

export default router;
