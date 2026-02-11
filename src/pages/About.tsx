import { Award, Globe, Users, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const MILESTONES = [
  { year: '2012', title: 'Founded in Noida', desc: 'Started NCR RealtyHub from Sector 104 with a focus on verified listings.' },
  { year: '2015', title: '500+ Families Housed', desc: 'Expanded across Noida Expressway and the Sector 137 corridor.' },
  { year: '2018', title: 'RERA-First Compliance', desc: 'Built a verification desk for RERA IDs and builder due diligence.' },
  { year: '2021', title: 'Greater Noida Expansion', desc: 'Coverage across Pari Chowk, Techzone 4, and Knowledge Park.' },
  { year: '2025', title: '3,500+ NCR Transactions', desc: 'Trusted by homebuyers, tenants, and investors across Delhi NCR.' },
];

const TEAM = [
  { name: 'Aarav Khanna', role: 'Managing Director', img: '/images/agents/agent-4.jpg' },
  { name: 'Ritika Sharma', role: 'Head of Sales', img: '/images/agents/agent-5.jpg' },
  { name: 'Mohit Bansal', role: 'Project Advisory Lead', img: '/images/agents/agent-6.jpg' },
  { name: 'Sneha Iyer', role: 'Marketing & Partnerships', img: '/images/agents/agent-7.jpg' },
];

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <Layout>
      <section className="pt-32 pb-20 container text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Story</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">Rooted in Noida. Built for NCR Homebuyers.</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          NCR RealtyHub was founded in Sector 104 with a simple promise: verified listings, clear pricing, and trusted guidance
          for every buyer, renter, and investor in Noida, Greater Noida, and Delhi NCR.
        </p>
      </section>

      <RevealSection>
        <section className="py-16 bg-card/50">
          <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Verified Listings', desc: 'RERA checks, builder diligence, and on-ground verification.' },
              { icon: Globe, title: 'NCR Coverage', desc: 'Noida, Greater Noida, Ghaziabad, and East Delhi micro-markets.' },
              { icon: Users, title: 'Client-First', desc: 'Transparent advice from shortlist to registry and handover.' },
              { icon: TrendingUp, title: 'Market Insight', desc: 'Data-driven guidance for growth corridors and investor deals.' },
            ].map(v => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 container">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2 text-center">Leadership</p>
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(t => (
              <div key={t.name} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-2 border-border group-hover:border-primary transition-colors">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 bg-card/50">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2 text-center">Journey</p>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Our Milestones</h2>
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">{m.year}</div>
                    {i < MILESTONES.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <section className="py-16 container">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-8">Trusted Partners</p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {['ATS', 'Godrej Properties', 'Mahagun', 'Eldeco', 'Tata Housing', 'Supertech'].map(name => (
            <span key={name} className="font-heading text-lg text-muted-foreground/40 font-semibold">{name}</span>
          ))}
        </div>
      </section>
    </Layout>
  );
}
