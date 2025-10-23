import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

interface PolygonDrawProps {
  isDrawing: boolean;
  onPolygonComplete: (coordinates: LatLngExpression[]) => void;
  drawnPolygon: LatLngExpression[] | null;
}

export function PolygonDraw({ isDrawing, onPolygonComplete, drawnPolygon }: PolygonDrawProps) {
  const map = useMap();
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const pointsRef = useRef<L.LatLng[]>([]);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const tempLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!map || !isDrawing) {
      // Clear drawing state when not drawing
      pointsRef.current = [];
      markersRef.current.forEach(marker => map?.removeLayer(marker));
      markersRef.current = [];
      if (tempLineRef.current && map) {
        map.removeLayer(tempLineRef.current);
        tempLineRef.current = null;
      }

      // Change cursor back to default
      if (map) {
        map.getContainer().style.cursor = '';
      }
      return;
    }

    // Change cursor to crosshair when drawing
    map.getContainer().style.cursor = 'crosshair';

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickedPoint = e.latlng;
      console.log('Map clicked at:', clickedPoint);

      // Check if clicking near the first point to close polygon
      if (pointsRef.current.length >= 3) {
        const firstPoint = pointsRef.current[0];

        // Convert lat/lng points to pixel coordinates for accurate distance check
        const firstPointPixel = map.latLngToContainerPoint(firstPoint);
        const clickedPointPixel = map.latLngToContainerPoint(clickedPoint);
        const pixelDistance = firstPointPixel.distanceTo(clickedPointPixel);

        console.log('Pixel distance to first point:', pixelDistance, 'Threshold: 20px');

        // If within 20 pixels of first point, close the polygon
        if (pixelDistance < 20) {
          const polygonCoords = pointsRef.current.map(p => [p.lat, p.lng] as LatLngExpression);
          console.log('Closing polygon with coords:', polygonCoords);
          onPolygonComplete(polygonCoords);
          return;
        }
      }

      // Add new point
      console.log('Adding point:', clickedPoint, 'Total points:', pointsRef.current.length + 1);
      pointsRef.current.push(clickedPoint);

      // Add marker for the point
      const marker = L.circleMarker(clickedPoint, {
        radius: 6,
        fillColor: '#3b82f6',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.8
      }).addTo(map);

      markersRef.current.push(marker);

      // Change first marker to green after 3 points to indicate closing point
      if (pointsRef.current.length >= 3 && markersRef.current[0]) {
        markersRef.current[0].setStyle({
          fillColor: '#10b981', // Green color
          radius: 8, // Slightly larger
          weight: 3
        });
      }

      // Update or create polyline showing current polygon shape
      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current);
      }

      if (pointsRef.current.length > 1) {
        tempLineRef.current = L.polyline(pointsRef.current, {
          color: '#3b82f6',
          weight: 2,
          dashArray: '5, 10'
        }).addTo(map);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, isDrawing, onPolygonComplete]);

  // Display the completed polygon
  useEffect(() => {
    if (!map) return;

    // Remove old polygon
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    // Draw new polygon if exists
    if (drawnPolygon && drawnPolygon.length > 0) {
      polygonLayerRef.current = L.polygon(drawnPolygon, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 3
      }).addTo(map);
    }

    return () => {
      if (polygonLayerRef.current && map) {
        map.removeLayer(polygonLayerRef.current);
      }
    };
  }, [map, drawnPolygon]);

  return null;
}
