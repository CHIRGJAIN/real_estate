import { Property } from '@/data/properties';

interface FormatINROptions {
  compact?: boolean;
  isRent?: boolean;
}

export function formatINR(amount: number, options: FormatINROptions = {}): string {
  const { compact = false, isRent = false } = options;
  const crore = 10000000;
  const lakh = 100000;

  const formatGrouped = (value: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value));

  const trimDecimals = (value: number, digits: number) => {
    const fixed = value.toFixed(digits);
    return fixed.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  };

  let formatted: string;

  if (compact) {
    if (amount >= crore) {
      const value = amount / crore;
      formatted = `₹ ${trimDecimals(value, 2)} Cr`;
    } else if (amount >= lakh) {
      const value = amount / lakh;
      formatted = `₹ ${trimDecimals(value, 1)} Lakh`;
    } else {
      formatted = `₹ ${formatGrouped(amount)}`;
    }
  } else {
    formatted = `₹ ${formatGrouped(amount)}`;
  }

  return isRent ? `${formatted}/mo` : formatted;
}

export function formatCurrency(amount: number, isRent = false): string {
  return formatINR(amount, { compact: true, isRent });
}

export function formatFullCurrency(amount: number, isRent = false): string {
  return formatINR(amount, { compact: false, isRent });
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq.ft.`;
}

export function simulateApiCall<T>(data: T, delay = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

export interface FilterState {
  purpose: string;
  type: string[];
  priceMin: number;
  priceMax: number;
  beds: number;
  baths: number;
  areaMin: number;
  areaMax: number;
  furnishing: string[];
  possession: string[];
  amenities: string[];
  verifiedOnly: boolean;
  newLaunchOnly: boolean;
  reraOnly: boolean;
  nearMetro: boolean;
  builder: string;
  society: string;
  city: string;
  search: string;
}

export const defaultFilters: FilterState = {
  purpose: '',
  type: [],
  priceMin: 0,
  priceMax: 50000000,
  beds: 0,
  baths: 0,
  areaMin: 0,
  areaMax: 100000,
  furnishing: [],
  possession: [],
  amenities: [],
  verifiedOnly: false,
  newLaunchOnly: false,
  reraOnly: false,
  nearMetro: false,
  builder: '',
  society: '',
  city: '',
  search: '',
};

export function filterProperties(properties: Property[], filters: FilterState): Property[] {
  return properties.filter(p => {
    if (filters.purpose && p.purpose !== filters.purpose) return false;
    if (filters.type.length && !filters.type.includes(p.type)) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.beds && p.beds < filters.beds) return false;
    if (filters.baths && p.baths < filters.baths) return false;
    if (p.areaSqft < filters.areaMin || p.areaSqft > filters.areaMax) return false;
    if (filters.furnishing.length && !filters.furnishing.includes(p.furnishing)) return false;
    if (filters.possession.length && !filters.possession.includes(p.possession)) return false;
    if (filters.amenities.length && !filters.amenities.every(a => p.amenities.includes(a))) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.newLaunchOnly && !p.newLaunch) return false;
    if (filters.reraOnly && !p.reraId) return false;
    if (filters.nearMetro && !p.location.landmark.toLowerCase().includes('metro')) return false;
    if (filters.builder && p.builderName !== filters.builder) return false;
    if (filters.society && p.societyName !== filters.society) return false;
    if (filters.city && p.location.city !== filters.city) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        p.title,
        p.location.city,
        p.location.locality,
        p.location.sector,
        p.location.landmark,
        p.builderName,
        p.societyName,
        p.reraId,
        p.type,
        p.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortProperties(properties: Property[], sort: SortOption): Property[] {
  const sorted = [...properties];
  switch (sort) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular': return sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    default: return sorted;
  }
}

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.purpose) count++;
  if (filters.type.length) count++;
  if (filters.priceMin > 0 || filters.priceMax < defaultFilters.priceMax) count++;
  if (filters.beds) count++;
  if (filters.baths) count++;
  if (filters.areaMin > 0 || filters.areaMax < defaultFilters.areaMax) count++;
  if (filters.furnishing.length) count++;
  if (filters.possession.length) count++;
  if (filters.amenities.length) count++;
  if (filters.verifiedOnly) count++;
  if (filters.newLaunchOnly) count++;
  if (filters.reraOnly) count++;
  if (filters.nearMetro) count++;
  if (filters.builder) count++;
  if (filters.society) count++;
  if (filters.city) count++;
  if (filters.search) count++;
  return count;
}
