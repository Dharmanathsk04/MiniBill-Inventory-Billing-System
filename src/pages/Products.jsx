import { useState, useEffect } from 'react';
import api from '../api/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '', sku: '', price: 0, taxPercent: 0, stock: 0, categoryId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      alert('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.filter(c => c.active));
    } catch (error) {
      alert('Failed to fetch categories');
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    try {
      const res = await api.get(`/products?search=${value}`);
      setProducts(res.data);
    } catch (error) {
      alert('Search failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      alert('Please select a category!');
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        taxPercent: parseFloat(formData.taxPercent) || 0,
        stock: parseInt(formData.stock) || 0,
        category: { id: formData.categoryId }
      };
      
      if (editing) {
        await api.put(`/products/${editing}`, productData);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        alert('Product created successfully!');
      }
      
      setFormData({ name: '', sku: '', price: 0, taxPercent: 0, stock: 0, categoryId: '' });
      setEditing(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error:', error.response?.data);
      alert(error.response?.data?.error || 'Operation failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      taxPercent: product.taxPercent,
      stock: product.stock,
      categoryId: product.category?.id || ''
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this product?')) {
      try {
        await api.delete(`/products/${id}`);
        alert('Product deactivated!');
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to deactivate');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="p-2 border rounded w-64"
            value={search}
            onChange={handleSearch}
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g., Laptop"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                placeholder="e.g., LAP001"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 999.99"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
              <input
                type="number"
                placeholder="e.g., 18"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.taxPercent}
                onChange={(e) => setFormData({...formData, taxPercent: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                placeholder="e.g., 50"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">No products found</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.sku}</td>
                  <td className="px-6 py-4">{p.category?.name || '-'}</td>
                  <td className="px-6 py-4">₹{p.price}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;