import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, X, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import FilterPanel from '@/components/FilterPanel';
import SkeletonCard from '@/components/SkeletonCard';
import PropertyMap from '@/components/PropertyMap';
import { useProperties } from '@/hooks/useProperties';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FilterState, defaultFilters, filterProperties, sortProperties, SortOption, getActiveFilterCount, formatINR } from '@/utils/helpers';

const PAGE_SIZE = 9;

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);
  const { allProperties } = useProperties();

  const [filters, setFilters] = useState<FilterState>(() => {
    const f = { ...defaultFilters };
    const purpose = searchParams.get('purpose');
    const city = searchParams.get('city');
    const s = searchParams.get('search');
    const type = searchParams.get('type');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const beds = searchParams.get('beds');
    const baths = searchParams.get('baths');
    const areaMin = searchParams.get('areaMin');
    const areaMax = searchParams.get('areaMax');
    const possession = searchParams.get('possession');
    const verified = searchParams.get('verified');
    const newLaunch = searchParams.get('newLaunch');
    const reraOnly = searchParams.get('rera');
    const nearMetro = searchParams.get('nearMetro');
    const builder = searchParams.get('builder');
    const society = searchParams.get('society');
    if (purpose) f.purpose = purpose;
    if (city) f.city = city;
    if (s) { f.search = s; }
    if (type) f.type = [type];
    if (priceMin && !Number.isNaN(Number(priceMin))) f.priceMin = Math.max(0, Number(priceMin));
    if (priceMax && !Number.isNaN(Number(priceMax))) f.priceMax = Math.max(0, Number(priceMax));
    if (beds && !Number.isNaN(Number(beds))) f.beds = Math.max(0, Number(beds));
    if (baths && !Number.isNaN(Number(baths))) f.baths = Math.max(0, Number(baths));
    if (areaMin && !Number.isNaN(Number(areaMin))) f.areaMin = Math.max(0, Number(areaMin));
    if (areaMax && !Number.isNaN(Number(areaMax))) f.areaMax = Math.max(0, Number(areaMax));
    if (possession) f.possession = [possession];
    if (verified) f.verifiedOnly = verified === '1';
    if (newLaunch) f.newLaunchOnly = newLaunch === '1';
    if (reraOnly) f.reraOnly = reraOnly === '1';
    if (nearMetro) f.nearMetro = nearMetro === '1';
    if (builder) f.builder = builder;
    if (society) f.society = society;
    if (f.priceMax < f.priceMin) f.priceMax = f.priceMin;
    if (f.areaMax < f.areaMin) f.areaMax = f.areaMin;
    return f;
  });

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [filters, sort]);

  const cityOptions = useMemo(
    () => Array.from(new Set(allProperties.map((property) => property.location.city))).sort(),
    [allProperties],
  );
  const builderOptions = useMemo(
    () => Array.from(new Set(allProperties.map((property) => property.builderName))).sort(),
    [allProperties],
  );
  const societyOptions = useMemo(
    () => Array.from(new Set(allProperties.map((property) => property.societyName))).sort(),
    [allProperties],
  );

  const results = useMemo(
    () => sortProperties(filterProperties(allProperties, filters), sort),
    [filters, sort, allProperties],
  );

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = getActiveFilterCount(filters);

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
    if (f.search && f.search.length >= 2) {
      setRecentSearches(prev => [f.search, ...prev.filter(x => x !== f.search)].slice(0, 6));
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">Noida, Greater Noida & Delhi NCR Listings</h1>
              <p className="text-sm text-muted-foreground">{results.length} listings matched</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={filters.search}
                  onChange={e => handleFilterChange({ ...filters, search: e.target.value })}
                  placeholder="Search sector, society, landmark..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="h-10 px-3 rounded-lg bg-card border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="hidden md:flex border border-border/50 rounded-lg overflow-hidden">
                <button onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`} aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`} aria-label="List view">
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant={showMap ? 'gold' : 'outline'}
                size="sm"
                className="hidden md:flex items-center gap-2"
                onClick={() => setShowMap(!showMap)}
              >
                <Map className="h-4 w-4" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden relative"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 gold-gradient rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">{activeCount}</span>
                )}
              </Button>
              <Button
                variant={showMap ? 'gold' : 'outline'}
                size="icon"
                className="md:hidden"
                onClick={() => setShowMap(!showMap)}
                aria-label="Toggle map view"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-muted-foreground">Recent:</span>
              {recentSearches.map(item => (
                <button
                  key={item}
                  onClick={() => handleFilterChange({ ...filters, search: item })}
                  className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Active Filter Chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.purpose && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground capitalize">
                  {filters.purpose}
                  <button onClick={() => handleFilterChange({ ...filters, purpose: '' })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.city && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.city}
                  <button onClick={() => handleFilterChange({ ...filters, city: '' })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.type.map(t => (
                <span key={t} className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground capitalize">
                  {t}
                  <button onClick={() => handleFilterChange({ ...filters, type: filters.type.filter(x => x !== t) })}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {filters.builder && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.builder}
                  <button onClick={() => handleFilterChange({ ...filters, builder: '' })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.society && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.society}
                  <button onClick={() => handleFilterChange({ ...filters, society: '' })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.search && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  "{filters.search}"
                  <button onClick={() => handleFilterChange({ ...filters, search: '' })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {(filters.priceMin > 0 || filters.priceMax < defaultFilters.priceMax) && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {formatINR(filters.priceMin, { compact: true })} - {formatINR(filters.priceMax, { compact: true })}
                  <button onClick={() => handleFilterChange({ ...filters, priceMin: defaultFilters.priceMin, priceMax: defaultFilters.priceMax })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.beds > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.beds}+ Beds
                  <button onClick={() => handleFilterChange({ ...filters, beds: 0 })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.baths > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.baths}+ Baths
                  <button onClick={() => handleFilterChange({ ...filters, baths: 0 })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {(filters.areaMin > 0 || filters.areaMax < defaultFilters.areaMax) && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {filters.areaMin.toLocaleString('en-IN')} - {filters.areaMax.toLocaleString('en-IN')} sq.ft.
                  <button onClick={() => handleFilterChange({ ...filters, areaMin: defaultFilters.areaMin, areaMax: defaultFilters.areaMax })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.furnishing.map(f => (
                <span key={f} className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground capitalize">
                  {f.replace('-', ' ')}
                  <button onClick={() => handleFilterChange({ ...filters, furnishing: filters.furnishing.filter(x => x !== f) })}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {filters.possession.map(p => (
                <span key={p} className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground capitalize">
                  {p === 'under-construction' ? 'Under Construction' : 'Ready to Move'}
                  <button onClick={() => handleFilterChange({ ...filters, possession: filters.possession.filter(x => x !== p) })}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {filters.amenities.map(a => (
                <span key={a} className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  {a}
                  <button onClick={() => handleFilterChange({ ...filters, amenities: filters.amenities.filter(x => x !== a) })}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {filters.verifiedOnly && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  Verified
                  <button onClick={() => handleFilterChange({ ...filters, verifiedOnly: false })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.newLaunchOnly && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  New Projects
                  <button onClick={() => handleFilterChange({ ...filters, newLaunchOnly: false })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.reraOnly && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  RERA Registered
                  <button onClick={() => handleFilterChange({ ...filters, reraOnly: false })}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.nearMetro && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
                  Near Metro
                  <button onClick={() => handleFilterChange({ ...filters, nearMetro: false })}><X className="h-3 w-3" /></button>
                </span>
              )}
              <button onClick={() => handleFilterChange(defaultFilters)} className="text-xs text-primary hover:text-gold-light transition-colors">
                Clear All
              </button>
            </div>
          )}

          <div className={`flex gap-8 ${showMap ? 'flex-col xl:flex-row' : ''}`}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card border border-border/50 rounded-xl p-5">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  cities={cityOptions}
                  builders={builderOptions}
                  societies={societyOptions}
                />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : pageResults.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-heading text-2xl font-semibold text-foreground mb-2">No properties found</p>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                  <Button variant="outline-gold" onClick={() => { handleFilterChange(defaultFilters); }}>Reset Filters</Button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {pageResults.map(p => (
                      <PropertyCard key={p.id} property={p} variant={view} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            page === i + 1 ? 'gold-gradient text-primary-foreground' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {showMap && (
              <div className="xl:w-[40%] w-full h-[420px] xl:h-auto">
                <div className="sticky top-24 h-[420px] xl:h-[calc(100vh-140px)] rounded-xl overflow-hidden border border-border/50">
                  <PropertyMap properties={results} height="100%" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 w-full max-h-[85vh] bg-card border-t border-border p-5 rounded-t-2xl" style={{ animation: 'sheet-up 0.3s ease-out' }}>
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onClose={() => setMobileFiltersOpen(false)}
              isMobile
              cities={cityOptions}
              builders={builderOptions}
              societies={societyOptions}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
