# Seabed Data Coverage Gap Visualizer - Build Guide v1.0

## 🎯 Project Overview

**Tool Name**: EDITO Seabed Data Coverage Gap Visualizer

**Purpose**: A web-based visualization service that identifies and prioritizes unmapped or poorly-mapped seabed areas for autonomous vessel missions, helping coordinate mapping efforts where they're most needed for marine spatial planning, conservation, and blue economy development.

**Target Users**: Marine data managers, survey coordinators, marine spatial planners, research institutions, conservation organizations, offshore developers

**Build Timeline**: 3 months (MVP in 6-8 weeks)

---

## 📋 Core Functionality

### User Workflow
1. User selects a region of interest on interactive map
2. System displays bathymetry data coverage with color-coded quality/resolution layers
3. System overlays contextual layers: Marine Protected Areas, shipping routes, offshore installations
4. System calculates priority scores for unmapped/poorly-mapped areas
5. User can adjust priority weights (ecological vs. economic importance)
6. System highlights priority areas for survey missions
7. User can export target areas as GeoJSON for mission planning
8. API provides programmatic access for mission planning software

---

## 🗺️ Domain Knowledge: Marine Data Gaps

### Why Data Gaps Matter

**1. Current State of Ocean Mapping**
- Only ~25% of the ocean floor is mapped to modern standards (IHO Order 1)
- European waters have better coverage (~40-60%) but still significant gaps
- Data quality varies dramatically: some areas have 1m resolution, others 500m
- Much existing data is 20-40 years old (pre-multibeam era)

**2. Impact of Data Gaps**

**Marine Conservation**:
- Can't protect what we haven't mapped
- Critical habitat identification requires high-resolution bathymetry
- Marine Protected Area boundaries often based on incomplete data

**Offshore Development**:
- Wind farm site selection requires detailed seabed mapping
- Cable/pipeline routes need accurate bathymetry
- Poor data = higher costs and environmental risks

**Maritime Safety**:
- Navigation charts depend on bathymetric data
- Shipping route optimization needs accurate depth data
- Uncharted hazards pose risks

**Climate Research**:
- Seafloor mapping essential for ocean circulation models
- Carbon sequestration studies need seabed data
- Climate vulnerability assessments require baseline mapping

**3. Survey Prioritization Challenges**

**Current Approach** (ad hoc):
- Surveys driven by specific projects (wind farms, cables)
- Limited coordination between organizations
- Economic areas get mapped; remote areas ignored
- No systematic prioritization

**Better Approach** (data-driven):
- Identify critical data gaps systematically
- Balance ecological and economic priorities
- Coordinate survey efforts efficiently
- Focus on areas with multiple stakeholders

---

## 🎯 Our Tool's Value Proposition

### 1. Data-Driven Prioritization

Instead of random or project-driven surveys:
```
Traditional: "Let's survey where we got funding"
Our approach: "Here are the highest-value unmapped areas based on multiple factors"
```

### 2. Multi-Stakeholder Coordination

**Use Cases**:
- **Research Institutions**: Identify scientifically valuable unmapped areas
- **Conservation NGOs**: Prioritize mapping for MPA designation/management
- **Offshore Developers**: Find areas needing survey for project planning
- **Government Agencies**: Coordinate national mapping strategies
- **Survey Companies**: Identify market opportunities for mapping services

### 3. Efficient Resource Allocation

**Value Creation**:
- Avoid duplicate surveys in same area by different organizations
- Focus autonomous vessel missions on highest-priority gaps
- Enable opportunistic mapping (ships passing through gap areas)
- Support grant applications with evidence-based prioritization

### 4. Integration with EDITO

**Demonstrates**:
- How Digital Ocean data informs operational decisions
- Value of open marine data infrastructure
- Coordination across European waters
- Link between data discovery and action

---

## 📊 Input Data Sources

### 1. EMODnet Bathymetry - Coverage and Quality
**Purpose**: Identify data gaps, resolution, and age

**Access**:
- Coverage/Quality Portal: `https://portal.emodnet-bathymetry.eu/`
- WMS Service: `https://ows.emodnet-bathymetry.eu/wms`
- REST API: `https://rest.emodnet-bathymetry.eu/`
- Free, no authentication required

**Key Datasets**:
- **Source References**: Shows which surveys contributed to each area
- **Coverage Metadata**: Resolution, age, quality metrics
- **Data Products**: Mean bathymetry, standard deviation (uncertainty indicator)

**Layers to Use**:
- `emodnet:source_references` - Survey coverage polygons
- `emodnet:mean` - Bathymetry for context
- CDI (Common Data Index) - Detailed metadata per survey

**Sample Request** (Get survey metadata):
```
GET https://rest.emodnet-bathymetry.eu/source_references?
  bbox=-10,38,-8,40&
  format=json
```

**Data Structure**:
```json
{
  "features": [
    {
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "properties": {
        "survey_id": "PT_2015_001",
        "year": 2015,
        "resolution": 5,  // meters
        "vertical_accuracy": 0.5,  // meters
        "survey_type": "Multibeam",
        "institution": "Portuguese Hydrographic Institute"
      }
    }
  ]
}
```

---

### 2. EMODnet Human Activities - Shipping & Infrastructure
**Purpose**: Identify economically important areas

**Access**:
- Portal: `https://www.emodnet-humanactivities.eu/`
- WMS: `https://ows.emodnet-humanactivities.eu/wms`
- Free access

