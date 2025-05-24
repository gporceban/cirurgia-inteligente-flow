
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Calendar, Clock, FileText, Shield, MessageSquare } from 'lucide-react';

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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cirurgia Inteligente Hub</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

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
