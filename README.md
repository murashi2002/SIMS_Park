# Stock Inventory Management System (SIMS)

## Project Overview
SIMS is a comprehensive web-based application designed to manage stock inventory for SmartPark company. It handles the management of spare parts, tracking stock inflows and outflows, and generating reports.

## Project Structure
```
Niyonkuru_Fiston02_National_Practical_Exam_2025/
├── backend-project/          # Node.js Express API
│   ├── controllers/          # Business logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Authentication & validation
│   ├── config/              # Database configuration
│   ├── server.js            # Main server file
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
├── frontend-project/        # React Vite Application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── database/               # Database files
    └── sims.sql           # Database schema
```

## Technologies Used
- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: JWT with bcryptjs password encryption
- **API Communication**: Axios

## Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- npm or yarn package manager

## Installation & Setup

### 1. Database Setup
1. Open MySQL Command Line or MySQL Workbench
2. Run the SQL script from `database/sims.sql`:
   ```sql
   SOURCE path/to/database/sims.sql;
   ```
3. Verify tables were created in the `SIMS` database

### 2. Backend Setup
```bash
cd backend-project

# Install dependencies (already done, but here for reference)
npm install

# Create .env file (already created, verify database credentials)
# The .env file contains:
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=password
# DB_NAME=SIMS
# JWT_SECRET=smartpark_sims_secret_2025_secure

# Start the server
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend-project

# Install dependencies (already done, but here for reference)
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

### Authentication System
- User registration with strong password validation
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (@$!%*?&)
- Secure login with JWT token
- Password encryption using bcryptjs

### Menu Pages

#### 1. SparePart
- **Operations**: Create, Read
- Add new spare parts with name, category, quantity, and unit price
- View all spare parts in a table
- Automatic total price calculation

#### 2. StockIn
- **Operations**: Create, Read
- Record spare parts received/purchased
- Track quantity and date of stock inflow
- Automatic update of spare part inventory

#### 3. StockOut
- **Operations**: Create, Read, Update, Delete
- Record spare parts removed from stock
- Track unit price and total value
- Edit existing stock out records
- Delete stock out records (inventory is adjusted accordingly)

#### 4. Reports
- **Daily Stock Status Report**
  - Shows: Spare Name, Stored Quantity, StockOut Quantity, Remaining Quantity
- **Daily Stock Out Report**
  - Shows all stock out transactions for the day
- **Custom Date Range Reports**
  - Generate reports between specific dates
- **Export & Print**
  - Export reports to CSV format
  - Print-friendly view
  - Summary statistics

#### 5. Logout
- Secure logout that clears authentication token
- Returns to login page

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Spare Parts
- `POST /api/spare-parts` - Create spare part
- `GET /api/spare-parts` - Get all spare parts
- `GET /api/spare-parts/:id` - Get spare part by ID

### Stock In
- `POST /api/stock-in` - Create stock in record
- `GET /api/stock-in` - Get all stock in records

### Stock Out
- `POST /api/stock-out` - Create stock out record
- `GET /api/stock-out` - Get all stock out records
- `GET /api/stock-out/:id` - Get stock out record by ID
- `PUT /api/stock-out/:id` - Update stock out record
- `DELETE /api/stock-out/:id` - Delete stock out record

### Reports
- `GET /api/reports/daily-stock-status` - Daily stock status
- `GET /api/reports/daily-stock-out` - Daily stock out
- `GET /api/reports/custom` - Custom date range reports

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Spare_Part Table
```sql
CREATE TABLE Spare_Part (
  SparePartID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Category VARCHAR(50) NOT NULL,
  Quantity INT NOT NULL,
  UnitPrice DECIMAL(10, 2) NOT NULL,
  TotalPrice DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stock_In Table
```sql
CREATE TABLE Stock_In (
  StockInID INT PRIMARY KEY AUTO_INCREMENT,
  SparePartID INT NOT NULL,
  StockInQuantity INT NOT NULL,
  StockInDate DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID)
);
```

### Stock_Out Table
```sql
CREATE TABLE Stock_Out (
  StockOutID INT PRIMARY KEY AUTO_INCREMENT,
  SparePartID INT NOT NULL,
  StockOutQuantity INT NOT NULL,
  StockOutUnitPrice DECIMAL(10, 2) NOT NULL,
  StockOutTotalPrice DECIMAL(12, 2),
  StockOutDate DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID)
);
```

## Entity Relationship Diagram (ERD)

```
┌──────────────────┐           ┌──────────────────┐
│   Users          │           │   Spare_Part     │
├──────────────────┤           ├──────────────────┤
│ id (PK)          │           │ SparePartID (PK) │
│ username (UNIQUE)│           │ Name             │
│ password         │           │ Category         │
│ created_at       │           │ Quantity         │
└──────────────────┘           │ UnitPrice        │
                               │ TotalPrice       │
                               └──────────────────┘
                                      ▲
                                      │ FK
                                   ┌──┴──┐
                              ┌────┴─┐   │
                              │      │   │
                         ┌────▼──┐  └───▼────┐
                         │Stock_In│  │Stock_Out│
                         ├───────┤  ├────────┤
                         │Stock  │  │Stock   │
                         │InID   │  │OutID   │
                         ├───────┤  ├────────┤
                         │SparePart│ │SparePart
                         │ID (FK) │ │ID (FK) │
                         ├───────┤  ├────────┤
                         │Stock  │  │Stock   │
                         │InQty  │  │OutQty  │
                         ├───────┤  ├────────┤
                         │Stock  │  │Unit    │
                         │InDate │  │Price   │
                         └───────┘  ├────────┤
                                    │Total   │
                                    │Price   │
                                    ├────────┤
                                    │Stock   │
                                    │OutDate │
                                    └────────┘

Relationships:
- One Spare_Part has many Stock_In records (1:M)
- One Spare_Part has many Stock_Out records (1:M)
- Stock_In and Stock_Out both reference Spare_Part via FK
```

## Running the Application

### Development Mode
Terminal 1 (Backend):
```bash
cd backend-project
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd frontend-project
npm run dev
# App runs on http://localhost:5173
```

### Production Mode
```bash
# Backend
cd backend-project
npm start

# Frontend
cd frontend-project
npm run build
npm run preview
```

## Testing the Application

1. **Register a user**: Use the registration form with a strong password
2. **Login**: Use your credentials to log in
3. **Add Spare Part**: Create a few spare parts
4. **Record Stock In**: Add stock for the spare parts
5. **Record Stock Out**: Remove stock and test edit/delete
6. **View Reports**: Check daily reports and export to CSV
7. **Logout**: Verify logout clears session

## Security Features
- JWT-based authentication
- Password encryption with bcryptjs
- CORS protection
- SQL injection prevention via parameterized queries
- Secure password policy enforcement

## Notes
- All inventory adjustments are automatically tracked
- Reports are generated in real-time
- Data is persisted in MySQL database
- Application is responsive and works on mobile devices

## Troubleshooting

### Database connection error
- Verify MySQL is running
- Check .env database credentials
- Ensure SIMS database exists

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check if ports are not blocked by firewall
- Verify API URL in frontend services/api.js

### Password validation error
- Password must meet all strength requirements
- Use special characters (@$!%*?&)
- Minimum 8 characters required

## Exam Requirements Met
✅ ERD designed and documented
✅ Database created with all tables
✅ Backend API with CRUD operations
✅ React frontend with Tailwind CSS
✅ User authentication with encrypted passwords
✅ All menu pages implemented (SparePart, StockIn, StockOut, Reports, Logout)
✅ Daily reports generation
✅ CSV export functionality
✅ Responsive design
✅ Proper folder structure (backend-project, frontend-project)

---
**Project Date**: 2025
**Student**: Niyonkuru Fiston
**School**: WORLD MISSION SECONDARY SCHOOL
**Assessment**: SWD DAY 6 INTEGRATED ASSESSMENT
