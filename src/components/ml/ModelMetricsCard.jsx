import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Crosshair, Activity, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModelMetricsCard({ modelName, metrics, isRecommended = false }) {
  const metricItems = [
    { label: 'Accuracy', value: metrics.accuracy, icon: Target, color: 'text-blue-600' },
    { label: 'Precision', value: metrics.precision, icon: Crosshair, color: 'text-green-600' },
    { label: 'Recall', value: metrics.recall, icon: Activity, color: 'text-purple-600' },
    { label: 'F1 Score', value: metrics.f1Score, icon: Award, color: 'text-amber-600' },
  ];

  return (
    <Card className={cn(
      "border-0 shadow-lg relative overflow-hidden",
      isRecommended && "ring-2 ring-green-500 ring-offset-2"
    )}>
      {isRecommended && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Recommended
          </Badge>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-500" />
          {modelName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main metrics */}
        <div className="grid grid-cols-2 gap-4">
          {metricItems.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", color)} />
                <span className="text-sm text-slate-600">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={value} className="h-2 flex-1" />
                <span className="text-sm font-bold text-slate-800">{value}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Regression metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">MAE</p>
            <p className="text-lg font-bold text-slate-800">{metrics.mae}</p>
            <p className="text-xs text-slate-400">minutes</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">RMSE</p>
            <p className="text-lg font-bold text-slate-800">{metrics.rmse}</p>
            <p className="text-xs text-slate-400">minutes</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">R² Score</p>
            <p className="text-lg font-bold text-slate-800">{metrics.r2Score}</p>
            <p className="text-xs text-slate-400">goodness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}