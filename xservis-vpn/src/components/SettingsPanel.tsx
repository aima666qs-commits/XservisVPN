import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Cpu, RefreshCw, Palette, Lock, Globe,
  Server, Languages, Activity, Info, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface SettingsItem {
  id: string;
  icon: typeof Shield;
  label: string;
  desc: string;
  type: 'toggle' | 'link';
  route?: string;
  stateKey?: string;
}

const settings: SettingsItem[] = [
  { id: 'vpn', icon: Shield, label: 'VPN', desc: 'Основные параметры подключения', type: 'toggle', stateKey: 'autoConnect' },
  { id: 'ai-routing', icon: Cpu, label: 'AI Routing', desc: 'Автоматический подбор маршрута', type: 'toggle', stateKey: 'aiRouting' },
  { id: 'rotation', icon: RefreshCw, label: 'Smart Rotation', desc: 'Автоматическая ротация SNI/порта', type: 'toggle', stateKey: 'smartRotation' },
  { id: 'themes', icon: Palette, label: 'Темы', desc: '12 премиальных тем оформления', type: 'link', route: '/settings/themes' },
  { id: 'security', icon: Lock, label: 'Безопасность', desc: 'Настройки шифрования', type: 'toggle', stateKey: 'notifications' },
  { id: 'dns', icon: Globe, label: 'DNS', desc: '1.1.1.1, 8.8.8.8', type: 'toggle', stateKey: 'autoConnect' },
  { id: 'proxy', icon: Server, label: 'Прокси', desc: 'SOCKS5, HTTP', type: 'link', route: '/settings/proxy' },
  { id: 'language', icon: Languages, label: 'Язык', desc: 'Русский', type: 'link', route: '/settings/language' },
  { id: 'diagnostics', icon: Activity, label: 'Диагностика', desc: 'Логи и отладка', type: 'link', route: '/settings/diag' },
  { id: 'about', icon: Info, label: 'О приложении', desc: 'XservisVPN v2.0.0', type: 'link', route: '/settings/about' },
];

export default function SettingsPanel() {
  const navigate = useNavigate();
  const store = useStore();

  const getToggleValue = (key: string): boolean => {
    switch (key) {
      case 'autoConnect': return store.autoConnect;
      case 'aiRouting': return store.aiRouting;
      case 'smartRotation': return store.smartRotation;
      case 'notifications': return store.notifications;
      default: return false;
    }
  };

  const toggleValue = (key: string) => {
    switch (key) {
      case 'autoConnect': store.setAutoConnect(!store.autoConnect); break;
      case 'aiRouting': store.setAiRouting(!store.aiRouting); break;
      case 'smartRotation': store.setSmartRotation(!store.smartRotation); break;
      case 'notifications': store.setNotifications(!store.notifications); break;
    }
  };

  return (
    <div className="px-1 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        ⚙ Настройки
      </motion.h1>

      <div className="flex flex-col gap-2.5">
        {settings.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300 }}
            onClick={() => {
              if (item.type === 'link' && item.route) navigate(item.route);
            }}
            className="glass p-4 flex items-center gap-3.5 cursor-pointer"
            style={{ cursor: item.type === 'link' ? 'pointer' : 'default' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}
            >
              <item.icon size={20} style={{ color: 'var(--primary)' }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>

            {item.type === 'toggle' ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); toggleValue(item.stateKey!); }}
                className="w-12 h-6 rounded-full relative cursor-pointer border-none flex-shrink-0"
                style={{
                  background: getToggleValue(item.stateKey!) ? 'var(--primary)' : 'var(--card-border)',
                  transition: 'background 0.3s ease',
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full absolute top-0.5"
                  style={{ background: '#fff' }}
                  animate={{ x: getToggleValue(item.stateKey!) ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            ) : (
              <ChevronRight size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
