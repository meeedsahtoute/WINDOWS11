import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKernel } from '../KernelContext.tsx';
import { Search, LayoutGrid, Settings, Terminal as TerminalIcon, Folder, Monitor, Power, User } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const { state, launchApp, focusWindow } = useKernel();
  const [isStartOpen, setIsStartOpen] = useState(false);

  const pinnedApps = [
    { name: 'File Explorer', component: 'FileExplorer', icon: <Folder className="text-amber-500" /> },
    { name: 'Terminal', component: 'Terminal', icon: <TerminalIcon className="text-slate-700" /> },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/70 backdrop-blur-2xl border-t border-white/20 flex items-center justify-center z-[9999]">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={`p-2 rounded-md transition-all hover:bg-white/50 active:scale-90 ${isStartOpen ? 'bg-white/50' : ''}`}
        >
          <LayoutGrid size={24} className="text-blue-600" fill="currentColor" />
        </button>

        <button className="p-2 rounded-md transition-all hover:bg-white/50 active:scale-90">
          <Search size={20} className="text-slate-700" />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {pinnedApps.map(app => (
          <button
            key={app.name}
            onClick={() => launchApp(app.name, app.component, app.name)}
            className="p-2 rounded-md transition-all hover:bg-white/50 active:scale-90 group relative"
          >
            {app.icon}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100" />
          </button>
        ))}

        {state.windows.map(win => (
          <button
            key={win.id}
            onClick={() => focusWindow(win.id)}
            className={`p-2 rounded-md transition-all hover:bg-white/50 active:scale-90 relative ${state.activeWindowId === win.id ? 'bg-white/50' : ''}`}
          >
            <Monitor size={20} className="text-blue-500" />
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-blue-600 rounded-full transition-all ${state.activeWindowId === win.id ? 'w-4' : 'opacity-50'}`} />
          </button>
        ))}
      </div>

      {/* System Tray (Simplified) */}
      <div className="absolute right-4 flex items-center gap-4 text-xs font-medium text-slate-700">
        <div className="flex flex-col items-end">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartOpen && (
          <StartMenu onClose={() => setIsStartOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const StartMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { launchApp, logout } = useKernel();

  const apps = [
    { name: 'File Explorer', component: 'FileExplorer', icon: <Folder size={32} className="text-amber-500" /> },
    { name: 'Terminal', component: 'Terminal', icon: <TerminalIcon size={32} className="text-slate-700" /> },
    { name: 'Settings', component: 'Settings', icon: <Settings size={32} className="text-slate-500" /> },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[-1]" onClick={onClose} />
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-14 w-[540px] h-[600px] bg-white/80 backdrop-blur-3xl border border-white/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-8 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-900">Pinned</h3>
            <button className="text-xs font-medium text-slate-500 hover:bg-black/5 px-2 py-1 rounded">All apps &gt;</button>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {apps.map(app => (
              <button
                key={app.name}
                onClick={() => { launchApp(app.name, app.component, app.name); onClose(); }}
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  {app.icon}
                </div>
                <span className="text-[11px] text-slate-700 text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-16 bg-black/5 border-t border-black/5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <span className="text-xs font-medium text-slate-700">Aura User</span>
          </div>
          <button onClick={logout} className="p-2 hover:bg-black/5 rounded-md transition-colors">
            <Power size={18} className="text-slate-700" />
          </button>
        </div>
      </motion.div>
    </>
  );
};
