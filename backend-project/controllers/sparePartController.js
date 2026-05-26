const pool = require('../config/database');

// Create spare part
const createSparePart = async (req, res) => {
  try {
    const { name, category, quantity, unitPrice, totalPrice } = req.body;

    if (!name || !category || quantity === undefined || !unitPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const conn = await pool.getConnection();
    const calculateTotal = quantity * unitPrice;

    await conn.query(
      'INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)',
      [name, category, quantity, unitPrice, calculateTotal]
    );

    conn.release();
    res.status(201).json({ message: 'Spare part added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create spare part', error: error.message });
  }
};

// Get all spare parts
const getSpareParts = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [spareParts] = await conn.query('SELECT * FROM Spare_Part');
    conn.release();

    res.json(spareParts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve spare parts', error: error.message });
  }
};

// Get spare part by ID
const getSparePartById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const [sparePart] = await conn.query('SELECT * FROM Spare_Part WHERE SparePartID = ?', [id]);
    conn.release();

    if (sparePart.length === 0) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.json(sparePart[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve spare part', error: error.message });
  }
};

module.exports = { createSparePart, getSpareParts, getSparePartById };
