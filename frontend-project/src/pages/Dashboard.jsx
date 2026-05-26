import { useState } from 'react';
import SparePartForm from '../components/SparePartForm';
import StockInForm from '../components/StockInForm';
import StockOutForm from '../components/StockOutForm';
import Reports from '../components/Reports';

export default function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('spare-parts');

  const navItems = [
    { id: 'spare-parts', label: 'SparePart' },
    { id: 'stock-in', label: 'StockIn' },
    { id: 'stock-out', label: 'StockOut' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">SIMS</h1>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`px-4 py-2 rounded transition-colors ${
                      activePage === item.id
                        ? 'bg-blue-900 font-bold'
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {user?.username || 'User'}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-3 py-1 rounded whitespace-nowrap text-sm transition-colors ${
                  activePage === item.id
                    ? 'bg-blue-900 font-bold'
                    : 'bg-blue-700 hover:bg-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activePage === 'spare-parts' && <SparePartForm />}
        {activePage === 'stock-in' && <StockInForm />}
        {activePage === 'stock-out' && <StockOutForm />}
        {activePage === 'reports' && <Reports />}
      </main>
    </div>
  );
}
