import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useProperties } from '@/hooks/useProperties';

export default function FavoritesPage() {
  const [favorites] = useLocalStorage<string[]>('favorites', []);
  const { allProperties } = useProperties();
  const favProperties = allProperties.filter(p => favorites.includes(p.id));

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Shortlisted Properties</h1>
        <p className="text-muted-foreground mb-8">{favProperties.length} shortlisted listings</p>

        {favProperties.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-heading text-2xl font-semibold text-foreground mb-2">No shortlisted properties yet</p>
            <p className="text-muted-foreground mb-6">Tap the heart icon to shortlist your favorite homes.</p>
            <Link to="/listings"><Button variant="gold">Browse Properties</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProperties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
