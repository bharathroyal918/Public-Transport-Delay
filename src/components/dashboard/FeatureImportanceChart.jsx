import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function FeatureImportanceChart({ data, title = "Feature Importance" }) {
  const sortedData = [...data].sort((a, b) => b.importance - a.importance);
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedData} 
              layout="vertical" 
              margin={{ top: 5, right: 50, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis dataKey="feature" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                }}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Importance']}
              />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]} fill="#3b82f6">
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${220 - index * 15}, 80%, ${50 + index * 3}%)`} 
                  />
                ))}
                <LabelList dataKey="importance" position="right" formatter={(v) => `${v.toFixed(1)}%`} fill="#64748b" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}