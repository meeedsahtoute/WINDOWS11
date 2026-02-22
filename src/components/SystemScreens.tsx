import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useKernel } from '../KernelContext.tsx';
import { Loader2, Power, User } from 'lucide-react';

export const BootScreen: React.FC = () => {
  const { boot } = useKernel();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(boot, 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [boot]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[10000]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)]">
          <span className="text-white font-bold text-4xl italic">A</span>
        </div>
      </motion.div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-mono">
        Kernel Initialization...
      </span>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
  const { login } = useKernel();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => login('Aura User'), 1000);
  };

  return (
    <div className="fixed inset-0 bg-[url('https://picsum.photos/id/10/1920/1080')] bg-cover bg-center flex items-center justify-center z-[9000]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center mb-6 shadow-2xl">
          <User size={64} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-light text-white mb-8 drop-shadow-lg">Aura User</h1>
        
        {isLoggingIn ? (
          <Loader2 className="text-white animate-spin" size={32} />
        ) : (
          <button
            onClick={handleLogin}
            className="px-12 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white font-medium transition-all active:scale-95"
          >
            Sign In
          </button>
        )}
      </motion.div>

      <div className="absolute bottom-8 right-8 flex gap-6">
        <button className="text-white/80 hover:text-white transition-colors">
          <Power size={24} />
        </button>
      </div>
    </div>
  );
};
