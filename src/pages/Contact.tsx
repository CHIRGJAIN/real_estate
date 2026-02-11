import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import OfficeMap from '@/components/OfficeMap';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const inputClass = "w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Get In Touch</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Contact NCR RealtyHub</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Questions about buying, renting, or investing in Noida? We are here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, title: 'Visit Us', lines: ['Sector 104, Noida', 'Uttar Pradesh 201301'] },
              { icon: Phone, title: 'Call Us', lines: ['+91 98765 43210'] },
              { icon: Mail, title: 'Email Us', lines: ['hello@ncrrealtyhub.in'] },
              { icon: Clock, title: 'Working Hours', lines: ['Mon-Sat: 9:00 AM - 7:00 PM', 'Sunday: On Appointment'] },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl">
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  {item.lines.map(l => <p key={l} className="text-xs text-muted-foreground">{l}</p>)}
                </div>
              </div>
            ))}
            <a href="https://wa.me/919971179127" className="w-full">
              <Button variant="gold" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Your Name *" className={inputClass} required />
                <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email Address *" type="email" className={inputClass} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone Number" className={inputClass} />
                <select value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))} className={inputClass + ' appearance-none'}>
                  <option value="">Select Subject</option>
                  <option value="buy">Buying a Property</option>
                  <option value="sell">Selling a Property</option>
                  <option value="rent">Renting a Property</option>
                  <option value="invest">Investment Advice</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Your Message *" rows={6} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" required />
              <Button variant="gold" size="lg" className="w-full" type="submit">Send Message</Button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 h-64 bg-card border border-border/50 rounded-xl overflow-hidden">
          <OfficeMap height="100%" />
        </div>
        <div className="mt-6 bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Nearby from our office</h3>
          <p className="text-sm text-muted-foreground">Sector 104 Market, Noida Expressway access, schools, hospitals, and daily conveniences.</p>
        </div>
      </div>
    </Layout>
  );
}
