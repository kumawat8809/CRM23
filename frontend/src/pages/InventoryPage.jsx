import { useEffect, useState } from 'react';
import api from '../api/client';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/inventory').then((res) => setItems(res.data));
  }, []);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2>Inventory</h2>
      <input placeholder="Search by name/SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table>
        <thead><tr><th>Item</th><th>SKU</th><th>Stock</th><th>Reorder</th></tr></thead>
        <tbody>
          {filtered.map((i) => (
            <tr key={i.id} className={i.quantity <= i.reorderLevel ? 'low-stock' : ''}>
              <td>{i.name}</td><td>{i.sku}</td><td>{i.quantity}</td><td>{i.reorderLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
