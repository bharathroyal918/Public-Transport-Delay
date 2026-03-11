import React, { useState } from 'react';
import { db } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Play, Trash2, RefreshCw, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data generators
const ROUTE_TEMPLATES = [
  { name: 'Downtown Express', type: 'bus', origin: 'Central Station', destination: 'Downtown Mall', distance: 8.5, duration: 25, stops: 12, passengers: 15000 },
  { name: 'Airport Shuttle', type: 'bus', origin: 'Airport Terminal', destination: 'City Center', distance: 22.3, duration: 45, stops: 8, passengers: 8000 },
  { name: 'Metro Line 1', type: 'metro', origin: 'North Terminal', destination: 'South Terminal', distance: 18.7, duration: 32, stops: 15, passengers: 45000 },
  { name: 'Metro Line 2', type: 'metro', origin: 'East Hub', destination: 'West Hub', distance: 15.2, duration: 28, stops: 12, passengers: 38000 },
  { name: 'Commuter Rail', type: 'train', origin: 'Suburb Station', destination: 'Main Central', distance: 35.5, duration: 55, stops: 10, passengers: 22000 },
  { name: 'Express Train', type: 'train', origin: 'Industrial Zone', destination: 'Business District', distance: 28.0, duration: 40, stops: 5, passengers: 18000 },
  { name: 'Local Bus 101', type: 'bus', origin: 'Residential Area A', destination: 'Shopping Center', distance: 6.2, duration: 20, stops: 18, passengers: 5000 },
  { name: 'Local Bus 202', type: 'bus', origin: 'University Campus', destination: 'Tech Park', distance: 9.8, duration: 28, stops: 14, passengers: 7500 },
  { name: 'Night Metro', type: 'metro', origin: 'Entertainment District', destination: 'Residential Hub', distance: 12.5, duration: 22, stops: 8, passengers: 12000 },
  { name: 'Cross-City Express', type: 'train', origin: 'North Station', destination: 'South Station', distance: 42.0, duration: 65, stops: 7, passengers: 25000 }
];

const WEATHER_CONDITIONS = ['clear', 'clear', 'clear', 'cloudy', 'cloudy', 'rainy', 'rainy', 'foggy', 'stormy', 'snowy'];
const EVENT_TYPES = ['none', 'none', 'none', 'none', 'sports', 'concert', 'festival', 'conference', 'parade'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateRandomDelay = (weather, hour, hasEvent, crowdSize, trafficLevel) => {
  let baseDelay = 2;
  
  // Weather impact
  const weatherImpact = { clear: 0, cloudy: 0.5, rainy: 3, foggy: 4, stormy: 8, snowy: 6 };
  baseDelay += weatherImpact[weather] || 0;
  
  // Peak hour impact
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    baseDelay += 3;
  }
  
  // Event impact
  if (hasEvent && crowdSize > 0) {
    baseDelay += Math.log10(crowdSize) * 0.8;
  }
  
  // Traffic impact
  baseDelay += trafficLevel * 0.5;
  
  // Add randomness
  baseDelay += (Math.random() - 0.3) * 4;
  
  return Math.max(0, Math.round(baseDelay * 10) / 10);
};

const getDelayCategory = (delay) => {
  if (delay <= 2) return 'on_time';
  if (delay <= 5) return 'minor';
  if (delay <= 10) return 'moderate';
  return 'severe';
};

