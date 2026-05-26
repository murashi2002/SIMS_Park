const pool = require('../config/database');

// Get daily stock status report
const getDailyStockStatus = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    const [report] = await conn.query(`
      SELECT 
        sp.SparePartID,
        sp.Name as SpareName,
        sp.Quantity as StoredQuantity,
        COALESCE(SUM(so.StockOutQuantity), 0) as StockOutQuantity,
        sp.Quantity - COALESCE(SUM(so.StockOutQuantity), 0) as RemainingQuantity,
        CURDATE() as ReportDate
      FROM Spare_Part sp
      LEFT JOIN Stock_Out so ON sp.SparePartID = so.SparePartID AND DATE(so.StockOutDate) = CURDATE()
      GROUP BY sp.SparePartID, sp.Name, sp.Quantity
      ORDER BY sp.Name
    `);
    
    conn.release();
    res.json({ date: new Date().toISOString().split('T')[0], data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate daily stock status report', error: error.message });
  }
};

// Get daily stock out report
const getDailyStockOutReport = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    const [report] = await conn.query(`
      SELECT 
        so.StockOutID,
        sp.Name as SpareName,
        sp.Category,
        so.StockOutQuantity as Quantity,
        so.StockOutUnitPrice as UnitPrice,
        so.StockOutTotalPrice as TotalPrice,
        so.StockOutDate as Date
      FROM Stock_Out so
      JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID
      WHERE DATE(so.StockOutDate) = CURDATE()
      ORDER BY so.StockOutDate DESC, so.StockOutID DESC
    `);
    
    conn.release();
    res.json({ date: new Date().toISOString().split('T')[0], data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate daily stock out report', error: error.message });
  }
};

// Get custom date range report
const getCustomReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    if (!startDate || !endDate || !reportType) {
      return res.status(400).json({ message: 'startDate, endDate, and reportType are required' });
    }

    const conn = await pool.getConnection();
    let report;

    if (reportType === 'stock-status') {
      [report] = await conn.query(`
        SELECT 
          sp.SparePartID,
          sp.Name as SpareName,
          sp.Quantity as StoredQuantity,
          COALESCE(SUM(so.StockOutQuantity), 0) as StockOutQuantity,
          sp.Quantity - COALESCE(SUM(so.StockOutQuantity), 0) as RemainingQuantity
        FROM Spare_Part sp
        LEFT JOIN Stock_Out so ON sp.SparePartID = so.SparePartID AND DATE(so.StockOutDate) BETWEEN ? AND ?
        GROUP BY sp.SparePartID, sp.Name, sp.Quantity
        ORDER BY sp.Name
      `, [startDate, endDate]);
    } else if (reportType === 'stock-out') {
      [report] = await conn.query(`
        SELECT 
          so.StockOutID,
          sp.Name as SpareName,
          sp.Category,
          so.StockOutQuantity as Quantity,
          so.StockOutUnitPrice as UnitPrice,
          so.StockOutTotalPrice as TotalPrice,
          so.StockOutDate as Date
        FROM Stock_Out so
        JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID
        WHERE DATE(so.StockOutDate) BETWEEN ? AND ?
        ORDER BY so.StockOutDate DESC
      `, [startDate, endDate]);
    }

    conn.release();
    res.json({ startDate, endDate, reportType, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate custom report', error: error.message });
  }
};

module.exports = { getDailyStockStatus, getDailyStockOutReport, getCustomReport };
