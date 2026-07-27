import { create } from 'zustand';
import { themes, applyTheme } from '../themes/themes';
import type { Theme } from '../themes/themes';

export interface ServerConfig {
  id: string;
  flag: string;
  name: string;
  ip: string;
  port: number;
  protocol: 'vless-reality' | 'hysteria2' | 'grpc' | 'vless-tcp';
  country: string;
  provider?: string;
  config: Record<string, any>;
}

export interface ConnectionStats {
  ping: number;
  speed: number;
  upload: number;
  download: number;
  trafficUsed: string;
  connectedAt: number | null;
}

interface AppState {
  // Connection
  isConnected: boolean;
  isConnecting: boolean;
  currentServer: ServerConfig | null;
  currentSni: string;
  currentPort: number;
  currentProtocol: string;
  stats: ConnectionStats;

  // Theme
  currentTheme: string;
  themeList: Theme[];

  // Settings
  autoConnect: boolean;
  smartRotation: boolean;
  aiRouting: boolean;
  notifications: boolean;
  language: string;

  // Actions
  setConnected: (v: boolean) => void;
  setConnecting: (v: boolean) => void;
  setServer: (s: ServerConfig) => void;
  setSni: (s: string) => void;
  setPort: (p: number) => void;
  setProtocol: (p: string) => void;
  updateStats: (s: Partial<ConnectionStats>) => void;
  setTheme: (id: string) => void;
  setAutoConnect: (v: boolean) => void;
  setSmartRotation: (v: boolean) => void;
  setAiRouting: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setLanguage: (v: string) => void;
  reset: () => void;
}

const initialStats: ConnectionStats = {
  ping: 0,
  speed: 0,
  upload: 0,
  download: 0,
  trafficUsed: '0 MB',
  connectedAt: null,
};

export const useStore = create<AppState>((set) => ({
  isConnected: false,
  isConnecting: false,
  currentServer: null,
  currentSni: 'www.google.com',
  currentPort: 443,
  currentProtocol: 'vless-reality',
  stats: initialStats,
  currentTheme: 'ocean',
  themeList: Object.values(themes),
  autoConnect: false,
  smartRotation: true,
  aiRouting: true,
  notifications: true,
  language: 'ru',

  setConnected: (v) => set({ isConnected: v }),
  setConnecting: (v) => set({ isConnecting: v }),
  setServer: (s) => set({ currentServer: s }),
  setSni: (s) => set({ currentSni: s }),
  setPort: (p) => set({ currentPort: p }),
  setProtocol: (p) => set({ currentProtocol: p }),
  updateStats: (s) => set((state) => ({ stats: { ...state.stats, ...s } })),
  setTheme: (id) => {
    const theme = themes[id];
    if (theme) {
      applyTheme(theme);
      set({ currentTheme: id });
    }
  },
  setAutoConnect: (v) => set({ autoConnect: v }),
  setSmartRotation: (v) => set({ smartRotation: v }),
  setAiRouting: (v) => set({ aiRouting: v }),
  setNotifications: (v) => set({ notifications: v }),
  setLanguage: (v) => set({ language: v }),
  reset: () => set({
    isConnected: false,
    isConnecting: false,
    currentServer: null,
    stats: initialStats,
  }),
}));

// Apply default theme on load
applyTheme(themes.ocean);

export const SNI_LIST = [
  'www.google.com', 'www.cloudflare.com', 'www.microsoft.com',
  'www.apple.com', 'www.amazon.com', 'www.yahoo.com',
  'www.bing.com', 'www.youtube.com', 'github.com',
  'stackoverflow.com', 'www.reddit.com', 'www.wikipedia.org',
];

export const PORT_LIST = [443, 8443, 2096, 2087, 2053, 2083, 465, 993, 995, 5222];

