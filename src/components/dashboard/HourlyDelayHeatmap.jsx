import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const getColor = (value, max) => {
  const ratio = value / max;
  if (ratio < 0.2) return 'bg-green-100';
  if (ratio < 0.4) return 'bg-green-300';
  if (ratio < 0.6) return 'bg-yellow-300';
  if (ratio < 0.8) return 'bg-orange-400';
  return 'bg-red-500';
};

export default function HourlyDelayHeatmap({ data, title = "Delay Heatmap by Hour & Day" }) {
  const maxValue = Math.max(...data.flat());
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hours header */}
            <div className="flex mb-1">
              <div className="w-12"></div>
              {hours.filter((_, i) => i % 2 === 0).map(hour => (
                <div key={hour} className="flex-1 text-center text-xs text-slate-500">
                  {hour}:00
                </div>
              ))}
            </div>
            
            {/* Heatmap rows */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-12 text-sm font-medium text-slate-600">{day}</div>
                <div className="flex flex-1 gap-0.5">
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className={cn(
                        "flex-1 h-6 rounded-sm cursor-pointer transition-transform hover:scale-110",
                        getColor(data[dayIndex]?.[hour] || 0, maxValue)
                      )}
                      title={`${day} ${hour}:00 - Avg Delay: ${(data[dayIndex]?.[hour] || 0).toFixed(1)} min`}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-center mt-4 gap-2">
              <span className="text-xs text-slate-500">Low</span>
              <div className="flex gap-0.5">
                <div className="w-6 h-4 rounded-sm bg-green-100"></div>
                <div className="w-6 h-4 rounded-sm bg-green-300"></div>
                <div className="w-6 h-4 rounded-sm bg-yellow-300"></div>
                <div className="w-6 h-4 rounded-sm bg-orange-400"></div>
                <div className="w-6 h-4 rounded-sm bg-red-500"></div>
              </div>
              <span className="text-xs text-slate-500">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}