**Key Layers**:
- **Shipping Density**: Route traffic intensity
- **Cables**: Submarine telecommunications and power cables
- **Pipelines**: Oil, gas, and other pipelines
- **Offshore Platforms**: Wind farms, oil/gas installations
- **Dredging Areas**: Marine aggregate extraction
- **Aquaculture**: Fish farms and shellfish production

**Sample Layers**:
```
- route_density_all_2019: Shipping route density
- wind_farms: Offshore wind farm locations
- cables_tccom: Telecommunications cables
- pipelines_oilgas: Oil and gas pipelines
```

---

### 3. World Database on Protected Areas (WDPA)
**Purpose**: Identify ecologically important areas

**Access**:
- Portal: `https://www.protectedplanet.net/`
- API: `https://api.protectedplanet.net/`
- Download: GeoJSON/Shapefile exports
- Free (registration required)

**Data Fields**:
```json
{
  "name": "Parque Natural da Arrábida",
  "designation": "Marine Protected Area",
  "iucn_category": "V",
  "marine_area_km2": 53.4,
  "status": "Designated",
  "management_plan": true,
  "year_designated": 1998
}
```

**IUCN Categories** (for priority weighting):
- Ia/Ib: Strict nature reserves (highest priority)
- II: National parks
- III: Natural monuments
- IV: Habitat/species management areas
- V: Protected landscapes/seascapes
- VI: Sustainable use areas

---

### 4. EMODnet Seabed Habitats (Optional Enhancement)
**Purpose**: Biodiversity importance

**Access**:
- Portal: `https://www.emodnet-seabedhabitats.eu/`
- WMS: `https://ows.emodnet-seabedhabitats.eu/wms`

**Key Layers**:
- EUSeaMap: Broad-scale habitat mapping
- EUNIS habitat classifications
- Predicted habitat suitability

---

### 5. GEBCO (General Bathymetric Chart of the Oceans) - Alternative/Supplement
**Purpose**: Global coverage baseline, identify large gaps

**Access**:
- Portal: `https://www.gebco.net/`
- WMS: `https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/`
- Free access

**Use**: Compare GEBCO (low resolution) vs EMODnet (high resolution) to identify areas with only satellite-derived data

---

## 🏗️ Technical Architecture

### Tech Stack

**Frontend**:
```
- React 18+ with TypeScript
- Leaflet 1.9+ (map rendering)
- React-Leaflet (React wrapper for Leaflet)
- Turf.js (geospatial calculations)
- shadcn/ui or Material-UI (UI components)
- Recharts or Chart.js (data visualization)
- Axios (API calls)
- Zustand or Redux Toolkit (state management)
```

**Backend** (Node.js API):
```
- Node.js + Express or Fastify
- PostgreSQL + PostGIS (spatial database)
- node-postgres (pg) for database access
- GeoJSON processing libraries
- CORS enabled for frontend access
```

**Deployment**:
```
- Frontend: Vercel or Netlify
- Backend: Railway, Render, or Fly.io
- Database: Supabase (PostgreSQL + PostGIS) or Railway
- Domain: edito-data-gaps.vercel.app
```

---

## 🧮 Priority Scoring Algorithm

### Conceptual Model

**Priority Score** = combination of:
1. **Data Quality Gap** (0-100): How poor is existing data?
2. **Ecological Importance** (0-100): Conservation value?
3. **Economic Importance** (0-100): Development/infrastructure value?
4. **Accessibility** (0-100): How feasible to survey?

**Formula**:
```
Priority Score = (
  w_data × Data_Gap_Score +
  w_eco × Ecological_Score +
  w_econ × Economic_Score +
  w_access × Accessibility_Score
) / (w_data + w_eco + w_econ + w_access)

Default weights: w_data=1.5, w_eco=1.0, w_econ=1.0, w_access=0.5
```

---

### Component Scores Detail

#### 1. Data Quality Gap Score (0-100)

**Factors**:
- **Resolution**: Coarser = higher gap score
- **Age**: Older data = higher gap score
- **Uncertainty**: Higher uncertainty = higher gap score
- **Survey Type**: Satellite-only > interpolated > single-beam > multibeam

**Calculation**:
```javascript
function calculateDataGapScore(surveyData) {
  // Resolution score (0-40 points)
  let resolutionScore = 0;
  if (!surveyData || surveyData.resolution === null) {
    resolutionScore = 40; // No data = maximum gap
  } else if (surveyData.resolution > 100) {
    resolutionScore = 35; // Very coarse
  } else if (surveyData.resolution > 50) {
    resolutionScore = 25;
  } else if (surveyData.resolution > 25) {
    resolutionScore = 15;
  } else if (surveyData.resolution > 10) {
    resolutionScore = 8;
  } else {
    resolutionScore = 0; // High resolution
  }
  
  // Age score (0-30 points)
  const currentYear = 2025;
  const dataAge = surveyData?.year ? currentYear - surveyData.year : 50;
  let ageScore = 0;
  if (dataAge > 30) {
    ageScore = 30; // Very old data
  } else if (dataAge > 20) {
    ageScore = 25;
  } else if (dataAge > 10) {
    ageScore = 15;
  } else if (dataAge > 5) {
    ageScore = 8;
  } else {
    ageScore = 0; // Recent data
  }
  
  // Survey type score (0-30 points)
  const surveyTypeScores = {
    'multibeam': 0,
    'single_beam': 10,
    'lidar': 5,
    'interpolated': 20,
    'satellite_derived': 25,
    'unknown': 30,
    null: 30
  };
  const typeScore = surveyTypeScores[surveyData?.survey_type] || 30;
  
  return Math.min(resolutionScore + ageScore + typeScore, 100);
}
```

