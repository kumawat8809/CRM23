import { useEffect, useState } from 'react';
import api from '../api/client';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    customerId: '',
    deviceType: 'Mobile',
    imeiSerial: '',
    problem: '',
    estimatedCost: ''
  });

  const loadJobs = () => api.get('/jobs').then((res) => setJobs(res.data));

  useEffect(() => {
    loadJobs();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/jobs', form);
    setForm({ customerId: '', deviceType: 'Mobile', imeiSerial: '', problem: '', estimatedCost: '' });
    loadJobs();
  };

  return (
    <div>
      <h2>Job Management</h2>
      <form className="panel" onSubmit={submit}>
        <input placeholder="Customer ID" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required />
        <select value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })}>
          <option>Mobile</option><option>Laptop</option><option>HDD</option>
        </select>
        <input placeholder="IMEI / Serial" value={form.imeiSerial} onChange={(e) => setForm({ ...form, imeiSerial: e.target.value })} />
        <input placeholder="Problem" value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} required />
        <input placeholder="Estimated Cost" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} required />
        <button>Create Job</button>
      </form>

      <table>
        <thead><tr><th>#</th><th>Customer</th><th>Device</th><th>Status</th><th>Cost</th></tr></thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}><td>{j.jobNumber}</td><td>{j.customer?.name}</td><td>{j.deviceType}</td><td>{j.status}</td><td>₹{j.estimatedCost}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
