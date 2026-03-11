import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle, AlertCircle, XCircle, Zap, Brain, MapPin, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const getStatusConfig = (category) => {
  const configs = {
    on_time: { label: 'On Time', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
    minor: { label: 'Minor Delay', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertCircle },
    moderate: { label: 'Moderate Delay', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
    severe: { label: 'Severe Delay', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle }
  };
  return configs[category] || configs.on_time;
};

export default function PredictionResult({ prediction, route }) {
  if (!prediction) return null;
  
  const statusConfig = getStatusConfig(prediction.predicted_category);
  const StatusIcon = statusConfig.icon;
  
  return (
    <Card className={cn("border-2 shadow-lg", statusConfig.border, statusConfig.bg)}>
      <CardHeader className="border-b border-slate-100/50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span className="text-lg font-semibold text-slate-800">Prediction Result</span>
          </div>
          <Badge className={cn("text-sm py-1 px-3", statusConfig.bg, statusConfig.color, "border", statusConfig.border)}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Prediction */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg border-4 border-slate-100">
            <div className="text-center">
              <Clock className={cn("h-8 w-8 mx-auto mb-1", statusConfig.color)} />
              <span className={cn("text-4xl font-bold", statusConfig.color)}>
                {prediction.predicted_delay_minutes.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500 block">minutes</span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Prediction Confidence
            </span>
            <span className="text-sm font-bold text-slate-900">{prediction.confidence_score.toFixed(1)}%</span>
          </div>
          <Progress value={prediction.confidence_score} className="h-2" />
        </div>

        {/* Route Info */}
        {prediction.map_route && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 rounded-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Route className="h-4 w-4" />
                Distance
              </div>
              <p className="font-semibold text-slate-800">{prediction.map_route.distance_km} km</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="h-4 w-4" />
                Base Travel Time
              </div>
              <p className="font-semibold text-slate-800">{prediction.map_route.base_travel_time} min</p>
            </div>
            <div className="col-span-2 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4" />
                From
              </div>
              <p className="font-medium text-slate-800 text-sm">{prediction.map_route.origin}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4" />
                To
              </div>
              <p className="font-medium text-slate-800 text-sm">{prediction.map_route.destination}</p>
            </div>
          </div>
        )}
        
        {route && !prediction.map_route && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 rounded-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Route className="h-4 w-4" />
                Distance
              </div>
              <p className="font-semibold text-slate-800">{route.distance_km} km</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="h-4 w-4" />
                Normal Duration
              </div>
              <p className="font-semibold text-slate-800">{route.estimated_duration_mins} min</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4" />
                From
              </div>
              <p className="font-semibold text-slate-800 truncate">{route.origin}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4" />
                To
              </div>
              <p className="font-semibold text-slate-800 truncate">{route.destination}</p>
            </div>
          </div>
        )}

        {/* ML Delay Breakdown */}
        {prediction.map_route && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 text-sm">Time Breakdown</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Base Travel (Maps)</p>
                <p className="text-lg font-bold text-blue-600">{prediction.map_route.base_travel_time} min</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Predicted Delay (ML)</p>
                <p className="text-lg font-bold text-orange-600">{prediction.predicted_delay_minutes.toFixed(1)} min</p>
              </div>
            </div>
          </div>
        )}

        {/* Total Time */}
        {prediction.total_delay_minutes ? (
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <div className="flex justify-between items-center">
              <span className="text-indigo-700 font-semibold">Total Expected Time</span>
              <span className="text-3xl font-bold text-indigo-900">
                {prediction.total_delay_minutes.toFixed(0)} min
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-2">Maps Time + ML Delay = Total Journey Time</p>
          </div>
        ) : route && (
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-indigo-700 font-medium">Expected Total Travel Time</span>
              <span className="text-2xl font-bold text-indigo-800">
                {(route.estimated_duration_mins + prediction.predicted_delay_minutes).toFixed(0)} min
              </span>
            </div>
          </div>
        )}

        {/* Model Info */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-200/50">
          <span>Model: {prediction.model_used}</span>
          <span>{new Date(prediction.created_date).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}