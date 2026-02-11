import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, GitCompareArrows, Share2, Download, Bed, Bath, Maximize, Car, Sofa, CalendarDays, MapPin, Phone, Star, X, ChevronLeft, ChevronRight, BadgeCheck, Building2, ArrowLeft, MessageCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { agents } from '@/data/agents';
import { formatFullCurrency, formatArea, formatINR } from '@/utils/helpers';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { useProperties } from '@/hooks/useProperties';
import PropertyMap from '@/components/PropertyMap';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProperties } = useProperties();
  const property = allProperties.find(p => p.id === id);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [compareList, setCompareList] = useLocalStorage<string[]>('compareList', []);
  const [scheduleForm, setScheduleForm] = useState({ name: '', phone: '', date: '', message: '' });
  const [showDesc, setShowDesc] = useState(false);
  const [emiForm, setEmiForm] = useState({ loanAmount: 0, rate: 8.5, tenure: 20 });

  useEffect(() => {
    if (!property) return;
    if (property.purpose === 'rent' || property.purpose === 'commercial') return;
    setEmiForm({
      loanAmount: Math.round(property.price * 0.8),
      rate: 8.5,
      tenure: 20,
    });
  }, [property?.id]);

  if (!property) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center container">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Button variant="outline-gold" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Listings
          </Button>
        </div>
      </Layout>
    );
  }

  const agent = agents.find(a => a.id === property.agentId);
  const isRent = property.purpose === 'rent' || property.purpose === 'commercial';
  const isFav = favorites.includes(property.id);
  const isCompare = compareList.includes(property.id);
  const images = property.images && property.images.length > 0 ? property.images : ['/placeholder.svg'];
  const similar = allProperties.filter(p => p.id !== property.id && p.location.city === property.location.city).slice(0, 4);
  const whatsappNumber = agent?.phone ? agent.phone.replace(/\D/g, '') : '919876543210';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}.`;
  const emi = useMemo(() => {
    if (emiForm.loanAmount <= 0 || emiForm.rate <= 0 || emiForm.tenure <= 0) return 0;
    const monthlyRate = emiForm.rate / 12 / 100;
    const months = emiForm.tenure * 12;
    const factor = Math.pow(1 + monthlyRate, months);
    return Math.round((emiForm.loanAmount * monthlyRate * factor) / (factor - 1));
  }, [emiForm]);

  const toggleFav = () => {
    if (isFav) { setFavorites(prev => prev.filter(x => x !== property.id)); toast('Removed from favorites'); }
    else { setFavorites(prev => [...prev, property.id]); toast.success('Added to favorites'); }
  };

  const toggleCompare = () => {
    if (isCompare) { setCompareList(prev => prev.filter(x => x !== property.id)); toast('Removed from compare'); }
    else {
      if (compareList.length >= 4) { toast.error('Max 4 properties'); return; }
      setCompareList(prev => [...prev, property.id]); toast.success('Added to compare');
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.name || !scheduleForm.phone) { toast.error('Please fill required fields'); return; }
    const requests = JSON.parse(localStorage.getItem('visitRequests') || '[]');
    requests.push({
      ...scheduleForm,
      propertyId: property.id,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('visitRequests', JSON.stringify(requests));
    toast.success('Site visit scheduled! Our agent will contact you shortly.');
    setScheduleForm({ name: '', phone: '', date: '', message: '' });
  };

  const FACTS = [
    { icon: Bed, label: 'Bedrooms', value: property.beds || '-' },
    { icon: Bath, label: 'Bathrooms', value: property.baths || '-' },
    { icon: Maximize, label: 'Area', value: formatArea(property.areaSqft) },
    { icon: Car, label: 'Parking', value: property.amenities.some(a => a.toLowerCase().includes('parking')) ? 'Yes' : 'No' },
    { icon: Sofa, label: 'Furnishing', value: property.furnishing.replace('-', ' ') },
    { icon: CalendarDays, label: 'Possession', value: property.possession === 'ready-to-move' ? 'Ready to Move' : 'Under Construction' },
  ];

  return (
    <Layout>
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-primary transition-colors">Listings</Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </nav>
        </div>

        {/* Image Gallery */}
        <div className="container mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
            <button onClick={() => setLightboxIdx(0)} className="md:col-span-2 md:row-span-2 relative group">
              <img
                src={images[0]}
                alt={property.title}
                className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
            </button>
            {images.slice(1, 5).map((img, i) => (
              <button key={i} onClick={() => setLightboxIdx(i + 1)} className="relative group hidden md:block">
                <img
                  src={img}
                  alt=""
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-foreground font-semibold">+{images.length - 5} more</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="container pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.verified && <span className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-medium px-3 py-1 rounded-full"><BadgeCheck className="h-3 w-3" />Verified</span>}
                  {property.newLaunch && <span className="bg-card border border-primary/30 text-primary text-xs font-medium px-3 py-1 rounded-full">New Project</span>}
                  {property.reraId && <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">RERA</span>}
                  <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full capitalize">{isRent ? 'For Rent' : property.purpose === 'buy' ? 'For Sale' : 'Commercial'}</span>
                  <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full capitalize flex items-center gap-1"><Building2 className="h-3 w-3" />{property.type}</span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{property.location.fullAddress}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground">{property.societyName}</span> | {property.builderName}
                </div>
                <p className="text-3xl font-bold text-primary">{formatFullCurrency(property.price, isRent)}</p>
                {!isRent && <p className="text-sm text-muted-foreground">{formatINR(property.pricePerSqft, { compact: false })} per sq.ft.</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button variant={isFav ? 'gold' : 'outline-gold'} onClick={toggleFav}>
                  <Heart className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />{isFav ? 'Saved' : 'Save'}
                </Button>
                <Button variant={isCompare ? 'gold' : 'outline-gold'} onClick={toggleCompare}>
                  <GitCompareArrows className="h-4 w-4" />{isCompare ? 'Comparing' : 'Compare'}
                </Button>
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                  <Share2 className="h-4 w-4" />Share
                </Button>
                <Button variant="outline" onClick={() => toast.success('Brochure download started')}>
                  <Download className="h-4 w-4" />Brochure
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href={whatsappLink} className="w-full">
                  <Button variant="gold" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />WhatsApp Agent
                  </Button>
                </a>
                <Button variant="outline-gold" className="w-full gap-2" onClick={() => toast.success('Calling...')}>
                  <Phone className="h-4 w-4" />Call Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => document.getElementById('schedule-visit')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <CalendarDays className="h-4 w-4" />Schedule Site Visit
                </Button>
                <Link to="/home-loan" className="w-full">
                  <Button variant="ghost-light" className="w-full gap-2">
                    <Calculator className="h-4 w-4" />Get Loan Assistance
                  </Button>
                </Link>
              </div>

              {/* Key Facts */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {FACTS.map(f => (
                  <div key={f.label} className="text-center p-4 bg-card border border-border/50 rounded-xl">
                    <f.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-foreground capitalize">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Society</p>
                  <p className="text-sm font-semibold text-foreground">{property.societyName}</p>
                </div>
                <div className="p-4 bg-card border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Builder</p>
                  <p className="text-sm font-semibold text-foreground">{property.builderName}</p>
                </div>
                <div className="p-4 bg-card border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">RERA ID</p>
                  <p className="text-sm font-semibold text-foreground">{property.reraId || 'Available on request'}</p>
                </div>
              </div>

              {!isRent && (
                <div className="bg-card border border-border/50 rounded-xl p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Price Breakup</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Base Price</span>
                    <span className="font-semibold text-foreground">{formatFullCurrency(property.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Booking Amount (approx.)</span>
                    <span className="font-semibold text-foreground">{formatINR(Math.round(property.price * 0.1))}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Maintenance Estimate (approx.)</span>
                    <span className="font-semibold text-foreground">{formatINR(Math.round(property.areaSqft * 3), { isRent: true })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Stamp duty & registration as per Uttar Pradesh circle rates. Indicative only.</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Description</h2>
                <p className={`text-sm text-muted-foreground leading-relaxed ${showDesc ? '' : 'line-clamp-4'}`}>{property.description}</p>
                <button onClick={() => setShowDesc(!showDesc)} className="text-primary text-sm mt-2 hover:text-gold-light transition-colors">
                  {showDesc ? 'Read Less' : 'Read More'}
                </button>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 p-3 bg-card border border-border/50 rounded-lg text-sm text-foreground">
                      <div className="w-2 h-2 rounded-full gold-gradient flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Location Map</h2>
                <div className="h-64 rounded-xl overflow-hidden border border-border/50">
                  <PropertyMap properties={[property]} height="100%" zoom={14} />
                </div>
              </div>

              {/* Nearby */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Nearby</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'Landmarks', items: [property.location.landmark, 'Noida-Greater Noida Expressway', 'DND Flyway'] },
                    { type: 'Metro & Transport', items: ['Sector 137 Metro', 'Botanical Garden Metro', 'Noida City Center'] },
                    { type: 'Schools & Hospitals', items: ['Amity University', 'Jaypee Hospital', 'Local Schools & Clinics'] },
                  ].map(cat => (
                    <div key={cat.type} className="p-4 bg-card border border-border/50 rounded-xl">
                      <h4 className="text-sm font-semibold text-foreground mb-2">{cat.type}</h4>
                      {cat.items.map(item => (
                        <p key={item} className="text-xs text-muted-foreground mb-1">{item}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Card */}
              {agent && (
                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={agent.photo} alt={agent.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-primary" fill="currentColor" />
                        <span>{agent.rating}</span>
                        <span>|</span>
                        <span>{agent.propertiesCount} listings</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={whatsappLink} className="w-full">
                      <Button variant="gold" size="sm" className="w-full">
                        <MessageCircle className="h-3 w-3" />WhatsApp
                      </Button>
                    </a>
                    <Button variant="outline-gold" size="sm" className="w-full" onClick={() => toast.success('Calling agent...')}>
                      <Phone className="h-3 w-3" />Call
                    </Button>
                  </div>
                </div>
              )}

              {/* Schedule Visit */}
              <div className="bg-card border border-border/50 rounded-xl p-6" id="schedule-visit">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Schedule a Site Visit</h3>
                <form onSubmit={handleSchedule} className="space-y-3">
                  <input
                    value={scheduleForm.name}
                    onChange={e => setScheduleForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Name *"
                    className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <input
                    value={scheduleForm.phone}
                    onChange={e => setScheduleForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone / WhatsApp Number *"
                    className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <textarea
                    value={scheduleForm.message}
                    onChange={e => setScheduleForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Message (optional)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <Button variant="gold" className="w-full" type="submit">Schedule Site Visit</Button>
                </form>
              </div>

              {!isRent && (
                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">EMI Calculator</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Loan Amount</label>
                      <input
                        type="number"
                        value={emiForm.loanAmount}
                        onChange={e => setEmiForm(prev => ({ ...prev, loanAmount: Number(e.target.value) || 0 }))}
                        className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Interest Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={emiForm.rate}
                          onChange={e => setEmiForm(prev => ({ ...prev, rate: Number(e.target.value) || 0 }))}
                          className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Tenure (Years)</label>
                        <input
                          type="number"
                          value={emiForm.tenure}
                          onChange={e => setEmiForm(prev => ({ ...prev, tenure: Number(e.target.value) || 0 }))}
                          className="w-full h-10 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Estimated EMI</p>
                      <p className="text-lg font-semibold text-foreground">{formatINR(emi, { isRent: true })}</p>
                      <p className="text-[11px] text-muted-foreground">Indicative only. Actual EMI may vary.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
          {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-6 right-6 text-foreground/70 hover:text-foreground" aria-label="Close gallery">
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setLightboxIdx(prev => prev !== null ? (prev - 1 + property.images.length) % property.images.length : 0); }}
            className="absolute left-4 md:left-8 text-foreground/70 hover:text-foreground p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={images[lightboxIdx]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <button
            onClick={e => { e.stopPropagation(); setLightboxIdx(prev => prev !== null ? (prev + 1) % property.images.length : 0); }}
            className="absolute right-4 md:right-8 text-foreground/70 hover:text-foreground p-2"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-6 text-sm text-muted-foreground">
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </Layout>
  );
}
