import { useMemo } from 'react';
import { Property, properties as baseProperties } from '@/data/properties';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'customProperties';

const normalizeProperty = (property: Property): Property => {
  const price = Number(property.price) || 0;
  const areaSqft = Number(property.areaSqft) || 0;
  const pricePerSqft = property.pricePerSqft || (areaSqft ? Math.round(price / areaSqft) : 0);

  return {
    ...property,
    price,
    areaSqft,
    pricePerSqft,
    createdAt: property.createdAt || new Date().toISOString().slice(0, 10),
    popularityScore: property.popularityScore ?? 50,
  };
};

export function useProperties() {
  const [customProperties, setCustomProperties] = useLocalStorage<Property[]>(STORAGE_KEY, []);

  const normalizedCustom = useMemo(
    () => customProperties.map((property) => normalizeProperty(property)),
    [customProperties],
  );

  const allProperties = useMemo(() => {
    const baseIds = new Set(baseProperties.map((property) => property.id));
    const filteredCustom = normalizedCustom.filter((property) => property && !baseIds.has(property.id));
    return [...filteredCustom, ...baseProperties];
  }, [normalizedCustom]);

  const addProperty = (property: Property) => {
    const next = normalizeProperty(property);
    setCustomProperties((prev) => [next, ...prev.filter((item) => item.id !== next.id)]);
  };

  return { allProperties, customProperties: normalizedCustom, addProperty, setCustomProperties };
}
