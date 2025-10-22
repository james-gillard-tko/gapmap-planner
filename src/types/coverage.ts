// Survey data types
export interface SurveyProperties {
  survey_id: string;
  year: number;
  resolution: number; // meters
  survey_type: 'multibeam' | 'single_beam' | 'lidar' | 'interpolated' | 'satellite_derived' | 'unknown';
  institution?: string;
  vertical_accuracy?: number;
}

export interface SurveyFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: SurveyProperties;
}

export interface CoverageData {
  type: 'FeatureCollection';
  region: string;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  features: SurveyFeature[];
}

// Quality scoring types
export type QualityCategory = 'no_data' | 'very_poor' | 'poor' | 'moderate' | 'good' | 'excellent';

export interface QualityScore {
  score: number; // 0-100 (higher = bigger gap)
  category: QualityCategory;
}

export interface ScoredSurvey extends SurveyFeature {
  properties: SurveyProperties & QualityScore;
}

// Coverage statistics
export interface CoverageStatistics {
  total_area_km2: number;
  no_data_percent: number;
  very_poor_percent: number;
  poor_percent: number;
  moderate_percent: number;
  good_percent: number;
  excellent_percent: number;
  avg_resolution: number;
  avg_age: number;
  gap_area_km2: number; // Areas with poor/very poor/no data
  priority_gap_count: number;
}
