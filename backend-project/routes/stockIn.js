const express = require('express');
const { createStockIn, getStockInRecords } = require('../controllers/stockInController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createStockIn);
router.get('/', authenticate, getStockInRecords);

module.exports = router;
