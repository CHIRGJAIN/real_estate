import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
      toast.success('Welcome back to NCR RealtyHub!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Try signing up first.');
    }
  };

  const inputClass = "w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <Layout>
      <div className="pt-32 pb-20 container max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your NCR RealtyHub account</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className={inputClass} required />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className={inputClass} required />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:text-gold-light transition-colors">Forgot password?</Link>
            </div>
            <Button variant="gold" className="w-full" type="submit">Sign In</Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:text-gold-light transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
