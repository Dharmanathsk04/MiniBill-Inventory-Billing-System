import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Fetching invoices...');
      const response = await api.get('/invoices');
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data Type:', typeof response.data);
      console.log('📥 Response Data:', response.data);
      
      let data = response.data;
      
      // If data is a string, parse it
      if (typeof data === 'string') {
        console.log('🔍 Data is string, parsing JSON...');
        data = JSON.parse(data);
        console.log('✅ Parsed data:', data);
      }
      
      // If data is an object with content property, extract it
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (data.content && Array.isArray(data.content)) {
          data = data.content;
        } else if (data._embedded && data._embedded.invoices) {
          data = data._embedded.invoices;
        } else if (data.invoices && Array.isArray(data.invoices)) {
          data = data.invoices;
        } else {
          // Try to find any array in the object
          const values = Object.values(data);
          const foundArray = values.find(v => Array.isArray(v));
          if (foundArray) {
            data = foundArray;
          }
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.warn('⚠️ Data is not an array, converting to array');
        data = data ? [data] : [];
      }
      
      console.log('📊 Final invoices:', data);
      console.log('📊 Count:', data.length);
      
      setInvoices(data);
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error.response?.data?.error || 'Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading invoices...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Link to="/create-invoice" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create Invoice
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!error && (
        <>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
            <p className="font-medium text-green-700">
              ✅ Total Invoices: {invoices.length}
            </p>
          </div>

          {invoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p>No invoices found</p>
              <Link to="/create-invoice" className="text-blue-600 hover:underline mt-2 block">
                Create your first invoice
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((inv, index) => (
                    <tr key={inv.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{inv.invoiceNumber || 'N/A'}</td>
                      <td className="px-6 py-4">{inv.customer?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        ₹{inv.total ? Number(inv.total).toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Invoices;