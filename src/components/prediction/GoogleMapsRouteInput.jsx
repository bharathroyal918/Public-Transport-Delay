import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Loader2, Clock, Route as RouteIcon, Map } from "lucide-react";
import { toast } from 'sonner';
import { useLoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCi3U0TUQmlrrrVOaR-aG6k4KNusN8DOKg";
const LIBRARIES = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '12px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export default function GoogleMapsRouteInput({ onRouteCalculated }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeData, setRouteData] = useState(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const calculateRoute = useCallback(async () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }

    setIsCalculating(true);
    
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      
      const route = results.routes[0];
      const leg = route.legs[0];
      
      const data = {
        origin: leg.start_address,
        destination: leg.end_address,
        distance_km: (leg.distance.value / 1000).toFixed(2),
        duration_minutes: Math.ceil(leg.duration.value / 60),
        traffic_duration_minutes: leg.duration_in_traffic 
          ? Math.ceil(leg.duration_in_traffic.value / 60)
          : Math.ceil(leg.duration.value / 60),
        distance_text: leg.distance.text,
        duration_text: leg.duration.text
      };
      
      setRouteData(data);
      
      if (onRouteCalculated) {
        onRouteCalculated(data);
      }
      
      toast.success('Route calculated successfully!');
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Failed to calculate route. Please check your addresses.');
    } finally {
      setIsCalculating(false);
    }
  }, [origin, destination, onRouteCalculated]);

  if (loadError) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading Google Maps. Please check your API key.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600">Loading Google Maps...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Map className="h-5 w-5 text-blue-500" />
          Enter Route Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Origin Input */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500" />
            Source Location
          </Label>
          <Input
            type="text"
            placeholder="Enter starting location (e.g., New York, NY)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="h-11 text-base"
          />
        </div>

        {/* Destination Input */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            Destination Location
          </Label>
          <Input
            type="text"
            placeholder="Enter destination location (e.g., Boston, MA)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-11 text-base"
          />
        </div>

        {/* Calculate Route Button */}
        <Button
          onClick={calculateRoute}
          disabled={isCalculating || !origin || !destination}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Calculating Route...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-5 w-5" />
              Show Route on Map
            </>
          )}
        </Button>

        {/* Route Information */}
        {routeData && (
          <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <RouteIcon className="h-5 w-5 text-green-700" />
              <h4 className="font-bold text-green-900">Route Found!</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 mb-1">Distance</p>
                <p className="font-bold text-lg text-slate-900">{routeData.distance_text}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 mb-1">Travel Time</p>
                <p className="font-bold text-lg text-slate-900">{routeData.duration_text}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">From</p>
                  <p className="text-sm font-medium text-slate-800">{routeData.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">To</p>
                  <p className="text-sm font-medium text-slate-800">{routeData.destination}</p>
                </div>
              </div>
            </div>

            <Badge className="w-full justify-center py-2 bg-green-600 text-white hover:bg-green-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              Map Base Time: {routeData.duration_minutes} minutes
            </Badge>
          </div>
        )}

        {/* Google Map */}
        <div className="rounded-xl overflow-hidden border-2 border-slate-300 shadow-lg">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              zoomControl: true,
            }}
          >
            {directionsResponse && (
              <DirectionsRenderer 
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: '#059669',
                    strokeWeight: 5,
                  }
                }}
              />
            )}
          </GoogleMap>
        </div>
      </CardContent>
    </Card>
  );
}