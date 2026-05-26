const express = require('express');
const { createSparePart, getSpareParts, getSparePartById } = require('../controllers/sparePartController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createSparePart);
router.get('/', authenticate, getSpareParts);
router.get('/:id', authenticate, getSparePartById);

module.exports = router;
