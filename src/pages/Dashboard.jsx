import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Clock, Bus, AlertTriangle, TrendingUp, Cloud, Calendar, Activity } from 'lucide-react';

import StatsCard from '../components/dashboard/StatsCard';
import DelayChart from '../components/dashboard/DelayChart';
import WeatherImpactChart from '../components/dashboard/WeatherImpactChart';
import RouteDelayTable from '../components/dashboard/RouteDelayTable';
import HourlyDelayHeatmap from '../components/dashboard/HourlyDelayHeatmap';
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: delayRecords = [], isLoading: loadingRecords } = useQuery({
    queryKey: ['delayRecords'],
    queryFn: () => db.entities.DelayRecord.list('-created_date', 500),
  });

  const { data: routes = [], isLoading: loadingRoutes } = useQuery({
    queryKey: ['routes'],
    queryFn: () => db.entities.Route.list(),
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!delayRecords.length) return { avgDelay: 0, totalRoutes: 0, onTimeRate: 0, severeDelays: 0 };
    
    const avgDelay = delayRecords.reduce((sum, r) => sum + (r.delay_minutes || 0), 0) / delayRecords.length;
    const onTime = delayRecords.filter(r => r.delay_category === 'on_time').length;
    const severe = delayRecords.filter(r => r.delay_category === 'severe').length;
    
    return {
      avgDelay: avgDelay.toFixed(1),
      totalRoutes: routes.length,
      onTimeRate: ((onTime / delayRecords.length) * 100).toFixed(1),
      severeDelays: severe
    };
  }, [delayRecords, routes]);

  // Delay trends by day
  const delayTrends = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const dayRecords = delayRecords.filter(r => r.day_of_week?.slice(0, 3) === day);
      return {
        name: day,
        bus: dayRecords.filter(r => r.route_type === 'bus').reduce((s, r) => s + (r.delay_minutes || 0), 0) / Math.max(1, dayRecords.filter(r => r.route_type === 'bus').length),
        train: dayRecords.filter(r => r.route_type === 'train').reduce((s, r) => s + (r.delay_minutes || 0), 0) / Math.max(1, dayRecords.filter(r => r.route_type === 'train').length),
        metro: dayRecords.filter(r => r.route_type === 'metro').reduce((s, r) => s + (r.delay_minutes || 0), 0) / Math.max(1, dayRecords.filter(r => r.route_type === 'metro').length),
      };
    });
  }, [delayRecords]);

  // Weather impact data
  const weatherImpact = useMemo(() => {
    const conditions = ['clear', 'cloudy', 'rainy', 'foggy', 'stormy', 'snowy'];
    return conditions.map(condition => {
      const records = delayRecords.filter(r => r.weather_condition === condition);
      const avgDelay = records.length ? records.reduce((s, r) => s + (r.delay_minutes || 0), 0) / records.length : 0;
      return { condition: condition.charAt(0).toUpperCase() + condition.slice(1), avgDelay };
    });
  }, [delayRecords]);

  // Route performance data
  const routePerformance = useMemo(() => {
    return routes.map(route => {
      const routeRecords = delayRecords.filter(r => r.route_name === route.route_name);
      const avgDelay = routeRecords.length ? routeRecords.reduce((s, r) => s + (r.delay_minutes || 0), 0) / routeRecords.length : 0;
      
      let status = 'on_time';
      if (avgDelay > 10) status = 'severe';
      else if (avgDelay > 5) status = 'moderate';
      else if (avgDelay > 2) status = 'minor';
      
      return {
        ...route,
        avgDelay,
        status
      };
    });
  }, [routes, delayRecords]);

  // Heatmap data
  const heatmapData = useMemo(() => {
    const dayMap = { 'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6 };
    const data = Array(7).fill(null).map(() => Array(24).fill(0));
    const counts = Array(7).fill(null).map(() => Array(24).fill(0));
    
    delayRecords.forEach(r => {
      const dayIdx = dayMap[r.day_of_week];
      const hour = r.hour;
      if (dayIdx !== undefined && hour !== undefined) {
        data[dayIdx][hour] += r.delay_minutes || 0;
        counts[dayIdx][hour]++;
      }
    });
    
    return data.map((dayData, dayIdx) => 
      dayData.map((total, hour) => counts[dayIdx][hour] ? total / counts[dayIdx][hour] : 0)
    );
  }, [delayRecords]);

  const isLoading = loadingRecords || loadingRoutes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transit Delay Analytics</h1>
          <p className="text-slate-500 mt-1">Real-time insights and ML-powered predictions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            <>
              <StatsCard 
                title="Average Delay" 
                value={`${stats.avgDelay} min`}
                icon={Clock}
                iconBg="bg-blue-500"
                trend={parseFloat(stats.avgDelay) > 5 ? 'up' : 'down'}
                trendValue={parseFloat(stats.avgDelay) > 5 ? '+12% vs last week' : '-8% vs last week'}
              />
              <StatsCard 
                title="Active Routes" 
                value={stats.totalRoutes}
                icon={Bus}
                iconBg="bg-green-500"
              />
              <StatsCard 
                title="On-Time Rate" 
                value={`${stats.onTimeRate}%`}
                icon={TrendingUp}
                iconBg="bg-indigo-500"
                trend={parseFloat(stats.onTimeRate) > 80 ? 'down' : 'up'}
                trendValue={parseFloat(stats.onTimeRate) > 80 ? 'Excellent' : 'Needs attention'}
              />
              <StatsCard 
                title="Severe Delays" 
                value={stats.severeDelays}
                subtitle="Last 24 hours"
                icon={AlertTriangle}
                iconBg="bg-red-500"
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </>
          ) : (
            <>
              <DelayChart data={delayTrends} title="Average Delay by Day of Week" />
              <WeatherImpactChart data={weatherImpact} title="Weather Impact on Delays" />
            </>
          )}
        </div>

        {/* Heatmap */}
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : (
          <HourlyDelayHeatmap data={heatmapData} title="Delay Patterns by Hour & Day" />
        )}

        {/* Route Table */}
        {isLoading ? (
          <Skeleton className="h-96 rounded-xl" />
        ) : (
          <RouteDelayTable data={routePerformance} title="Route Performance Overview" />
        )}
      </div>
    </div>
  );
}