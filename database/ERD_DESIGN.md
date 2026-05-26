# Entity Relationship Diagram (ERD) - SIMS Database

## Overview
The SIMS database is designed with 4 main entities to manage stock inventory:
1. **Users** - System users for authentication
2. **Spare_Part** - Inventory items
3. **Stock_In** - Stock inflow transactions
4. **Stock_Out** - Stock outflow transactions

## Entities and Attributes

### 1. Users Entity
**Purpose**: User authentication and access control

```
Users (users table)
├─ id (PK, INT, AUTO_INCREMENT)
├─ username (VARCHAR(50), UNIQUE, NOT NULL)
├─ password (VARCHAR(255), NOT NULL)
└─ created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

**Cardinality**: One user can have many sessions/tokens

---

### 2. Spare_Part Entity
**Purpose**: Store information about spare parts inventory

```
Spare_Part
├─ SparePartID (PK, INT, AUTO_INCREMENT)
├─ Name (VARCHAR(100), NOT NULL)
├─ Category (VARCHAR(50), NOT NULL)
├─ Quantity (INT, NOT NULL) [Current available quantity]
├─ UnitPrice (DECIMAL(10,2), NOT NULL)
├─ TotalPrice (DECIMAL(12,2)) [Calculated: Quantity × UnitPrice]
└─ created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

**Cardinality**: 
- One Spare_Part has many Stock_In records (1:M)
- One Spare_Part has many Stock_Out records (1:M)

---

### 3. Stock_In Entity
**Purpose**: Record stock inflow (purchases, receipts)

```
Stock_In
├─ StockInID (PK, INT, AUTO_INCREMENT)
├─ SparePartID (FK, INT, NOT NULL) → References Spare_Part(SparePartID)
├─ StockInQuantity (INT, NOT NULL)
├─ StockInDate (DATE, NOT NULL)
└─ created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

**Relationships**:
- FK: SparePartID → Spare_Part.SparePartID (1:M)
- Cardinality: 0 or more Stock_In records per Spare_Part

---

### 4. Stock_Out Entity
**Purpose**: Record stock outflow (sales, removals)

```
Stock_Out
├─ StockOutID (PK, INT, AUTO_INCREMENT)
├─ SparePartID (FK, INT, NOT NULL) → References Spare_Part(SparePartID)
├─ StockOutQuantity (INT, NOT NULL)
├─ StockOutUnitPrice (DECIMAL(10,2), NOT NULL)
├─ StockOutTotalPrice (DECIMAL(12,2)) [Calculated: Quantity × UnitPrice]
├─ StockOutDate (DATE, NOT NULL)
└─ created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

**Relationships**:
- FK: SparePartID → Spare_Part.SparePartID (1:M)
- Cardinality: 0 or more Stock_Out records per Spare_Part

---

## Relationship Description

### Stock_In to Spare_Part
- **Type**: Many-to-One (M:1)
- **Foreign Key**: Stock_In.SparePartID → Spare_Part.SparePartID
- **Cardinality**: (0,M) to (1,1)
- **Rule**: Each Stock_In record must reference exactly one Spare_Part
- **Cascade Delete**: ON DELETE CASCADE

### Stock_Out to Spare_Part
- **Type**: Many-to-One (M:1)
- **Foreign Key**: Stock_Out.SparePartID → Spare_Part.SparePartID
- **Cardinality**: (0,M) to (1,1)
- **Rule**: Each Stock_Out record must reference exactly one Spare_Part
- **Cascade Delete**: ON DELETE CASCADE

---

## ERD Representation (Text Format)

```
                              ┌─────────────────┐
                              │     Users       │
                              ├─────────────────┤
                              │ id (PK)         │
                              │ username(UNIQUE)│
                              │ password        │
                              │ created_at      │
                              └─────────────────┘

                  ┌──────────────────────────────────┐
                  │         Spare_Part              │
                  ├──────────────────────────────────┤
                  │ SparePartID (PK)                │
                  │ Name                            │
                  │ Category                        │
                  │ Quantity                        │
                  │ UnitPrice                       │
                  │ TotalPrice                      │
                  │ created_at                      │
                  └──────────────────────────────────┘
                           ▲              ▲
                           │              │
                      (1:M) │              │ (1:M)
                           │              │
           ┌───────────────┘              └──────────────┐
           │                                             │
    ┌──────▼────────────────┐              ┌────────────▼────────┐
    │     Stock_In          │              │    Stock_Out        │
    ├───────────────────────┤              ├─────────────────────┤
    │ StockInID (PK)        │              │ StockOutID (PK)     │
    │ SparePartID (FK)      │              │ SparePartID (FK)    │
    │ StockInQuantity       │              │ StockOutQuantity    │
    │ StockInDate           │              │ StockOutUnitPrice   │
    │ created_at            │              │ StockOutTotalPrice  │
    └───────────────────────┘              │ StockOutDate        │
                                           │ created_at          │
                                           └─────────────────────┘
```

---

## Database Keys

### Primary Keys (PK)
- users.id
- Spare_Part.SparePartID
- Stock_In.StockInID
- Stock_Out.StockOutID

### Foreign Keys (FK)
- Stock_In.SparePartID → Spare_Part.SparePartID
- Stock_Out.SparePartID → Spare_Part.SparePartID

### Unique Keys
- users.username

### Indexes
- Spare_Part(Name)
- Stock_In(StockInDate)
- Stock_Out(StockOutDate)
- Stock_In(SparePartID)
- Stock_Out(SparePartID)

---

## Business Rules

1. **Inventory Management**
   - Spare part quantity is updated whenever stock is added (Stock_In) or removed (Stock_Out)
   - Total price of spare part = Quantity × UnitPrice
   - Cannot delete a spare part if it has associated stock transactions

2. **Stock In**
   - Every stock in must reference an existing spare part
   - Quantity must be positive
   - Date cannot be in the future

3. **Stock Out**
   - Every stock out must reference an existing spare part
   - Quantity cannot exceed current available quantity
   - Each stock out has its own unit price (may differ from current spare part unit price)
   - Date cannot be in the future

4. **Authentication**
   - Username must be unique
   - Password is encrypted before storage
   - User is required for all transactions

---

## Normalization

### First Normal Form (1NF)
✅ All attributes are atomic (no repeating groups)
✅ Each table has a primary key

### Second Normal Form (2NF)
✅ All non-key attributes depend on the entire primary key
✅ No partial dependencies

### Third Normal Form (3NF)
✅ No transitive dependencies
✅ All non-key attributes depend only on the primary key

**Conclusion**: The database is in 3NF ✅

---

## Design Notes

1. **Cascade Delete**: Foreign keys use CASCADE delete to maintain referential integrity
2. **Date Fields**: All dates are stored in DATE format (YYYY-MM-DD)
3. **Currency**: Price fields use DECIMAL(10,2) for accuracy
4. **Timestamps**: created_at fields track record creation time
5. **Indexes**: Indexes are created on frequently queried fields for performance

---

**Date**: May 26, 2025
**Designer**: Niyonkuru Fiston
**System**: SIMS (Stock Inventory Management System)
