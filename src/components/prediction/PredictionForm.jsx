import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles } from "lucide-react";

const weatherConditions = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy'];
const eventTypes = ['none', 'sports', 'concert', 'festival', 'conference', 'parade'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PredictionForm({ 
  formData, 
  setFormData, 
  routes, 
  onPredict, 
  isLoading,
  hasRouteData 
}) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Delay Prediction Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Route Selection */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Select Route</Label>
          <Select value={formData.route_id || ''} onValueChange={(v) => handleChange('route_id', v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose a route" />
            </SelectTrigger>
            <SelectContent>
              {routes.map(route => (
                <SelectItem key={route.id} value={route.id}>
                  {route.route_name} ({route.route_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Day of Week</Label>
            <Select value={formData.day_of_week || 'Monday'} onValueChange={(v) => handleChange('day_of_week', v)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Hour (0-23)</Label>
            <Input 
              type="number" 
              min={0} 
              max={23} 
              value={formData.hour || 8}
              onChange={(e) => handleChange('hour', parseInt(e.target.value))}
              className="h-11"
            />
          </div>
        </div>

        {/* Weather Section */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
          <h4 className="font-semibold text-slate-700">Weather Conditions</h4>
          
          <div className="space-y-2">
            <Label className="text-slate-600">Weather Type</Label>
            <Select value={formData.weather_condition || 'clear'} onValueChange={(v) => handleChange('weather_condition', v)}>
              <SelectTrigger className="h-11 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weatherConditions.map(w => (
                  <SelectItem key={w} value={w} className="capitalize">{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Temperature (°C)</Label>
              <Input 
                type="number" 
                value={formData.temperature_c || 20}
                onChange={(e) => handleChange('temperature_c', parseFloat(e.target.value))}
                className="h-11 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Precipitation (mm)</Label>
              <Input 
                type="number" 
                min={0}
                value={formData.precipitation_mm || 0}
                onChange={(e) => handleChange('precipitation_mm', parseFloat(e.target.value))}
                className="h-11 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Wind Speed (km/h)</Label>
              <Input 
                type="number" 
                min={0}
                value={formData.wind_speed_kmh || 10}
                onChange={(e) => handleChange('wind_speed_kmh', parseFloat(e.target.value))}
                className="h-11 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Visibility (km)</Label>
              <Input 
                type="number" 
                min={0}
                value={formData.visibility_km || 10}
                onChange={(e) => handleChange('visibility_km', parseFloat(e.target.value))}
                className="h-11 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Event Section */}
        <div className="space-y-4 p-4 bg-amber-50 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-700">Event Settings</h4>
            <div className="flex items-center gap-2">
              <Label className="text-slate-600">Has Event</Label>
              <Switch 
                checked={formData.has_event || false}
                onCheckedChange={(v) => handleChange('has_event', v)}
              />
            </div>
          </div>
          
          {formData.has_event && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-600">Event Type</Label>
                <Select value={formData.event_type || 'none'} onValueChange={(v) => handleChange('event_type', v)}>
                  <SelectTrigger className="h-11 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(e => (
                      <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Crowd Size: {formData.event_crowd_size || 0}</Label>
                <Slider 
                  value={[formData.event_crowd_size || 0]}
                  onValueChange={([v]) => handleChange('event_crowd_size', v)}
                  max={100000}
                  step={1000}
                  className="py-2"
                />
              </div>
            </>
          )}
        </div>

        {/* Traffic Congestion */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Traffic Congestion Level: {formData.traffic_congestion_level || 5}</Label>
          <Slider 
            value={[formData.traffic_congestion_level || 5]}
            onValueChange={([v]) => handleChange('traffic_congestion_level', v)}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Low (1)</span>
            <span>High (10)</span>
          </div>
        </div>

        {!hasRouteData && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            ⚠️ Please calculate route on the map above first
          </div>
        )}

        <Button 
          onClick={onPredict} 
          disabled={isLoading || !formData.route_id || !hasRouteData}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Predict Total Delay
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}