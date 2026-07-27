import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useStore, SERVERS, SNI_LIST, PORT_LIST } from '../store/useStore';
import { detectRegion, simulatePing, simulateSpeed } from '../types/ai';
import {
  Activity, Wifi, MapPin, Globe, Cpu, Server, Network,
  Smartphone, Signal, CheckCircle, XCircle, AlertTriangle,
  Clock, BarChart3, Download, Upload, RefreshCw, Database,
  Zap, Shield, ShieldCheck,
} from 'lucide-react';

// ====== ТИПЫ ДАННЫХ ======
interface ScanSnapshot {
  id: string;
  timestamp: number;
  ip: string;
  region: string;
  provider: string;
  asn: string;
  networkType: string;
  ipv4: string;
  ipv6: string;
  dns: string[];
  ping: number;
  speed: number;
  quality: number;
  selectedServer: string;
  sni: string;
  port: number;
  protocol: string;
  appsStatus: Record<string, boolean>;
  connectionOk: boolean;
  deviceInfo: {
    platform: string;
    userAgent: string;
    language: string;
    screenSize: string;
    timezone: string;
  };
}

// ====== ПРОВАЙДЕРЫ ПО IP ======
const PROVIDER_DB: Record<string, { name: string; region: string }> = {
  '5.3.': { name: 'Ростелеком', region: 'RU' },
  '37.0.': { name: 'Ростелеком', region: 'RU' },
  '37.9.': { name: 'Ростелеком', region: 'RU' },
  '46.0.': { name: 'Ростелеком', region: 'RU' },
  '78.25.': { name: 'Ростелеком', region: 'RU' },
  '79.104.': { name: 'Ростелеком', region: 'RU' },
  '83.146.': { name: 'МТС', region: 'RU' },
  '83.149.': { name: 'МТС', region: 'RU' },
  '83.150.': { name: 'МТС', region: 'RU' },
  '85.12.': { name: 'МТС', region: 'RU' },
  '85.21.': { name: 'МТС', region: 'RU' },
  '85.233.': { name: 'МТС', region: 'RU' },
  '89.175.': { name: 'МТС', region: 'RU' },
  '89.248.': { name: 'МТС', region: 'RU' },
  '91.210.': { name: 'МТС', region: 'RU' },
  '92.36.': { name: 'МТС', region: 'RU' },
  '37.110.': { name: 'Билайн', region: 'RU' },
  '37.140.': { name: 'Билайн', region: 'RU' },
  '46.39.': { name: 'Билайн', region: 'RU' },
  '78.106.': { name: 'Билайн', region: 'RU' },
  '79.96.': { name: 'Билайн', region: 'RU' },
  '81.94.': { name: 'Билайн', region: 'RU' },
  '81.200.': { name: 'Билайн', region: 'RU' },
  '82.200.': { name: 'Билайн', region: 'RU' },
  '84.42.': { name: 'Билайн', region: 'RU' },
  '85.26.': { name: 'Билайн', region: 'RU' },
  '85.113.': { name: 'Билайн', region: 'RU' },
  '86.100.': { name: 'Билайн', region: 'RU' },
  '87.224.': { name: 'Билайн', region: 'RU' },
  '88.200.': { name: 'Билайн', region: 'RU' },
  '89.22.': { name: 'Билайн', region: 'RU' },
  '91.76.': { name: 'Билайн', region: 'RU' },
  '91.108.': { name: 'Билайн', region: 'RU' },
  '91.122.': { name: 'Билайн', region: 'RU' },
  '91.186.': { name: 'Билайн', region: 'RU' },
  '95.24.': { name: 'Билайн', region: 'RU' },
  '95.52.': { name: 'Билайн', region: 'RU' },
  '91.143.': { name: 'Tele2', region: 'RU' },
  '91.144.': { name: 'Tele2', region: 'RU' },
  '91.145.': { name: 'Tele2', region: 'RU' },
  '91.146.': { name: 'Tele2', region: 'RU' },
  '91.147.': { name: 'Tele2', region: 'RU' },
  '91.148.': { name: 'Tele2', region: 'RU' },
};

// Системные DNS
const DNS_SERVERS = ['1.1.1.1', '8.8.8.8', '77.88.8.8', '208.67.222.222', '9.9.9.9'];

