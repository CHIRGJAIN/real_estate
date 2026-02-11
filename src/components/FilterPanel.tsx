import { useEffect, useState } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState, defaultFilters, formatINR } from '@/utils/helpers';
import { CITIES, PROPERTY_TYPES, FURNISHING_OPTIONS, ALL_AMENITIES } from '@/data/properties';
import { Slider } from '@/components/ui/slider';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
  cities?: string[];
  builders?: string[];
  societies?: string[];
}

export default function FilterPanel({ filters, onChange, onClose, isMobile, cities, builders, societies }: Props) {
  const [local, setLocal] = useState(filters);
  const cityOptions = cities && cities.length ? cities : CITIES;
  const builderOptions = builders && builders.length ? builders : [];
  const societyOptions = societies && societies.length ? societies : [];

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const normalizeRanges = (next: FilterState) => {
    const priceMin = Math.max(0, next.priceMin);
    const priceMax = Math.max(priceMin, next.priceMax);
    const areaMin = Math.max(0, next.areaMin);
    const areaMax = Math.max(areaMin, next.areaMax);
    return { ...next, priceMin, priceMax, areaMin, areaMax };
  };

  const update = (partial: Partial<FilterState>) => {
    const next = normalizeRanges({ ...local, ...partial });
    setLocal(next);
    if (!isMobile) onChange(next);
  };

  const toggleArray = (key: keyof FilterState, value: string) => {
    const arr = local[key] as string[];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    update({ [key]: next });
  };

  const reset = () => {
    setLocal(defaultFilters);
    onChange(defaultFilters);
  };

  const apply = () => {
    onChange(normalizeRanges(local));
    onClose?.();
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="py-4 border-b border-border/50">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">{title}</h4>
      {children}
    </div>
  );

  const numberInputClass = "w-full h-9 px-3 rounded-md bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  const PRICE_RANGES = [
    { label: '₹25L', min: 0, max: 2500000 },
    { label: '₹50L', min: 0, max: 5000000 },
    { label: '₹75L', min: 0, max: 7500000 },
    { label: '₹1Cr', min: 0, max: 10000000 },
    { label: '₹2Cr', min: 0, max: 20000000 },
    { label: '₹3Cr+', min: 30000000, max: defaultFilters.priceMax },
  ];

  const AREA_RANGES = [
    { label: 'Under 1,000', min: 0, max: 1000 },
    { label: '1,000 - 3,000', min: 1000, max: 3000 },
    { label: '3,000 - 5,000', min: 3000, max: 5000 },
    { label: '5,000+', min: 5000, max: defaultFilters.areaMax },
  ];

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''}`}>
      <div className="flex items-center justify-between px-1 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
            <RotateCcw className="h-3 w-3" />Reset
          </button>
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className={`${isMobile ? 'flex-1 overflow-y-auto' : ''} space-y-0`}>
        <Section title="Purpose">
          <div className="flex gap-2">
            {['buy', 'rent', 'commercial'].map(p => (
              <button
                key={p}
                onClick={() => update({ purpose: local.purpose === p ? '' : p })}
                className={`px-3 py-1.5 text-xs rounded-full capitalize transition-all ${
                  local.purpose === p ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Property Type">
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => toggleArray('type', t)}
                className={`px-3 py-1.5 text-xs rounded-full capitalize transition-all ${
                  (local.type as string[]).includes(t) ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        <Section title="City">
          <select
            value={local.city}
            onChange={e => update({ city: e.target.value })}
            className="w-full h-9 px-3 rounded-md bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="">All Cities</option>
            {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Section>

        {builderOptions.length > 0 && (
          <Section title="Builder">
            <select
              value={local.builder}
              onChange={e => update({ builder: e.target.value })}
              className="w-full h-9 px-3 rounded-md bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="">All Builders</option>
              {builderOptions.map(builder => <option key={builder} value={builder}>{builder}</option>)}
            </select>
          </Section>
        )}

        {societyOptions.length > 0 && (
          <Section title="Society">
            <select
              value={local.society}
              onChange={e => update({ society: e.target.value })}
              className="w-full h-9 px-3 rounded-md bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="">All Societies</option>
              {societyOptions.map(society => <option key={society} value={society}>{society}</option>)}
            </select>
          </Section>
        )}

        <Section title="Price Range">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={local.priceMin}
              onChange={e => update({ priceMin: Number(e.target.value) || 0 })}
              placeholder="Min"
              className={numberInputClass}
            />
            <input
              type="number"
              min={0}
              value={local.priceMax === defaultFilters.priceMax ? '' : local.priceMax}
              onChange={e => update({ priceMax: e.target.value === '' ? defaultFilters.priceMax : Number(e.target.value) || defaultFilters.priceMax })}
              placeholder="Max"
              className={numberInputClass}
            />
          </div>
          <div className="mt-4">
            <Slider
              min={0}
              max={defaultFilters.priceMax}
              step={250000}
              value={[local.priceMin, local.priceMax]}
              onValueChange={([min, max]) => update({ priceMin: min, priceMax: max })}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>{formatINR(local.priceMin, { compact: true })}</span>
              <span>{formatINR(local.priceMax, { compact: true })}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {PRICE_RANGES.map(range => (
              <button
                key={range.label}
                onClick={() => update({ priceMin: range.min, priceMax: range.max })}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  local.priceMin === range.min && local.priceMax === range.max ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Bedrooms">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map(b => (
              <button
                key={b}
                onClick={() => update({ beds: local.beds === b ? 0 : b })}
                className={`w-9 h-9 text-xs rounded-lg transition-all ${
                  local.beds === b && b !== 0 ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {b === 0 ? 'Any' : b === 5 ? '5+' : b}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Bathrooms">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map(b => (
              <button
                key={b}
                onClick={() => update({ baths: local.baths === b ? 0 : b })}
                className={`w-9 h-9 text-xs rounded-lg transition-all ${
                  local.baths === b && b !== 0 ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {b === 0 ? 'Any' : b === 5 ? '5+' : b}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Area (sq.ft.)">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={local.areaMin}
              onChange={e => update({ areaMin: Number(e.target.value) || 0 })}
              placeholder="Min"
              className={numberInputClass}
            />
            <input
              type="number"
              min={0}
              value={local.areaMax === defaultFilters.areaMax ? '' : local.areaMax}
              onChange={e => update({ areaMax: e.target.value === '' ? defaultFilters.areaMax : Number(e.target.value) || defaultFilters.areaMax })}
              placeholder="Max"
              className={numberInputClass}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {AREA_RANGES.map(range => (
              <button
                key={range.label}
                onClick={() => update({ areaMin: range.min, areaMax: range.max })}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  local.areaMin === range.min && local.areaMax === range.max ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Furnishing">
          <div className="flex flex-wrap gap-2">
            {FURNISHING_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => toggleArray('furnishing', f)}
                className={`px-3 py-1.5 text-xs rounded-full capitalize transition-all ${
                  (local.furnishing as string[]).includes(f) ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Possession">
          <div className="flex gap-2">
            {['ready-to-move', 'under-construction'].map(p => (
              <button
                key={p}
                onClick={() => toggleArray('possession', p)}
                className={`px-3 py-1.5 text-xs rounded-full capitalize transition-all ${
                  (local.possession as string[]).includes(p) ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {p === 'under-construction' ? 'Under Construction' : 'Ready to Move'}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Amenities">
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map(a => (
              <button
                key={a}
                onClick={() => toggleArray('amenities', a)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  (local.amenities as string[]).includes(a) ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Section>

        <div className="py-4 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">Verified Only</span>
            <button
              onClick={() => update({ verifiedOnly: !local.verifiedOnly })}
              className={`w-10 h-6 rounded-full transition-colors relative ${local.verifiedOnly ? 'bg-primary' : 'bg-secondary'}`}
              role="switch"
              aria-checked={local.verifiedOnly}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${local.verifiedOnly ? 'left-5' : 'left-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">New Projects Only</span>
            <button
              onClick={() => update({ newLaunchOnly: !local.newLaunchOnly })}
              className={`w-10 h-6 rounded-full transition-colors relative ${local.newLaunchOnly ? 'bg-primary' : 'bg-secondary'}`}
              role="switch"
              aria-checked={local.newLaunchOnly}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${local.newLaunchOnly ? 'left-5' : 'left-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">RERA Registered</span>
            <button
              onClick={() => update({ reraOnly: !local.reraOnly })}
              className={`w-10 h-6 rounded-full transition-colors relative ${local.reraOnly ? 'bg-primary' : 'bg-secondary'}`}
              role="switch"
              aria-checked={local.reraOnly}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${local.reraOnly ? 'left-5' : 'left-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">Near Metro</span>
            <button
              onClick={() => update({ nearMetro: !local.nearMetro })}
              className={`w-10 h-6 rounded-full transition-colors relative ${local.nearMetro ? 'bg-primary' : 'bg-secondary'}`}
              role="switch"
              aria-checked={local.nearMetro}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${local.nearMetro ? 'left-5' : 'left-1'}`} />
            </button>
          </label>
        </div>
      </div>

      {isMobile && (
        <div className="p-4 border-t border-border/50">
          <Button variant="gold" className="w-full" onClick={apply}>Apply Filters</Button>
        </div>
      )}
    </div>
  );
}
