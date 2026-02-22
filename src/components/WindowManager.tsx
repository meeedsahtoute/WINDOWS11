import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKernel } from '../KernelContext.tsx';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { FileExplorer } from './apps/FileExplorer.tsx';
import { Terminal } from './apps/Terminal.tsx';
import { Settings } from './apps/Settings.tsx';

const APP_COMPONENTS: Record<string, React.FC> = {
  FileExplorer,
  Terminal,
  Settings,
};

export const WindowManager: React.FC = () => {
  const { state, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useKernel();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {state.windows.map((win) => {
          if (win.isMinimized) return null;

          const AppContent = APP_COMPONENTS[state.processes.find(p => p.windowId === win.id)?.component || ''] || (() => <div>App not found</div>);

          return (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                zIndex: win.zIndex,
                width: win.isMaximized ? '100%' : win.width,
                height: win.isMaximized ? 'calc(100% - 48px)' : win.height,
                x: win.isMaximized ? 0 : win.x,
                y: win.isMaximized ? 0 : win.y,
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`absolute pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col ${win.isMaximized ? '' : 'rounded-xl'}`}
              onMouseDown={() => focusWindow(win.id)}
              drag={!win.isMaximized}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                updateWindowPosition(win.id, win.x + info.offset.x, win.y + info.offset.y);
              }}
            >
              {/* Title Bar */}
              <div className="h-10 flex items-center justify-between px-4 select-none cursor-default bg-white/50 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700">{win.title}</span>
                </div>
                <div className="flex items-center">
                  <button onClick={() => minimizeWindow(win.id)} className="p-2 hover:bg-black/5 transition-colors rounded">
                    <Minus size={14} />
                  </button>
                  <button onClick={() => maximizeWindow(win.id)} className="p-2 hover:bg-black/5 transition-colors rounded">
                    {win.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
                  </button>
                  <button onClick={() => closeWindow(win.id)} className="p-2 hover:bg-red-500 hover:text-white transition-colors rounded">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-hidden">
                <AppContent />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
