-- Create SIMS Database
CREATE DATABASE IF NOT EXISTS SIMS;
USE SIMS;

-- Users table for authentication
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare_Part table
CREATE TABLE Spare_Part (
  SparePartID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Category VARCHAR(50) NOT NULL,
  Quantity INT NOT NULL,
  UnitPrice DECIMAL(10, 2) NOT NULL,
  TotalPrice DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock_In table
CREATE TABLE Stock_In (
  StockInID INT PRIMARY KEY AUTO_INCREMENT,
  SparePartID INT NOT NULL,
  StockInQuantity INT NOT NULL,
  StockInDate DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID) ON DELETE CASCADE
);

-- Stock_Out table
CREATE TABLE Stock_Out (
  StockOutID INT PRIMARY KEY AUTO_INCREMENT,
  SparePartID INT NOT NULL,
  StockOutQuantity INT NOT NULL,
  StockOutUnitPrice DECIMAL(10, 2) NOT NULL,
  StockOutTotalPrice DECIMAL(12, 2),
  StockOutDate DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_spare_part_name ON Spare_Part(Name);
CREATE INDEX idx_stock_in_date ON Stock_In(StockInDate);
CREATE INDEX idx_stock_out_date ON Stock_Out(StockOutDate);
CREATE INDEX idx_stock_in_spare_part ON Stock_In(SparePartID);
CREATE INDEX idx_stock_out_spare_part ON Stock_Out(SparePartID);
