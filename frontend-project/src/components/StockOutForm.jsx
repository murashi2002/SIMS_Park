import { useState, useEffect } from 'react';
import { stockOutService, sparePartService } from '../services/api';

export default function StockOutForm() {
  const [stockOutRecords, setStockOutRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    sparePartId: '',
    quantity: '',
    unitPrice: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSpareParts();
    fetchStockOutRecords();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await sparePartService.getAll();
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  const fetchStockOutRecords = async () => {
    try {
      setLoading(true);
      const response = await stockOutService.getAll();
      setStockOutRecords(response.data);
    } catch (error) {
      setMessage('Error fetching stock out records: ' + error.message);
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

    if (!formData.sparePartId || !formData.quantity || !formData.unitPrice) {
      setMessage('All fields are required');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await stockOutService.update(editingId, {
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          date: formData.date,
        });
        setMessage('Stock out record updated successfully!');
        setEditingId(null);
      } else {
        await stockOutService.create({
          sparePartId: parseInt(formData.sparePartId),
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          date: formData.date,
        });
        setMessage('Stock out recorded successfully!');
      }

      setFormData({
        sparePartId: '',
        quantity: '',
        unitPrice: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchStockOutRecords();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.StockOutID);
    setFormData({
      sparePartId: record.SparePartID,
      quantity: record.StockOutQuantity,
      unitPrice: record.StockOutUnitPrice,
      date: record.StockOutDate,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      setLoading(true);
      await stockOutService.delete(id);
      setMessage('Stock out record deleted successfully!');
      fetchStockOutRecords();
    } catch (error) {
      setMessage('Error deleting record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      sparePartId: '',
      quantity: '',
      unitPrice: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? 'Update Stock Out' : 'Record Stock Out'}
        </h2>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Spare Part</label>
              <select
                name="sparePartId"
                value={formData.sparePartId}
                onChange={handleInputChange}
                disabled={editingId !== null}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : editingId ? 'Update Record' : 'Record Stock Out'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Display Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Stock Out Records</h2>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && stockOutRecords.length === 0 && (
          <p className="text-gray-600">No stock out records found.</p>
        )}

        {!loading && stockOutRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Spare Part</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockOutRecords.map((record) => {
                  const unitPrice = record.StockOutUnitPrice == null ? null : Number(record.StockOutUnitPrice);
                  const totalPrice = record.StockOutTotalPrice == null ? null : Number(record.StockOutTotalPrice);

                  return (
                    <tr key={record.StockOutID} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{record.StockOutID}</td>
                      <td className="border border-gray-300 px-4 py-2">{record.Name}</td>
                      <td className="border border-gray-300 px-4 py-2">{record.StockOutQuantity}</td>
                      <td className="border border-gray-300 px-4 py-2">RWF {unitPrice != null && !Number.isNaN(unitPrice) ? unitPrice.toFixed(2) : ''}</td>
                      <td className="border border-gray-300 px-4 py-2">RWF {totalPrice != null && !Number.isNaN(totalPrice) ? totalPrice.toFixed(2) : ''}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(record.StockOutDate).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.StockOutID)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
