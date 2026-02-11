import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Reset link sent! (simulated)');
  };

  return (
    <Layout>
      <div className="pt-32 pb-20 container max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a reset link</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <p className="text-foreground mb-4">Check your inbox for a password reset link.</p>
              <Link to="/login"><Button variant="outline-gold"><ArrowLeft className="h-4 w-4" />Back to Login</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                type="email"
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <Button variant="gold" className="w-full" type="submit">Send Reset Link</Button>
              <div className="text-center">
                <Link to="/login" className="text-xs text-primary hover:text-gold-light transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft className="h-3 w-3" />Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
