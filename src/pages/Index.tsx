import { Link } from 'react-router-dom';
import { useMemo, type ReactNode } from 'react';
import { ArrowRight, Home, Key, Building2, Briefcase, Scale, Wallet, BadgeCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import HeroSearch from '@/components/HeroSearch';
import PropertyCard from '@/components/PropertyCard';
import StatsCounter from '@/components/StatsCounter';
import { useProperties } from '@/hooks/useProperties';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HERO_IMAGE = '/images/hero/hero.jpg';

const LOCATIONS = [
  { name: 'Sector 104', count: 5, img: '/images/properties/noida-apartment-1.jpg' },
  { name: 'Sector 137', count: 4, img: '/images/properties/noida-office-1.jpg' },
  { name: 'Sector 150', count: 4, img: '/images/properties/noida-apartment-2.jpg' },
  { name: 'Pari Chowk', count: 3, img: '/images/properties/noida-apartment-3.jpg' },
  { name: 'Techzone 4', count: 3, img: '/images/properties/noida-office-2.jpg' },
  { name: 'Indirapuram', count: 3, img: '/images/properties/noida-apartment-4.jpg' },
];

const SERVICES = [
  { icon: Home, title: 'Buy Homes', desc: 'Verified flats and villas across Noida and Greater Noida.' },
  { icon: Key, title: 'Rent Homes', desc: 'Move-in ready rentals near metro and expressway corridors.' },
  { icon: Building2, title: 'New Projects', desc: 'RERA-registered launches with transparent pricing.' },
  { icon: Briefcase, title: 'Commercial Spaces', desc: 'Office floors and retail shops in prime NCR markets.' },
  { icon: Wallet, title: 'Home Loan Assistance', desc: 'Loan eligibility checks and bank tie-ups for best rates.' },
  { icon: Scale, title: 'Legal & RERA Support', desc: 'Documentation, registry guidance, and compliance help.' },
];

const TESTIMONIALS = [
  { name: 'Rahul Malhotra', role: 'Bought 3BHK, Sector 104', text: 'NCR RealtyHub guided us from shortlist to registry. The process was smooth and transparent.', rating: 5, avatar: '/images/agents/agent-1.jpg' },
  { name: 'Ankita Joshi', role: 'Rented near Expressway', text: 'Needed a rental close to my office. Got options in 2 days and finalized quickly.', rating: 5, avatar: '/images/agents/agent-2.jpg' },
  { name: 'Vikram Singh', role: 'Investor, Greater Noida', text: 'Their market insights for new launches helped me lock a great deal under ₹1 Cr.', rating: 4, avatar: '/images/agents/agent-3.jpg' },
];

function RevealSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { allProperties } = useProperties();
  const featured = useMemo(
    () => [...allProperties].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 6),
    [allProperties],
  );
  const reraVerified = useMemo(
    () => allProperties.filter((p) => p.reraId && p.verified).slice(0, 4),
    [allProperties],
  );
  const expresswayLaunches = useMemo(
    () => allProperties.filter((p) => p.newLaunch && p.location.landmark.toLowerCase().includes('expressway')).slice(0, 4),
    [allProperties],
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Luxury home overlooking the city"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/50 to-background" />
        <div className="relative z-10 container text-center py-32">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Verified Homes & Investments in Noida, Greater Noida & Delhi NCR
          </p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Find Your <span className="gold-text">Perfect Home</span><br />in Noida & NCR
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            Explore verified flats, villas, plots, and commercial spaces with trusted local experts.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <RevealSection>
        <section className="py-20">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Handpicked</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Properties in NCR</h2>
              </div>
              <Link to="/listings" className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-gold-light transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/listings">
                <Button variant="outline-gold">View All Listings</Button>
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Top Locations */}
      <RevealSection>
        <section className="py-20 bg-card/50">
          <div className="container">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2 text-center">Explore</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-10">Top Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {LOCATIONS.map(loc => (
                <Link
                  key={loc.name}
                  to={`/listings?search=${encodeURIComponent(loc.name)}`}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden"
                >
                  <img src={loc.img} alt={loc.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-heading text-base font-semibold text-foreground">{loc.name}</h3>
                    <p className="text-xs text-primary">{loc.count} properties</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Services */}
      <RevealSection>
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2 text-center">What We Offer</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-10">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map(s => (
                <div key={s.title} className="p-6 bg-card border border-border/50 rounded-xl card-hover group">
                  <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* RERA Verified */}
      {reraVerified.length > 0 && (
        <RevealSection>
          <section className="py-20 bg-card/50">
            <div className="container">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Trust & Compliance</p>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">RERA Verified Listings</h2>
                </div>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reraVerified.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* New Launches */}
      {expresswayLaunches.length > 0 && (
        <RevealSection>
          <section className="py-20 bg-card/50">
            <div className="container">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Noida Expressway Belt</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">New Launches Near Expressway</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {expresswayLaunches.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* Stats */}
      <StatsCounter />

      {/* Testimonials */}
      <RevealSection>
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2 text-center">Testimonials</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-10">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="p-6 bg-card border border-border/50 rounded-xl">
                  <div className="flex items-center gap-1 text-primary mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* CTA */}
      <RevealSection>
        <section className="py-20">
          <div className="container">
            <div className="relative rounded-2xl overflow-hidden p-10 md:p-16 text-center">
              <div className="absolute inset-0 gold-gradient opacity-10" />
              <div className="relative z-10">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Visit a Property?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  WhatsApp our team for instant responses and curated site visits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/listings"><Button variant="gold" size="lg">Browse Listings</Button></Link>
                  <a href="https://wa.me/919971179127"><Button variant="outline-gold" size="lg">WhatsApp Now</Button></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </Layout>
  );
}
