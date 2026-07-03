import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${id}`);
      console.log('Invoice details:', response.data);
      setInvoice(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError(error.response?.data?.error || 'Failed to fetch invoice details');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading invoice details...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
        <Link to="/invoices" className="text-blue-600 hover:underline">← Back to Invoices</Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg mb-4">
          <p>Invoice not found</p>
        </div>
        <Link to="/invoices" className="text-blue-600 hover:underline">← Back to Invoices</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoice Details</h2>
        <Link to="/invoices" className="text-blue-600 hover:underline">← Back to Invoices</Link>
      </div>

      {/* Invoice Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Invoice Number</p>
            <p className="font-bold text-lg">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-bold">{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Customer</p>
            <p className="font-bold">{invoice.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{invoice.customer?.phone || ''}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-bold">{invoice.customer?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.product?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">₹{item.unitPrice?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">₹{item.taxAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 font-bold">₹{item.total?.toFixed(2) || '0.00'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No items found</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right font-bold">Subtotal:</td>
              <td className="px-6 py-4 font-bold">₹{invoice.subtotal?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right font-bold">Tax:</td>
              <td className="px-6 py-4 font-bold">₹{invoice.tax?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr className="border-t-2 border-gray-300">
              <td colSpan="4" className="px-6 py-4 text-right font-bold text-lg">Grand Total:</td>
              <td className="px-6 py-4 font-bold text-lg text-green-600">₹{invoice.total?.toFixed(2) || '0.00'}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default InvoiceDetails;