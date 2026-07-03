import { useState, useEffect } from 'react';
import api from '../api/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', defaultGstPercent: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      alert('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, formData);
        alert('Category updated!');
      } else {
        await api.post('/categories', formData);
        alert('Category created!');
      }
      setFormData({ name: '', description: '', defaultGstPercent: 0 });
      setEditing(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData(cat);
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        alert('Category deactivated!');
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to deactivate');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                placeholder="e.g., Electronics"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g., Electronic items"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default GST %</label>
              <input
                type="number"
                placeholder="e.g., 18"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.defaultGstPercent}
                onChange={(e) => setFormData({...formData, defaultGstPercent: parseFloat(e.target.value) || 0})}
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">GST %</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No categories found</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4">{cat.description || '-'}</td>
                  <td className="px-6 py-4">{cat.defaultGstPercent}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${cat.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">Delete</button>
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

export default Categories;