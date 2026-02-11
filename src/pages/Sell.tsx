import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { ALL_AMENITIES, type Property } from '@/data/properties';
import { agents } from '@/data/agents';
import { useProperties } from '@/hooks/useProperties';

const STEPS = ['Basic Info', 'Details', 'Pricing', 'Photos', 'Contact'];
const SAMPLE_PHOTOS = [
  '/images/properties/noida-apartment-1.jpg',
  '/images/properties/noida-apartment-2.jpg',
  '/images/properties/noida-apartment-3.jpg',
];

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [photoInput, setPhotoInput] = useState('');
  const { addProperty } = useProperties();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    address: '',
    sector: '',
    city: '',
    pinCode: '',
    landmark: '',
    societyName: '',
    builderName: '',
    reraId: '',
    beds: '',
    baths: '',
    area: '',
    furnishing: '',
    possession: 'ready-to-move',
    price: '',
    purpose: 'buy',
    amenities: [] as string[],
    photos: [] as string[],
    name: '',
    phone: '',
    email: '',
  });

  const update = (partial: Partial<typeof form>) => setForm(prev => ({ ...prev, ...partial }));

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: '',
      address: '',
      sector: '',
      city: '',
      pinCode: '',
      landmark: '',
      societyName: '',
      builderName: '',
      reraId: '',
      beds: '',
      baths: '',
      area: '',
      furnishing: '',
      possession: 'ready-to-move',
      price: '',
      purpose: 'buy',
      amenities: [],
      photos: [],
      name: '',
      phone: '',
      email: '',
    });
    setPhotoInput('');
    setCreatedId(null);
  };

  const addPhoto = () => {
    const url = photoInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast.error('Please enter a valid image URL.');
      return;
    }
    if (form.photos.includes(url)) {
      toast.error('This photo is already added.');
      return;
    }
    update({ photos: [...form.photos, url] });
    setPhotoInput('');
  };

  const removePhoto = (url: string) => {
    update({ photos: form.photos.filter(photo => photo !== url) });
  };

  const toggleAmenity = (amenity: string) => {
    const next = form.amenities.includes(amenity)
      ? form.amenities.filter(item => item !== amenity)
      : [...form.amenities, amenity];
    update({ amenities: next });
  };

  const validateStep = () => {
    if (step === 0 && (!form.title || !form.type || !form.address || !form.city || !form.sector)) {
      toast.error('Please complete the basic property details.');
      return false;
    }
    if (step === 1 && (!form.area || !form.furnishing || !form.possession)) {
      toast.error('Please complete the property details.');
      return false;
    }
    if (step === 2 && !form.price) {
      toast.error('Please add a price.');
      return false;
    }
    if (step === 4 && (!form.name || !form.phone || !form.email)) {
      toast.error('Please provide your contact information.');
      return false;
    }
    return true;
  };

  const buildProperty = (): Property => {
    const area = Number(form.area) || 0;
    const price = Number(form.price) || 0;
    const city = form.city.trim();
    const sector = form.sector.trim();
    const fullAddress = [form.address, sector, city, form.pinCode].filter(Boolean).join(', ');
    const locality = form.societyName || form.address.split(',')[0]?.trim() || sector || city;
    const landmark = form.landmark || 'Noida Expressway';
    const agentId = agents.find(a => a.city.toLowerCase() === city.toLowerCase())?.id || agents[0]?.id || '1';
    const defaultImage = '/images/properties/noida-apartment-1.jpg';

    return {
      id: `custom-${Date.now()}`,
      title: form.title || `${form.type} in ${form.city}`,
      description: form.description || `Beautiful ${form.type} located in ${form.city}.`,
      purpose: form.purpose as Property['purpose'],
      type: form.type as Property['type'],
      price,
      rent: form.purpose === 'rent' ? price : undefined,
      pricePerSqft: area ? Math.round(price / area) : 0,
      location: {
        city,
        locality,
        sector: sector || city,
        fullAddress,
        landmark,
        lat: 28.533,
        lng: 77.379,
      },
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      areaSqft: area,
      furnishing: (form.furnishing || 'unfurnished') as Property['furnishing'],
      possession: (form.possession || 'ready-to-move') as Property['possession'],
      images: form.photos.length ? form.photos : [defaultImage],
      amenities: form.amenities.length ? form.amenities : ['Parking', 'Security'],
      verified: false,
      newLaunch: form.possession === 'under-construction',
      reraId: form.reraId || '',
      builderName: form.builderName || 'Independent Builder',
      societyName: form.societyName || 'Independent Floor',
      agentId,
      createdAt: new Date().toISOString().slice(0, 10),
      popularityScore: 60,
    };
  };

  const submit = () => {
    const property = buildProperty();
    addProperty(property);
    setCreatedId(property.id);
    const submissions = JSON.parse(localStorage.getItem('sellSubmissions') || '[]');
    submissions.push({
      id: property.id,
      propertyId: property.id,
      createdAt: new Date().toISOString(),
      contact: {
        name: form.name,
        phone: form.phone,
        email: form.email,
      },
      form,
    });
    localStorage.setItem('sellSubmissions', JSON.stringify(submissions));
    setSubmitted(true);
    toast.success('Property listed successfully!');
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };

  if (submitted) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container text-center">
          <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Property Listed!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Your property has been submitted successfully. Our team will review and contact you within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {createdId && (
              <Link to={`/property/${createdId}`}>
                <Button variant="outline-gold">View Listing</Button>
              </Link>
            )}
            <Button variant="gold" onClick={() => { setSubmitted(false); setStep(0); resetForm(); }}>
              List Another Property
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const inputClass = "w-full h-11 px-4 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <Layout>
      <div className="pt-28 pb-20 container max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-2">List Your Property</h1>
        <p className="text-muted-foreground text-center mb-10">Reach verified buyers and tenants across Noida and NCR</p>

        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < step ? 'gold-gradient text-primary-foreground' :
                i === step ? 'border-2 border-primary text-primary' :
                'border border-border text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden md:inline">{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 md:w-16 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border/50 rounded-xl p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Basic Information</h2>
              <input value={form.title} onChange={e => update({ title: e.target.value })} placeholder="Property Title" className={inputClass} />
              <select value={form.type} onChange={e => update({ type: e.target.value })} className={inputClass + ' appearance-none'}>
                <option value="">Property Type</option>
                <option value="apartment">Apartment / Flat</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="plot">Plot</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>
              <input value={form.address} onChange={e => update({ address: e.target.value })} placeholder="Street / Tower / Block" className={inputClass} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.sector} onChange={e => update({ sector: e.target.value })} placeholder="Sector (e.g., Sector 104)" className={inputClass} />
                <input value={form.societyName} onChange={e => update({ societyName: e.target.value })} placeholder="Society / Project Name" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.builderName} onChange={e => update({ builderName: e.target.value })} placeholder="Builder Name" className={inputClass} />
                <input value={form.city} onChange={e => update({ city: e.target.value })} placeholder="City (Noida, Greater Noida)" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.pinCode} onChange={e => update({ pinCode: e.target.value })} placeholder="PIN Code" className={inputClass} />
                <input value={form.reraId} onChange={e => update({ reraId: e.target.value })} placeholder="RERA ID (optional)" className={inputClass} />
              </div>
              <input value={form.landmark} onChange={e => update({ landmark: e.target.value })} placeholder="Nearby Landmark (e.g., Sector 137 Metro)" className={inputClass} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input value={form.beds} onChange={e => update({ beds: e.target.value })} placeholder="Bedrooms" type="number" className={inputClass} />
                <input value={form.baths} onChange={e => update({ baths: e.target.value })} placeholder="Bathrooms" type="number" className={inputClass} />
              </div>
              <input value={form.area} onChange={e => update({ area: e.target.value })} placeholder="Area (sq.ft.)" type="number" className={inputClass} />
              <select value={form.furnishing} onChange={e => update({ furnishing: e.target.value })} className={inputClass + ' appearance-none'}>
                <option value="">Furnishing</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
              <select value={form.possession} onChange={e => update({ possession: e.target.value })} className={inputClass + ' appearance-none'}>
                <option value="ready-to-move">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
              </select>
              <textarea
                value={form.description}
                onChange={e => update({ description: e.target.value })}
                placeholder="Describe the property (highlights, view, amenities)"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Pricing</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {['buy', 'rent', 'commercial'].map(p => (
                  <button key={p} onClick={() => update({ purpose: p })} className={`px-4 py-2 text-sm rounded-full capitalize transition-all ${form.purpose === p ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {p === 'buy' ? 'For Sale' : p === 'rent' ? 'For Rent' : 'Commercial'}
                  </button>
                ))}
              </div>
              <input value={form.price} onChange={e => update({ price: e.target.value })} placeholder={form.purpose === 'rent' ? 'Monthly Rent (₹)' : 'Expected Price (₹)'} type="number" className={inputClass} />
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                        form.amenities.includes(amenity) ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Photos</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  value={photoInput}
                  onChange={e => setPhotoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhoto();
                    }
                  }}
                  placeholder="Paste an image URL"
                  className={inputClass}
                />
                <Button variant="outline-gold" onClick={addPhoto}>Add Photo</Button>
                <Button
                  variant="ghost-light"
                  onClick={() => update({ photos: Array.from(new Set([...form.photos, ...SAMPLE_PHOTOS])) })}
                >
                  Use Sample Photos
                </Button>
              </div>

              {form.photos.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Add at least one photo to make your listing stand out.</p>
                  <p className="text-xs text-muted-foreground">Photos are stored locally in your browser.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {form.photos.map((photo) => (
                    <div key={photo} className="relative rounded-lg overflow-hidden border border-border/50">
                      <img src={photo} alt="Listing photo" className="w-full h-28 object-cover" />
                      <button
                        onClick={() => removePhoto(photo)}
                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full border border-border hover:text-destructive"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Contact Information</h2>
              <input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Your Name" className={inputClass} />
              <input value={form.phone} onChange={e => update({ phone: e.target.value })} placeholder="Phone / WhatsApp Number" className={inputClass} />
              <input value={form.email} onChange={e => update({ email: e.target.value })} placeholder="Email" type="email" className={inputClass} />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="ghost-light" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />Back
            </Button>
            <Button variant="gold" onClick={next}>
              {step === STEPS.length - 1 ? 'Submit' : 'Continue'}<ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