#### 2. Ecological Importance Score (0-100)

**Factors**:
- **Protected Area Overlap**: Inside MPA = higher score
- **IUCN Category**: Stricter protection = higher score
- **Habitat Sensitivity**: Critical habitats = higher score
- **Biodiversity Hotspots**: Known richness = higher score

**Calculation**:
```javascript
function calculateEcologicalScore(area, protectedAreas, habitatData) {
  let score = 0;
  
  // Check MPA overlap (0-50 points)
  const overlappingMPAs = findOverlappingMPAs(area, protectedAreas);
  if (overlappingMPAs.length > 0) {
    // Use strictest IUCN category
    const iucnScores = {
      'Ia': 50, 'Ib': 50,  // Strict reserves
      'II': 40,             // National parks
      'III': 35,            // Natural monuments
      'IV': 30,             // Habitat management
      'V': 20,              // Protected landscape
      'VI': 15,             // Sustainable use
      'Not Reported': 10
    };
    
    const maxMPAScore = Math.max(
      ...overlappingMPAs.map(mpa => iucnScores[mpa.iucn_category] || 10)
    );
    score += maxMPAScore;
  }
  
  // Habitat importance (0-30 points)
  if (habitatData) {
    const sensitiveHabitats = [
      'cold_water_coral',
      'maerl_beds',
      'seagrass_meadows',
      'seamounts'
    ];
    
    if (sensitiveHabitats.some(h => habitatData.habitats.includes(h))) {
      score += 30;
    } else if (habitatData.habitats.length > 0) {
      score += 15;
    }
  }
  
  // Biodiversity hotspot bonus (0-20 points)
  if (area.biodiversity_score > 0.8) {
    score += 20;
  } else if (area.biodiversity_score > 0.5) {
    score += 10;
  }
  
  return Math.min(score, 100);
}
```

#### 3. Economic Importance Score (0-100)

**Factors**:
- **Shipping Routes**: High traffic = higher score
- **Existing Infrastructure**: Cables, pipelines, platforms = higher score
- **Planned Development**: Proposed wind farms, etc. = higher score
- **Resource Extraction**: Fishing, mining areas = higher score

**Calculation**:
```javascript
function calculateEconomicScore(area, humanActivities) {
  let score = 0;
  
  // Shipping density (0-40 points)
  const shippingDensity = getShippingDensity(area, humanActivities.shipping);
  if (shippingDensity > 100) { // ships per month
    score += 40;
  } else if (shippingDensity > 50) {
    score += 30;
  } else if (shippingDensity > 20) {
    score += 20;
  } else if (shippingDensity > 5) {
    score += 10;
  }
  
  // Infrastructure presence (0-40 points)
  const infrastructure = countInfrastructure(area, humanActivities);
  if (infrastructure.cables > 0) score += 15;
  if (infrastructure.pipelines > 0) score += 15;
  if (infrastructure.wind_farms > 0) score += 20;
  if (infrastructure.platforms > 0) score += 10;
  score = Math.min(score, 40);
  
  // Planned developments (0-20 points)
  const plannedDevelopments = getPlannedDevelopments(area);
  if (plannedDevelopments.length > 0) {
    score += 20;
  }
  
  return Math.min(score, 100);
}
```

#### 4. Accessibility Score (0-100)

**Factors**:
- **Water Depth**: Extreme depths harder to survey
- **Distance from Port**: Far = more expensive
- **Weather Conditions**: Rough areas harder to survey
- **Existing Traffic**: High traffic = easier opportunistic mapping

**Calculation**:
```javascript
function calculateAccessibilityScore(area, bathymetry, weatherData) {
  let score = 100; // Start at max accessibility
  
  // Depth penalty (0-30 point reduction)
  const avgDepth = getAverageDepth(area, bathymetry);
  if (avgDepth > 4000) {
    score -= 30; // Very deep, specialized equipment needed
  } else if (avgDepth > 2000) {
    score -= 20;
  } else if (avgDepth > 1000) {
    score -= 10;
  } else if (avgDepth < 10) {
    score -= 15; // Too shallow for large vessels
  }
  
  // Distance from port penalty (0-30 point reduction)
  const distanceToPort = calculateNearestPort(area);
  if (distanceToPort > 500) { // km
    score -= 30;
  } else if (distanceToPort > 200) {
    score -= 20;
  } else if (distanceToPort > 100) {
    score -= 10;
  }
  
  // Weather penalty (0-20 point reduction)
  const avgWaveHeight = weatherData?.average_wave_height || 1.5;
  if (avgWaveHeight > 3) {
    score -= 20;
  } else if (avgWaveHeight > 2) {
    score -= 10;
  }
  
  // Shipping traffic bonus (0-20 point addition)
  const shippingDensity = getShippingDensity(area);
  if (shippingDensity > 50) {
    score += 20; // Opportunistic mapping possible
  } else if (shippingDensity > 20) {
    score += 10;
  }
  
  return Math.max(0, Math.min(score, 100));
}
```

---

## 🎨 UI/UX Specification

### Main Dashboard Layout

