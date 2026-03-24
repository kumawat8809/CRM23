import { useEffect, useState } from 'react';
import api from '../api/client';

export default function CustomersPage() {
  const [q, setQ] = useState('');
  const [customers, setCustomers] = useState([]);

  const search = () => {
    api.get('/customers', { params: { q } }).then((res) => setCustomers(res.data));
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <h2>Customer Management</h2>
      <div className="inline">
        <input placeholder="Search by phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={search}>Search</button>
      </div>
      {customers.map((c) => (
        <div key={c.id} className="panel">
          <h4>{c.name} ({c.phone})</h4>
          <p>Jobs: {c.jobs?.length || 0} | Invoices: {c.invoices?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}
