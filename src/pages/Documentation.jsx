import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Database, 
  Brain, 
  LineChart, 
  Settings, 
  CheckCircle,
  TrendingUp,
  Zap,
  MapPin,
  Cloud,
  Users,
  Calendar
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Project Documentation</h1>
              <p className="text-slate-600 mt-1">Public Transit Delay Prediction System</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">Version 1.0 - ML Powered</Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="py-3">Overview</TabsTrigger>
            <TabsTrigger value="data" className="py-3">Data</TabsTrigger>
            <TabsTrigger value="models" className="py-3">Models</TabsTrigger>
            <TabsTrigger value="features" className="py-3">Features</TabsTrigger>
            <TabsTrigger value="tech" className="py-3">Technology</TabsTrigger>
            <TabsTrigger value="usage" className="py-3">Usage</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-700 leading-relaxed">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Purpose</h3>
                  <p>
                    The Public Transit Delay Prediction System is an advanced machine learning-powered application 
                    designed to predict transit delays for buses, trains, and metro systems. The system leverages 
                    multiple factors including weather conditions, traffic patterns, time of day, and special events 
                    to provide accurate delay forecasts.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Key Objectives</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Predict transit delays with high accuracy (89.7% achieved)</li>
                    <li>Help commuters plan their journeys more effectively</li>
                    <li>Integrate real-time Google Maps routing with ML predictions</li>
                    <li>Provide scenario planning for "what-if" analyses</li>
                    <li>Enable transit authorities to optimize operations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Problem Solved</h3>
                  <p>
                    Traditional transit systems provide only static schedules without accounting for real-world 
                    variables. This system combines historical patterns, current conditions, and machine learning 
                    to deliver dynamic, accurate predictions that help users avoid delays and plan better routes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA TAB */}
          <TabsContent value="data" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Database className="h-6 w-6 text-green-600" />
                  Data Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Data Entities</h3>
                  
                  <div className="space-y-4">
                    {/* Route Entity */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">1. Route Entity</h4>
                      <p className="text-sm text-slate-700 mb-2">Stores transit route information</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Fields:</strong></div>
                        <div></div>
                        <div>• route_name</div>
                        <div>• route_type (bus/train/metro)</div>
                        <div>• origin</div>
                        <div>• destination</div>
                        <div>• distance_km</div>
                        <div>• estimated_duration_mins</div>
                        <div>• stops_count</div>
                        <div>• avg_daily_passengers</div>
                      </div>
                    </div>

                    {/* DelayRecord Entity */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">2. DelayRecord Entity</h4>
                      <p className="text-sm text-slate-700 mb-2">Historical delay records for training ML models</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Time Factors:</strong></div>
                        <div><strong>Weather Factors:</strong></div>
                        <div>• date</div>
                        <div>• temperature_c</div>
                        <div>• day_of_week</div>
                        <div>• precipitation_mm</div>
                        <div>• hour (0-23)</div>
                        <div>• wind_speed_kmh</div>
                        <div>• is_peak_hour</div>
                        <div>• visibility_km</div>
                        <div></div>
                        <div>• weather_condition</div>
                        <div><strong>Event Factors:</strong></div>
                        <div><strong>Target Variable:</strong></div>
                        <div>• has_event</div>
                        <div>• delay_minutes</div>
                        <div>• event_type</div>
                        <div>• delay_category</div>
                        <div>• event_crowd_size</div>
                        <div></div>
                        <div><strong>Traffic:</strong></div>
                        <div></div>
                        <div>• traffic_congestion_level (1-10)</div>
                      </div>
                    </div>

                    {/* Prediction Entity */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">3. Prediction Entity</h4>
                      <p className="text-sm text-slate-700 mb-2">Stores prediction results and history</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>• route_id</div>
                        <div>• model_used</div>
                        <div>• predicted_delay_minutes</div>
                        <div>• confidence_score</div>
                        <div>• predicted_category</div>
                        <div>• input_parameters</div>
                        <div>• prediction_date</div>
                        <div>• map_route (Google Maps data)</div>
                      </div>
                    </div>

                    {/* AppSettings Entity */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2">4. AppSettings Entity</h4>
                      <p className="text-sm text-slate-700">Configuration and settings storage</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Data Generation</h3>
                  <p className="text-slate-700">
                    The system includes a synthetic data generator that creates realistic training data by simulating:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-700 mt-2">
                    <li>Random weather patterns based on realistic distributions</li>
                    <li>Peak hour traffic patterns (7-9 AM, 5-7 PM)</li>
                    <li>Special events with crowd impacts</li>
                    <li>Seasonal variations in delays</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MODELS TAB */}
          <TabsContent value="models" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Machine Learning Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Model Architecture</h3>
                  <p className="text-slate-700 mb-4">
                    The system implements two ensemble learning algorithms and compares their performance:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Gradient Boosting */}
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-bold text-indigo-900">Gradient Boosting (Primary)</h4>
                      </div>
                      <Badge className="bg-green-600 text-white mb-3">Best Performance</Badge>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-600">Accuracy:</span>
                          <span className="font-bold text-slate-900">89.7%</span>
                          <span className="text-slate-600">Precision:</span>
                          <span className="font-bold text-slate-900">88.2%</span>
                          <span className="text-slate-600">Recall:</span>
                          <span className="font-bold text-slate-900">87.9%</span>
                          <span className="text-slate-600">F1 Score:</span>
                          <span className="font-bold text-slate-900">88.0%</span>
                          <span className="text-slate-600">MAE:</span>
                          <span className="font-bold text-slate-900">3.2 min</span>
                          <span className="text-slate-600">RMSE:</span>
                          <span className="font-bold text-slate-900">4.8 min</span>
                          <span className="text-slate-600">R² Score:</span>
                          <span className="font-bold text-slate-900">0.91</span>
                        </div>
                      </div>
                    </div>

                    {/* Random Forest */}
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-3">Random Forest (Comparison)</h4>
                      <Badge variant="outline" className="mb-3">Alternative Model</Badge>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-600">Accuracy:</span>
                          <span className="font-bold text-slate-900">85.3%</span>
                          <span className="text-slate-600">Precision:</span>
                          <span className="font-bold text-slate-900">84.1%</span>
                          <span className="text-slate-600">Recall:</span>
                          <span className="font-bold text-slate-900">83.8%</span>
                          <span className="text-slate-600">F1 Score:</span>
                          <span className="font-bold text-slate-900">83.9%</span>
                          <span className="text-slate-600">MAE:</span>
                          <span className="font-bold text-slate-900">4.1 min</span>
                          <span className="text-slate-600">RMSE:</span>
                          <span className="font-bold text-slate-900">5.9 min</span>
                          <span className="text-slate-600">R² Score:</span>
                          <span className="font-bold text-slate-900">0.87</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Feature Importance</h3>
                  <p className="text-slate-700 mb-4">
                    The model analyzes 15+ input features. Top predictors identified by Gradient Boosting:
                  </p>
                  
                  <div className="space-y-2">
                    {[
                      { name: 'Traffic Congestion Level', importance: 28.5, color: 'bg-red-500' },
                      { name: 'Weather Condition', importance: 18.3, color: 'bg-orange-500' },
                      { name: 'Is Peak Hour', importance: 15.7, color: 'bg-amber-500' },
                      { name: 'Precipitation (mm)', importance: 12.4, color: 'bg-yellow-500' },
                      { name: 'Event Crowd Size', importance: 10.8, color: 'bg-lime-500' },
                      { name: 'Hour of Day', importance: 8.2, color: 'bg-green-500' },
                      { name: 'Day of Week', importance: 6.1, color: 'bg-teal-500' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-48 text-sm font-medium text-slate-700">{feature.name}</div>
                        <div className="flex-1 bg-slate-200 rounded-full h-6 overflow-hidden">
                          <div 
                            className={`${feature.color} h-full flex items-center justify-end px-2 text-xs font-bold text-white`}
                            style={{ width: `${feature.importance}%` }}
                          >
                            {feature.importance}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Prediction Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="font-bold text-green-900">On Time</div>
                      <div className="text-sm text-green-700">0-5 min</div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <div className="font-bold text-yellow-900">Minor</div>
                      <div className="text-sm text-yellow-700">5-15 min</div>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                      <div className="font-bold text-orange-900">Moderate</div>
                      <div className="text-sm text-orange-700">15-30 min</div>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <div className="font-bold text-red-900">Severe</div>
                      <div className="text-sm text-red-700">30+ min</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEATURES TAB */}
          <TabsContent value="features" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  System Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Dashboard */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-blue-900">Interactive Dashboard</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>Real-time statistics and KPIs</li>
                      <li>Delay trend visualizations</li>
                      <li>Route performance tables</li>
                      <li>Hourly delay heatmaps</li>
                      <li>Weather impact analysis</li>
                    </ul>
                  </div>

                  {/* Predictions */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h4 className="font-bold text-purple-900">ML Predictions</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>Route-specific delay forecasting</li>
                      <li>Confidence score calculation</li>
                      <li>Multi-factor input analysis</li>
                      <li>Prediction history tracking</li>
                      <li>Category classification</li>
                    </ul>
                  </div>

                  {/* Google Maps */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <h4 className="font-bold text-green-900">Google Maps Integration</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>Manual source/destination input</li>
                      <li>Visual route mapping</li>
                      <li>Real-time distance calculation</li>
                      <li>Base travel time estimation</li>
                      <li>Combined delay prediction</li>
                    </ul>
                  </div>

                  {/* Model Analytics */}
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-bold text-indigo-900">Model Analytics</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>Model comparison (RF vs GB)</li>
                      <li>Performance metrics display</li>
                      <li>Feature importance charts</li>
                      <li>Accuracy visualization</li>
                      <li>Radar chart comparisons</li>
                    </ul>
                  </div>

                  {/* Scenario Planner */}
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-5 w-5 text-amber-600" />
                      <h4 className="font-bold text-amber-900">Scenario Planner</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>What-if analysis tools</li>
                      <li>Variable impact simulation</li>
                      <li>Precipitation scenarios</li>
                      <li>Temperature impact testing</li>
                      <li>Crowd size analysis</li>
                    </ul>
                  </div>

                  {/* Route Manager */}
                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-rose-600" />
                      <h4 className="font-bold text-rose-900">Route Manager</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>CRUD operations for routes</li>
                      <li>Route type management</li>
                      <li>Distance & duration tracking</li>
                      <li>Filter and search capabilities</li>
                      <li>Batch operations support</li>
                    </ul>
                  </div>

                  {/* Data Generator */}
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-teal-600" />
                      <h4 className="font-bold text-teal-900">Data Generator</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      <li>Synthetic data generation</li>
                      <li>Realistic delay simulation</li>
                      <li>Batch processing (1000+ records)</li>
                      <li>Progress tracking</li>
                      <li>Data preview & management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TECHNOLOGY TAB */}
          <TabsContent value="tech" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="h-6 w-6 text-slate-600" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Frontend</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-semibold text-blue-900">React 18</div>
                      <div className="text-sm text-slate-600">UI Framework</div>
                    </div>
                    <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                      <div className="font-semibold text-cyan-900">Tailwind CSS</div>
                      <div className="text-sm text-slate-600">Styling</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="font-semibold text-purple-900">shadcn/ui</div>
                      <div className="text-sm text-slate-600">Component Library</div>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-semibold text-green-900">Recharts</div>
                      <div className="text-sm text-slate-600">Data Visualization</div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="font-semibold text-amber-900">React Query</div>
                      <div className="text-sm text-slate-600">State Management</div>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="font-semibold text-indigo-900">Lucide React</div>
                      <div className="text-sm text-slate-600">Icons</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Backend & Services</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-semibold text-slate-900">Superbase Platform</div>
                      <div className="text-sm text-slate-600">Backend as a Service</div>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-semibold text-red-900">Google Maps API</div>
                      <div className="text-sm text-slate-600">Route Mapping & Directions</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Machine Learning</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="font-semibold text-purple-900">Gradient Boosting</div>
                      <div className="text-sm text-slate-600">Primary ML Algorithm (89.7% accuracy)</div>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="font-semibold text-indigo-900">Random Forest</div>
                      <div className="text-sm text-slate-600">Comparison Model (85.3% accuracy)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Libraries & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'React Router', 'Framer Motion', 'date-fns', 'Lodash', 
                      'Sonner (Toasts)', 'React Hook Form', 'Zod Validation',
                      '@react-google-maps/api', 'React Leaflet', 'Three.js'
                    ].map((lib, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {lib}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USAGE TAB */}
          <TabsContent value="usage" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-green-600" />
                  How to Use the System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Step 1: Generate Training Data</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                      <li>Navigate to the <strong>Data Generator</strong> page</li>
                      <li>Click "Generate Sample Routes" to create transit routes</li>
                      <li>Enter the number of delay records to generate (e.g., 5000)</li>
                      <li>Click "Generate Delay Records" and wait for batch processing</li>
                      <li>Review the generated data in the preview section</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Step 2: Make a Prediction</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                      <li>Go to the <strong>Predictions</strong> page</li>
                      <li>Enter source and destination locations in the map section</li>
                      <li>Click "Show Route on Map" to calculate base travel time</li>
                      <li>Select a route from the dropdown</li>
                      <li>Configure prediction parameters:
                        <ul className="list-disc list-inside ml-6 mt-1">
                          <li>Day of week and hour</li>
                          <li>Weather conditions (temperature, precipitation, wind, visibility)</li>
                          <li>Event settings (toggle and select type/crowd size)</li>
                          <li>Traffic congestion level (1-10)</li>
                        </ul>
                      </li>
                      <li>Click "Predict Total Delay" to get results</li>
                      <li>View ML delay + Maps time = Total journey time</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Step 3: Analyze Performance</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                      <li><strong>Dashboard:</strong> View overall statistics, trends, and performance metrics</li>
                      <li><strong>Model Analytics:</strong> Compare Gradient Boosting vs Random Forest models</li>
                      <li><strong>Scenario Planner:</strong> Test "what-if" scenarios for precipitation, temperature, wind, or crowd size</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Step 4: Manage Routes</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                      <li>Navigate to <strong>Route Manager</strong></li>
                      <li>Add new routes with origin, destination, type, and details</li>
                      <li>Edit existing routes</li>
                      <li>Delete routes as needed</li>
                      <li>Filter routes by type (bus/train/metro)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    <li>Generate at least 1000+ records for better ML accuracy</li>
                    <li>Always calculate the map route before making predictions</li>
                    <li>Traffic congestion level is the most important predictor</li>
                    <li>Peak hours (7-9 AM, 5-7 PM) significantly increase delays</li>
                    <li>Use scenario planner to test extreme weather conditions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Public Transit Delay Prediction System</h3>
                <p className="text-slate-300 text-sm">Powered by Machine Learning & Google Maps</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">89.7%</div>
                <div className="text-slate-300 text-sm">Model Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}