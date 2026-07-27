import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TabBar from './components/TabBar';
import SettingsPanel from './components/SettingsPanel';
import ThemeSelector from './components/ThemeSelector';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Stats from './pages/Stats';
import AiPage from './pages/AiPage';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const isTabPage = ['/', '/servers', '/stats', '/ai', '/settings'].includes(location.pathname);

  return (
    <div className="relative min-h-dvh max-w-lg mx-auto liquid-gradient">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/servers" element={<PageTransition><Servers /></PageTransition>} />
          <Route path="/stats" element={<PageTransition><Stats /></PageTransition>} />
          <Route path="/ai" element={<PageTransition><AiPage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><SettingsPanel /></PageTransition>} />
          <Route path="/settings/themes" element={<PageTransition><ThemeSelector /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {isTabPage && <TabBar />}
    </div>
  );
}
