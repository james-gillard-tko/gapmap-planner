# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-27

### Added
- Interactive polygon drawing feature with click-based vertex placement
- Tile filtering using center-point-in-polygon analysis with Turf.js
- Visual feedback: green marker indicates polygon closing point after 3 vertices
- Reset button to clear polygon and exit drawing mode
- Map loads clean with no tiles until polygon is drawn
- Pixel-based distance calculation for accurate polygon closing detection (20px threshold)

### Changed
- Updated README with project overview and EDITO hackathon context
- Map now starts without coverage tiles displayed

### Technical
- Added PolygonDraw component using Leaflet event handlers
- Integrated @turf/turf for geospatial calculations
- Implemented useMemo hook for efficient tile filtering

## [1.0.0] - 2025-01-26

### Added
- Initial MVP release
- React 19 + TypeScript + Vite application structure
- Leaflet interactive map with Portuguese shelf coverage
- Dummy survey data (offshore Lisbon)
- Coverage visualization with color-coded quality metrics
- Modern UI with shadcn/ui components and TailwindCSS
- Custom app icon and branded header
- Docker configuration for EDITO deployment
- Nginx configuration for production serving
- Multi-stage Docker build (Node.js → Nginx)

### Features
- Display survey coverage tiles with:
  - Resolution metrics (1-5m scale)
  - Vertical accuracy
  - Survey year
  - Institution attribution
- Interactive legend for data quality interpretation
- Responsive header with app branding
- Footer status bar with survey count and region info

### Infrastructure
- GitHub repository setup
- Docker Hub image publishing
- EDITO service-playground Helm chart configuration
- AMD64 architecture build support for EDITO platform

## [Unreleased]

### Planned
- Integration with GEBCO API
- Integration with EMODnet API
- Real-time bathymetry data fetching
- Zarr format data access
- Export functionality (CSV, GeoJSON)
- User authentication for EDITO
- Advanced filtering options
- Performance optimization for large datasets
- Mobile responsiveness improvements

---

## Version History

- **1.1.0** - Polygon drawing and tile filtering
- **1.0.0** - Initial MVP with dummy data