```
┌────────────────────────────────────────────────────────────────┐
│  🗺️ EDITO Seabed Data Coverage Gap Visualizer                 │
│  [Help] [About] [API Docs]                             [Login] │
├────────────────┬───────────────────────────────────────────────┤
│                │                                                │
│  CONTROL PANEL │           LEAFLET MAP                          │
│                │                                                │
│ 1. REGION      │   Base layers:                                │
│   [Select]     │   - Bathymetry (EMODnet)                      │
│   [Draw]       │   - Data coverage (color-coded by quality)    │
│                │                                                │
│ 2. DATA LAYERS │   Overlay layers (toggleable):                │
│   ☑ Coverage   │   - Marine Protected Areas                    │
│   ☑ MPAs       │   - Shipping routes                           │
│   ☑ Shipping   │   - Wind farms                                │
│   ☐ Cables     │   - Priority score heatmap                    │
│   ☐ Wind Farms │                                                │
│   ☐ Habitats   │   [+] [-] Zoom                                │
│                │   [🔍] Search location                         │
│ 3. PRIORITY    │   [📍] Draw custom area                       │
│    WEIGHTS     │                                                │
│   Data: [●●●○] │                                                │
│   Ecology:[●●○○]│                                                │
│   Economy:[●●○○]│                                                │
│   Access: [●○○○]│                                                │
│                │                                                │
│ 4. FILTERS     │                                                │
│   Min Score:   │                                                │
│   [50] ━━━━●━  │                                                │
│                │                                                │
│   Min Area:    │                                                │
│   [10] km²     │                                                │
│                │                                                │
│ [CALCULATE]    │                                                │
│                │                                                │
├────────────────┴───────────────────────────────────────────────┤
│  📊 PRIORITY AREAS (Top 10)                                    │
│  ┌───┬─────────────────┬──────┬────────┬──────┬────────────┐  │
│  │ # │ Location        │ Area │ Score  │ Gap  │ Actions    │  │
│  ├───┼─────────────────┼──────┼────────┼──────┼────────────┤  │
│  │ 1 │ W. Portugal MPA │ 45km²│ 87/100 │ High │[View][Export]│
│  │ 2 │ Tagus Estuary   │ 23km²│ 82/100 │ Med  │[View][Export]│
│  │ 3 │ Offshore Lisbon │ 67km²│ 78/100 │ High │[View][Export]│
│  └───┴─────────────────┴──────┴────────┴──────┴────────────┘  │
│                                                                 │
│  [Export All Priority Areas] [Generate Report] [API Access]    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Map Visualization Styles

#### Coverage Quality Layer (Color Scheme)

```javascript
const coverageColorScale = {
  'no_data': '#ff0000',        // Red - unmapped
  'very_poor': '#ff6600',      // Orange-red - >100m resolution or >30yr old
  'poor': '#ff9900',           // Orange - 50-100m resolution or 20-30yr old
  'moderate': '#ffcc00',       // Yellow - 25-50m resolution or 10-20yr old
  'good': '#99cc33',           // Yellow-green - 10-25m resolution or 5-10yr
  'excellent': '#33cc33'       // Green - <10m resolution and <5yr old
};
```

#### Priority Score Heatmap

```javascript
const priorityColorScale = {
  low: '#4575b4',      // Blue (0-40)
  medium: '#ffffbf',   // Yellow (40-70)
  high: '#d73027'      // Red (70-100)
};
```

#### Layer Styles

**Marine Protected Areas**:
- Fill: Semi-transparent blue (#0066cc with 0.2 opacity)
- Stroke: Solid blue (#0066cc)
- Stroke width: 2px
- Label: MPA name on hover

**Shipping Routes**:
- Line color: Purple (#9933cc)
- Line width: Proportional to traffic density (1-5px)
- Opacity: 0.6

**Wind Farms**:
- Icon: Wind turbine symbol
- Color: Teal (#00cccc)
- Cluster when zoomed out

**Cables/Pipelines**:
- Line color: Gray (#666666)
- Line style: Dashed
- Width: 2px

---

## 📦 Component Structure

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx          # Main Leaflet map
│   │   ├── CoverageLayer.tsx         # Data quality visualization
│   │   ├── PriorityHeatmap.tsx       # Priority score overlay
│   │   ├── MPALayer.tsx              # Protected areas
│   │   ├── ShippingLayer.tsx         # Shipping density
│   │   ├── InfrastructureLayer.tsx   # Cables, wind farms
│   │   ├── DrawControls.tsx          # Custom area selection
│   │   └── Legend.tsx                # Map legend
│   │
│   ├── ControlPanel/
│   │   ├── RegionSelector.tsx        # Region selection
│   │   ├── LayerToggle.tsx           # Layer visibility controls
│   │   ├── PriorityWeights.tsx       # Weight sliders
│   │   ├── FilterControls.tsx        # Score/area filters
│   │   └── CalculateButton.tsx       # Trigger analysis
│   │
│   ├── Results/
│   │   ├── PriorityTable.tsx         # Top priority areas list
│   │   ├── AreaDetails.tsx           # Detailed area information
│   │   ├── ExportButton.tsx          # GeoJSON export
│   │   └── ReportGenerator.tsx       # PDF report generation
│   │
│   └── Shared/
│       ├── InfoTooltip.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── ColorLegend.tsx
│
├── lib/
│   ├── algorithms/
│   │   ├── priorityScoring.ts        # Main scoring algorithm
│   │   ├── dataGapAnalysis.ts        # Coverage gap calculation
│   │   ├── spatialAnalysis.ts        # Geometric operations
│   │   └── gridGeneration.ts         # Create analysis grid
│   │
│   ├── api/
│   │   ├── emodnetBathymetry.ts      # EMODnet coverage data
│   │   ├── emodnetHumanActivities.ts # Shipping, infrastructure
│   │   ├── protectedAreas.ts         # WDPA API calls
│   │   └── backendAPI.ts             # Our API client
│   │
│   └── types/
│       ├── coverage.ts               # Coverage data types
│       ├── priority.ts               # Priority score types
│       └── layers.ts                 # Map layer types
│
├── hooks/
│   ├── useLeafletMap.ts              # Map state management
│   ├── useCoverageData.ts            # Coverage data fetching
│   ├── usePriorityCalculation.ts    # Priority computation
│   └── useLayerData.ts               # Layer data management
│
├── stores/
│   └── dataGapStore.ts               # Zustand global state
│
├── server/                           # Backend API
│   ├── index.ts                      # Express server
│   ├── routes/
│   │   ├── priority.ts               # Priority calculation endpoint
│   │   ├── coverage.ts               # Coverage data endpoint
│   │   └── export.ts                 # Export endpoints
│   ├── services/
│   │   ├── dataLoader.ts             # Load external data
│   │   ├── priorityEngine.ts         # Server-side scoring
│   │   └── exportService.ts          # Generate exports
│   └── database/
│       ├── schema.sql                # PostGIS schema
│       └── queries.ts                # Database queries
│
└── App.tsx
```

