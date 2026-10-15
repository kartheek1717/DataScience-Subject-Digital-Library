import React, { useState } from 'react';
import { useLab } from './context/LabContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { ExperimentWorkspace } from './components/ExperimentWorkspace';
import { ModulesView } from './components/ModulesView';
import { ProjectsView } from './components/ProjectsView';
import { ResumeView } from './components/ResumeView';
import { ToolsView } from './components/ToolsView';
import { SettingsView } from './components/SettingsView';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';

export const AppContent: React.FC = () => {
  const { currentTab } = useLab();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFC] dark:bg-[#07141F] text-[#122333] dark:text-[#F8FAFC] relative selection:bg-[#009F9A]/20 selection:text-[#009F9A]">
      
      {/* Background ambient light mesh & tech grid */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-[#DFF8F7]/30 via-[#EAF4FF]/20 to-transparent dark:from-[#009F9A]/5 dark:via-[#2563EB]/5 dark:to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Sticky Header with Menu Toggle and Expandable Search + Page Icons */}
      <Header onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Overlay Drawer Sidebar (Closed by default, slides in when menu button clicked) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Global Application Layout: Full-Width Main Workspace Viewport */}
      <div className="flex-1 flex w-full relative z-10">
        <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          {currentTab === 'home' && <HomeDashboard />}
          {currentTab === 'modules' && <ModulesView />}
          {currentTab === 'experiments' && <ExperimentWorkspace />}
          {currentTab === 'projects' && <ProjectsView />}
          {(currentTab === 'profile' || currentTab === 'resume') && <ResumeView />}
          {currentTab === 'tools' && <ToolsView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modern Touch-Friendly Bottom Navigation for Mobile Devices */}
      <MobileBottomNav onOpenDrawer={() => setIsSidebarOpen(true)} />

      {/* Global Interactive Modals & Toast System */}
      <SearchModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return <AppContent />;
}
