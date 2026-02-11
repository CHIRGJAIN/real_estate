import { useMemo, useState } from 'react';
import { CheckCircle2, MessageCircle, Phone, Calculator } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/utils/helpers';

export default function HomeLoanPage() {
  const [form, setForm] = useState({ loanAmount: 7500000, rate: 8.6, tenure: 20 });

  const emi = useMemo(() => {
    if (form.loanAmount <= 0 || form.rate <= 0 || form.tenure <= 0) return 0;
    const monthlyRate = form.rate / 12 / 100;
    const months = form.tenure * 12;
    const factor = Math.pow(1 + monthlyRate, months);
    return Math.round((form.loanAmount * monthlyRate * factor) / (factor - 1));
  }, [form]);

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Home Loan Desk</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Home Loan Assistance for Noida & NCR</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare rates, check eligibility, and get support from documentation to disbursement.
            Our team coordinates with leading banks to get you the best offer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-semibold text-foreground">EMI Calculator</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Loan Amount</label>
                <input
                  type="number"
                  value={form.loanAmount}
                  onChange={e => setForm(prev => ({ ...prev, loanAmount: Number(e.target.value) || 0 }))}
                  className="w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.rate}
                  onChange={e => setForm(prev => ({ ...prev, rate: Number(e.target.value) || 0 }))}
                  className="w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tenure (Years)</label>
                <input
                  type="number"
                  value={form.tenure}
                  onChange={e => setForm(prev => ({ ...prev, tenure: Number(e.target.value) || 0 }))}
                  className="w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-4 bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Estimated EMI</p>
              <p className="text-2xl font-semibold text-foreground">{formatINR(emi, { isRent: true })}</p>
              <p className="text-[11px] text-muted-foreground">Indicative only. Actual EMI may vary.</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Get Loan Assistance</h3>
            <p className="text-sm text-muted-foreground">Share your requirements and we will connect you with a loan specialist.</p>
            <a href="https://wa.me/919876543210" className="w-full">
              <Button variant="gold" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />WhatsApp Loan Desk
              </Button>
            </a>
            <a href="tel:+919876543210" className="w-full">
              <Button variant="outline-gold" className="w-full gap-2">
                <Phone className="h-4 w-4" />Call Now
              </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Documents Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              {[
                'PAN card and Aadhaar',
                'Last 3-6 months salary slips',
                'Bank statements (6 months)',
                'Form 16 or ITR',
                'Property papers and allotment letter',
                'Passport size photographs',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Why NCR RealtyHub</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                'Rate comparison across leading banks',
                'Assistance with eligibility and pre-approval',
                'Dedicated loan coordinator for your case',
                'End-to-end documentation support',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
