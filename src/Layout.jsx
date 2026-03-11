import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { cn } from "@/lib/utils";
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Brain, FlaskConical, Route, Database,
  BarChart3, Menu, X, Train, BookOpen, LogOut, User, ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Toaster } from 'sonner';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
  { name: 'Dashboard',       href: 'Dashboard',       icon: LayoutDashboard },
  { name: 'Predictions',     href: 'Predictions',     icon: Brain },
  { name: 'Model Analytics', href: 'ModelAnalytics',  icon: BarChart3 },
  { name: 'Scenario Planner',href: 'ScenarioPlanner', icon: FlaskConical },
  { name: 'Route Manager',   href: 'RouteManager',    icon: Route },
  { name: 'Data Generator',  href: 'DataGenerator',   icon: Database },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, configured } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    if (configured) navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Train className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">Transport Prediction</h1>
              <p className="text-xs text-slate-500">ML for Transit Delays</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = currentPageName === item.href;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400")} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            <Link
              to={createPageUrl('Documentation')}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                currentPageName === 'Documentation'
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <BookOpen className={cn("h-5 w-5", currentPageName === 'Documentation' ? "text-blue-600" : "text-slate-400")} />
              Documentation
            </Link>

            {/* Connection Mode */}
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 mb-2 text-center">
              {import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                <span className="text-xs font-semibold text-green-700">Supabase mode</span>
              ) : (
                <span className="text-xs font-semibold text-yellow-700">Demo (localStorage) mode</span>
              )}
            </div>
            {/* ML Status */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
              <p className="text-xs font-semibold text-slate-600 mb-1">ML Model Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-500">Gradient Boosting Active</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Accuracy: 89.7%</p>
            </div>

            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-800 truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-200 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-slate-900">Transport Prediction</span>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
