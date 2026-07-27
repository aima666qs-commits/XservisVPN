import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { detectRegion, simulatePing, simulateSpeed } from '../types/ai';

interface Step {
  icon: string;
  label: string;
  doneDetail: string;
  detail: string;
}

const steps: Step[] = [
  { icon: '📡', label: 'Определяю твой регион', detail: 'Анализ IP...', doneDetail: 'Москва · МТС' },
  { icon: '🔍', label: 'Сканирую SNI', detail: 'Поиск оптимальных...', doneDetail: 'Найдено 15 SNI' },
  { icon: '📊', label: 'Проверяю порты', detail: 'Тестирование...', doneDetail: '443 ✓ 8443 ✓ 2096 ✓' },
  { icon: '🧠', label: 'AI выбирает сервер', detail: 'Анализ загрузки...', doneDetail: 'Сервер подобран' },
  { icon: '⚡', label: 'Ротация SNI и портов', detail: 'Маскировка...', doneDetail: 'SNI + Порт изменены' },
];

export default function ScanSteps() {
  const { isConnecting, isConnected } = useStore();
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (isConnecting && !isConnected) {
      setCurrentStep(0);
      const timers = steps.map((_, i) => {
        const delay = [700, 900, 800, 1100, 600][i] || 800;
        return setTimeout(() => setCurrentStep(i), delay);
      });
      // Final step
      const finalTimer = setTimeout(() => {
        if (isConnected) setCurrentStep(5);
      }, 4100);
      return () => { timers.forEach(t => clearTimeout(t)); clearTimeout(finalTimer); };
    }
    if (!isConnecting && !isConnected) {
      setCurrentStep(-1);
    }
    if (isConnected) {
      setCurrentStep(5);
    }
  }, [isConnecting, isConnected]);

  if (currentStep < 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass p-5 mb-4"
    >
      {steps.map((step, i) => {
        const isActive = currentStep === i;
        const isDone = currentStep > i || (i === 4 && currentStep >= 5);
        const show = currentStep >= i || isDone;

        return (
          <AnimatePresence key={i}>
            {show && (
              <motion.div
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{
                  opacity: isActive || isDone ? 1 : 0.4,
                  x: 0,
                  height: 'auto',
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-center gap-3 py-2.5"
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: isDone
                      ? 'rgba(0,230,118,0.1)'
                      : isActive
                        ? 'rgba(255,145,0,0.12)'
                        : 'var(--surface)',
                    border: isDone
                      ? '1px solid rgba(0,230,118,0.2)'
                      : isActive
                        ? '1px solid rgba(255,145,0,0.3)'
                        : '1px solid var(--card-border)',
                  }}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isDone ? '✅' : isActive ? step.icon : step.icon}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: isDone ? 'var(--success)' : isActive ? 'var(--text)' : 'var(--text-secondary)' }}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {isDone ? step.doneDetail : step.detail}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isActive && !isDone && (
                    <motion.div
                      className="w-4 h-4 rounded-full"
                      style={{
                        border: '2px solid var(--card-border)',
                        borderTopColor: 'var(--primary)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {isDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="text-sm"
                    >
                      ✅
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </motion.div>
  );
}