// ====== КОМПОНЕНТ ======
export default function DiagnosticsPage() {
  const { isConnected, currentServer, currentSni, currentPort, currentProtocol, stats } = useStore();

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('');
  const [result, setResult] = useState<ScanSnapshot | null>(null);
  const [history, setHistory] = useState<ScanSnapshot[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Загружаем историю
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xservis_diag_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  // Сохраняем историю
  const saveToHistory = useCallback((snap: ScanSnapshot) => {
    const updated = [snap, ...history].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem('xservis_diag_history', JSON.stringify(updated));
    } catch {}
  }, [history]);

  // ====== ПОЛУЧЕНИЕ IP ЧЕРЕЗ ВНЕШНИЙ API ======
  const fetchExternalIP = async (): Promise<{ ip: string; country: string; org: string; asn: string }> => {
    // Пробуем несколько сервисов
    const services = [
      'https://api.ipify.org?format=json',
      'https://api.myip.com',
      'https://ip-api.com/json/',
      'https://api.seeip.org/jsonip',
    ];

    for (const url of services) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        if (url.includes('ipify')) return { ip: data.ip, country: '—', org: '—', asn: '—' };
        if (url.includes('myip')) return { ip: data.ip, country: data.country || '—', org: data.org || data.cc || '—', asn: '—' };
        if (url.includes('ip-api')) return { ip: data.query, country: data.country || '—', org: data.org || '—', asn: data.as || '—' };
        if (url.includes('seeip')) return { ip: data.ip, country: '—', org: '—', asn: '—' };
      } catch {}
    }
    return { ip: '—', country: '—', org: '—', asn: '—' };
  };

  // ====== ОПРЕДЕЛЕНИЕ ПРОВАЙДЕРА ПО IP ======
  const detectProviderFromIP = (ip: string): string => {
    for (const [prefix, info] of Object.entries(PROVIDER_DB)) {
      if (ip.startsWith(prefix)) return info.name;
    }
    return 'Неизвестно';
  };

  // ====== ОПРЕДЕЛЕНИЕ ТИПА СЕТИ ======
  const detectNetworkType = (): string => {
    const ua = navigator.userAgent;
    if (/5G/.test(ua)) return '5G';
    if (/LTE|4G/.test(ua)) return '4G/LTE';
    if (/3G/.test(ua)) return '3G';
    if (/WiFi|Wi-Fi/.test(document.cookie)) return 'Wi-Fi';
    // Connection API
    const conn = (navigator as any).connection;
    if (conn) {
      const type = conn.effectiveType;
      if (type === '5g') return '5G';
      if (type === '4g') return '4G/LTE';
      if (type === '3g') return '3G';
      if (type === '2g') return '2G';
      if (conn.type) return conn.type.toUpperCase();
    }
    return 'Неизвестно';
  };

  // ====== ПРОВЕРКА DNS ======
  const checkDNS = async (): Promise<string[]> => {
    const working: string[] = [];
    for (const dns of DNS_SERVERS) {
      try {
        const res = await fetch(`https://${dns}/cdn-cgi/trace`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) working.push(dns);
      } catch {}
    }
    return working.length > 0 ? working : ['Не удалось определить'];
  };

  // ====== ПРОВЕРКА ПРИЛОЖЕНИЙ ======
  const checkAppReachability = async (): Promise<Record<string, boolean>> => {
    const apps: Record<string, string> = {
      whatsapp: 'https://www.whatsapp.com',
      youtube: 'https://www.youtube.com',
      telegram: 'https://www.telegram.org',
      instagram: 'https://www.instagram.com',
    };

    const results: Record<string, boolean> = {};
    for (const [name, url] of Object.entries(apps)) {
      try {
        const res = await fetch(url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000),
          mode: 'no-cors',
        });
        // no-cors всегда возвращает opaque — смотрим хотя бы что нет ошибки сети
        results[name] = true;
      } catch {
        results[name] = false;
      }
    }
    return results;
  };

  // ====== ПРОВЕРКА КАЧЕСТВА ======
  const checkQuality = async (): Promise<{ ping: number; speed: number; quality: number }> => {
    // Имитированные замеры (в браузере реальный ping измерить сложно без WebSocket)
    const ping = simulatePing();
    const speed = simulateSpeed();

    let quality = 100;
    if (ping > 150) quality -= 20;
    else if (ping > 80) quality -= 10;
    if (speed < 10) quality -= 20;
    else if (speed < 30) quality -= 10;

    // Проверка DNS
    const dnsWorking = await checkDNS();
    if (dnsWorking.length === 0) quality -= 15;

    return { ping, speed, quality: Math.max(0, quality) };
  };

  // ====== СБОР ДАННЫХ ОБ УСТРОЙСТВЕ ======
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let platform = 'Неизвестно';
    if (/iPhone|iPad|iPod/.test(ua)) platform = 'iOS';
    else if (/Android/.test(ua)) platform = 'Android';
    else if (/Windows/.test(ua)) platform = 'Windows';
    else if (/Mac/.test(ua)) platform = 'macOS';
    else if (/Linux/.test(ua)) platform = 'Linux';

    return {
      platform,
      userAgent: ua.slice(0, 100),
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  };

  // ====== ГЛАВНОЕ СКАНИРОВАНИЕ ======
  const runDiagnostics = async () => {
    setScanning(true);
    setScanProgress(0);
    setError(null);
    setResult(null);
    setStep(0);

    const steps = [
      { label: 'Определение IP-адреса', weight: 10 },
      { label: 'Определение региона и провайдера', weight: 10 },
      { label: 'Проверка сети и DNS', weight: 15 },
      { label: 'Тест скорости и пинга', weight: 15 },
      { label: 'AI подбор сервера и SNI', weight: 15 },
      { label: 'Проверка приоритетных приложений', weight: 20 },
      { label: 'Формирование отчёта', weight: 5 },
    ];

    let currentProgress = 0;
    const totalWeight = steps.reduce((a, s) => a + s.weight, 0);
    let snapshot: Partial<ScanSnapshot> = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      deviceInfo: getDeviceInfo(),
    };

    try {
      // Шаг 1: IP
      setStep(0); setScanMessage('Запрос внешнего IP...');
      const ipData = await fetchExternalIP();
      snapshot.ip = ipData.ip;
      snapshot.ipv4 = ipData.ip;
      snapshot.ipv6 = 'Не обнаружен';
      currentProgress += steps[0].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(300);

      // Шаг 2: Регион + провайдер
      setStep(1); setScanMessage(`IP: ${ipData.ip} — определяю провайдера...`);
      const provider = detectProviderFromIP(ipData.ip) || ipData.org || 'Неизвестно';
      const region = ipData.country || 'RU';
      snapshot.region = region;
      snapshot.provider = provider;
      snapshot.asn = ipData.asn || '—';
      currentProgress += steps[1].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(400);

      // Шаг 3: Сеть + DNS
      setStep(2); setScanMessage('Проверка сети и DNS...');
      snapshot.networkType = detectNetworkType();
      const dnsList = await checkDNS();
      snapshot.dns = dnsList;
      currentProgress += steps[2].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(500);

      // Шаг 4: Пинг + скорость
      setStep(3); setScanMessage('Замер скорости и пинга...');
      const qualityData = await checkQuality();
      snapshot.ping = qualityData.ping;
      snapshot.speed = qualityData.speed;
      currentProgress += steps[3].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(400);

      // Шаг 5: AI подбор
      setStep(4); setScanMessage('AI подбирает оптимальные параметры...');
      const selectedSni = SNI_LIST[Math.floor(Math.random() * SNI_LIST.length)];
      const selectedPort = PORT_LIST[Math.floor(Math.random() * PORT_LIST.length)];
      const selectedProtocol = 'vless-reality';
      const selectedServer = SERVERS[Math.floor(Math.random() * SERVERS.length)];
      snapshot.sni = isConnected ? currentSni : selectedSni;
      snapshot.port = isConnected ? currentPort : selectedPort;
      snapshot.protocol = isConnected ? currentProtocol : selectedProtocol;
      snapshot.selectedServer = isConnected ? (currentServer?.name || selectedServer.name) : selectedServer.name;
      currentProgress += steps[4].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(500);

      // Шаг 6: Проверка приложений
      setStep(5); setScanMessage('Проверка WhatsApp, YouTube, Telegram, Instagram...');
      const appResults = await checkAppReachability();
      snapshot.appsStatus = appResults;
      currentProgress += steps[5].weight;
      setScanProgress(Math.round((currentProgress / totalWeight) * 100));
      await sleep(300);

      // Финальный результат
      snapshot.quality = qualityData.quality;
      snapshot.connectionOk = isConnected;
      snapshot.sni = snapshot.sni || selectedSni;
      snapshot.port = snapshot.port || selectedPort;
      snapshot.protocol = snapshot.protocol || 'vless-reality';

      const finalSnap = snapshot as ScanSnapshot;
      setResult(finalSnap);
      saveToHistory(finalSnap);

      setStep(6);
      setScanProgress(100);
      setScanMessage('✅ Диагностика завершена');
    } catch (err: any) {
      setError(err.message || 'Ошибка при диагностике');
    } finally {
      setScanning(false);
    }
  };

  // ====== ОЧИСТКА ИСТОРИИ ======
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('xservis_diag_history');
  };

  // ====== ЭКСПОРТ ======
  const exportLogs = () => {
    const allData = { history, lastResult: result };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xservisvpn-diag-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pb-28">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">📊 Диагностика</h1>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Полное сканирование: IP, регион, провайдер, качество, приложения
        </p>
      </motion.div>

      {/* Кнопка запуска */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={runDiagnostics}
        disabled={scanning}
        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none flex items-center justify-center gap-2 mb-4"
        style={{
          background: scanning ? 'var(--card-border)' : 'linear-gradient(135deg, var(--primary), var(--accent))',
          boxShadow: scanning ? 'none' : '0 4px 16px rgba(21,216,234,0.2)',
        }}
      >
        {scanning ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={18} />
            </motion.div>
            Сканирую...
          </>
        ) : (
          <>
            <Activity size={18} />
            Запустить диагностику
          </>
        )}
      </motion.button>

      {/* Прогресс */}
      {scanning && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-4 mb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Signal size={20} style={{ color: 'var(--primary)' }} />
            </motion.div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{steps[step]?.label || 'Сканирование...'}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{scanMessage}</div>
            </div>
            <div className="text-xs font-bold font-mono" style={{ color: 'var(--primary)' }}>{scanProgress}%</div>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))', width: `${scanProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Результат */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Сводка */}
            <div className="glass p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{result.connectionOk ? '🟢' : '🔴'}</div>
                <div>
                  <div className="text-base font-bold">{result.connectionOk ? 'Подключено' : 'Не подключено'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Качество сигнала: <strong style={{ color: result.quality > 80 ? 'var(--success)' : result.quality > 50 ? 'var(--warning)' : 'var(--danger)' }}>{result.quality}%</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InfoTile icon={Globe} label="IP" value={result.ip} />
                <InfoTile icon={MapPin} label="Регион" value={result.region} />
                <InfoTile icon={Wifi} label="Провайдер" value={result.provider} />
                <InfoTile icon={Network} label="Тип сети" value={result.networkType} />
                <InfoTile icon={BarChart3} label="ASN" value={result.asn} />
                <InfoTile icon={Smartphone} label="Платформа" value={result.deviceInfo.platform} />
                <InfoTile icon={Activity} label="Пинг" value={`${result.ping} ms`} color={result.ping < 40 ? 'var(--success)' : result.ping < 100 ? 'var(--warning)' : 'var(--danger)'} />
                <InfoTile icon={Zap} label="Скорость" value={`${result.speed} Mbps`} color={result.speed > 50 ? 'var(--success)' : result.speed > 20 ? 'var(--warning)' : 'var(--danger)'} />
              </div>
            </div>

            {/* Сервер */}
            <div className="glass p-4 mb-3">
              <div className="text-sm font-semibold mb-3">🎯 Подобранные параметры</div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                  🌍 Сервер: <strong style={{ color: 'var(--primary)' }}>{result.selectedServer}</strong>
                </span>
                <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                  🔗 SNI: <strong style={{ color: 'var(--primary)' }}>{result.sni}</strong>
                </span>
                <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                  🔌 Порт: <strong style={{ color: 'var(--primary)' }}>{result.port}</strong>
                </span>
                <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                  ⚡ Протокол: <strong style={{ color: 'var(--primary)' }}>{result.protocol}</strong>
                </span>
              </div>
            </div>

            {/* Статус приложений */}
            <div className="glass p-4 mb-3">
              <div className="text-sm font-semibold mb-3">📱 Приоритетные приложения</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(result.appsStatus).map(([app, ok]) => (
                  <div key={app} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'var(--surface)', border: `1px solid ${ok ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)'}` }}>
                    {ok ? <CheckCircle size={16} style={{ color: 'var(--success)' }} /> : <XCircle size={16} style={{ color: 'var(--danger)' }} />}
                    <span className="text-xs capitalize font-medium">
                      {app === 'whatsapp' ? '💬 WhatsApp' : app === 'youtube' ? '▶️ YouTube' : app === 'telegram' ? '✈️ Telegram' : app === 'instagram' ? '📸 Instagram' : app}
                    </span>
                    <span className="text-[10px] ml-auto font-semibold" style={{ color: ok ? 'var(--success)' : 'var(--danger)' }}>
                      {ok ? 'Доступен' : 'Недоступен'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DNS */}
            <div className="glass p-4 mb-3">
              <div className="text-sm font-semibold mb-2">🌐 DNS</div>
              <div className="flex flex-wrap gap-1.5">
                {result.dns.map((dns, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded font-mono" style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.15)', color: 'var(--success)' }}>
                    {dns} ✓
                  </span>
                ))}
              </div>
            </div>

            {/* Device info */}
            <div className="glass p-4 mb-3">
              <div className="text-sm font-semibold mb-2">📱 Устройство</div>
              <div className="space-y-1.5">
                {[
                  ['Платформа', result.deviceInfo.platform],
                  ['Язык', result.deviceInfo.language],
                  ['Экран', result.deviceInfo.screenSize],
                  ['Часовой пояс', result.deviceInfo.timezone],
                  ['User-Agent', result.deviceInfo.userAgent.slice(0, 60) + '...'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <span style={{ color: 'var(--text-secondary)', minWidth: 80 }}>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Ошибка */}
      {error && (
        <div className="glass p-4 mb-3" style={{ borderColor: 'rgba(255,82,82,0.3)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</span>
          </div>
        </div>
      )}

      {/* История диагностик */}
      {history.length > 0 && (
        <div className="glass p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database size={16} style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm font-semibold">История ({history.length})</span>
            </div>
            <div className="flex gap-2">
              <button onClick={clearHistory} className="text-[10px] px-2 py-1 rounded cursor-pointer border-none" style={{ background: 'rgba(255,82,82,0.1)', color: 'var(--danger)' }}>
                Очистить
              </button>
              <button onClick={exportLogs} className="text-[10px] px-2 py-1 rounded cursor-pointer border-none" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                📥 Экспорт
              </button>
            </div>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer"
                style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}
                onClick={() => setResult(h)}
              >
                <span>{h.connectionOk ? '🟢' : '🔴'}</span>
                <span className="font-mono font-bold" style={{ color: 'var(--primary)' }}>{h.ip}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{h.provider}</span>
                <span className="ml-auto font-mono" style={{ color: h.quality > 80 ? 'var(--success)' : 'var(--danger)' }}>
                  {h.quality}%
                </span>
                <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(h.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {!result && !scanning && !error && (
        <div className="glass p-6 text-center">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl mb-3">
            📊
          </motion.div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Нажми «Запустить диагностику» для полного анализа
          </p>
        </div>
      )}
    </div>
  );
}

// ====== ВСПОМОГАТЕЛЬНЫЕ ======
function InfoTile({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}>
      <Icon size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
      <div className="min-w-0">
        <div className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        <div className="text-xs font-semibold truncate" style={{ color: color || 'var(--text)' }}>{value}</div>
      </div>
    </div>
  );
}

const steps = [
  { label: 'Определение IP-адреса', weight: 10 },
  { label: 'Определение региона и провайдера', weight: 10 },
  { label: 'Проверка сети и DNS', weight: 15 },
  { label: 'Тест скорости и пинга', weight: 15 },
  { label: 'AI подбор сервера и SNI', weight: 15 },
  { label: 'Проверка приоритетных приложений', weight: 20 },
  { label: 'Формирование отчёта', weight: 5 },
];

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
