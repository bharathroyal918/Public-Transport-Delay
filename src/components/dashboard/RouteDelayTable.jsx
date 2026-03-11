import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bus, Train, TrainFront, AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const getStatusBadge = (category) => {
  const config = {
    on_time: { label: 'On Time', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    minor: { label: 'Minor Delay', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
    moderate: { label: 'Moderate', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
    severe: { label: 'Severe', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
  };
  const { label, color, icon: Icon } = config[category] || config.on_time;
  return (
    <Badge className={cn("flex items-center gap-1 border", color)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const getRouteIcon = (type) => {
  const icons = { bus: Bus, train: Train, metro: TrainFront };
  const Icon = icons[type] || Bus;
  return <Icon className="h-4 w-4 text-slate-500" />;
};

export default function RouteDelayTable({ data, title = "Route Performance" }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-slate-600">Route</TableHead>
                <TableHead className="text-slate-600">Type</TableHead>
                <TableHead className="text-slate-600">Avg Delay</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-slate-600">Distance</TableHead>
                <TableHead className="text-slate-600">Est. Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((route, index) => (
                <TableRow key={index} className="border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-800">{route.route_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRouteIcon(route.route_type)}
                      <span className="capitalize text-slate-600">{route.route_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-semibold",
                      route.avgDelay <= 2 ? "text-green-600" :
                      route.avgDelay <= 5 ? "text-yellow-600" :
                      route.avgDelay <= 10 ? "text-orange-600" : "text-red-600"
                    )}>
                      {route.avgDelay.toFixed(1)} min
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell className="text-slate-600">{route.distance_km} km</TableCell>
                  <TableCell className="text-slate-600">{route.estimated_duration_mins} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}