import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { aiRecommend, simulatePing, simulateSpeed } from '../types/ai';

export default function ConnectButton() {
  const {
    isConnected, isConnecting, setConnected, setConnecting,
    setServer, setSni, setPort, setProtocol, updateStats, currentServer,
  } = useStore();

  const handleConnect = async () => {
    if (isConnected) {
      setConnected(false);
      setServer({} as any);
      updateStats({ connectedAt: null });
      return;
    }

    setConnecting(true);

    // Simulate AI scan + connect sequence
    const steps = [
      { delay: 600, action: () => {} },
      { delay: 800, action: () => {} },
      { delay: 700, action: () => {} },
      { delay: 1000, action: () => {
        const rec = aiRecommend();
        setServer(rec.server);
        setSni(rec.sni);
        setPort(rec.port);
        setProtocol(rec.protocol);
      }},
      { delay: 500, action: () => {
        setConnected(true);
        setConnecting(false);
        updateStats({
          ping: simulatePing(),
          speed: simulateSpeed(),
          connectedAt: Date.now(),
          upload: Math.random() * 5,
          download: Math.random() * 50,
          trafficUsed: '0 MB',
        });
      }},
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      step.action();
    }
  };

  const ringVariants = {
    idle: {
      borderColor: 'var(--card-border)',
      boxShadow: '0 0 0px rgba(21,216,234,0)',
    },
    connecting: {
      borderColor: ['var(--card-border)', 'var(--primary)', 'var(--card-border)'],
      boxShadow: [
        '0 0 0px rgba(21,216,234,0)',
        '0 0 40px rgba(21,216,234,0.3)',
        '0 0 0px rgba(21,216,234,0)',
      ],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    connected: {
      borderColor: 'var(--success)',
      boxShadow: '0 0 50px rgba(0,230,118,0.25)',
    },
  };

  const buttonVariants = {
    idle: {
      background: 'linear-gradient(135deg, #15D8EA, #2E8BFF)',
      boxShadow: '0 4px 20px rgba(21,216,234,0.2)',
    },
    connecting: {
      background: ['linear-gradient(135deg, #15D8EA, #2E8BFF)', 'linear-gradient(135deg, #FF9100, #FF6D00)'],
      boxShadow: [
        '0 4px 20px rgba(21,216,234,0.2)',
        '0 4px 30px rgba(255,145,0,0.3)',
      ],
      transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
    },
    connected: {
      background: 'linear-gradient(135deg, #00E676, #00C853)',
      boxShadow: '0 4px 30px rgba(0,230,118,0.3)',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 170, height: 170 }}
        animate="visible"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid var(--card-border)' }}
          variants={ringVariants}
          animate={isConnected ? 'connected' : isConnecting ? 'connecting' : 'idle'}
        />

        <motion.button
          onClick={handleConnect}
          disabled={isConnecting && !isConnected}
          className="relative z-10 rounded-full flex flex-col items-center justify-center text-white font-bold border-none cursor-pointer"
          style={{ width: 130, height: 130 }}
          variants={buttonVariants}
          animate={isConnected ? 'connected' : isConnecting ? 'connecting' : 'idle'}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <AnimatePresence mode="wait">
            {isConnecting && !isConnected ? (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-xs">Сканирую...</span>
              </motion.div>
            ) : isConnected ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.span
                  className="text-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🟢
                </motion.span>
                <span className="text-xs font-medium">Подключено</span>
              </motion.div>
            ) : (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.span
                  className="text-3xl"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🌐
                </motion.span>
                <span className="text-xs">Подключиться</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  );
}
