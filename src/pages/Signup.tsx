import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === form.email)) { toast.error('Email already registered'); return; }
    users.push({ name: form.name, email: form.email, password: form.password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email }));
    toast.success('Account created! Welcome to NCR RealtyHub.');
    navigate('/');
  };

  const inputClass = "w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <Layout>
      <div className="pt-32 pb-20 container max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join NCR RealtyHub today</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Full Name" className={inputClass} required />
            <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" className={inputClass} required />
            <input value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Password" type="password" className={inputClass} required />
            <input value={form.confirm} onChange={e => setForm(prev => ({ ...prev, confirm: e.target.value }))} placeholder="Confirm Password" type="password" className={inputClass} required />
            <Button variant="gold" className="w-full" type="submit">Create Account</Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:text-gold-light transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
