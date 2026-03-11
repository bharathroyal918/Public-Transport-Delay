import React, { useState } from 'react';
import { db } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

import ScenarioAnalysis from '../components/scenario/ScenarioAnalysis';
import { predictDelay } from '../components/ml/MLModelService';
import { Skeleton } from "@/components/ui/skeleton";

export default function ScenarioPlanner() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [baseDelay, setBaseDelay] = useState(5);
  const [scenarioResults, setScenarioResults] = useState(null);
  
  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => db.entities.Route.list(),
  });

  const handleRouteChange = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    setSelectedRoute(route);
    
    // Calculate base delay for this route
    const result = predictDelay({
      route_id: routeId,
      day_of_week: 'Monday',
      hour: 12,
      weather_condition: 'clear',
      temperature_c: 20,
      precipitation_mm: 0,
      wind_speed_kmh: 10,
      visibility_km: 10,
      has_event: false,
      event_type: 'none',
      event_crowd_size: 0,
      traffic_congestion_level: 5
    });
    
    setBaseDelay(result.predicted_delay_minutes);
  };

  const handleAnalysisComplete = (data) => {
    setScenarioResults(data);
  };

  // Pre-computed scenarios
  const commonScenarios = [
    {
      title: "Heavy Rain Day",
      description: "Precipitation increases to 40mm",
      impact: "+8.5 min avg delay",
      severity: "high",
      recommendation: "Add 15-minute buffer to schedules"
    },
    {
      title: "Major Sports Event",
      description: "Stadium event with 50,000 attendees",
      impact: "+6.2 min avg delay",
      severity: "moderate",
      recommendation: "Increase service frequency by 30%"
    },
    {
      title: "Peak Hour Congestion",
      description: "Traffic level rises to 9/10",
      impact: "+5.8 min avg delay",
      severity: "moderate",
      recommendation: "Deploy additional vehicles"
    },
    {
      title: "Winter Storm",
      description: "Snow + high winds + low visibility",
      impact: "+15.3 min avg delay",
      severity: "critical",
      recommendation: "Consider service suspension or alerts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Scenario Planner</h1>
          <p className="text-slate-500 mt-1">What-if analysis for transit planning</p>
        </div>

        {/* Route Selection */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Select Route for Analysis</label>
                {isLoading ? (
                  <Skeleton className="h-11 w-full" />
                ) : (
                  <Select onValueChange={handleRouteChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a route to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map(route => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.route_name} ({route.route_type}) - {route.distance_km}km
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedRoute && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500">Base Delay</p>
                    <p className="text-xl font-bold text-slate-800">{baseDelay.toFixed(1)} min</p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-xs text-slate-500">Distance</p>
                    <p className="text-xl font-bold text-slate-800">{selectedRoute.distance_km} km</p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-xs text-slate-500">Est. Time</p>
                    <p className="text-xl font-bold text-slate-800">{selectedRoute.estimated_duration_mins} min</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Analysis Tool */}
          <ScenarioAnalysis baseDelay={baseDelay} onAnalyze={handleAnalysisComplete} />

          {/* Common Scenarios */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pre-computed Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {commonScenarios.map((scenario, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{scenario.title}</h4>
                    <Badge className={
                      scenario.severity === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                      scenario.severity === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }>
                      {scenario.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{scenario.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={
                        scenario.severity === 'critical' ? 'h-4 w-4 text-red-500' :
                        scenario.severity === 'high' ? 'h-4 w-4 text-orange-500' :
                        'h-4 w-4 text-yellow-500'
                      } />
                      <span className="text-sm font-medium text-slate-700">{scenario.impact}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-xs text-blue-700">{scenario.recommendation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Planning Recommendations */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-indigo-500" />
              Dynamic Schedule Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <h4 className="font-semibold text-slate-700 mb-2">Buffer Time Strategy</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Based on current conditions, we recommend adding buffer times to schedules.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Clear Weather:</span>
                    <span className="font-semibold text-green-600">+2 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Light Rain:</span>
                    <span className="font-semibold text-yellow-600">+5 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Heavy Rain:</span>
                    <span className="font-semibold text-orange-600">+10 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Severe Weather:</span>
                    <span className="font-semibold text-red-600">+15 min</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <h4 className="font-semibold text-slate-700 mb-2">Event Day Protocol</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Recommended actions for days with large public events.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    Increase service frequency 2hr before
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    Deploy extra vehicles on affected routes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    Send passenger alerts 4hr ahead
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    Maintain post-event service for 2hr
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <h4 className="font-semibold text-slate-700 mb-2">Passenger Communication</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Proactive delay notifications help passenger satisfaction.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Real-time delay updates via app
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Alternative route suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Estimated arrival time adjustments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Weather-based travel advisories
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