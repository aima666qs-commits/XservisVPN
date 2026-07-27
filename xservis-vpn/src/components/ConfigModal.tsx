import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface ConfigModalProps {
  open: boolean;
  onClose: () => void;
}

type ConfigTab = 'json' | 'vless' | 'hysteria2' | 'link';

const FREE_PORTS = [10809, 20808, 30808, 10810, 20809, 10811, 40808, 50808];

export default function ConfigModal({ open, onClose }: ConfigModalProps) {
  const { currentServer, currentSni, currentPort, currentProtocol } = useStore();
  const [tab, setTab] = useState<ConfigTab>('json');

  // Авто-подхват порта из PortErrorAlert
  const savedPort = parseInt(localStorage.getItem('xservis_local_port') || '10809');
  const [localPort, setLocalPort] = useState(savedPort);

  // Слушаем событие от PortErrorAlert
  useEffect(() => {
    const handler1 = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.port) {
        setLocalPort(detail.port);
        localStorage.setItem('xservis_local_port', String(detail.port));
      }
    };
    const handler2 = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.port) {
        setLocalPort(detail.port);
        localStorage.setItem('xservis_local_port', String(detail.port));
      }
    };
    window.addEventListener('xservis-port-found', handler1);
    window.addEventListener('xservis-apply-port', handler2);
    return () => {
      window.removeEventListener('xservis-port-found', handler1);
      window.removeEventListener('xservis-apply-port', handler2);
    };
  }, []);

  const getConfig = (type: ConfigTab): string => {
    if (!currentServer) return '// Нет активного сервера';
    const cfg = JSON.parse(JSON.stringify(currentServer.config));

    if (type === 'json') {
      const raw = JSON.stringify(cfg, null, 2);
      return raw;
    }

    switch (type) {
      case 'vless': {
        const params = new URLSearchParams({
          type: cfg.network || 'tcp',
          security: cfg.security || 'reality',
          pbk: cfg.realitySettings?.publicKey || '',
          sid: cfg.realitySettings?.shortId || '',
          spx: cfg.realitySettings?.spiderX || '/',
          s: cfg.realitySettings?.serverName || currentSni,
          fp: cfg.realitySettings?.fingerprint || 'chrome',
          flow: cfg.flow || 'xtls-rprx-vision',
          sni: currentSni,
        });
        if (cfg.grpcSettings?.serviceName) params.set('serviceName', cfg.grpcSettings.serviceName);
        return `vless://${cfg.id}@${cfg.address}:${currentPort}?${params.toString()}#${currentServer.flag} ${currentServer.name}`;
      }

      case 'hysteria2': {
        if (currentProtocol === 'hysteria2') {
          return `hysteria2://${cfg.auth || 'auth'}@${cfg.address}:${cfg.port}?alpn=h3&insecure=0#${currentServer.flag} ${currentServer.name}`;
        }
        return '// Hysteria 2 не активен. Переключи протокол.';
      }

      case 'link':
        return `https://vp.vpnfreedom.tech/sub/508b36c8-3389-4358-8046-1531ce5ff4c0`;

      default:
        return '';
    }
  };

  const copyConfig = () => {
    const text = getConfig(tab);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Show toast
      });
    }
  };

  const openInApp = (platform: 'ios' | 'android') => {
    const configLink = getConfig('vless');
    copyConfig();

    const schemes = platform === 'ios'
      ? [`v2raytun://import/${encodeURIComponent(configLink)}`, `shadowrocket://import/${encodeURIComponent(configLink)}`]
      : [`intent://import/${encodeURIComponent(configLink)}#Intent;package=com.v2ray.ang;end`, `v2rayng://import/${encodeURIComponent(configLink)}`];

    const tryOpen = (i: number) => {
      if (i >= schemes.length) {
        window.open(platform === 'ios' ? 'https://apps.apple.com/app/v2raytun/id6476628951' : 'https://play.google.com/store/apps/details?id=com.v2ray.ang', '_blank');
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = schemes[i];
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
        tryOpen(i + 1);
      }, 500);
    };
    tryOpen(0);
  };

  const tabs: { id: ConfigTab; label: string }[] = [
    { id: 'json', label: '📄 JSON' },
    { id: 'vless', label: '🔑 VLESS' },
    { id: 'hysteria2', label: '⚡ Hysteria2' },
    { id: 'link', label: '🔗 Ссылка' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass w-full max-w-sm p-5"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
          >
      {/* Auto port status */}
      <div
        className="rounded-xl p-3 mb-4 flex items-center gap-3"
        style={{ background: localPort !== 10809 ? 'rgba(0,230,118,0.06)' : 'rgba(255,145,0,0.06)', border: `1px solid ${localPort !== 10809 ? 'rgba(0,230,118,0.15)' : 'rgba(255,145,0,0.15)'}` }}
      >
        <span className="text-sm">{localPort !== 10809 ? '✅' : '🔌'}</span>
        <div className="flex-1">
          <div className="text-xs font-semibold" style={{ color: localPort !== 10809 ? 'var(--success)' : 'var(--text)' }}>
            {localPort !== 10809 ? `Порт ${localPort} свободен` : 'Локальный порт SOCKS'}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {localPort !== 10809
              ? `Порт 10808 был занят — автоматически выбран ${localPort}`
              : 'Автоматически выберу свободный'}
          </div>
        </div>
      </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">📋 Конфигурация</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer border-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
              >
                ✕
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {tabs.map(t => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTab(t.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-none"
                  style={{
                    background: tab === t.id ? 'var(--primary)' : 'var(--surface)',
                    color: tab === t.id ? '#000' : 'var(--text-secondary)',
                    border: tab === t.id ? 'none' : '1px solid var(--card-border)',
                  }}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>

            {/* Config content */}
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl p-4 overflow-x-auto"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--card-border)',
                maxHeight: '40vh',
                overflowY: 'auto',
              }}
            >
              <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all font-mono" style={{ color: 'var(--text-secondary)' }}>
                {getConfig(tab)}
              </pre>
            </motion.div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5 mt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={copyConfig}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                📋 Скопировать
              </motion.button>

              <div className="flex gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openInApp('ios')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
                  style={{ background: 'linear-gradient(135deg, #007aff, #0055cc)' }}
                >
                  🍎 iOS
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openInApp('android')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
                  style={{ background: 'linear-gradient(135deg, #34a853, #1b8a4a)' }}
                >
                  🤖 Android
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
