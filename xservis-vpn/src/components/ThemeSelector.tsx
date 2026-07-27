import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { themes, type Theme } from '../themes/themes';

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useStore();
  const themeList = Object.values(themes);

  return (
    <div className="px-1 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2"
      >
        🎨 Темы
      </motion.h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Выбери премиальную тему оформления
      </p>

      <div className="grid grid-cols-2 gap-3">
        {themeList.map((theme: Theme, i) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setTheme(theme.id)}
            className="rounded-xl p-4 text-left cursor-pointer border-2"
            style={{
              background: theme.colors.surface,
              borderColor: currentTheme === theme.id ? theme.colors.primary : theme.colors.cardBorder,
              transition: 'border-color 0.3s ease',
            }}
          >
            {/* Color preview */}
            <div className="flex gap-1.5 mb-3">
              <div className="w-6 h-6 rounded-lg" style={{ background: theme.colors.primary }} />
              <div className="w-6 h-6 rounded-lg" style={{ background: theme.colors.accent }} />
              <div className="w-6 h-6 rounded-lg" style={{ background: theme.colors.glow }} />
              <div className="w-6 h-6 rounded-lg" style={{ background: theme.colors.bg }} />
            </div>

            <div className="text-sm font-bold" style={{ color: theme.colors.text }}>
              {theme.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.colors.textSecondary }}>
              {theme.gradients.button.slice(0, 30)}...
            </div>

            {currentTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                style={{ background: theme.colors.primary, color: '#000' }}
              >
                ✓ Активна
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
