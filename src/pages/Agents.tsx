import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { agents } from '@/data/agents';

export default function AgentsPage() {
  const [cityFilter, setCityFilter] = useState('');
  const cities = [...new Set(agents.map(a => a.city))];
  const filtered = cityFilter ? agents.filter(a => a.city === cityFilter) : agents;

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Our Team</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Property Consultants</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Local experts across Noida, Greater Noida, and Delhi NCR to help you buy, rent, or invest.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          <button onClick={() => setCityFilter('')} className={`px-4 py-2 text-sm rounded-full transition-all ${!cityFilter ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
            All Cities
          </button>
          {cities.map(c => (
            <button key={c} onClick={() => setCityFilter(c)} className={`px-4 py-2 text-sm rounded-full transition-all ${cityFilter === c ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(agent => (
            <Link key={agent.id} to={`/agents/${agent.id}`} className="group">
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden card-hover">
                <div className="relative aspect-square overflow-hidden">
                  <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-5 -mt-12 relative z-10">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{agent.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 text-primary" />{agent.city}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-primary" fill="currentColor" />{agent.rating}</span>
                    <span>{agent.propertiesCount} listings</span>
                    <span>{agent.experience}y exp</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Languages className="h-3 w-3 text-primary" />
                    {agent.languages.join(', ')}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialization.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
