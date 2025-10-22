import { useState, useEffect } from 'react';
import { MapContainer } from './components/Map/MapContainer';
import { CoverageLayer } from './components/Map/CoverageLayer';
import { Legend } from './components/Map/Legend';
import type { CoverageData } from './types/coverage';

function App() {
  const [coverageData, setCoverageData] = useState<CoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow-md z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">GapMap Planner</h1>
            <p className="text-sm text-blue-100">Seabed Data Coverage Gap Visualizer</p>
          </div>
          <div className="text-sm text-blue-100">
            <p>Region: Portuguese Shelf (Lisbon-Setúbal)</p>
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
            <CoverageLayer data={coverageData} />
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
