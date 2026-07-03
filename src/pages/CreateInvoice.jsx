import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items, products]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.filter(c => c.active));
    } catch (error) {
      alert('Failed to fetch customers');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.filter(p => p.active && p.stock > 0));
    } catch (error) {
      alert('Failed to fetch products');
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let tax = 0;
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const itemTotal = price * quantity;
        const itemTax = (itemTotal * parseFloat(product.taxPercent || 0)) / 100;
        subtotal += itemTotal;
        tax += itemTax;
      }
    });
    setSubtotal(subtotal);
    setTax(tax);
    setTotal(subtotal + tax);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      alert('Please select a customer!');
      return;
    }

    const validItems = items.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one product!');
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        customer: { id: selectedCustomer },
        items: validItems.map(item => ({
          product: { id: item.productId },
          quantity: parseInt(item.quantity)
        }))
      };

      await api.post('/invoices', invoiceData);
      alert('Invoice created successfully!');
      navigate('/invoices');
    } catch (error) {
      console.error('Error:', error.response?.data);
      alert(error.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Customer *</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Products</label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <select
                className="flex-1 p-2 border rounded"
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.price} (Stock: {p.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                className="w-24 p-2 border rounded"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            + Add Product
          </button>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-end space-x-8">
            <div><span className="font-bold">Subtotal:</span> ₹{subtotal.toFixed(2)}</div>
            <div><span className="font-bold">Tax:</span> ₹{tax.toFixed(2)}</div>
            <div><span className="font-bold text-lg">Total:</span> ₹{total.toFixed(2)}</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating Invoice...' : 'Create Invoice'}
        </button>
      </form>
    </div>
  );
}

export default CreateInvoice;