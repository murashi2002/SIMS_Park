import { useState, useEffect } from 'react';
import { stockInService, sparePartService } from '../services/api';

export default function StockInForm() {
  const [stockInRecords, setStockInRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    sparePartId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSpareParts();
    fetchStockInRecords();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await sparePartService.getAll();
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  const fetchStockInRecords = async () => {
    try {
      setLoading(true);
      const response = await stockInService.getAll();
      setStockInRecords(response.data);
    } catch (error) {
      setMessage('Error fetching stock in records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.sparePartId || !formData.quantity) {
      setMessage('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await stockInService.create({
        sparePartId: parseInt(formData.sparePartId),
        quantity: parseInt(formData.quantity),
        date: formData.date,
      });

      setFormData({
        sparePartId: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
      });
      setMessage('Stock in recorded successfully!');
      fetchStockInRecords();
    } catch (error) {
      setMessage('Error recording stock in: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Stock In</h2>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Spare Part</label>
              <select
                name="sparePartId"
                value={formData.sparePartId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select spare part</option>
                {spareParts.map((part) => (
                  <option key={part.SparePartID} value={part.SparePartID}>
                    {part.Name} ({part.Category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Recording...' : 'Record Stock In'}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Stock In History</h2>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && stockInRecords.length === 0 && (
          <p className="text-gray-600">No stock in records found.</p>
        )}

        {!loading && stockInRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Spare Part</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {stockInRecords.map((record) => (
                  <tr key={record.StockInID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{record.StockInID}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.Name}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.Category}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.StockInQuantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(record.StockInDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