export default function DataGenerator() {
  const queryClient = useQueryClient();
  const [recordCount, setRecordCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: routes = [], isLoading: loadingRoutes } = useQuery({
    queryKey: ['routes'],
    queryFn: () => db.entities.Route.list(),
  });

  const { data: delayRecords = [], isLoading: loadingRecords } = useQuery({
    queryKey: ['delayRecords'],
    queryFn: () => db.entities.DelayRecord.list('-created_date', 1000),
  });

  const generateRoutes = async () => {
    setIsGenerating(true);
    setProgress(0);

    // make sure storage / network is available
    try {
      // simple localStorage probe (will throw in strict mode or if disabled)
      localStorage.setItem('pt_probe', '1');
      localStorage.removeItem('pt_probe');
    } catch (err) {
      console.error('storage probe failed', err);
      toast.error('Unable to access storage: ' + err.message);
      setIsGenerating(false);
      return;
    }

    try {
      for (let i = 0; i < ROUTE_TEMPLATES.length; i++) {
        const template = ROUTE_TEMPLATES[i];
        // create may throw if the client is misconfigured
        await db.entities.Route.create({
          route_name: template.name,
          route_type: template.type,
          origin: template.origin,
          destination: template.destination,
          distance_km: template.distance,
          estimated_duration_mins: template.duration,
          stops_count: template.stops,
          avg_daily_passengers: template.passengers,
        });

        // allow React to flush state updates so the progress bar moves
        setProgress(((i + 1) / ROUTE_TEMPLATES.length) * 100);
        // yield to the event loop so the UI can update
        await new Promise((r) => setTimeout(r, 0));
      }

      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success(`${ROUTE_TEMPLATES.length} routes created successfully`);
    } catch (err) {
      console.error('failed to generate routes', err);
      toast.error('Error generating routes: ' + (err.message || err));
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const generateDelayRecords = async () => {
    if (routes.length === 0) {
      toast.error('Please generate routes first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const batchSize = 50;
      const totalBatches = Math.ceil(recordCount / batchSize);

      for (let batch = 0; batch < totalBatches; batch++) {
        const records = [];
        const currentBatchSize = Math.min(batchSize, recordCount - batch * batchSize);

        for (let i = 0; i < currentBatchSize; i++) {
          const route = routes[Math.floor(Math.random() * routes.length)];
          const day = DAYS_OF_WEEK[Math.floor(Math.random() * 7)];
          const hour = Math.floor(Math.random() * 24);
          const weather = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
          const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
          const hasEvent = eventType !== 'none';
          const crowdSize = hasEvent ? Math.floor(Math.random() * 80000) + 5000 : 0;
          const trafficLevel = Math.floor(Math.random() * 10) + 1;
          const temperature = Math.round((Math.random() * 40 - 5) * 10) / 10;
          const precipitation = weather === 'rainy' || weather === 'stormy' ? Math.round(Math.random() * 50 * 10) / 10 : 0;
          const windSpeed = Math.round(Math.random() * 60 * 10) / 10;
          const visibility = weather === 'foggy' ? Math.round(Math.random() * 3 * 10) / 10 : Math.round((Math.random() * 10 + 5) * 10) / 10;

          const delayMinutes = generateRandomDelay(weather, hour, hasEvent, crowdSize, trafficLevel);

          // Generate date within last 30 days
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));

          records.push({
            route_id: route.id,
            route_name: route.route_name,
            route_type: route.route_type,
            delay_minutes: delayMinutes,
            delay_category: getDelayCategory(delayMinutes),
            date: date.toISOString().split('T')[0],
            day_of_week: day,
            hour: hour,
            is_peak_hour: (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19),
            temperature_c: temperature,
            precipitation_mm: precipitation,
            wind_speed_kmh: windSpeed,
            visibility_km: visibility,
            weather_condition: weather,
            has_event: hasEvent,
            event_type: eventType,
            event_crowd_size: crowdSize,
            traffic_congestion_level: trafficLevel,
          });
        }

        await db.entities.DelayRecord.bulkCreate(records);
        setProgress(((batch + 1) / totalBatches) * 100);
        await new Promise((r) => setTimeout(r, 0));
      }

      queryClient.invalidateQueries({ queryKey: ['delayRecords'] });
      toast.success(`${recordCount} delay records generated successfully`);
    } catch (err) {
      console.error('failed to generate delay records', err);
      toast.error('Error generating delay records: ' + (err.message || err));
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to delete all delay records? This cannot be undone.')) return;
    
    setIsGenerating(true);
    
    for (const record of delayRecords) {
      await db.entities.DelayRecord.delete(record.id);
    }
    
    queryClient.invalidateQueries({ queryKey: ['delayRecords'] });
    toast.success('All delay records cleared');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Generator</h1>
          <p className="text-slate-500 mt-1">Generate synthetic training data for ML models</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Routes Created</p>
                  <p className="text-3xl font-bold text-slate-900">{routes.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              {routes.length >= 10 && (
                <Badge className="mt-3 bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Delay Records</p>
                  <p className="text-3xl font-bold text-slate-900">{delayRecords.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {delayRecords.length >= 100 && (
                <Badge className="mt-3 bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sufficient for training
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Model Status</p>
                  <p className="text-xl font-bold text-slate-900">
                    {delayRecords.length >= 100 ? 'Ready to Train' : 'Need More Data'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${delayRecords.length >= 100 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {delayRecords.length >= 100 ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {isGenerating && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 mb-2">Generating data...</p>
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-bold text-slate-600">{Math.round(progress)}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generator Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Generator */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800">Step 1: Generate Routes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Create sample transit routes including buses, trains, and metro lines with realistic parameters.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm font-medium text-slate-700">Will create:</p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• 4 Bus routes (local & express)</li>
                  <li>• 3 Metro lines</li>
                  <li>• 3 Train routes (commuter & express)</li>
                </ul>
              </div>
              <Button 
                onClick={generateRoutes}
                disabled={isGenerating || routes.length >= 10}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {routes.length >= 10 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Routes Created
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate 10 Routes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Delay Record Generator */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800">Step 2: Generate Delay Records</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Generate historical delay records with weather, events, and traffic data for ML training.
              </p>
              <div className="space-y-2">
                <Label>Number of Records</Label>
                <Input 
                  type="number"
                  value={recordCount}
                  onChange={(e) => setRecordCount(parseInt(e.target.value) || 100)}
                  min={50}
                  max={1000}
                />
                <p className="text-xs text-slate-400">Recommended: 500+ for accurate model training</p>
              </div>
              <Button 
                onClick={generateDelayRecords}
                disabled={isGenerating || routes.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate {recordCount} Records
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={clearAllData}
                disabled={isGenerating || delayRecords.length === 0}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Delay Records
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Preview */}
        {delayRecords.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800">Recent Records Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left p-2 text-slate-600">Route</th>
                      <th className="text-left p-2 text-slate-600">Type</th>
                      <th className="text-left p-2 text-slate-600">Delay</th>
                      <th className="text-left p-2 text-slate-600">Weather</th>
                      <th className="text-left p-2 text-slate-600">Day/Hour</th>
                      <th className="text-left p-2 text-slate-600">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delayRecords.slice(0, 10).map((record, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-2 font-medium">{record.route_name}</td>
                        <td className="p-2 capitalize">{record.route_type}</td>
                        <td className="p-2">
                          <Badge className={
                            record.delay_category === 'on_time' ? 'bg-green-100 text-green-700' :
                            record.delay_category === 'minor' ? 'bg-yellow-100 text-yellow-700' :
                            record.delay_category === 'moderate' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {record.delay_minutes} min
                          </Badge>
                        </td>
                        <td className="p-2 capitalize">{record.weather_condition}</td>
                        <td className="p-2">{record.day_of_week?.slice(0, 3)} {record.hour}:00</td>
                        <td className="p-2">{record.has_event ? record.event_type : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}