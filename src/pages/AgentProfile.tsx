import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, ArrowLeft, Briefcase, Languages, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { agents } from '@/data/agents';
import { useProperties } from '@/hooks/useProperties';

export default function AgentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = agents.find(a => a.id === id);
  const { allProperties } = useProperties();

  if (!agent) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center container">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Agent Not Found</h1>
          <Button variant="outline-gold" onClick={() => navigate('/agents')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Agents</Button>
        </div>
      </Layout>
    );
  }

  const agentProperties = allProperties.filter(p => p.agentId === agent.id);
  const whatsappNumber = agent.phone.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20I%20am%20looking%20for%20a%20property%20in%20${encodeURIComponent(agent.city)}.`;

  return (
    <Layout>
      <div className="pt-28 pb-20 container">
        <button onClick={() => navigate('/agents')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Agents
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border/50 rounded-xl p-8 text-center">
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">{agent.name}</h1>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 text-primary" />{agent.city}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-primary" fill="currentColor" />{agent.rating}</span>
              <span>{agent.propertiesCount} listings</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{agent.experience}y</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
              <Languages className="h-3 w-3 text-primary" />
              {agent.languages.join(', ')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={whatsappLink} className="w-full">
                <Button variant="gold" className="w-full"><MessageCircle className="h-4 w-4" />WhatsApp</Button>
              </a>
              <a href={`tel:${whatsappNumber}`} className="w-full">
                <Button variant="outline-gold" className="w-full"><Phone className="h-4 w-4" />Call</Button>
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{agent.bio}</p>
            <h3 className="text-sm font-semibold text-foreground mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {agent.specialization.map(s => (
                <span key={s} className="px-3 py-1 text-sm bg-secondary rounded-full text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{agent.name}'s Listings</h2>
        {agentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentProperties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <p className="text-muted-foreground">No active listings.</p>
        )}
      </div>
    </Layout>
  );
}
