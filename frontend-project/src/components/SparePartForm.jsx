import { useState, useEffect } from 'react';
import { sparePartService } from '../services/api';

export default function SparePartForm() {
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unitPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const response = await sparePartService.getAll();
      setSpareParts(response.data);
    } catch (error) {
      setMessage('Error fetching spare parts: ' + error.message);
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

    if (!formData.name || !formData.category || !formData.quantity || !formData.unitPrice) {
      setMessage('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await sparePartService.create({
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
      });

      setFormData({ name: '', category: '', quantity: '', unitPrice: '' });
      setMessage('Spare part added successfully!');
      fetchSpareParts();
    } catch (error) {
      setMessage('Error adding spare part: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Spare Part</h2>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Spare Part Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter spare part name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
                required
              />
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
              <label className="block text-gray-700 font-bold mb-2">Unit Price</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter unit price"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Spare Part'}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Spare Parts List</h2>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && spareParts.length === 0 && (
          <p className="text-gray-600">No spare parts found. Add one to get started!</p>
        )}

        {!loading && spareParts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((part) => (
                  <tr key={part.SparePartID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{part.SparePartID}</td>
                    <td className="border border-gray-300 px-4 py-2">{part.Name}</td>
                    <td className="border border-gray-300 px-4 py-2">{part.Category}</td>
                    <td className="border border-gray-300 px-4 py-2">{part.Quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">RWF {part.UnitPrice?.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">RWF {part.TotalPrice?.toFixed(2)}</td>
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
