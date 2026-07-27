import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Smartphone, RotateCw, Settings, RefreshCw } from 'lucide-react';

interface PortErrorAlertProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function PortErrorAlert({ open, onClose, onOpen }: PortErrorAlertProps) {
  const solutions = [
    {
      icon: Smartphone,
      title: 'Закрыть принудительно',
      desc: 'Настройки → Приложения → v2rayNG/NekoBox → «Закрыть принудительно»',
      color: '#FF9100',
    },
    {
      icon: Settings,
      title: 'Сменить порт 10808',
      desc: 'В настройках приложения (⚙) → SOCKS порт → измени на 10809, 20808 или 30808',
      color: '#40C4FF',
    },
    {
      icon: RefreshCw,
      title: 'Перезагрузить телефон',
      desc: 'Перезагрузка освободит все занятые порты — 100% решение',
      color: '#00E676',
    },
  ];

  const ports = [10809, 20808, 30808, 10810, 20809, 10811, 40808, 50808];

  return (
    <>
      {/* Trigger button (shown inside ServerCard) */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-none"
        style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)', color: 'var(--danger)' }}
      >
        <AlertTriangle size={12} />
        Ошибка 10808?
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass w-full max-w-sm p-5"
              onClick={e => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,82,82,0.15)' }}>
                    <AlertTriangle size={22} style={{ color: 'var(--danger)' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Ошибка порта 10808</h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Порт уже занят другим приложением</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none flex-shrink-0"
                  style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Solutions */}
              <div className="flex flex-col gap-3 mb-4">
                {solutions.map((sol, i) => (
                  <motion.div
                    key={sol.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="rounded-xl p-3.5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${sol.color}15` }}>
                        <sol.icon size={18} style={{ color: sol.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">
                          {i + 1}. {sol.title}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {sol.desc}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommended ports */}
              <div
                className="rounded-xl p-3.5 mb-4"
                style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RotateCw size={14} style={{ color: 'var(--success)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                    Рекомендуемые свободные порты
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ports.map(p => (
                    <span
                      key={p}
                      className="text-xs px-3 py-1.5 rounded-md font-mono"
                      style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.15)', color: 'var(--text)' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Выбери любой порт из списка и введи его в настройках приложения (⚙ → SOCKS порт)
                </p>
              </div>

              {/* Quick copy button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const text = `Ошибка 10808 — реши за 1 минуту:
1. Настройки → Приложения → v2rayNG → Закрыть принудительно
2. ИЛИ смени порт на: 10809, 20808, 30808
3. ИЛИ перезагрузи телефон`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text);
                  onClose();
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                📋 Скопировать инструкцию
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
