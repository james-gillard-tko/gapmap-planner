import type { QualityScore, SurveyProperties, QualityCategory } from '../types/coverage';

const CURRENT_YEAR = 2025;

/**
 * Calculate data gap score for a survey
 * Higher score = bigger gap (worse data quality)
 *
 * @param survey - Survey properties (null if no data)
 * @returns Quality score (0-100) and category
 */
export function calculateDataGapScore(survey: SurveyProperties | null): QualityScore {
  // No data = maximum gap
  if (!survey) {
    return { score: 100, category: 'no_data' };
  }

  // Resolution score (0-50 points)
  let resolutionScore = 0;
  if (survey.resolution > 100) {
    resolutionScore = 50;
  } else if (survey.resolution > 50) {
    resolutionScore = 35;
  } else if (survey.resolution > 25) {
    resolutionScore = 25;
  } else if (survey.resolution > 10) {
    resolutionScore = 15;
  } else {
    resolutionScore = 5;
  }

  // Age score (0-50 points)
  const dataAge = CURRENT_YEAR - survey.year;
  let ageScore = 0;
  if (dataAge > 30) {
    ageScore = 50;
  } else if (dataAge > 20) {
    ageScore = 35;
  } else if (dataAge > 10) {
    ageScore = 25;
  } else if (dataAge > 5) {
    ageScore = 15;
  } else {
    ageScore = 5;
  }

  const totalScore = Math.min(resolutionScore + ageScore, 100);

  // Determine category based on score
  const category = determineCategory(totalScore);

  return { score: totalScore, category };
}

/**
 * Determine quality category from score
 */
function determineCategory(score: number): QualityCategory {
  if (score >= 80) return 'very_poor';
  if (score >= 60) return 'poor';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'good';
  return 'excellent';
}

/**
 * Check if a survey represents a data gap (priority for new surveys)
 */
export function isDataGap(score: QualityScore): boolean {
  return score.category === 'no_data' ||
         score.category === 'very_poor' ||
         score.category === 'poor';
}

/**
 * Get human-readable quality description
 */
export function getQualityDescription(survey: SurveyProperties | null): string {
  if (!survey) {
    return 'No survey data available';
  }

  const age = CURRENT_YEAR - survey.year;
  return `${survey.resolution}m resolution, ${age} years old (${survey.survey_type})`;
}
