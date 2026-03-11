import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, GitCompare, BarChart3, Award, Target, TrendingUp } from "lucide-react";

import ModelComparisonChart from '../components/dashboard/ModelComparisonChart';
import FeatureImportanceChart from '../components/dashboard/FeatureImportanceChart';
import ModelMetricsCard from '../components/ml/ModelMetricsCard';
import { getFeatureImportance, getModelMetrics } from '../components/ml/MLModelService';

export default function ModelAnalytics() {
  const metrics = getModelMetrics();
  const rfFeatures = getFeatureImportance('randomForest');
  const gbFeatures = getFeatureImportance('gradientBoosting');
  
  // Radar chart data for model comparison
  const radarData = [
    { metric: 'Accuracy', randomForest: metrics.randomForest.accuracy, gradientBoosting: metrics.gradientBoosting.accuracy },
    { metric: 'Precision', randomForest: metrics.randomForest.precision, gradientBoosting: metrics.gradientBoosting.precision },
    { metric: 'Recall', randomForest: metrics.randomForest.recall, gradientBoosting: metrics.gradientBoosting.recall },
    { metric: 'F1 Score', randomForest: metrics.randomForest.f1Score, gradientBoosting: metrics.gradientBoosting.f1Score },
    { metric: 'R² Score', randomForest: metrics.randomForest.r2Score * 100, gradientBoosting: metrics.gradientBoosting.r2Score * 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Model Analytics</h1>
          <p className="text-slate-500 mt-1">Compare ML models and understand prediction factors</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Best Model</p>
                  <p className="text-2xl font-bold mt-1">Gradient Boosting</p>
                  <Badge className="mt-2 bg-white/20 text-white border-0">89.7% Accuracy</Badge>
                </div>
                <Award className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Average MAE</p>
                  <p className="text-2xl font-bold mt-1">2.25 minutes</p>
                  <Badge className="mt-2 bg-white/20 text-white border-0">Highly Accurate</Badge>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Training Samples</p>
                  <p className="text-2xl font-bold mt-1">50,000+</p>
                  <Badge className="mt-2 bg-white/20 text-white border-0">Well Trained</Badge>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModelMetricsCard 
            modelName="Random Forest" 
            metrics={metrics.randomForest} 
            isRecommended={false}
          />
          <ModelMetricsCard 
            modelName="Gradient Boosting" 
            metrics={metrics.gradientBoosting} 
            isRecommended={true}
          />
        </div>

        {/* Radar Comparison */}
        <ModelComparisonChart data={radarData} title="Model Performance Comparison" />

        {/* Feature Importance */}
        <Tabs defaultValue="gradient" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Feature Importance Analysis
            </h2>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="gradient">Gradient Boosting</TabsTrigger>
              <TabsTrigger value="forest">Random Forest</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="gradient">
            <FeatureImportanceChart data={gbFeatures} title="Gradient Boosting - Top Delay Predictors" />
          </TabsContent>
          
          <TabsContent value="forest">
            <FeatureImportanceChart data={rfFeatures} title="Random Forest - Top Delay Predictors" />
          </TabsContent>
        </Tabs>

        {/* Key Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-500" />
              Key Model Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Why Gradient Boosting Wins</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Better at capturing non-linear relationships between weather and delays
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Sequential learning corrects errors from previous iterations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    More robust to outliers in traffic congestion data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Lower MAE (2.1 vs 2.4 minutes) for precise predictions
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Top Delay Factors</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">1.</span>
                    <strong>Traffic Congestion</strong> - Most significant predictor (24% importance)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">2.</span>
                    <strong>Precipitation</strong> - Heavy rain increases delays exponentially
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">3.</span>
                    <strong>Event Crowd Size</strong> - Large events cause significant disruption
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">4.</span>
                    <strong>Time of Day</strong> - Rush hours see 50-60% higher delays
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}