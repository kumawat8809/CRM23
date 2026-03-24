import { useEffect, useState } from 'react';
import api from '../api/client';

export default function SalesPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get('/sales').then((res) => setSales(res.data));
  }, []);

  return (
    <div>
      <h2>Sales Module</h2>
      <table>
        <thead><tr><th>Device</th><th>Condition</th><th>Purchase</th><th>Sale</th><th>Profit</th></tr></thead>
        <tbody>{sales.map((s) => <tr key={s.id}><td>{s.deviceName}</td><td>{s.condition || '-'}</td><td>₹{s.purchasePrice}</td><td>₹{s.salePrice}</td><td>₹{s.profitMargin}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
