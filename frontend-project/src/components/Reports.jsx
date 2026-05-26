import { useState, useEffect } from 'react';
import { reportsService } from '../services/api';

export default function Reports() {
  const [reportType, setReportType] = useState('daily-stock-status');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      setMessage('');
      let response;
      if (reportType === 'daily-stock-status') {
        response = await reportsService.getDailyStockStatus();
      } else {
        response = await reportsService.getDailyStockOut();
      }
      setReportData(response.data.data || []);
    } catch (error) {
      setMessage('Error fetching report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await reportsService.getCustomReport(startDate, endDate, reportType === 'daily-stock-status' ? 'stock-status' : 'stock-out');
      setReportData(response.data.data || []);
    } catch (error) {
      setMessage('Error fetching report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      setMessage('No data to export');
      return;
    }

    const csvContent = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Reports</h2>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setReportData([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily-stock-status">Daily Stock Status</option>
              <option value="daily-stock-out">Daily Stock Out</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={fetchDailyReport}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : "Today's Report"}
            </button>
          </div>

          {/* Custom Date Range */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold mb-4">Custom Date Range</h3>
            <form onSubmit={fetchCustomReport} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Report Display */}
      {reportData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {reportType === 'daily-stock-status' ? 'Daily Stock Status Report' : 'Daily Stock Out Report'}
            </h2>
            <div className="space-x-2">
              <button
                onClick={handleExportCSV}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Print
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse print:text-sm">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(reportData[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-2 text-left font-bold"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border border-gray-300 px-4 py-2">
                        {typeof value === 'number'
                          ? value.toFixed(2)
                          : value instanceof Date
                          ? new Date(value).toLocaleDateString()
                          : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          {reportType === 'daily-stock-out' && reportData.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-gray-700">Total Items Out</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.reduce((sum, row) => sum + (row.Quantity || 0), 0)}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-gray-700">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  RWF {reportData.reduce((sum, row) => sum + (row.TotalPrice || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-gray-700">Records</p>
                <p className="text-2xl font-bold text-purple-600">{reportData.length}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && reportData.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">No data available. Select a report type and generate a report.</p>
        </div>
      )}
    </div>
  );
}
