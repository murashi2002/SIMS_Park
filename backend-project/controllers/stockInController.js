const pool = require('../config/database');

// Create stock in record
const createStockIn = async (req, res) => {
  try {
    const { sparePartId, quantity, date } = req.body;

    if (!sparePartId || quantity === undefined) {
      return res.status(400).json({ message: 'Spare part ID and quantity are required' });
    }

    const conn = await pool.getConnection();
    const stockInDate = date || new Date().toISOString().split('T')[0];

    // Insert into Stock_In
    const [result] = await conn.query(
      'INSERT INTO Stock_In (SparePartID, StockInQuantity, StockInDate) VALUES (?, ?, ?)',
      [sparePartId, quantity, stockInDate]
    );

    // Update spare part quantity
    await conn.query(
      'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
      [quantity, sparePartId]
    );

    conn.release();
    res.status(201).json({ message: 'Stock in recorded successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to record stock in', error: error.message });
  }
};

// Get all stock in records
const getStockInRecords = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [records] = await conn.query(`
      SELECT si.*, sp.Name, sp.Category 
      FROM Stock_In si 
      JOIN Spare_Part sp ON si.SparePartID = sp.SparePartID 
      ORDER BY si.StockInDate DESC
    `);
    conn.release();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve stock in records', error: error.message });
  }
};

module.exports = { createStockIn, getStockInRecords };
