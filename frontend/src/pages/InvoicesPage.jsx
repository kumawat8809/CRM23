import { useEffect, useState } from 'react';
import api from '../api/client';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get('/invoices').then((res) => setInvoices(res.data));
  }, []);

  return (
    <div>
      <h2>Billing System</h2>
      <table>
        <thead><tr><th>Invoice #</th><th>Type</th><th>Customer</th><th>Total</th><th>GST</th></tr></thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.type}</td>
              <td>{inv.customer?.name}</td>
              <td>₹{inv.total}</td>
              <td>₹{inv.gstAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
