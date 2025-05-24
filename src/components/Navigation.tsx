
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Calendar, Clock, FileText, Shield, MessageSquare, ChevronDown, Activity } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/capture', label: 'Captura de Dados', icon: FileText },
    { path: '/orchestrator', label: 'IA Orquestrador', icon: Clock },
    { path: '/communication', label: 'Comunicação', icon: MessageSquare },
    { path: '/calendar', label: 'Agenda', icon: Calendar },
    { path: '/compliance', label: 'Conformidade', icon: Shield },
  ];

  const getCurrentPageLabel = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Cirurgia Inteligente';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Dropdown Menu for Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Activity className="text-white w-4 h-4" />
                  </div>
                  <span className="font-semibold">{getCurrentPageLabel()}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center">
                  <Activity className="text-white w-3 h-3" />
                </div>
                <span>Cirurgia Inteligente Hub</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-2 w-full ${
                        isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status and User Info */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Sistema Ativo
            </Badge>
            <div className="text-sm text-gray-500">
              Dr. João Silva
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
