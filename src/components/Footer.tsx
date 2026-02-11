import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
      }
      toast.success('Subscribed successfully!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gold-gradient rounded-sm" />
              <span className="font-heading text-xl font-bold text-foreground">NCR RealtyHub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Verified homes and investments across Noida, Greater Noida, and Delhi NCR.
            </p>
            <div className="flex gap-4">
              {['X', 'In', 'Ig', 'Fb'].map(s => (
                <div key={s} className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Buy', href: '/listings?purpose=buy' },
                { label: 'Rent', href: '/listings?purpose=rent' },
                { label: 'New Projects', href: '/listings?newLaunch=1' },
                { label: 'Commercial', href: '/listings?purpose=commercial' },
                { label: 'List Property', href: '/sell' },
                { label: 'Home Loan', href: '/home-loan' },
              ].map(l => (
                <Link key={l.href} to={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>NCR RealtyHub<br />Sector 104, Noida, Uttar Pradesh 201301</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+91 9971179127</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>hello@ncrrealtyhub.in</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="https://wa.me/919971179127" className="px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  WhatsApp Us
                </a>
                <a href="tel:+919971179127" className="px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  Call Now
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Get Noida & NCR market updates and verified listings in your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-10 px-4 rounded-md bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <Button variant="gold" size="sm" type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            <p>(c) 2026 NCR RealtyHub. All rights reserved.</p>
            <p className="mt-1">RERA details are indicative in demo data. Verify with official sources.</p>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
