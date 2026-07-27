import { motion } from 'framer-motion';
import { useStore, SERVERS } from '../store/useStore';
import { aiSelectServer } from '../types/ai';

export default function Servers() {
  const { setServer, setSni, setPort, setProtocol, isConnected, currentServer } = useStore();

  const selectServer = (s: typeof SERVERS[0]) => {
    setServer(s);
    setPort(s.port);
    setProtocol(s.protocol);
    setSni('www.google.com');
  };

  const protoNames: Record<string, string> = {
    'vless-reality': 'VLESS Reality',
    'hysteria2': 'Hysteria 2',
    'grpc': 'gRPC',
    'vless-tcp': 'VLESS TCP',
  };

  return (
    <div className="px-4 pb-28">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2"
      >
        🌍 Серверы
      </motion.h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
        {SERVERS.length} серверов · AI автоматически выбирает лучший
      </p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          const rec = aiSelectServer('vless-reality');
          selectServer(rec);
        }}
        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mb-4 cursor-pointer border-none"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 4px 16px rgba(21,216,234,0.2)' }}
      >
        🤖 AI — Выбрать лучший сервер
      </motion.button>

      <div className="flex flex-col gap-2.5">
        {SERVERS.map((server, i) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectServer(server)}
            className="glass p-4 flex items-center gap-3.5 cursor-pointer"
            style={{
              borderColor: currentServer?.id === server.id ? 'var(--primary)' : 'var(--card-border)',
              borderWidth: currentServer?.id === server.id ? 2 : 1,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'var(--surface)' }}
            >
              {server.flag}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold truncate">{server.name}</span>
                {currentServer?.id === server.id && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--success)' }}>
                    active
                  </span>
                )}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {server.ip}:{server.port}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-xs font-medium">{server.country}</div>
              <div className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                {protoNames[server.protocol]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
