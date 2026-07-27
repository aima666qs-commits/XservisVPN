import { motion } from 'framer-motion';
import { useState } from 'react';
import ConnectButton from '../components/ConnectButton';
import ScanSteps from '../components/ScanSteps';
import StatsCard from '../components/StatsCard';
import ServerCard from '../components/ServerCard';
import ConfigModal from '../components/ConfigModal';
import PortErrorAlert from '../components/PortErrorAlert';

export default function Home() {
  const [showConfig, setShowConfig] = useState(false);
  const [showPortHelp, setShowPortHelp] = useState(false);

  return (
    <div className="px-4 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex items-center justify-between py-4 mb-2"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 4px 16px rgba(21,216,234,0.25)' }}
            animate={{ boxShadow: ['0 4px 16px rgba(21,216,234,0.25)', '0 4px 24px rgba(21,216,234,0.4)', '0 4px 16px rgba(21,216,234,0.25)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            X
          </motion.div>
          <div>
            <span className="text-lg font-extrabold tracking-tight">Xservis</span>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--primary)' }}>VPN</span>
          </div>
        </div>
        <div
          className="text-xs font-semibold px-3.5 py-1.5 rounded-full"
          style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.15)', color: 'var(--success)' }}
        >
          ● AI Active
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 250, damping: 20 }}
        className="text-[32px] font-extrabold leading-tight mt-2 mb-1"
      >
        VPN который
        <br />
        <span className="gradient-text">подбирается под тебя</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm leading-relaxed mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        AI автоматически подбирает лучший сервер, маршрут, SNI, транспорт и порт.
      </motion.p>

      {/* Port Error Alert */}
      <PortErrorAlert
        open={showPortHelp}
        onClose={() => setShowPortHelp(false)}
        onOpen={() => setShowPortHelp(true)}
      />

      {/* Connect Button */}
      <ConnectButton />

      {/* Scan Steps */}
      <ScanSteps />

      {/* Stats */}
      <StatsCard />

      {/* Server Card */}
      <ServerCard onShowConfig={() => setShowConfig(true)} onPortHelp={() => setShowPortHelp(true)} />

      {/* Config Modal */}
      <ConfigModal open={showConfig} onClose={() => setShowConfig(false)} />
    </div>
  );
}
