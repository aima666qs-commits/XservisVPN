import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Activity, Wifi, Download, Upload } from 'lucide-react';

export default function Stats() {
  const { isConnected, stats, currentServer } = useStore();
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!isConnected) { setHistory([]); return; }
    const interval = setInterval(() => {
      setHistory(prev => [...prev.slice(-19), stats.ping]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isConnected, stats.ping]);

  const maxPing = Math.max(...history, 100);

  return (
    <div className="px-4 pb-28">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        📈 Статистика
      </motion.h1>

      {!isConnected ? (
        <div className="glass p-6 text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-3"
          >
            📊
          </motion.div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Подключись к VPN, чтобы увидеть статистику
          </p>
        </div>
      ) : (
        <>
          {/* Big stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass p-4 text-center"
            >
              <Download size={20} className="mx-auto mb-1.5" style={{ color: 'var(--primary)' }} />
              <div className="text-2xl font-bold">{stats.speed}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Скорость Mbps</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="glass p-4 text-center"
            >
              <Upload size={20} className="mx-auto mb-1.5" style={{ color: 'var(--primary)' }} />
              <div className="text-2xl font-bold">{stats.upload.toFixed(1)}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Загрузка Mbps</div>
            </motion.div>
          </div>

          {/* Ping graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold">Пинг ({stats.ping}ms)</span>
            </div>
            <div className="flex items-end gap-1 h-24">
              {history.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / maxPing) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 rounded-t-sm"
                  style={{
                    background: v < 40 ? 'var(--success)' : v < 80 ? 'var(--warning)' : 'var(--danger)',
                    opacity: 0.6 + (i / history.length) * 0.4,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-4"
          >
            <div className="text-sm font-semibold mb-3">Детали</div>
            {[
              { icon: Wifi, label: 'IP', value: currentServer?.ip || '—' },
              { icon: BarChart3, label: 'Трафик', value: stats.trafficUsed },
              { icon: TrendingUp, label: 'Протокол', value: currentServer?.protocol || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <Icon size={16} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span className="text-xs font-semibold ml-auto">{value}</span>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
