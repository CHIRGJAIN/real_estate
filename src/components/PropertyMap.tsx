import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Property } from '@/data/properties';
import { formatINR } from '@/utils/helpers';

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  properties: Property[];
  height?: string;
  zoom?: number;
}

const DEFAULT_CENTER: [number, number] = [28.533, 77.379];

export default function PropertyMap({ properties, height = '100%', zoom = 13 }: Props) {
  const center = useMemo(() => {
    if (!properties.length) return DEFAULT_CENTER;
    const avgLat = properties.reduce((sum, p) => sum + p.location.lat, 0) / properties.length;
    const avgLng = properties.reduce((sum, p) => sum + p.location.lng, 0) / properties.length;
    return [avgLat, avgLng] as [number, number];
  }, [properties]);

  return (
    <div style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.location.lat, property.location.lng]}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">{property.title}</p>
                <p className="text-muted-foreground mb-2">{formatINR(property.price, { compact: true, isRent: property.purpose !== 'buy' })}</p>
                <Link to={`/property/${property.id}`} className="text-primary hover:text-gold-light">
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
