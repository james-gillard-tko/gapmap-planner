# GapMap Planner

Interactive web application for visualizing and analyzing seabed survey coverage gaps. Draw regions of interest and instantly identify areas with existing bathymetry data coverage.

Built for the **EDITO Model Lab Hackathon 2025**.

## Overview

GapMap Planner helps marine scientists and survey planners identify gaps in seabed mapping coverage by:
- Visualizing existing survey data on an interactive map
- Drawing custom polygon areas of interest
- Filtering survey tiles based on center-point-in-polygon analysis
- Displaying data quality metrics (resolution, vertical accuracy, survey year)

**Current Status:** Prototype using dummy data off the coast of Lisbon, Portugal.

## Technology Stack

- **React 19** + **TypeScript** - Modern UI framework
- **Leaflet** - Interactive mapping
- **Turf.js** - Geospatial analysis (point-in-polygon filtering)
- **Vite** - Build tool
- **TailwindCSS** + **shadcn/ui** - Styling
- **Docker** - Containerization for EDITO deployment

## Future Development

### Short Term
- Integration with real bathymetry data sources:
  - **GEBCO** (General Bathymetric Chart of the Oceans)
  - **EMODnet** (European Marine Observation and Data Network)
- Expand geographic coverage beyond Portuguese shelf

### Long Term
- Host application within EDITO infrastructure
- On-the-fly access to bathymetry data in Zarr format
- Real-time data fetching when users draw polygon areas of interest
- Export functionality for survey planning reports
- Multi-resolution data visualization

## Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/james-gillard-tko/gapmap-planner.git
cd gapmap-planner

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

## Docker Deployment

The application includes Docker configuration for deployment to the EDITO service catalog:

```bash
# Build Docker image (IMPORTANT: use --platform flag for EDITO compatibility)
docker build --platform linux/amd64 -t gapmap-planner:latest .

# Run locally
docker run -p 8080:80 gapmap-planner:latest
```

Access at http://localhost:8080

## Usage

1. Click **Draw Polygon** to enter drawing mode
2. Click on the map to add vertices (minimum 3 points)
3. Click near the first point (green marker) to close the polygon
4. Survey tiles with center points inside the polygon are displayed
5. Click **Reset** to clear and start over

## License

MIT
