import { GeoJSON, Popup } from 'react-leaflet';
import type { PathOptions } from 'leaflet';
import { QUALITY_COLORS, POLYGON_OPACITY, POLYGON_WEIGHT } from '../../lib/colors';
import { calculateDataGapScore, getQualityDescription } from '../../lib/scoring';
import type { CoverageData, SurveyFeature, QualityScore } from '../../types/coverage';

interface CoverageLayerProps {
  data: CoverageData | null;
}

export function CoverageLayer({ data }: CoverageLayerProps) {
  if (!data) return null;

  const style = (feature: any): PathOptions => {
    const survey = feature?.properties;
    const qualityScore: QualityScore = calculateDataGapScore(survey);

    return {
      fillColor: QUALITY_COLORS[qualityScore.category],
      fillOpacity: POLYGON_OPACITY,
      color: QUALITY_COLORS[qualityScore.category],
      weight: POLYGON_WEIGHT,
      opacity: 0.8,
    };
  };

  const onEachFeature = (feature: SurveyFeature, layer: any) => {
    const survey = feature.properties;
    const qualityScore = calculateDataGapScore(survey);
    const description = getQualityDescription(survey);

    const popupContent = `
      <div class="text-sm">
        <div class="font-semibold text-base mb-2">${survey.survey_id}</div>
        <div class="space-y-1">
          <div><span class="font-medium">Quality:</span> ${qualityScore.category.replace('_', ' ').toUpperCase()}</div>
          <div><span class="font-medium">Score:</span> ${qualityScore.score}/100</div>
          <div><span class="font-medium">Resolution:</span> ${survey.resolution}m</div>
          <div><span class="font-medium">Year:</span> ${survey.year}</div>
          <div><span class="font-medium">Type:</span> ${survey.survey_type}</div>
          ${survey.institution ? `<div><span class="font-medium">Institution:</span> ${survey.institution}</div>` : ''}
        </div>
        <div class="mt-2 pt-2 border-t text-xs text-gray-600">
          ${description}
        </div>
      </div>
    `;

    layer.bindPopup(popupContent);

    // Add hover effect
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: POLYGON_WEIGHT,
          opacity: 0.8,
          fillOpacity: POLYGON_OPACITY
        });
      }
    });
  };

  return (
    <GeoJSON
      data={data as any}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}
