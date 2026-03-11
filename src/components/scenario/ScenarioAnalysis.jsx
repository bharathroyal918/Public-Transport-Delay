import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FlaskConical, CloudRain, Thermometer, Wind, Users, TrendingUp } from "lucide-react";

export default function ScenarioAnalysis({ baseDelay = 5, onAnalyze }) {
  const [scenarioType, setScenarioType] = useState('precipitation');
  const [range, setRange] = useState([0, 50]);
  const [analysisData, setAnalysisData] = useState(null);

  const scenarios = {
    precipitation: { label: 'Precipitation', unit: 'mm', max: 100, icon: CloudRain, color: '#3b82f6' },
    temperature: { label: 'Temperature', unit: '°C', max: 45, min: -10, icon: Thermometer, color: '#ef4444' },
    wind_speed: { label: 'Wind Speed', unit: 'km/h', max: 100, icon: Wind, color: '#22c55e' },
    crowd_size: { label: 'Event Crowd', unit: 'people', max: 100000, step: 5000, icon: Users, color: '#f59e0b' }
  };

  const runScenario = () => {
    const config = scenarios[scenarioType];
    const points = 20;
    const step = (range[1] - range[0]) / points;
    
    // Simulated impact calculation
    const data = Array.from({ length: points + 1 }, (_, i) => {
      const value = range[0] + (step * i);
      let impact = 0;
      
      switch(scenarioType) {
        case 'precipitation':
          impact = Math.pow(value / 10, 1.5) * 0.8;
          break;
        case 'temperature':
          impact = Math.abs(value - 20) * 0.15;
          break;
        case 'wind_speed':
          impact = Math.pow(value / 20, 1.3) * 0.5;
          break;
        case 'crowd_size':
          impact = Math.log10(value + 1) * 1.5;
          break;
        default:
          impact = 0;
      }
      
      return {
        value: Math.round(value),
        delay: Math.max(0, baseDelay + impact + (Math.random() * 0.5 - 0.25))
      };
    });

    setAnalysisData(data);
    if (onAnalyze) onAnalyze(data);
  };

  const config = scenarios[scenarioType];
  const Icon = config.icon;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-purple-500" />
          What-If Scenario Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Scenario Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(scenarios).map(([key, { label, icon: SIcon, color }]) => (
            <Button
              key={key}
              variant={scenarioType === key ? "default" : "outline"}
              className={scenarioType === key ? "bg-slate-900" : ""}
              onClick={() => setScenarioType(key)}
            >
              <SIcon className="h-4 w-4 mr-2" style={{ color: scenarioType === key ? 'white' : color }} />
              {label}
            </Button>
          ))}
        </div>

        {/* Range Slider */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700 font-medium flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color: config.color }} />
              {config.label} Range
            </Label>
            <span className="text-sm font-semibold text-slate-600">
              {range[0]} - {range[1]} {config.unit}
            </span>
          </div>
          <Slider
            value={range}
            onValueChange={setRange}
            min={config.min || 0}
            max={config.max}
            step={config.step || 1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{config.min || 0} {config.unit}</span>
            <span>{config.max} {config.unit}</span>
          </div>
        </div>

        <Button 
          onClick={runScenario}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Run Scenario Analysis
        </Button>

        {/* Results Chart */}
        {analysisData && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">
              Predicted Delay vs {config.label}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="value" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: config.unit, position: 'bottom', fill: '#64748b' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Delay (min)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(value) => [`${value.toFixed(1)} min`, 'Predicted Delay']}
                    labelFormatter={(value) => `${config.label}: ${value} ${config.unit}`}
                  />
                  <ReferenceLine y={baseDelay} stroke="#94a3b8" strokeDasharray="5 5" label="Base" />
                  <Line 
                    type="monotone" 
                    dataKey="delay" 
                    stroke={config.color} 
                    strokeWidth={3}
                    dot={{ fill: config.color, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-slate-500">Min Delay</p>
                <p className="text-lg font-bold text-green-600">
                  {Math.min(...analysisData.map(d => d.delay)).toFixed(1)} min
                </p>
              </div>
              <div className="text-center border-x border-slate-200">
                <p className="text-xs text-slate-500">Max Delay</p>
                <p className="text-lg font-bold text-red-600">
                  {Math.max(...analysisData.map(d => d.delay)).toFixed(1)} min
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Avg Impact</p>
                <p className="text-lg font-bold text-blue-600">
                  +{(analysisData[analysisData.length - 1].delay - analysisData[0].delay).toFixed(1)} min
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}