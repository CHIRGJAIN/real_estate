import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const QUICK_FILTERS = [
  { label: 'Sector 104', params: { search: 'Sector 104' } },
  { label: 'Near Metro', params: { nearMetro: '1' } },
  { label: 'Ready to Move', params: { possession: 'ready-to-move' } },
  { label: 'Verified', params: { verified: '1' } },
  { label: 'Under ₹ 1 Cr', params: { priceMin: '0', priceMax: '10000000' } },
  { label: 'Investor Deals', params: { newLaunch: '1' } },
];

export default function HeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'buy' | 'rent' | 'commercial' | 'new'>('buy');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [budget, setBudget] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);
  const { allProperties } = useProperties();

  const MAX_BUDGET = 50000000;

  const searchOptions = useMemo(() => {
    const values = allProperties.flatMap((property) => [
      property.location.locality,
      property.location.sector,
      property.societyName,
      property.location.city,
    ]);
    return Array.from(new Set(values.filter(Boolean))).sort();
  }, [allProperties]);

  const suggestions = search.length > 0
    ? searchOptions.filter(c => c.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const parseBudget = (value: string) => {
    if (!value) return null;
    const [minRaw, maxRaw] = value.split('-');
    const min = Number(minRaw);
    const max = Number(maxRaw);
    if (Number.isNaN(min) && Number.isNaN(max)) return null;
    return {
      min: Number.isNaN(min) ? 0 : min,
      max: Number.isNaN(max) ? MAX_BUDGET : max,
    };
  };

  const handleSearch = (overrides?: { search?: string; type?: string; budget?: string; tab?: 'buy' | 'rent' | 'commercial' | 'new' }) => {
    const nextSearch = overrides?.search ?? search;
    const nextType = overrides?.type ?? type;
    const nextBudget = overrides?.budget ?? budget;
    const nextTab = overrides?.tab ?? tab;
    const params = new URLSearchParams();
    if (nextTab !== 'new') {
      params.set('purpose', nextTab);
    } else {
      params.set('newLaunch', '1');
    }
    if (nextSearch) params.set('search', nextSearch);
    if (nextType) params.set('type', nextType);
    const range = parseBudget(nextBudget);
    if (range) {
      params.set('priceMin', String(range.min));
      params.set('priceMax', String(range.max));
    }
    if (nextSearch) {
      setRecentSearches(prev => [nextSearch, ...prev.filter(x => x !== nextSearch)].slice(0, 6));
    }
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-0 mb-4 justify-center">
        {(['buy', 'rent', 'new', 'commercial'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-sm font-medium capitalize transition-all duration-300 ${
              t === tab
                ? 'gold-gradient text-primary-foreground rounded-t-lg'
                : 'bg-card/60 text-muted-foreground hover:text-foreground rounded-t-lg border border-border/30 border-b-0'
            }`}
          >
            {t === 'new' ? 'New Projects' : t}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl border border-border/30 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Sector, society or landmark"
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/80 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search location"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 py-1">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onMouseDown={() => { setSearch(s); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary/50 flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-primary" />{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="h-11 px-4 rounded-lg bg-secondary/80 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            aria-label="Property type"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment / Flat</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="plot">Plot</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>

          <select
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="h-11 px-4 rounded-lg bg-secondary/80 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            aria-label="Budget range"
          >
            <option value="">Any Budget</option>
            <option value="0-2500000">Under ₹25L</option>
            <option value="2500000-5000000">₹25L - ₹50L</option>
            <option value="5000000-7500000">₹50L - ₹75L</option>
            <option value="7500000-10000000">₹75L - ₹1Cr</option>
            <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
            <option value="20000000-50000000">₹2Cr+</option>
          </select>

          <Button variant="gold" size="lg" onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Quick Filters:</span>
          {QUICK_FILTERS.map(filter => (
            <button
              key={filter.label}
              onClick={() => {
                const params = new URLSearchParams();
                if (tab !== 'new') {
                  params.set('purpose', tab);
                } else {
                  params.set('newLaunch', '1');
                }
                Object.entries(filter.params).forEach(([key, value]) => params.set(key, value));
                navigate(`/listings?${params.toString()}`);
              }}
              className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Recent:</span>
            {recentSearches.map(item => (
              <button
                key={item}
                onClick={() => handleSearch({ search: item })}
                className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
