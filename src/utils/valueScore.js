import { CATEGORY_BENCHMARKS } from '../data/benchmarks';

export const DEFAULT_WEIGHTS = {
  priceCompetitiveness: 30,
  customerRating: 25,
  featureToPrice: 20,
  qualityReliability: 15,
  warrantySupport: 10
};

export const WEIGHT_LABELS = {
  priceCompetitiveness: 'Price Competitiveness',
  customerRating: 'Customer Rating & Reviews',
  featureToPrice: 'Feature-to-Price Ratio',
  qualityReliability: 'Quality & Low Return Rate',
  warrantySupport: 'Warranty & Support'
};

/**
 * Validates if custom weights sum to exactly 100%
 */
export function validateWeights(weights = DEFAULT_WEIGHTS) {
  const total = Object.values(weights).reduce((sum, w) => sum + Number(w || 0), 0);
  const isValid = Math.abs(total - 100) < 0.01;
  return {
    isValid,
    total,
    difference: 100 - total
  };
}

/**
 * Calculates normalized 0-100 component scores for a product.
 */
export function calculateComponentScores(product) {
  if (!product) return null;

  const benchmark = CATEGORY_BENCHMARKS[product.category] || {
    avgPrice: product.sellingPrice || 5000,
    avgRating: 4.2,
    avgReturnRate: 6.0,
    typicalWarrantyMonths: 12
  };

  // 1. Price Competitiveness (0 - 100)
  // Cheaper than category benchmark => higher score; more expensive => lower score
  const priceDiffPct = ((benchmark.avgPrice - product.sellingPrice) / benchmark.avgPrice) * 100;
  // Base 60 score for matching average, +- 0.5 per percentage deviation, clamped 15..98
  const rawPriceScore = 60 + (priceDiffPct * 0.5);
  const priceScore = Math.max(15, Math.min(98, Math.round(rawPriceScore)));

  // 2. Customer Rating Component (0 - 100)
  // Combines star rating with review count credibility log factor
  const baseRatingScore = ((product.rating || 4.0) / 5.0) * 80;
  const reviewCount = product.reviewCount || 10;
  // logarithmic confidence bonus up to 20 points
  const reviewBonus = Math.min(20, Math.log10(reviewCount + 1) * 5.5);
  const ratingScore = Math.max(20, Math.min(100, Math.round(baseRatingScore + reviewBonus)));

  // 3. Feature-to-Price Assessment (0 - 100)
  // Feature score (0-100) normalized by price relative to benchmark
  const baseFeature = product.featureScore || 75;
  const priceRatio = product.sellingPrice / (benchmark.avgPrice || product.sellingPrice);
  // If priceRatio < 1, feature delivery per rupee is superior
  const featurePriceRaw = (baseFeature / Math.max(0.4, priceRatio));
  const featureScore = Math.max(20, Math.min(99, Math.round(featurePriceRaw * 0.88)));

  // 4. Quality & Reliability Indicators (0 - 100)
  // Low return rate and high build quality score
  const productQuality = product.qualityScore || 80;
  const returnRate = product.returnRate !== undefined ? product.returnRate : benchmark.avgReturnRate;
  const returnPenalty = returnRate * 4; // 5% return rate => 20 pts penalty
  const qualityScore = Math.max(20, Math.min(98, Math.round((productQuality * 0.7) + (100 - returnPenalty) * 0.3)));

  // 5. Warranty & After-Sales Support (0 - 100)
  const warrantyMonths = product.warrantyMonths || 12;
  const warrantyScore = Math.max(25, Math.min(100, Math.round((warrantyMonths / 24) * 100)));

  // Data Completeness & Confidence Score (0 - 100%)
  const hasSpecs = product.specs && Object.keys(product.specs).length >= 4;
  const hasReviews = (product.reviewCount || 0) > 20;
  const confidenceScore = Math.round(
    (hasSpecs ? 40 : 20) + 
    (hasReviews ? 40 : 20) + 
    (product.warrantyMonths ? 20 : 10)
  );

  return {
    priceCompetitiveness: priceScore,
    customerRating: ratingScore,
    featureToPrice: featureScore,
    qualityReliability: qualityScore,
    warrantySupport: warrantyScore,
    confidenceScore
  };
}

/**
 * Calculates overall ValueScore (0 - 100) using weights.
 */
