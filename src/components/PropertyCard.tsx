import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, GitCompareArrows, Bed, Bath, Maximize, MapPin, BadgeCheck, Sparkles, Building2 } from 'lucide-react';
import { Property } from '@/data/properties';
import { formatCurrency, formatArea } from '@/utils/helpers';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface Props {
  property: Property;
  variant?: 'grid' | 'list';
}

export default function PropertyCard({ property, variant = 'grid' }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [compareList, setCompareList] = useLocalStorage<string[]>('compareList', []);
  const images = property.images && property.images.length > 0 ? property.images : ['/placeholder.svg'];

  const isFav = favorites.includes(property.id);
  const isCompare = compareList.includes(property.id);
  const isRent = property.purpose === 'rent' || property.purpose === 'commercial';
  const purposeLabel = property.purpose === 'buy' ? 'For Sale' : property.purpose === 'rent' ? 'For Rent' : 'Commercial';

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== property.id));
      toast('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, property.id]);
      toast.success('Added to favorites');
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompare) {
      setCompareList(prev => prev.filter(id => id !== property.id));
      toast('Removed from compare');
    } else {
      if (compareList.length >= 4) {
        toast.error('Maximum 4 properties to compare');
        return;
      }
      setCompareList(prev => [...prev, property.id]);
      toast.success('Added to compare');
    }
  };

  if (variant === 'list') {
    return (
      <Link to={`/property/${property.id}`} className="block">
        <article className="bg-card border border-border/50 rounded-lg overflow-hidden card-hover flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0">
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {property.verified && <span className="flex items-center gap-1 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full"><BadgeCheck className="h-3 w-3" />Verified</span>}
              {property.newLaunch && <span className="flex items-center gap-1 bg-card/90 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/30"><Sparkles className="h-3 w-3" />New</span>}
              {property.reraId && <span className="flex items-center gap-1 bg-secondary/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border/50">RERA</span>}
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-1">{property.title}</h3>
                <span className="text-lg font-bold text-primary whitespace-nowrap">{formatCurrency(property.price, isRent)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{property.location.locality}, {property.location.city}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Building2 className="h-3 w-3" />
                <span>{property.societyName}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {property.beds > 0 && <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.beds}</span>}
                {property.baths > 0 && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.baths}</span>}
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{formatArea(property.areaSqft)}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={toggleFav} className={`p-2 rounded-full transition-colors ${isFav ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`} aria-label="Toggle favorite">
                  <Heart className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button onClick={toggleCompare} className={`p-2 rounded-full transition-colors ${isCompare ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`} aria-label="Toggle compare">
                  <GitCompareArrows className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <article className="bg-card border border-border/50 rounded-lg overflow-hidden card-hover">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={images[imgIdx]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {property.verified && <span className="flex items-center gap-1 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full"><BadgeCheck className="h-3 w-3" />Verified</span>}
            {property.newLaunch && <span className="flex items-center gap-1 bg-card/90 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/30"><Sparkles className="h-3 w-3" />New</span>}
            {property.reraId && <span className="flex items-center gap-1 bg-secondary/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border/50">RERA</span>}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button onClick={toggleFav} className={`p-2 rounded-full glass transition-colors ${isFav ? 'text-red-400' : 'text-foreground/70 hover:text-red-400'}`} aria-label="Toggle favorite">
              <Heart className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button onClick={toggleCompare} className={`p-2 rounded-full glass transition-colors ${isCompare ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`} aria-label="Toggle compare">
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-primary w-4' : 'bg-foreground/40 hover:bg-foreground/60'}`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-lg font-bold text-primary">{formatCurrency(property.price, isRent)}</p>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">{purposeLabel}</span>
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <MapPin className="h-3 w-3" />
            <span>{property.location.locality}, {property.location.city}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
            {property.beds > 0 && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{property.beds} Beds</span>}
            {property.baths > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.baths} Baths</span>}
            <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{formatArea(property.areaSqft)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
