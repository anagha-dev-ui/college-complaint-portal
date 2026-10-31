/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintTracker } from './components/ComplaintTracker';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { GuidelinesView } from './components/GuidelinesView';
import { AuthModal } from './components/AuthModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {currentView === 'home' && <Hero />}
        {currentView === 'submit' && <ComplaintForm />}
        {currentView === 'track' && <ComplaintTracker />}
        {currentView === 'student-dashboard' && <StudentDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'guidelines' && <GuidelinesView />}
      </div>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <ComplaintDetailModal />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
