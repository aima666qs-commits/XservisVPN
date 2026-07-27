import { motion, AnimatePresence } from 'framer-motion';
import { Home, Globe, BarChart3, Cpu, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { id: '/', icon: Home, label: 'Главная' },
  { id: '/servers', icon: Globe, label: 'Серверы' },
  { id: '/stats', icon: BarChart3, label: 'Статистика' },
  { id: '/ai', icon: Cpu, label: 'AI' },
  { id: '/settings', icon: Settings, label: 'Настройки' },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      <div
        className="mx-auto max-w-lg"
        style={{
          background: 'var(--card)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid var(--card-border)',
          borderRadius: '20px 20px 0 0',
          margin: '0 8px',
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = location.pathname === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(id)}
                className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300"
                style={{
                  minWidth: 56,
                  background: isActive ? 'var(--primary)' : 'transparent',
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--primary)', opacity: 0.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)', position: 'relative', zIndex: 1 }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)', position: 'relative', zIndex: 1 }}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
