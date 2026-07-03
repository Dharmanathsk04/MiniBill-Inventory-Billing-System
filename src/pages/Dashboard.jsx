import { useState, useEffect } from 'react';
import api from '../api/api';

function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    customers: 0,
    invoices: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, p, cu, i] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/customers'),
          api.get('/invoices')
        ]);
        setStats({
          categories: c.data.length,
          products: p.data.length,
          customers: cu.data.length,
          invoices: i.data.length
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Categories</h3>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Customers</h3>
          <p className="text-3xl font-bold">{stats.customers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Invoices</h3>
          <p className="text-3xl font-bold">{stats.invoices}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;