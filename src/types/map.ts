import type { LatLngBounds } from 'leaflet';

// Map bounds type
export interface MapBounds {
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  bounds: LatLngBounds;
}

// Layer visibility state
export interface LayerVisibility {
  coverage: boolean;
  legend: boolean;
  grid: boolean;
}

// Region definition
export interface Region {
  name: string;
  bbox: [number, number, number, number];
  center: [number, number];
  zoom: number;
  description?: string;
}
