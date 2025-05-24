
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SurgicalDashboard } from '@/components/SurgicalDashboard';
import { DataCapture } from '@/components/DataCapture';
import { AIOrchestrator } from '@/components/AIOrchestrator';
import { PatientCommunication } from '@/components/PatientCommunication';
import { ComplianceModule } from '@/components/ComplianceModule';
import { CalendarIntegration } from '@/components/CalendarIntegration';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Router>
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<SurgicalDashboard />} />
            <Route path="/capture" element={<DataCapture />} />
            <Route path="/orchestrator" element={<AIOrchestrator />} />
            <Route path="/communication" element={<PatientCommunication />} />
            <Route path="/compliance" element={<ComplianceModule />} />
            <Route path="/calendar" element={<CalendarIntegration />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default Index;