---

## 🔧 Implementation Steps

### Phase 1: Map Foundation (Week 1-2)
**Goal**: Basic map with coverage layer

**Tasks**:
1. Set up React + TypeScript project
2. Install dependencies: leaflet, react-leaflet, @turf/turf
3. Create MapContainer with Leaflet
4. Add EMODnet bathymetry as base layer (WMS)
5. Implement region selection (bounding box or drawn polygon)
6. Add basic zoom/pan controls
7. Display EMODnet coverage metadata

**Deliverable**: Interactive map showing bathymetry coverage

---

### Phase 2: Coverage Quality Visualization (Week 2-3)
**Goal**: Color-coded data quality display

**Tasks**:
1. Fetch EMODnet source references for selected region
2. Parse survey metadata (resolution, age, type)
3. Classify coverage quality (excellent → no data)
4. Create CoverageLayer component with color coding
5. Implement legend showing quality categories
6. Add hover tooltips with survey details
7. Create quality statistics summary

**Deliverable**: Map shows color-coded coverage quality

---

### Phase 3: Contextual Layers (Week 3-5)
**Goal**: Add MPA, shipping, and infrastructure overlays

**Tasks**:
1. Integrate WDPA data (MPAs)
   - Fetch MPA boundaries
   - Style as semi-transparent overlays
   - Add MPA info on click
2. Add EMODnet Human Activities layers
   - Shipping density layer
   - Wind farm locations
   - Cable/pipeline routes
3. Create layer toggle UI
4. Implement layer filtering (by type, status)
5. Add layer legend

**Deliverable**: Multi-layer visualization with context data

---

### Phase 4: Priority Scoring Algorithm (Week 5-7)
**Goal**: Calculate priority scores for gaps

**Tasks**:
1. Implement grid generation (divide region into analysis cells)
2. Create data gap scoring function
3. Create ecological importance scoring
4. Create economic importance scoring
5. Create accessibility scoring
6. Implement weighted combination algorithm
7. Add weight adjustment UI (sliders)
8. Test algorithm with sample data

**Deliverable**: Functional priority scoring system

---

### Phase 5: Backend API (Week 6-8)
**Goal**: Server-side processing and data storage

**Tasks**:
1. Set up Express/Fastify server
2. Configure PostgreSQL + PostGIS database
3. Create database schema for cached data
4. Implement `/api/coverage` endpoint
5. Implement `/api/priority/calculate` endpoint
6. Implement `/api/priority/areas` endpoint (top N)
7. Add CORS and authentication (optional)
8. Deploy backend

**Deliverable**: REST API for data and calculations

**API Endpoints**:
```
GET  /api/coverage?bbox=minLon,minLat,maxLon,maxLat
POST /api/priority/calculate
     Body: { bbox, weights, filters }
     Returns: { priorityAreas[], heatmapData }
GET  /api/priority/areas?limit=10&minScore=50
GET  /api/export/geojson/:areaId
GET  /api/export/report/:areaId
```

---

### Phase 6: Priority Visualization (Week 7-9)
**Goal**: Display priority scores and results

**Tasks**:
1. Create priority heatmap layer
2. Implement priority area highlighting
3. Create top priority areas table
4. Add area detail panel
5. Implement filtering (min score, min area)
6. Add sorting options
7. Create priority statistics dashboard

**Deliverable**: Visual priority area identification

---

### Phase 7: Export & Integration (Week 9-10)
**Goal**: Export capabilities and API access

**Tasks**:
1. Implement GeoJSON export for selected areas
2. Add metadata to exports (scores, attributes)
3. Create CSV export for tabular data
4. Generate PDF reports with maps
5. Document API for external integration
6. Add API key generation (optional)
7. Create example API usage code

**Deliverable**: Export functionality and API documentation

---

### Phase 8: Polish & Demo (Week 10-12)
**Goal**: Production-ready demo

**Tasks**:
1. Add 3 pre-configured regions (Portuguese coast, North Sea, Mediterranean)
2. Implement responsive design
3. Add loading states and error handling
4. Performance optimization (caching, lazy loading)
5. Add help documentation/tooltips
6. Create demo video
7. Deploy to production
8. Write comprehensive README

