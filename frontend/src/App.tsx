import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { CommandPalette, useCommandPalette } from './components/CommandPalette';
import { FloatingAI } from './components/FloatingAI';
import { WelcomeScreen, useWelcomeScreen } from './components/WelcomeScreen';
import { useTheme } from './hooks/useTheme';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import './styles/index.css';

function AppContent() {
  const commandPalette = useCommandPalette();
  const welcomeScreen = useWelcomeScreen();
  useTheme(); // Apply theme to document

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/editor/:id?" element={<EditorPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Components */}
      <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
      <FloatingAI />
      {welcomeScreen.isOpen && <WelcomeScreen onClose={welcomeScreen.close} />}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
