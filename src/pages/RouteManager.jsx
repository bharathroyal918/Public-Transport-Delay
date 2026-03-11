import React, { useState } from 'react';
import { db } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Bus, Train, TrainFront, Route, MapPin, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const initialFormState = {
  route_name: '',
  route_type: 'bus',
  origin: '',
  destination: '',
  distance_km: '',
  estimated_duration_mins: '',
  stops_count: '',
  avg_daily_passengers: ''
};

export default function RouteManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => db.entities.Route.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Route.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route created successfully');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Route.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route updated successfully');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Route.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted');
    }
  });

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      distance_km: parseFloat(formData.distance_km) || 0,
      estimated_duration_mins: parseInt(formData.estimated_duration_mins) || 0,
      stops_count: parseInt(formData.stops_count) || 0,
      avg_daily_passengers: parseInt(formData.avg_daily_passengers) || 0
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (route) => {
    setFormData({
      route_name: route.route_name || '',
      route_type: route.route_type || 'bus',
      origin: route.origin || '',
      destination: route.destination || '',
      distance_km: route.distance_km?.toString() || '',
      estimated_duration_mins: route.estimated_duration_mins?.toString() || '',
      stops_count: route.stops_count?.toString() || '',
      avg_daily_passengers: route.avg_daily_passengers?.toString() || ''
    });
    setEditingId(route.id);
    setIsDialogOpen(true);
  };

  const getRouteIcon = (type) => {
    const icons = { bus: Bus, train: Train, metro: TrainFront };
    const Icon = icons[type] || Bus;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      bus: 'bg-blue-100 text-blue-700 border-blue-200',
      train: 'bg-green-100 text-green-700 border-green-200',
      metro: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || colors.bus;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Route Manager</h1>
            <p className="text-slate-500 mt-1">Manage transit routes and their parameters</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Route Name</Label>
                  <Input 
                    value={formData.route_name}
                    onChange={(e) => setFormData({...formData, route_name: e.target.value})}
                    placeholder="e.g., Downtown Express"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Transport Type</Label>
                  <Select value={formData.route_type} onValueChange={(v) => setFormData({...formData, route_type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origin</Label>
                    <Input 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      placeholder="Start point"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      placeholder="End point"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={formData.distance_km}
                      onChange={(e) => setFormData({...formData, distance_km: e.target.value})}
                      placeholder="15.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Est. Duration (min)</Label>
                    <Input 
                      type="number"
                      value={formData.estimated_duration_mins}
                      onChange={(e) => setFormData({...formData, estimated_duration_mins: e.target.value})}
                      placeholder="45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stops Count</Label>
                    <Input 
                      type="number"
                      value={formData.stops_count}
                      onChange={(e) => setFormData({...formData, stops_count: e.target.value})}
                      placeholder="12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avg Daily Passengers</Label>
                    <Input 
                      type="number"
                      value={formData.avg_daily_passengers}
                      onChange={(e) => setFormData({...formData, avg_daily_passengers: e.target.value})}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingId ? 'Update' : 'Create'} Route
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Route className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Routes</p>
                <p className="text-2xl font-bold text-slate-900">{routes.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Bus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bus Routes</p>
                <p className="text-2xl font-bold text-slate-900">{routes.filter(r => r.route_type === 'bus').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Train className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Train/Metro Routes</p>
                <p className="text-2xl font-bold text-slate-900">{routes.filter(r => r.route_type === 'train' || r.route_type === 'metro').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Daily Passengers</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(routes.reduce((s, r) => s + (r.avg_daily_passengers || 0), 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Routes Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800">All Routes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : routes.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Route className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No routes yet. Add your first route to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100">
                      <TableHead className="text-slate-600">Route</TableHead>
                      <TableHead className="text-slate-600">Type</TableHead>
                      <TableHead className="text-slate-600">Origin → Destination</TableHead>
                      <TableHead className="text-slate-600">Distance</TableHead>
                      <TableHead className="text-slate-600">Duration</TableHead>
                      <TableHead className="text-slate-600">Stops</TableHead>
                      <TableHead className="text-slate-600">Passengers/Day</TableHead>
                      <TableHead className="text-slate-600 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-800">{route.route_name}</TableCell>
                        <TableCell>
                          <Badge className={`flex items-center gap-1 w-fit border ${getTypeColor(route.route_type)}`}>
                            {getRouteIcon(route.route_type)}
                            <span className="capitalize">{route.route_type}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-3 w-3" />
                            {route.origin} → {route.destination}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{route.distance_km} km</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="h-3 w-3" />
                            {route.estimated_duration_mins} min
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{route.stops_count || '-'}</TableCell>
                        <TableCell className="text-slate-600">
                          {route.avg_daily_passengers?.toLocaleString() || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(route)}>
                              <Pencil className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => deleteMutation.mutate(route.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}