import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';
import Card from '../components/Card';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const chartData = [
    { name: 'Daily', revenue: Number(data.dailyRevenue) },
    { name: 'Monthly', revenue: Number(data.monthlyRevenue) }
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <Card title="Total Jobs" value={data.totalJobs} />
        <Card title="Pending Repairs" value={data.pendingRepairs} />
        <Card title="Completed Jobs" value={data.completedJobs} />
        <Card title="Total Sales" value={data.totalSales} />
        <Card title="Revenue" value={`₹${Number(data.totalRevenue).toFixed(2)}`} />
        <Card title="Low Stock Alerts" value={data.lowStock} />
      </div>
      <div className="chart-box">
        <h3>Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
