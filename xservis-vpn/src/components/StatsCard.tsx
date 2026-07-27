import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

const statItems = [
  { key: 'ping', label: 'Пинг', icon: '📶', suffix: 'ms' },
  { key: 'speed', label: 'Скорость', icon: '⚡', suffix: 'Mbps' },
  { key: 'country', label: 'Страна', icon: '🌍', suffix: '' },
  { key: 'protocol', label: 'Протокол', icon: '🔒', suffix: '' },
  { key: 'traffic', label: 'Трафик', icon: '📊', suffix: '' },
  { key: 'uptime', label: 'Время', icon: '⏱', suffix: '' },
];

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}ч ${m % 60}м`;
  if (m > 0) return `${m}м ${s % 60}с`;
  return `${s}с`;
}

export default function StatsCard() {
  const { isConnected, stats, currentServer, currentSni, currentProtocol } = useStore();
  const [uptime, setUptime] = useState('0с');

  useEffect(() => {
    if (!isConnected || !stats.connectedAt) return;
    const interval = setInterval(() => {
      setUptime(formatUptime(Date.now() - stats.connectedAt!));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected, stats.connectedAt]);

  if (!isConnected) return null;

  const protoNames: Record<string, string> = {
    'vless-reality': 'VLESS Reality',
    'hysteria2': 'Hysteria 2',
    'grpc': 'gRPC',
    'vless-tcp': 'VLESS TCP',
  };

  const values: Record<string, string> = {
    ping: `${stats.ping}`,
    speed: `${stats.speed}`,
    country: currentServer?.country || '—',
    protocol: protoNames[currentProtocol] || currentProtocol,
    traffic: stats.trafficUsed,
    uptime,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.3 }}
      className="glass p-5 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)', boxShadow: '0 0 8px rgba(0,230,118,0.5)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
            Подключено
          </span>
        </div>
        <div className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
          🔗 {currentSni}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statItems.map(({ key, label, icon, suffix }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 300 }}
            className="rounded-xl p-3 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}
          >
            <div className="text-lg mb-1">{icon}</div>
            <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {values[key]}
              {suffix && key !== 'ping' && key !== 'speed' ? '' : suffix ? <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}> {suffix}</span> : null}
              {(key === 'ping' || key === 'speed') && <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}> {suffix}</span>}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