**Deliverable**: Deployed demo at edito-data-gaps.vercel.app

---

## 💾 Database Schema (PostGIS)

```sql
-- Coverage data cache
CREATE TABLE coverage_data (
  id SERIAL PRIMARY KEY,
  survey_id VARCHAR(100) UNIQUE,
  geometry GEOMETRY(POLYGON, 4326),
  year INTEGER,
  resolution FLOAT,
  vertical_accuracy FLOAT,
  survey_type VARCHAR(50),
  institution VARCHAR(200),
  data_quality_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coverage_geom ON coverage_data USING GIST(geometry);
CREATE INDEX idx_coverage_quality ON coverage_data(data_quality_score);

-- Protected areas cache
CREATE TABLE protected_areas (
  id SERIAL PRIMARY KEY,
  wdpa_id INTEGER UNIQUE,
  name VARCHAR(500),
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  iucn_category VARCHAR(10),
  designation VARCHAR(200),
  marine_area_km2 FLOAT,
  status VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mpa_geom ON protected_areas USING GIST(geometry);
CREATE INDEX idx_mpa_category ON protected_areas(iucn_category);

-- Priority areas results
CREATE TABLE priority_areas (
  id SERIAL PRIMARY KEY,
  region_name VARCHAR(200),
  geometry GEOMETRY(POLYGON, 4326),
  area_km2 FLOAT,
  priority_score INTEGER,
  data_gap_score INTEGER,
  ecological_score INTEGER,
  economic_score INTEGER,
  accessibility_score INTEGER,
  metadata JSONB,
  calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_priority_geom ON priority_areas USING GIST(geometry);
CREATE INDEX idx_priority_score ON priority_areas(priority_score DESC);

-- Human activities cache
CREATE TABLE shipping_density (
  id SERIAL PRIMARY KEY,
  geometry GEOMETRY(POLYGON, 4326),
  vessel_count INTEGER,
  density_category VARCHAR(20),
  year INTEGER
);

CREATE INDEX idx_shipping_geom ON shipping_density USING GIST(geometry);

CREATE TABLE infrastructure (
  id SERIAL PRIMARY KEY,
  geometry GEOMETRY(LINESTRING, 4326), -- or POINT for platforms
  infra_type VARCHAR(50), -- 'cable', 'pipeline', 'wind_farm', 'platform'
  name VARCHAR(200),
  status VARCHAR(50), -- 'operational', 'planned', 'decommissioned'
  operator VARCHAR(200)
);

CREATE INDEX idx_infra_geom ON infrastructure USING GIST(geometry);
CREATE INDEX idx_infra_type ON infrastructure(infra_type);
```

---

## 📊 Sample Data Structures

### Coverage Data Response
```json
{
  "region": {
    "bbox": [-9.5, 38.6, -9.0, 39.0],
    "area_km2": 1234.5
  },
  "coverage_summary": {
    "total_surveys": 45,
    "no_data_percent": 23.5,
    "poor_quality_percent": 31.2,
    "good_quality_percent": 45.3
  },
  "surveys": [
    {
      "survey_id": "PT_2015_001",
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "year": 2015,
      "resolution": 5,
      "survey_type": "multibeam",
      "quality_category": "excellent",
      "data_gap_score": 15
    }
  ]
}
```

### Priority Areas Response
```json
{
  "calculation_params": {
    "weights": {
      "data_gap": 1.5,
      "ecological": 1.0,
      "economic": 1.0,
      "accessibility": 0.5
    },
    "filters": {
      "min_score": 50,
      "min_area_km2": 10
    }
  },
  "priority_areas": [
    {
      "id": "PA_001",
      "name": "Western Portugal MPA Gap",
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "area_km2": 45.3,
      "scores": {
        "total": 87,
        "data_gap": 92,
        "ecological": 85,
        "economic": 45,
        "accessibility": 78
      },
      "context": {
        "mpa_overlap": true,
        "mpa_names": ["Parque Natural da Arrábida"],
        "shipping_density": 12,
        "infrastructure_count": 0,
        "avg_depth": 65
      },
      "recommendation": "High priority for autonomous survey mission"
    }
  ],
  "statistics": {
    "total_gap_area_km2": 287.5,
    "high_priority_area_km2": 123.4,
    "areas_analyzed": 156
  }
}
```

---

## 🎯 Algorithm Implementation Examples

### Grid Generation
```javascript
/**
 * Divide region into analysis cells
 */
function generateAnalysisGrid(bbox, cellSize = 5000) { // 5km cells
  const [minLon, minLat, maxLon, maxLat] = bbox;
  
  const grid = [];
  
  // Calculate number of cells
  const width = turf.distance(
    turf.point([minLon, minLat]),
    turf.point([maxLon, minLat])
  );
  const height = turf.distance(
    turf.point([minLon, minLat]),
    turf.point([minLon, maxLat])
  );
  
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  
  const lonStep = (maxLon - minLon) / cols;
  const latStep = (maxLat - minLat) / rows;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellMinLon = minLon + j * lonStep;
      const cellMinLat = minLat + i * latStep;
      const cellMaxLon = cellMinLon + lonStep;
      const cellMaxLat = cellMinLat + latStep;
      
      const cell = turf.polygon([[
        [cellMinLon, cellMinLat],
        [cellMaxLon, cellMinLat],
        [cellMaxLon, cellMaxLat],
        [cellMinLon, cellMaxLat],
        [cellMinLon, cellMinLat]
      ]]);
      
      grid.push({
        id: `cell_${i}_${j}`,
        geometry: cell,
        bbox: [cellMinLon, cellMinLat, cellMaxLon, cellMaxLat]
      });
    }
  }
  
  return grid;
}
```

