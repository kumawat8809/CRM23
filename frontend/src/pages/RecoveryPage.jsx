import { useEffect, useState } from 'react';
import api from '../api/client';

export default function RecoveryPage() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get('/recovery').then((res) => setCases(res.data));
  }, []);

  return (
    <div>
      <h2>Data Recovery</h2>
      <table>
        <thead><tr><th>Case #</th><th>Device</th><th>Data Size</th><th>Status</th><th>Price</th></tr></thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}><td>{c.caseNumber}</td><td>{c.storageType}</td><td>{c.dataSizeGb} GB</td><td>{c.status}</td><td>₹{c.price}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
