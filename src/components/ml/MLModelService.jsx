// ML Model Service - Simulates trained Random Forest and Gradient Boosting models
// In production, this would connect to a Python backend with sklearn models

// Feature weights derived from "trained" model
const FEATURE_WEIGHTS = {
  randomForest: {
    precipitation_mm: 0.22,
    traffic_congestion_level: 0.18,
    weather_condition: 0.15,
    event_crowd_size: 0.12,
    hour: 0.10,
    wind_speed_kmh: 0.08,
    temperature_c: 0.06,
    day_of_week: 0.05,
    visibility_km: 0.04
  },
  gradientBoosting: {
    traffic_congestion_level: 0.24,
    precipitation_mm: 0.20,
    event_crowd_size: 0.14,
    weather_condition: 0.12,
    hour: 0.11,
    wind_speed_kmh: 0.07,
    temperature_c: 0.05,
    visibility_km: 0.04,
    day_of_week: 0.03
  }
};

// Weather condition impact multipliers
const WEATHER_IMPACT = {
  clear: 0,
  cloudy: 0.5,
  rainy: 2.5,
  stormy: 5,
  foggy: 3,
  snowy: 4.5
};

// Day of week impact (0 = Sunday baseline)
const DAY_IMPACT = {
  Monday: 1.2,
  Tuesday: 1.0,
  Wednesday: 1.0,
  Thursday: 1.1,
  Friday: 1.4,
  Saturday: 0.7,
  Sunday: 0.5
};

// Hour impact (peak hours have higher delays)
const getHourImpact = (hour) => {
  if (hour >= 7 && hour <= 9) return 1.5;  // Morning rush
  if (hour >= 17 && hour <= 19) return 1.6; // Evening rush
  if (hour >= 12 && hour <= 14) return 1.1; // Lunch
  if (hour >= 22 || hour <= 5) return 0.3;  // Night
  return 1.0;
};

export const predictDelay = (features, modelType = 'gradientBoosting') => {
  const weights = FEATURE_WEIGHTS[modelType];
  
  // Base delay calculation
  let baseDelay = 2;
  
  // Precipitation impact
  const precipImpact = Math.pow(features.precipitation_mm / 10, 1.3) * weights.precipitation_mm * 10;
  
  // Traffic congestion impact
  const trafficImpact = features.traffic_congestion_level * weights.traffic_congestion_level * 3;
  
  // Weather condition impact
  const weatherImpact = (WEATHER_IMPACT[features.weather_condition] || 0) * weights.weather_condition * 2;
  
  // Event impact
  const eventImpact = features.has_event 
    ? Math.log10(features.event_crowd_size + 1) * weights.event_crowd_size * 1.5
    : 0;
  
  // Hour impact
  const hourImpact = getHourImpact(features.hour) * weights.hour * 3;
  
  // Day impact
  const dayImpact = (DAY_IMPACT[features.day_of_week] || 1) * weights.day_of_week * 2;
  
  // Wind impact
  const windImpact = (features.wind_speed_kmh / 30) * weights.wind_speed_kmh * 2;
  
  // Temperature extreme impact
  const tempImpact = Math.abs(features.temperature_c - 20) * 0.05 * weights.temperature_c * 2;
  
  // Visibility impact
  const visImpact = features.visibility_km < 5 ? (5 - features.visibility_km) * weights.visibility_km * 1.5 : 0;
  
  // Total delay calculation
  const totalDelay = baseDelay + precipImpact + trafficImpact + weatherImpact + 
                     eventImpact + hourImpact + dayImpact + windImpact + tempImpact + visImpact;
  
  // Add small random noise for realism
  const noise = (Math.random() - 0.5) * 0.5;
  const finalDelay = Math.max(0, totalDelay + noise);
  
  // Determine category
  let category = 'on_time';
  if (finalDelay > 15) category = 'severe';
  else if (finalDelay > 8) category = 'moderate';
  else if (finalDelay > 3) category = 'minor';
  
  // Calculate confidence based on feature completeness
  const confidence = calculateConfidence(features, modelType);
  
  return {
    predicted_delay_minutes: Math.round(finalDelay * 10) / 10,
    predicted_category: category,
    confidence_score: confidence,
    model_used: modelType === 'randomForest' ? 'Random Forest' : 'Gradient Boosting'
  };
};

const calculateConfidence = (features, modelType) => {
  // Base confidence
  let confidence = 85;
  
  // Penalize missing or extreme values
  if (features.precipitation_mm > 50) confidence -= 5;
  if (features.wind_speed_kmh > 60) confidence -= 5;
  if (features.event_crowd_size > 50000) confidence -= 3;
  if (features.traffic_congestion_level >= 9) confidence -= 3;
  
  // Boost for complete data
  if (features.visibility_km && features.temperature_c) confidence += 3;
  
  // Model-specific adjustments
  if (modelType === 'gradientBoosting') confidence += 2;
  
  return Math.min(98, Math.max(60, confidence + (Math.random() * 5)));
};

export const compareModels = (features) => {
  const rfResult = predictDelay(features, 'randomForest');
  const gbResult = predictDelay(features, 'gradientBoosting');
  
  return {
    randomForest: rfResult,
    gradientBoosting: gbResult,
    recommended: gbResult.confidence_score > rfResult.confidence_score ? 'gradientBoosting' : 'randomForest'
  };
};

export const getFeatureImportance = (modelType = 'gradientBoosting') => {
  const weights = FEATURE_WEIGHTS[modelType];
  return Object.entries(weights).map(([feature, importance]) => ({
    feature: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    importance: importance * 100
  }));
};

export const getModelMetrics = () => ({
  randomForest: {
    accuracy: 87.3,
    precision: 85.2,
    recall: 88.1,
    f1Score: 86.6,
    mae: 2.4,
    rmse: 3.1,
    r2Score: 0.82
  },
  gradientBoosting: {
    accuracy: 89.7,
    precision: 88.4,
    recall: 90.2,
    f1Score: 89.3,
    mae: 2.1,
    rmse: 2.8,
    r2Score: 0.86
  }
});

export default { predictDelay, compareModels, getFeatureImportance, getModelMetrics };