export function calculateValueScore(product, customWeights = DEFAULT_WEIGHTS) {
  const validation = validateWeights(customWeights);
  const components = calculateComponentScores(product);

  if (!components) {
    return {
      overallScore: 0,
      band: getScoreBand(0),
      components: {},
      isValid: false,
      validation
    };
  }

  if (!validation.isValid) {
    return {
      overallScore: null,
      band: { label: 'Invalid Weights', color: 'slate', textClass: 'text-slate-500', bgClass: 'bg-slate-100' },
      components,
      isValid: false,
      validation
    };
  }

  // Weighted calculation
  const weightedSum =
    (components.priceCompetitiveness * customWeights.priceCompetitiveness) +
    (components.customerRating * customWeights.customerRating) +
    (components.featureToPrice * customWeights.featureToPrice) +
    (components.qualityReliability * customWeights.qualityReliability) +
    (components.warrantySupport * customWeights.warrantySupport);

  const overallScore = Math.max(1, Math.min(100, Math.round(weightedSum / 100)));
  const band = getScoreBand(overallScore);
  const explanation = generateScoreExplanation(product, components, overallScore);

  return {
    overallScore,
    band,
    components,
    confidenceScore: components.confidenceScore,
    explanation,
    isValid: true,
    validation
  };
}

/**
 * Maps numeric score to standard ValueScore bands
 */
export function getScoreBand(score) {
  if (score >= 85) {
    return {
      label: 'Excellent Value',
      code: 'EXCELLENT',
      color: 'emerald',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeClass: 'bg-emerald-600 text-white',
      ringColor: '#059669',
      summary: 'Delivers exceptional features and quality well above its price tier.'
    };
  }
  if (score >= 70) {
    return {
      label: 'Good Value',
      code: 'GOOD',
      color: 'blue',
      bgClass: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeClass: 'bg-blue-600 text-white',
      ringColor: '#2563eb',
      summary: 'Solid balance of performance, customer satisfaction, and pricing.'
    };
  }
  if (score >= 50) {
    return {
      label: 'Average Value',
      code: 'AVERAGE',
      color: 'amber',
      bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeClass: 'bg-amber-500 text-white',
      ringColor: '#d97706',
      summary: 'Fair choice, but competitor alternatives may offer better specs per rupee.'
    };
  }
  return {
    label: 'Compare Before Buying',
    code: 'LOWER',
    color: 'rose',
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeClass: 'bg-rose-600 text-white',
    ringColor: '#e11d48',
    summary: 'Priced at a premium relative to component specs or customer return rate.'
  };
}

/**
 * Generates transparent deterministic rationale for the product's score
 */
function generateScoreExplanation(product, components, overallScore) {
  const strengths = [];
  const weaknesses = [];

  if (components.priceCompetitiveness >= 75) {
    strengths.push('Priced competitively below the category average benchmark.');
  } else if (components.priceCompetitiveness < 55) {
    weaknesses.push('Priced higher than typical category alternatives.');
  }

  if (components.customerRating >= 80) {
    strengths.push(`High customer satisfaction rating (${product.rating}★) backed by genuine volume.`);
  } else if (components.customerRating < 60) {
    weaknesses.push('Customer rating or review volume is moderate.');
  }

  if (components.featureToPrice >= 80) {
    strengths.push('Offers standout hardware and feature capabilities for the asking price.');
  } else if (components.featureToPrice < 60) {
    weaknesses.push('Feature set is baseline relative to its retail price point.');
  }

  if (components.qualityReliability >= 80) {
    strengths.push(`Reliable build quality with low sample return rate (${product.returnRate || 4}%).`);
  } else if (components.qualityReliability < 60) {
    weaknesses.push(`Higher sample return rate (${product.returnRate || 8}%) impacts reliability score.`);
  }

  if (components.warrantySupport >= 80) {
    strengths.push(`Generous ${product.warrantyMonths || 12}-month warranty coverage.`);
  } else if (components.warrantySupport <= 40) {
    weaknesses.push(`Limited warranty window (${product.warrantyMonths || 6} months).`);
  }

  return {
    strengths: strengths.length ? strengths : ['Balanced performance across standard metrics.'],
    weaknesses: weaknesses.length ? weaknesses : ['No significant drawbacks detected in sample profile.'],
    headline: overallScore >= 75 
      ? 'A high-value recommendation backed by strong customer sentiment and pricing metrics.'
      : 'Viable purchase, but comparing competing products in the same category is recommended.'
  };
}
