import React, { useState } from 'react';
import { db } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import GoogleMapsRouteInput from '../components/prediction/GoogleMapsRouteInput';
import { predictDelay, compareModels } from '../components/ml/MLModelService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Trash2, Brain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Predictions() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapRouteData, setMapRouteData] = useState(null);
  
  const [formData, setFormData] = useState({
    route_id: '',
    day_of_week: 'Monday',
    hour: 8,
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

  const { data: routes = [], isLoading: loadingRoutes } = useQuery({
    queryKey: ['routes'],
    queryFn: () => db.entities.Route.list(),
  });

  const { data: predictionHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => db.entities.Prediction.list('-created_date', 10),
  });

  const savePredictionMutation = useMutation({
    mutationFn: (data) => db.entities.Prediction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction saved successfully');
    }
  });

  const deletePredictionMutation = useMutation({
    mutationFn: (id) => db.entities.Prediction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction deleted');
    }
  });

  const handleRouteCalculated = (routeData) => {
    setMapRouteData(routeData);
    toast.success('Route data received. Now make a prediction!');
  };

  const handlePredict = async () => {
    if (!mapRouteData) {
      toast.error('Please calculate route on the map first');
      return;
    }
    
    setIsLoading(true);
    
    // Find selected route
    const route = routes.find(r => r.id === formData.route_id);
    setSelectedRoute(route);
    
    // Run ML prediction for delay
    const result = predictDelay({
      ...formData,
      is_peak_hour: (formData.hour >= 7 && formData.hour <= 9) || (formData.hour >= 17 && formData.hour <= 19)
    }, 'gradientBoosting');
    
    // Calculate total delay: ML predicted delay + Google Maps travel time
    const mlDelay = result.predicted_delay_minutes;
    const mapsTime = mapRouteData.duration_minutes;
    const totalDelay = mlDelay + mapsTime;
    
    // Create prediction record with combined data
    const predictionData = {
      route_id: formData.route_id,
      route_name: route?.route_name || 'Custom Route',
      predicted_delay_minutes: mlDelay,
      predicted_category: result.predicted_category,
      confidence_score: result.confidence_score,
      model_used: result.model_used,
      input_parameters: formData,
      prediction_date: new Date().toISOString().split('T')[0],
      // Additional map data
      map_route: {
        origin: mapRouteData.origin,
        destination: mapRouteData.destination,
        distance_km: parseFloat(mapRouteData.distance_km),
        base_travel_time: mapsTime,
        total_time: totalDelay
      }
    };
    
    // Save to database
    await savePredictionMutation.mutateAsync(predictionData);
    
    setPrediction({ 
      ...predictionData, 
      created_date: new Date().toISOString(),
      total_delay_minutes: totalDelay 
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Delay Prediction</h1>
          <p className="text-slate-500 mt-1">ML-powered transit delay forecasting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Route Input & Form */}
          <div className="space-y-6">
            {/* Google Maps Route Input */}
            <GoogleMapsRouteInput onRouteCalculated={handleRouteCalculated} />
            
            {/* Prediction Form */}
            {loadingRoutes ? (
              <Skeleton className="h-[600px] rounded-xl" />
            ) : (
              <PredictionForm 
                formData={formData}
                setFormData={setFormData}
                routes={routes}
                onPredict={handlePredict}
                isLoading={isLoading}
                hasRouteData={!!mapRouteData}
              />
            )}
          </div>

          {/* Right Column - Results & History */}
          <div className="space-y-6">
            {/* Prediction Result */}
            {prediction && (
              <PredictionResult prediction={prediction} route={selectedRoute} />
            )}

            {/* Prediction History */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-500" />
                  Recent Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {loadingHistory ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                ) : predictionHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No predictions yet. Make your first prediction!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {predictionHistory.map((pred) => (
                      <div key={pred.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{pred.route_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500">{pred.predicted_delay_minutes} min delay</span>
                            <Badge variant="outline" className="text-xs">
                              {pred.predicted_category?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {new Date(pred.created_date).toLocaleDateString()}
                          </span>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => deletePredictionMutation.mutate(pred.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}