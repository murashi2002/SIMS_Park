const express = require('express');
const { createStockOut, getStockOutRecords, getStockOutById, updateStockOut, deleteStockOut } = require('../controllers/stockOutController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createStockOut);
router.get('/', authenticate, getStockOutRecords);
router.get('/:id', authenticate, getStockOutById);
router.put('/:id', authenticate, updateStockOut);
router.delete('/:id', authenticate, deleteStockOut);

module.exports = router;
