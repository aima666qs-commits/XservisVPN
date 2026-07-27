import { motion } from 'framer-motion';
import { useStore, SNI_LIST, PORT_LIST } from '../store/useStore';
import { aiSelectServer } from '../types/ai';

export default function ServerCard({ onShowConfig }: { onShowConfig: () => void }) {
  const {
    isConnected, currentServer, currentSni, currentPort,
    currentProtocol, setServer, setSni, setPort,
  } = useStore();

  if (!isConnected || !currentServer) return null;

  const protoNames: Record<string, string> = {
    'vless-reality': 'VLESS Reality',
    'hysteria2': 'Hysteria 2',
    'grpc': 'gRPC',
    'vless-tcp': 'VLESS TCP',
  };

  const rotate = () => {
    const newSni = SNI_LIST.filter(s => s !== currentSni);
    setSni(newSni[Math.floor(Math.random() * newSni.length)]);
    if (Math.random() < 0.4) {
      setPort(PORT_LIST[Math.floor(Math.random() * PORT_LIST.length)]);
    }
    if (Math.random() < 0.3) {
      setServer(aiSelectServer(currentProtocol));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.5 }}
      className="glass p-5 mb-4"
    >
      {/* Server header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {currentServer.flag}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold truncate">{currentServer.name}</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {currentServer.ip}:{currentPort}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={rotate}
          className="p-2.5 rounded-xl text-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
        >
          🔄
        </motion.button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
          🔗 SNI: <strong style={{ color: 'var(--primary)' }}>{currentSni}</strong>
        </span>
        <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
          ⚡ {protoNames[currentProtocol] || currentProtocol}
        </span>
        <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
          🎭 {currentServer.config.realitySettings?.fingerprint || 'chrome'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={onShowConfig}
          className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 4px 16px rgba(21,216,234,0.2)' }}
        >
          📋 Конфиг
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={rotate}
          className="py-3.5 px-5 rounded-xl text-sm font-semibold cursor-pointer"
          style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
        >
          🔄 Сменить
        </motion.button>
      </div>
    </motion.div>
  );
}
