import { useState, useEffect, useMemo } from 'react';
import { MapContainer } from './components/Map/MapContainer';
import { CoverageLayer } from './components/Map/CoverageLayer';
import { PolygonDraw } from './components/Map/PolygonDraw';
import { Legend } from './components/Map/Legend';
import { Button } from '@/components/ui/button';
import type { CoverageData } from './types/coverage';
import type { LatLngExpression } from 'leaflet';
import * as turf from '@turf/turf';

function App() {
  const [coverageData, setCoverageData] = useState<CoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Polygon drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPolygon, setDrawnPolygon] = useState<LatLngExpression[] | null>(null);

  // Filter coverage data based on drawn polygon
  const filteredCoverageData = useMemo(() => {
    if (!coverageData || !drawnPolygon || drawnPolygon.length === 0) {
      return null; // Show NO tiles when no polygon is drawn
    }

    // Convert polygon coordinates to turf polygon format
    // drawnPolygon is in [lat, lng] format, need to convert to [lng, lat] for Turf
    const polygonCoords = drawnPolygon.map(coord => {
      const [lat, lng] = coord as [number, number];
      return [lng, lat]; // Turf uses [lng, lat] format
    });
    // Close the polygon by adding first point at the end
    polygonCoords.push(polygonCoords[0]);
    const turfPolygon = turf.polygon([polygonCoords]);

    console.log('Drawn polygon coords (lng, lat):', polygonCoords);
    console.log('Total features to check:', coverageData.features.length);

    // Filter features whose center point falls inside the polygon
    const filteredFeatures = coverageData.features.filter(feature => {
      if (feature.geometry.type === 'Polygon') {
        // The feature geometry is already in GeoJSON format [lng, lat]
        const center = turf.centroid(feature.geometry);
        const isInside = turf.booleanPointInPolygon(center, turfPolygon);

        if (isInside) {
          console.log('Feature inside polygon:', feature.id, center.geometry.coordinates);
        }

        return isInside;
      }
      return false;
    });

    console.log('Filtered features count:', filteredFeatures.length);

    return {
      ...coverageData,
      features: filteredFeatures
    };
  }, [coverageData, drawnPolygon]);

  // Button handlers
  const startDrawing = () => {
    setIsDrawing(true);
  };

  const resetAll = () => {
    setDrawnPolygon(null);
    setIsDrawing(false);
  };

  const handlePolygonComplete = (coordinates: LatLngExpression[]) => {
    console.log('Polygon completed! Coordinates:', coordinates);
    setDrawnPolygon(coordinates);
    setIsDrawing(false); // Exit drawing mode after polygon is complete
  };

  // Load Portuguese shelf coverage data
  useEffect(() => {
    fetch('/data/portuguese-shelf-coverage.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load coverage data');
        return res.json();
      })
      .then(data => {
        setCoverageData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading coverage data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Modern SaaS Header */}
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-12 py-3 max-w-[1800px]">
          <div className="flex items-center justify-between">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              {/* App Icon */}
              <img
                src="https://i.imgur.com/FvbIdeI.png"
                alt="GapMap Planner Logo"
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">GapMap Planner</h1>
                <p className="text-xs text-gray-500">Seabed Coverage Analytics</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Draw Polygon Button - Only show when not drawing and no polygon */}
              {!isDrawing && !drawnPolygon && (
                <Button
                  onClick={startDrawing}
                  variant="outline"
                  size="sm"
                  className="border-[#56A3A6] text-[#56A3A6] hover:bg-[#56A3A6] hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Draw Polygon
                </Button>
              )}

              {/* Reset Button - Only show when drawing or polygon exists */}
              {(isDrawing || drawnPolygon) && (
                <Button
                  onClick={resetAll}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </Button>
              )}

              {/* Export Data Button */}
              <Button variant="outline" size="sm" className="border-[#56A3A6] text-[#56A3A6] hover:bg-[#56A3A6] hover:text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading coverage data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <MapContainer>
            <CoverageLayer data={filteredCoverageData} />
            <PolygonDraw
              isDrawing={isDrawing}
              onPolygonComplete={handlePolygonComplete}
              drawnPolygon={drawnPolygon}
            />
            <Legend />
          </MapContainer>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-gray-800 text-gray-300 px-6 py-2 text-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            {coverageData && (
              <span>
                {coverageData.features.length} surveys loaded |
                Region: {coverageData.region}
              </span>
            )}
          </div>
          <div>
            MVP v0.1 - Data gap visualization only
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
