const express = require('express');
const { getDailyStockStatus, getDailyStockOutReport, getCustomReport } = require('../controllers/reportsController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/daily-stock-status', authenticate, getDailyStockStatus);
router.get('/daily-stock-out', authenticate, getDailyStockOutReport);
router.get('/custom', authenticate, getCustomReport);

module.exports = router;