### Priority Area Aggregation
```javascript
/**
 * Aggregate high-priority cells into contiguous areas
 */
function aggregatePriorityAreas(scoredCells, minScore = 70) {
  // Filter high-priority cells
  const highPriorityCells = scoredCells.filter(
    cell => cell.priorityScore >= minScore
  );
  
  // Find contiguous groups using spatial clustering
  const clusters = [];
  const visited = new Set();
  
  highPriorityCells.forEach(cell => {
    if (visited.has(cell.id)) return;
    
    const cluster = [cell];
    visited.add(cell.id);
    
    // Find all adjacent high-priority cells
    const queue = [cell];
    while (queue.length > 0) {
      const current = queue.shift();
      
      const neighbors = highPriorityCells.filter(other => {
        if (visited.has(other.id)) return false;
        return areAdjacent(current.geometry, other.geometry);
      });
      
      neighbors.forEach(neighbor => {
        cluster.push(neighbor);
        queue.push(neighbor);
        visited.add(neighbor.id);
      });
    }
    
    clusters.push(cluster);
  });
  
  // Convert clusters to merged polygons
  return clusters.map((cluster, index) => {
    const geometries = cluster.map(cell => cell.geometry);
    const merged = turf.union(...geometries);
    
    const avgScore = cluster.reduce(
      (sum, cell) => sum + cell.priorityScore, 0
    ) / cluster.length;
    
    return {
      id: `priority_area_${index}`,
      geometry: merged,
      area_km2: turf.area(merged) / 1e6,
      priority_score: Math.round(avgScore),
      cell_count: cluster.length
    };
  });
}

function areAdjacent(geom1, geom2) {
  // Check if geometries share an edge
  const buffered = turf.buffer(geom1, 0.01, { units: 'kilometers' });
  return turf.booleanIntersects(buffered, geom2);
}
```

---

## 🎤 Pitch Deck Talking Points

### Problem Statement
"Only 25% of the ocean floor is mapped to modern standards. Survey efforts are uncoordinated, with critical areas for conservation and development remaining unmapped while resources are wasted on duplicate surveys."

### Solution
"Our tool uses EDITO data infrastructure to systematically identify and prioritize unmapped seabed areas, balancing ecological and economic importance with survey feasibility. It's a coordination platform for the marine mapping community."

### Demo
[Live demo with Portuguese coast]
"Looking at Portugal's continental shelf: our algorithm identified 45km² of unmapped Marine Protected Area with a priority score of 87/100. This area is critical for conservation, has moderate shipping traffic, and is accessible for autonomous survey missions. Export this as a mission file for your AUV in one click."

### Impact
- **Coordination**: Prevent duplicate surveys, share mission planning
- **Conservation**: Prioritize MPA mapping for evidence-based management
- **Blue Economy**: Identify survey needs for offshore development
- **Cost Efficiency**: Focus limited resources on highest-value areas
- **EDITO Value**: Demonstrates how Digital Ocean enables better decision-making

### Unique Value
"Unlike ad-hoc survey planning, we provide systematic, evidence-based prioritization. Unlike pure gap identification, we consider multiple stakeholder perspectives. Unlike static reports, we offer an interactive, always-updated coordination tool."

### Next Steps
"Phase 2: Real-time integration with autonomous vessel mission planners, machine learning to predict optimal survey timing, and expansion to global coverage with UN Ocean Decade Seabed 2030 initiative."

---

## 🚀 Quick Start Commands

```bash
# Create React TypeScript project
npx create-react-app edito-data-gaps --template typescript
cd edito-data-gaps

# Install frontend dependencies
npm install leaflet react-leaflet @turf/turf zustand axios
npm install @types/leaflet --save-dev

# Install UI library
npx shadcn-ui@latest init

# Install backend dependencies (in server/)
cd server
npm install express cors pg dotenv
npm install @types/express @types/cors --save-dev

# Start development
npm run dev # frontend
npm run server # backend

# Deploy
vercel # frontend
railway up # backend (or use Render/Fly.io)
```

---

## 📝 Example Regions for Demo

### Region 1: Portuguese Continental Shelf
```json
{
  "name": "Portuguese Shelf (Lisbon-Setúbal)",
  "bbox": [-9.7, 38.3, -8.8, 39.2],
  "description": "Mix of well-surveyed coastal waters and data gaps offshore",
  "context": {
    "mpas": ["Parque Natural da Arrábida", "Reserva Natural do Estuário do Tejo"],
    "infrastructure": ["Tagus shipping lane", "Offshore wind potential areas"],
    "depth_range": "10-200m"
  }
}
```

### Region 2: North Sea - German Bight
```json
{
  "name": "German Bight - North Sea",
  "bbox": [6.0, 53.5, 8.5, 55.5],
  "description": "Heavily utilized area with extensive wind farms and shipping",
  "context": {
    "mpas": ["Sylt Outer Reef", "Borkum Reef Ground"],
    "infrastructure": ["Multiple operational wind farms", "Dense shipping routes"],
    "depth_range": "20-50m"
  }
}
```

