import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Required to fix missing marker icons in React Leaflet with dynamic bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Create the Airbnb-style price pin bubble
const createPriceIcon = (rent: string | number) => {
  const displayRent = typeof rent === 'string' ? rent : rent.toLocaleString();
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div style="transform: translate(-50%, -100%);" class="bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-200 text-black font-bold text-[14px] whitespace-nowrap hover:bg-black hover:text-white transition-all duration-200 flex justify-center items-center">
        $${displayRent}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0] // Set explicitly to allow full HTML transform to handle center
  })
}

interface SeekerMapProps {
  properties: any[];
  onMarkerClick: (property: any) => void;
}

// A dynamic hook to recenter map when properties change entirely
const RecenterMap = ({ coordinates }: { coordinates: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, map.getZoom(), { animate: true });
  }, [coordinates, map]);
  return null;
}

export const SeekerMap: React.FC<SeekerMapProps> = ({ properties, onMarkerClick }) => {
  // Cincinnati center mapping default
  const defaultCenter: [number, number] = [39.1329, -84.5150]; // UC campus generalized
  
  // Calculate center based on all active markers roughly
  const validProps = properties.filter(p => p.lat && p.lng);
  
  let centerPosition = defaultCenter;
  if (validProps.length > 0) {
    const sumLat = validProps.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = validProps.reduce((sum, p) => sum + p.lng, 0);
    centerPosition = [sumLat / validProps.length, sumLng / validProps.length];
  }

  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden border border-black/10 shadow-inner relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Super sleek, light Airbnb-style tile server
        />
        
        <RecenterMap coordinates={centerPosition} />

        {validProps.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.lat, property.lng]}
            icon={createPriceIcon(property.rent)}
            eventHandlers={{
              click: () => {
                onMarkerClick(property);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
