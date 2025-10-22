# GapMap Planner - MVP Plan

## 🎯 Project Overview

**Goal**: Build a web-based tool to visualize bathymetry data coverage gaps in European waters, helping identify where to conduct marine surveys next.

**Timeline**: 1-2 weeks (hackathon pace)

**Tech Stack**: React + TypeScript + Leaflet (client-side only)

---

## 📋 Core MVP Features

### What Users Can Do:
1. ✅ View interactive map of Europe with bathymetry basemap
2. ✅ Draw rectangular box to select region of interest
3. ✅ See color-coded visualization of bathymetry coverage quality
4. ✅ Identify resolution and age of existing bathymetry data
5. ✅ Visualize data gaps (areas needing new surveys)
6. ✅ Export gap areas as GeoJSON for mission planning

### MVP Scope (Simplified):
- **Client-side only** - No backend/database required
- **Data gap scoring only** - Focus on resolution + age (no ecological/economic factors yet)
- **Sample data** - Pre-loaded GeoJSON for Portuguese shelf region
- **Single region** - Portuguese continental shelf (can expand later)

### Future Enhancements (Post-MVP):
- EMODnet bathymetry data from S3 bucket
- Backend API for data processing
- Multi-factor priority scoring (ecological, economic, accessibility)
- Multiple European regions
- Real-time EMODnet API integration
- User authentication and saved analyses

---

## 🏗️ Technical Architecture

```
Frontend (React + TypeScript + Vite)
│
├── Map Layer (Leaflet + React-Leaflet)
│   ├── EMODnet WMS basemap (visual bathymetry)
│   ├── Box drawing control for region selection
│   └── Coverage quality overlay (color-coded polygons)
│
├── Data Layer (Client-side)
│   ├── Static GeoJSON files (sample Portuguese shelf data)
│   ├── Data gap scoring algorithm
│   └── Spatial analysis (Turf.js)
│
├── UI Components
│   ├── MapContainer (main Leaflet map)
│   ├── DrawControl (region selection)
│   ├── CoverageLayer (quality visualization)
│   ├── ControlPanel (layer toggles, legend)
│   ├── ResultsPanel (statistics, gap areas)
│   └── ExportButton (GeoJSON download)
│
└── Styling
    └── Tailwind CSS + shadcn/ui
```

---

## 📊 Data Structure

### Sample Coverage Data Format

```json
{
  "type": "FeatureCollection",
  "region": "Portuguese Shelf (Lisbon-Setúbal)",
  "bbox": [-9.7, 38.3, -8.8, 39.2],
  "features": [
    {
      "type": "Feature",
      "id": "PT_2015_001",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-9.5, 38.6], [-9.3, 38.6], [-9.3, 38.8], [-9.5, 38.8], [-9.5, 38.6]]]
      },
      "properties": {
        "survey_id": "PT_2015_001",
        "year": 2015,
        "resolution": 5,
        "survey_type": "multibeam",
        "institution": "Portuguese Hydrographic Institute",
        "vertical_accuracy": 0.5
      }
    }
  ]
}
```

### Quality Categories

