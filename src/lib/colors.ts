import type { QualityCategory } from '../types/coverage';

// Quality color scheme (following EMODnet visual standards)
export const QUALITY_COLORS: Record<QualityCategory, string> = {
  no_data: '#ff0000',        // Red - unmapped
  very_poor: '#ff6600',      // Orange-red - >100m resolution or >30yr old
  poor: '#ff9900',           // Orange - 50-100m resolution or 20-30yr old
  moderate: '#ffcc00',       // Yellow - 25-50m resolution or 10-20yr old
  good: '#99cc33',           // Yellow-green - 10-25m resolution or 5-10yr old
  excellent: '#33cc33'       // Green - <10m resolution and <5yr old
};

// Quality category labels
export const QUALITY_LABELS: Record<QualityCategory, string> = {
  no_data: 'No Data',
  very_poor: 'Very Poor',
  poor: 'Poor',
  moderate: 'Moderate',
  good: 'Good',
  excellent: 'Excellent'
};

// Quality category descriptions
export const QUALITY_DESCRIPTIONS: Record<QualityCategory, string> = {
  no_data: 'No survey coverage',
  very_poor: '>100m resolution or >30 years old',
  poor: '50-100m resolution or 20-30 years old',
  moderate: '25-50m resolution or 10-20 years old',
  good: '10-25m resolution or 5-10 years old',
  excellent: '<10m resolution and <5 years old'
};

// Opacity for coverage polygons
export const POLYGON_OPACITY = 0.6;
export const POLYGON_WEIGHT = 1.5;
