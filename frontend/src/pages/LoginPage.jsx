import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@datamigrator.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Invalid login');
    }
  };

  return (
    <div className="login-wrap">
      <form onSubmit={submit} className="login-box">
        <h1>Data Migrator CRM</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign In</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