| Category | Color | Criteria |
|----------|-------|----------|
| **Excellent** | Green (#33cc33) | Resolution <10m AND age <5yr |
| **Good** | Yellow-green (#99cc33) | Resolution 10-25m OR age 5-10yr |
| **Moderate** | Yellow (#ffcc00) | Resolution 25-50m OR age 10-20yr |
| **Poor** | Orange (#ff9900) | Resolution 50-100m OR age 20-30yr |
| **Very Poor** | Orange-red (#ff6600) | Resolution >100m OR age >30yr |
| **No Data** | Red (#ff0000) | No survey coverage |

---

## 🎨 Data Gap Scoring Algorithm

```typescript
interface SurveyData {
  year: number;
  resolution: number; // meters
  survey_type: string;
}

function calculateDataGapScore(survey: SurveyData | null): {
  score: number;      // 0-100 (higher = bigger gap)
  category: string;   // quality category
} {
  const currentYear = 2025;

  // No data = maximum gap
  if (!survey) {
    return { score: 100, category: 'no_data' };
  }

  // Resolution score (0-50 points)
  let resolutionScore = 0;
  if (survey.resolution > 100) resolutionScore = 50;
  else if (survey.resolution > 50) resolutionScore = 35;
  else if (survey.resolution > 25) resolutionScore = 25;
  else if (survey.resolution > 10) resolutionScore = 15;
  else resolutionScore = 5;

  // Age score (0-50 points)
  const dataAge = currentYear - survey.year;
  let ageScore = 0;
  if (dataAge > 30) ageScore = 50;
  else if (dataAge > 20) ageScore = 35;
  else if (dataAge > 10) ageScore = 25;
  else if (dataAge > 5) ageScore = 15;
  else ageScore = 5;

  const totalScore = Math.min(resolutionScore + ageScore, 100);

  // Determine category
  let category = 'excellent';
  if (totalScore >= 80) category = 'very_poor';
  else if (totalScore >= 60) category = 'poor';
  else if (totalScore >= 40) category = 'moderate';
  else if (totalScore >= 20) category = 'good';

  return { score: totalScore, category };
}
```

---

## 📅 Implementation Timeline

### Week 1: Foundation + Visualization

**Days 1-2: Project Setup + Basic Map**
- [x] Create React + TypeScript + Vite project
- [x] Install dependencies: `leaflet`, `react-leaflet`, `@turf/turf`, `tailwindcss`
- [x] Set up Leaflet map component centered on Europe
- [x] Integrate EMODnet bathymetry WMS as basemap
- [x] Add zoom/pan controls

**Days 3-4: Region Selection + Sample Data**
- [ ] Implement box drawing tool (react-leaflet-draw or custom)
- [ ] Create sample coverage data for Portuguese shelf (~20-30 survey polygons)
- [ ] Load data when user draws box over Portuguese region
- [ ] Display survey polygons on map

**Days 5-7: Coverage Visualization**
- [ ] Implement data gap scoring function
- [ ] Color-code coverage polygons based on quality
- [ ] Add map legend showing quality categories
- [ ] Implement hover tooltips with survey metadata
- [ ] Add click handler for detailed survey info

### Week 2: Analysis + Export

**Days 8-10: Gap Analysis**
- [ ] Calculate coverage statistics for selected region
  - % area unmapped
  - % area by quality category
  - Average resolution
  - Average data age
- [ ] Identify priority gap areas (very poor + no data)
- [ ] Create results panel showing statistics
- [ ] Highlight gap areas on map

**Days 11-12: Export + Polish**
- [ ] GeoJSON export functionality (gap areas only)
- [ ] Add metadata to exports (score, resolution, age, area km²)
- [ ] Layer toggle controls (coverage, gaps, basemap)
- [ ] Responsive design
- [ ] Loading states, error handling

**Days 13-14: Demo Preparation**
- [ ] Add help/info tooltips
- [ ] Create README with usage instructions
- [ ] Deploy to Vercel
- [ ] Test complete user flow
- [ ] Record demo video (optional)

---

## 🗂️ Project Structure

```
gapmap-planner/
├── public/
│   └── data/
│       └── portuguese-shelf-coverage.json  # Sample data
│
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx           # Main Leaflet map
│   │   │   ├── CoverageLayer.tsx          # Quality visualization
│   │   │   ├── DrawControl.tsx            # Box drawing
│   │   │   └── Legend.tsx                 # Map legend
│   │   │
│   │   ├── Controls/
│   │   │   ├── ControlPanel.tsx           # Layer toggles
│   │   │   └── RegionSelector.tsx         # Pre-set regions
│   │   │
│   │   └── Results/
│   │       ├── StatisticsPanel.tsx        # Coverage stats
│   │       ├── GapAreasList.tsx           # Priority gaps
│   │       └── ExportButton.tsx           # GeoJSON export
│   │
│   ├── lib/
│   │   ├── scoring.ts                     # Gap scoring algorithm
│   │   ├── spatial.ts                     # Turf.js operations
│   │   └── colors.ts                      # Color schemes
│   │
│   ├── types/
│   │   ├── coverage.ts                    # Survey data types
│   │   └── map.ts                         # Map-related types
│   │
│   ├── hooks/
│   │   ├── useMapState.ts                 # Map state management
│   │   └── useCoverageData.ts             # Data loading
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── PLAN.md                                 # This file
└── README.md
```

---

## 🎯 Success Criteria

### Must Have (MVP):
- [x] Interactive map with Europe view
- [ ] Draw box to select Portuguese shelf region
- [ ] Color-coded coverage quality visualization
- [ ] Display resolution and age metadata
- [ ] Identify data gaps visually
- [ ] Export gap areas as GeoJSON

### Nice to Have (if time):
- [ ] Coverage statistics dashboard
- [ ] Multiple pre-configured regions
- [ ] Adjustable quality thresholds
- [ ] Area measurement (km²)
- [ ] Print/screenshot functionality

---

## 🔧 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "@turf/turf": "^7.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/leaflet": "^1.9.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 📝 External Data Sources

### EMODnet Bathymetry WMS (Basemap)
- **URL**: `https://ows.emodnet-bathymetry.eu/wms`
- **Layer**: `emodnet:mean_atlas_land` or `emodnet:mean`
- **Format**: image/png
- **CRS**: EPSG:3857 (Web Mercator)

### Sample Data (MVP)
- Static GeoJSON file with ~20-30 survey polygons
- Portuguese shelf region (bbox: [-9.7, 38.3, -8.8, 39.2])
- Mix of quality levels for realistic visualization

### Future: S3 Bucket Integration
- Full EMODnet bathymetry coverage data
- Served from S3 bucket
- API/service layer for data retrieval

---

## 🚀 Getting Started

```bash
# Create project
npm create vite@latest gapmap-planner -- --template react-ts
cd gapmap-planner

# Install dependencies
npm install leaflet react-leaflet @turf/turf
npm install -D @types/leaflet tailwindcss autoprefixer postcss

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev
```

---

## 🎨 UI Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  GapMap Planner - Seabed Coverage Visualizer        [Help]  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                               │
│  CONTROLS    │              LEAFLET MAP                      │
│              │                                               │
│ Region:      │  [EMODnet Bathymetry Basemap]                │
│ [Portuguese] │                                               │
│ [Draw Box]   │  Color-coded coverage polygons:              │
│              │  - Red = no data                             │
│ Layers:      │  - Orange = poor quality                     │
│ ☑ Coverage   │  - Yellow = moderate                         │
│ ☑ Legend     │  - Green = good/excellent                    │
│ ☐ Grid       │                                               │
│              │  [Draw box to analyze region]                │
│ [Export]     │                                               │
│              │                                               │
├──────────────┴──────────────────────────────────────────────┤
│  STATISTICS                                                  │
│  Coverage: 45% Good | 32% Poor | 23% No Data                │
│  Avg Resolution: 37m | Avg Age: 15 years                    │
│  Gap Area: 287 km² | Priority Gaps: 5 areas                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 📌 Important Notes

1. **S3 Integration (Future)**: The full EMODnet bathymetry coverage dataset will eventually be stored in an S3 bucket. For MVP, we're using static sample data.

2. **Client-side Focus**: All processing happens in browser using Turf.js. No backend needed for MVP.

3. **Expandable**: Architecture designed to easily add:
   - Backend API
   - Database (PostgreSQL + PostGIS)
   - Additional scoring factors (ecological, economic, accessibility)
   - Real-time EMODnet APIs
   - Multiple regions

4. **Demo-ready**: Focus on visual polish and clear UX for demonstrations.

---

## ✅ Next Steps

1. Set up React + TypeScript + Vite project
2. Install Leaflet and dependencies
3. Create basic map component with EMODnet basemap
4. Build from there following the timeline above

**Let's build this! 🚀**
