const pool = require('../config/database');

// Create stock out record
const createStockOut = async (req, res) => {
  try {
    const { sparePartId, quantity, unitPrice, date } = req.body;

    if (!sparePartId || quantity === undefined || !unitPrice) {
      return res.status(400).json({ message: 'Spare part ID, quantity, and unit price are required' });
    }

    const conn = await pool.getConnection();
    const stockOutDate = date || new Date().toISOString().split('T')[0];
    const totalPrice = quantity * unitPrice;

    // Insert into Stock_Out
    const [result] = await conn.query(
      'INSERT INTO Stock_Out (SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate) VALUES (?, ?, ?, ?, ?)',
      [sparePartId, quantity, unitPrice, totalPrice, stockOutDate]
    );

    // Update spare part quantity
    await conn.query(
      'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SparePartID = ?',
      [quantity, sparePartId]
    );

    conn.release();
    res.status(201).json({ message: 'Stock out recorded successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to record stock out', error: error.message });
  }
};

// Get all stock out records
const getStockOutRecords = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [records] = await conn.query(`
      SELECT so.*, sp.Name, sp.Category 
      FROM Stock_Out so 
      JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID 
      ORDER BY so.StockOutDate DESC
    `);
    conn.release();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve stock out records', error: error.message });
  }
};

// Get stock out record by ID
const getStockOutById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const [record] = await conn.query(`
      SELECT so.*, sp.Name, sp.Category 
      FROM Stock_Out so 
      JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID 
      WHERE so.StockOutID = ?
    `, [id]);
    conn.release();

    if (record.length === 0) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    res.json(record[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve stock out record', error: error.message });
  }
};

// Update stock out record
const updateStockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unitPrice, date } = req.body;

    const conn = await pool.getConnection();

    // Get existing record
    const [existing] = await conn.query('SELECT * FROM Stock_Out WHERE StockOutID = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    const oldQuantity = existing[0].StockOutQuantity;
    const newQuantity = quantity || oldQuantity;
    const newUnitPrice = unitPrice || existing[0].StockOutUnitPrice;
    const newTotalPrice = newQuantity * newUnitPrice;
    const newDate = date || existing[0].StockOutDate;

    // Update the record
    await conn.query(
      'UPDATE Stock_Out SET StockOutQuantity = ?, StockOutUnitPrice = ?, StockOutTotalPrice = ?, StockOutDate = ? WHERE StockOutID = ?',
      [newQuantity, newUnitPrice, newTotalPrice, newDate, id]
    );

    // Update spare part quantity (reverse old change and apply new)
    const quantityDifference = newQuantity - oldQuantity;
    await conn.query(
      'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SparePartID = ?',
      [quantityDifference, existing[0].SparePartID]
    );

    conn.release();
    res.json({ message: 'Stock out record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update stock out record', error: error.message });
  }
};

// Delete stock out record
const deleteStockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    // Get existing record
    const [existing] = await conn.query('SELECT * FROM Stock_Out WHERE StockOutID = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    // Delete the record
    await conn.query('DELETE FROM Stock_Out WHERE StockOutID = ?', [id]);

    // Restore spare part quantity
    await conn.query(
      'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
      [existing[0].StockOutQuantity, existing[0].SparePartID]
    );

    conn.release();
    res.json({ message: 'Stock out record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete stock out record', error: error.message });
  }
};

module.exports = { createStockOut, getStockOutRecords, getStockOutById, updateStockOut, deleteStockOut };
