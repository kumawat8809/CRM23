import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  ['Dashboard', '/'],
  ['Jobs', '/jobs'],
  ['Invoices', '/invoices'],
  ['Sales', '/sales'],
  ['Inventory', '/inventory'],
  ['Recovery', '/recovery'],
  ['Customers', '/customers']
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link to="/" className="brand">Data Migrator</Link>
        {navItems.map(([label, path]) => (
          <NavLink key={path} to={path} className="nav-link">
            {label}
          </NavLink>
        ))}
      </aside>
      <main>
        <header className="topbar">
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
}
