import { Link } from 'react-router-dom';
import { GitCompareArrows, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { type Property } from '@/data/properties';
import { formatFullCurrency, formatArea } from '@/utils/helpers';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { useProperties } from '@/hooks/useProperties';

export default function ComparePage() {
  const [compareList, setCompareList] = useLocalStorage<string[]>('compareList', []);
  const { allProperties } = useProperties();
  const compareProperties = allProperties.filter(p => compareList.includes(p.id));

  const remove = (id: string) => {
    setCompareList(prev => prev.filter(x => x !== id));
    toast('Removed from compare');
  };

  const ROWS = [
    { label: 'Price', render: (p: Property) => formatFullCurrency(p.price, p.purpose !== 'buy') },
    { label: 'Type', render: (p: Property) => p.type.replace('-', ' ') },
    { label: 'Society', render: (p: Property) => p.societyName || '-' },
    { label: 'Builder', render: (p: Property) => p.builderName || '-' },
    { label: 'RERA ID', render: (p: Property) => p.reraId || '-' },
    { label: 'Bedrooms', render: (p: Property) => p.beds || '-' },
    { label: 'Bathrooms', render: (p: Property) => p.baths || '-' },
    { label: 'Area', render: (p: Property) => formatArea(p.areaSqft) },
    { label: 'Furnishing', render: (p: Property) => p.furnishing.replace('-', ' ') },
    { label: 'Possession', render: (p: Property) => p.possession === 'ready-to-move' ? 'Ready to Move' : 'Under Construction' },
    { label: 'Location', render: (p: Property) => `${p.location.locality}, ${p.location.city}` },
    { label: 'Landmark', render: (p: Property) => p.location.landmark || '-' },
    { label: 'Verified', render: (p: Property) => p.verified ? 'Yes' : 'No' },
    { label: 'Amenities', render: (p: Property) => p.amenities.slice(0, 5).join(', ') },
  ];

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Compare Properties</h1>
        <p className="text-muted-foreground mb-8">Compare up to 4 NCR properties side by side</p>

        {compareProperties.length === 0 ? (
          <div className="text-center py-20">
            <GitCompareArrows className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-heading text-2xl font-semibold text-foreground mb-2">No properties to compare</p>
            <p className="text-muted-foreground mb-6">Add properties from listings to compare them.</p>
            <Link to="/listings"><Button variant="gold">Browse Properties</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 w-40" />
                  {compareProperties.map(p => (
                    <th key={p.id} className="p-4 text-center">
                      <div className="relative">
                        <button onClick={() => remove(p.id)} className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:scale-110 transition-transform" aria-label="Remove from compare">
                          <X className="h-3 w-3" />
                        </button>
                        <Link to={`/property/${p.id}`}>
                          <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                          <p className="font-heading text-sm font-semibold text-foreground line-clamp-1">{p.title}</p>
                        </Link>
                      </div>
                    </th>
                  ))}
                  {compareProperties.length < 4 && (
                    <th className="p-4 text-center">
                      <Link to="/listings" className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                        <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Add Property</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-card/50' : ''}>
                    <td className="p-4 text-sm font-semibold text-foreground">{row.label}</td>
                    {compareProperties.map(p => (
                      <td key={p.id} className="p-4 text-sm text-muted-foreground text-center">
                        {row.render(p)}
                      </td>
                    ))}
                    {compareProperties.length < 4 && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
