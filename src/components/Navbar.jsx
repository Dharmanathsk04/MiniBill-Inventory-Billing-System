import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">📋 MiniBill</Link>
          <div className="flex space-x-6">
            <Link to="/categories" className="hover:text-blue-200">Categories</Link>
            <Link to="/products" className="hover:text-blue-200">Products</Link>
            <Link to="/customers" className="hover:text-blue-200">Customers</Link>
            <Link to="/invoices" className="hover:text-blue-200">Invoices</Link>
            <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;