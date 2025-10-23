import { MapContainer as LeafletMap, TileLayer, LayersControl } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

const EMODNET_WMS_URL = 'https://ows.emodnet-bathymetry.eu/wms';

interface MapContainerProps {
  children?: React.ReactNode;
}

export function MapContainer({ children }: MapContainerProps) {
  // Center on Europe with good zoom for Portuguese shelf visibility
  const center: LatLngExpression = [45.0, -5.0];
  const zoom = 5;

  return (
    <div className="h-full w-full">
      <LeafletMap
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
      >
        <LayersControl position="topright">
          {/* Satellite Base Layer - Default */}
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* OpenStreetMap Base Layer */}
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* EMODnet Bathymetry WMS Layer */}
          <LayersControl.BaseLayer name="EMODnet Bathymetry">
            <TileLayer
              attribution='&copy; <a href="https://www.emodnet-bathymetry.eu/">EMODnet Bathymetry</a>'
              url={`${EMODNET_WMS_URL}?service=WMS&version=1.3.0&request=GetMap&layers=emodnet:mean_atlas_land&styles=&format=image/png&transparent=true&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`}
              // WMS-specific parameters
              // @ts-ignore - Leaflet types don't include WMS params
              layers="emodnet:mean_atlas_land"
              format="image/png"
              transparent={true}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {children}
      </LeafletMap>
    </div>
  );
}
