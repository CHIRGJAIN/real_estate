import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const OFFICE_POSITION: [number, number] = [28.533, 77.379];

export default function OfficeMap({ height = '100%' }: { height?: string }) {
  return (
    <div style={{ height }}>
      <MapContainer center={OFFICE_POSITION} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={OFFICE_POSITION}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-foreground">NCR RealtyHub</p>
              <p className="text-muted-foreground">Sector 104, Noida</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
