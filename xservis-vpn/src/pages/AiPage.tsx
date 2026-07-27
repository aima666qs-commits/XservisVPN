import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { detectRegion, aiRecommend } from '../types/ai';
import { Cpu, Activity, Network, Route, ShieldCheck } from 'lucide-react';

export default function AiPage() {
  const { isConnected, currentServer, currentSni, currentPort, currentProtocol, stats } = useStore();
  const { region, provider } = detectRegion();

  const rec = aiRecommend();

  const cards = [
    {
      icon: Network,
      title: 'Твой регион',
      value: region,
      sub: `Провайдер: ${provider}`,
    },
    {
      icon: Activity,
      title: 'AI Рекомендация',
      value: `${rec.score}%`,
      sub: rec.reason,
    },
    {
      icon: Route,
      title: 'Маршрут',
      value: currentServer?.country || '—',
      sub: currentServer?.name || 'Ожидание...',
    },
    {
      icon: ShieldCheck,
      title: 'Протокол',
      value: currentProtocol === 'vless-reality' ? 'VLESS Reality' :
             currentProtocol === 'hysteria2' ? 'Hysteria 2' :
             currentProtocol === 'grpc' ? 'gRPC' : currentProtocol,
      sub: `SNI: ${currentSni} · Порт: ${currentPort}`,
    },
  ];

  const analysisItems = [
    { label: 'Тип сети', value: 'LTE / 5G', status: '🟢' },
    { label: 'IPv4', value: '185.23.45.67', status: '🟢' },
    { label: 'DNS', value: '1.1.1.1 (Cloudflare)', status: '🟢' },
    { label: 'DPI уровень', value: 'Средний', status: '🟡' },
    { label: 'Качество маршрута', value: isConnected ? 'Отличное' : '—', status: isConnected ? '🟢' : '⚪' },
    { label: 'ASN', value: '???', status: '🟢' },
  ];

  return (
    <div className="px-4 pb-28">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2"
      >
        🤖 AI Assistant
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm mb-5"
        style={{ color: 'var(--text-secondary)' }}
      >
        Интеллектуальный анализ и подбор параметров
      </motion.p>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 300 }}
            className="glass p-3.5"
          >
            <card.icon size={18} className="mb-2" style={{ color: 'var(--primary)' }} />
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{card.title}</div>
            <div className="text-sm font-bold mt-0.5">{card.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-4 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={16} style={{ color: 'var(--primary)' }} />
          <span className="text-sm font-semibold">Анализ сети</span>
        </div>
        {analysisItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 py-2 border-b text-sm"
            style={{ borderColor: 'var(--card-border)' }}
          >
            <span>{item.status}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <span className="ml-auto font-medium text-xs">{item.value}</span>
          </div>
        ))}
      </motion.div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-4 text-center"
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Подключись к VPN для полного анализа
          </p>
        </motion.div>
      )}
    </div>
  );
}