export const SERVERS: ServerConfig[] = [
  {
    id: 'fi-main', flag: '🇫🇮', name: 'fi-main', ip: '148.135.211.19', port: 443,
    protocol: 'vless-reality', country: 'Финляндия',
    config: {
      protocol: 'vless', address: '148.135.211.19', port: 443,
      id: 'a06b7132-43bb-41f0-b751-9a1b071959af', flow: 'xtls-rprx-vision', encryption: 'none',
      network: 'tcp', security: 'reality',
      realitySettings: { serverName: 'www.cloudflare.com', fingerprint: 'chrome', publicKey: 'bJugVmxSK8GtMzxwrMJ1fO7Q1i-Ati0Px2SI80KgdAI', shortId: 'b24ad2fc6edce831' },
    },
  },
  {
    id: 'ru-40443', flag: '🇷🇺', name: 'RU 40443', ip: '77.91.93.217', port: 40443,
    protocol: 'vless-reality', country: 'Россия',
    config: {
      protocol: 'vless', address: '77.91.93.217', port: 40443,
      id: '270472e6-95d6-46d1-a92b-c23410fa4dfa', flow: 'xtls-rprx-vision', encryption: 'none',
      network: 'tcp', security: 'reality',
      realitySettings: { serverName: 'www.cloudflare.com', fingerprint: 'chrome', publicKey: 'F5ubDFZU1s3UYQK_5x-2AazV8ECv9FmvjOFXnsOXz0w', shortId: 'd51143136a97b0e8' },
    },
  },
  {
    id: 'ru-obhod-lte', flag: '🇷🇺', name: 'Обход 2 (LTE)', ip: '51.250.101.253', port: 443,
    protocol: 'vless-reality', country: 'Россия',
    config: {
      protocol: 'vless', address: '51.250.101.253', port: 443,
      id: 'b8a8be72-6a1d-4748-b59a-f19c81335cd1', flow: 'xtls-rprx-vision', encryption: 'none',
      network: 'tcp', security: 'reality',
      realitySettings: { serverName: 'ads.x5.ru', fingerprint: 'chrome', publicKey: 'sJmcpB61sSWubzff0AFv-vhYDar0lymSajeyG0jYpVA' },
    },
  },
  {
    id: 'se-obhod-megafon', flag: '🇸🇪', name: 'Обход 1 (Megafon)', ip: '84.201.154.210', port: 443,
    protocol: 'grpc', country: 'Швеция',
    config: {
      protocol: 'vless', address: '84.201.154.210', port: 443,
      id: 'b8a8be72-6a1d-4748-b59a-f19c81335cd1', encryption: 'none', flow: '',
      network: 'grpc', security: 'reality',
      grpcSettings: { serviceName: 'EventStreamService', authority: '', mode: true },
      realitySettings: { serverName: 'ads.x5.ru', publicKey: '7M74I50v50xdqLbSKZgcb_NtxP-owuiUNDjFJeHR8Rk', shortId: 'dcce1059e118666e', spiderX: '/', fingerprint: 'chrome' },
    },
  },
  {
    id: 'de-obhod-lte', flag: '🇩🇪', name: 'NEW Обход 2 (LTE)', ip: '91.240.87.0', port: 443,
    protocol: 'grpc', country: 'Германия',
    config: {
      protocol: 'vless', address: '91.240.87.0', port: 443,
      id: 'b8a8be72-6a1d-4748-b59a-f19c81335cd1', encryption: 'none', flow: '',
      network: 'grpc', security: 'reality',
      grpcSettings: { serviceName: 'EventStreamService', authority: '', mode: true },
      realitySettings: { serverName: 'ads.x5.ru', publicKey: 'jCbf1tqO8HAF9Qdr_67cEcCBHwV4lu5u2jhZZpLE3lo', shortId: 'ffbe35a334761d49', spiderX: '/', fingerprint: 'chrome' },
    },
  },
  {
    id: 'ru-hysteria-1', flag: '🇷🇺', name: 'Hysteria YouTube', ip: 'srv-17e124.21freedom.net', port: 11592,
    protocol: 'hysteria2', country: 'Россия',
    config: {
      protocol: 'hysteria', version: 2, address: 'srv-17e124.21freedom.net', port: 11592,
      auth: '4f90e77a5a', network: 'hysteria', security: 'tls',
      tlsSettings: { serverName: 'srv-17e124.21freedom.net', alpn: ['h3'], fingerprint: 'chrome' },
    },
  },
  {
    id: 'ru-hysteria-2', flag: '🇷🇺', name: 'Hysteria 2', ip: 'srv-0dc9de.21freedom.net', port: 11592,
    protocol: 'hysteria2', country: 'Россия',
    config: {
      protocol: 'hysteria', version: 2, address: 'srv-0dc9de.21freedom.net', port: 11592,
      auth: '374719a289', network: 'hysteria', security: 'tls',
      tlsSettings: { serverName: 'srv-0dc9de.21freedom.net', alpn: ['h3'], fingerprint: 'chrome' },
    },
  },
];