### Region 3: Mediterranean - Gulf of Lion
```json
{
  "name": "Gulf of Lion - French Mediterranean",
  "bbox": [3.0, 42.5, 5.5, 43.5],
  "description": "Continental shelf with submarine canyons, mixed coverage",
  "context": {
    "mpas": ["Parc Naturel Marin du Golfe du Lion"],
    "infrastructure": ["Barcelona-Marseille shipping route"],
    "depth_range": "50-2000m"
  }
}
```

---

## 🔐 API Authentication (Optional for MVP)

```javascript
// Simple API key authentication
const apiKeys = new Map(); // In production, use database

app.use('/api', (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  if (!apiKeys.has(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  req.user = apiKeys.get(apiKey);
  next();
});

// Public endpoints (no auth)
app.get('/api/public/regions', publicRegionsHandler);
app.get('/api/public/coverage', publicCoverageHandler);

// Protected endpoints (require API key)
app.post('/api/priority/calculate', authenticateAPIKey, calculatePriorityHandler);
app.get('/api/export/*', authenticateAPIKey, exportHandler);
```

---

## ⚠️ Known Limitations & Future Enhancements

**Current Limitations**:
1. Static data snapshots (not real-time updates)
2. European waters focus (limited global coverage)
3. Simplified accessibility model (no weather forecasting)
4. Manual priority weight adjustment (no ML optimization)
5. Limited to bathymetry gaps (doesn't include other survey types)

**Future Enhancements**:
- **Real-time integration**: Auto-update as new surveys published
- **Machine learning**: Learn optimal weights from survey outcomes
- **Collaborative features**: Multi-user mission planning and coordination
- **Mobile app**: Field access for survey vessel crews
- **Predictive analytics**: Forecast when gaps will be filled based on trends
- **Integration with UN Seabed 2030**: Align with global mapping goals
- **Survey cost estimation**: Estimate mission costs for budget planning
- **Habitat mapping priority**: Include benthic habitat survey gaps
- **Climate adaptation**: Priority areas for climate vulnerability assessment

---

## 📚 References & Documentation

**EMODnet Portals**:
- Bathymetry: https://portal.emodnet-bathymetry.eu/
- Human Activities: https://www.emodnet-humanactivities.eu/
- Seabed Habitats: https://www.emodnet-seabedhabitats.eu/

**Protected Areas**:
- WDPA: https://www.protectedplanet.net/
- API Docs: https://api.protectedplanet.net/documentation

**Mapping Standards**:
- IHO S-44 Standards: https://iho.int/en/standards-and-specifications
- UN Seabed 2030: https://seabed2030.org/

**Leaflet Documentation**:
- Leaflet: https://leafletjs.com/
- React-Leaflet: https://react-leaflet.js.org/

**Geospatial Libraries**:
- Turf.js: https://turfjs.org/
- PostGIS: https://postgis.net/documentation/

---

## ✅ Success Criteria

**MVP Success**:
- [ ] Interactive map with EMODnet coverage data
- [ ] Color-coded coverage quality visualization
- [ ] MPA and shipping route overlays
- [ ] Functional priority scoring algorithm
- [ ] Top 10 priority areas identification
- [ ] GeoJSON export capability
- [ ] Deployed and accessible online
- [ ] Basic API documentation

**Hackathon Success**:
- [ ] 5-minute functional demo
- [ ] Clear value for multiple stakeholders
- [ ] Demonstrates EDITO data integration
- [ ] Intuitive UI/UX
- [ ] Generates actionable priority lists
- [ ] Shows coordination benefits
- [ ] Team can explain algorithm rationale

---

## 🎯 Prompting Guide for AI Tools

When using Claude Code or V0, include these instructions:

1. **"Use this build guide as specification"** - reference this document
2. **"Focus on Phase 1-4 for MVP"** - backend can be simplified initially
3. **"Use Leaflet (not Mapbox)"** - important for this project
4. **"Sample data acceptable for demo"** - don't get blocked on API complexity
5. **"Prioritize visual clarity"** - color schemes and legends are critical
6. **"Make scoring algorithm transparent"** - users need to understand priorities
7. **"Include 3 pre-loaded regions"** - essential for demo
8. **"Add clear export functionality"** - key value proposition

**Sample Prompt**:
```
Build a React + TypeScript + Leaflet web application following the 
EDITO Seabed Data Coverage Gap Visualizer build guide. Focus on:
1. Interactive map with EMODnet WMS layers
2. Coverage quality color-coding (red=no data, green=excellent)
3. Priority scoring algorithm with adjustable weights
4. Top 10 priority areas table
5. GeoJSON export

Use sample data for initial development. Prioritize visual clarity
and intuitive UX. Include the Portuguese Shelf as pre-loaded region.
```

---

## 🌟 Key Differentiators

**What makes this tool unique:**

1. **Multi-stakeholder approach**: Balances conservation, economy, and feasibility
2. **Systematic prioritization**: Evidence-based, not opportunistic
3. **Coordination enabler**: Prevents duplication, enables collaboration
4. **Actionable outputs**: Direct export to mission planning systems
5. **Dynamic weighting**: Adapt priorities to organizational goals
6. **EDITO integration**: Showcases Digital Ocean infrastructure value
7. **Open science**: Promotes data sharing and coordination

---

**This tool addresses a real gap in ocean data coordination infrastructure. By systematically identifying priority areas for mapping, it helps the marine community work smarter, not just harder, toward comprehensive ocean knowledge.** 🗺️🌊

Good luck building your hackathon project!
