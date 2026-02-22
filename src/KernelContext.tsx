import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SystemState, Process, WindowState } from './types';

interface KernelContextType {
  state: SystemState;
  launchApp: (name: string, component: string, icon: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  logout: () => void;
  login: (username: string) => void;
  boot: () => void;
}

const KernelContext = createContext<KernelContextType | null>(null);

export const KernelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SystemState>({
    user: { name: 'Guest', isLoggedIn: false },
    isBooted: false,
    processes: [],
    windows: [],
    activeWindowId: null,
  });

  const [nextPid, setNextPid] = useState(1);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const boot = useCallback(() => {
    setState(prev => ({ ...prev, isBooted: true }));
  }, []);

  const login = useCallback((username: string) => {
    setState(prev => ({
      ...prev,
      user: { name: username, isLoggedIn: true }
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: { name: 'Guest', isLoggedIn: false },
      processes: [],
      windows: [],
      activeWindowId: null
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setMaxZIndex(prev => {
      const newZ = prev + 1;
      setState(s => ({
        ...s,
        activeWindowId: id,
        windows: s.windows.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w)
      }));
      return newZ;
    });
  }, []);

  const launchApp = useCallback((name: string, component: string, icon: string) => {
    const windowId = `win-${Math.random().toString(36).substr(2, 9)}`;
    const pid = nextPid;
    setNextPid(p => p + 1);

    const newWindow: WindowState = {
      id: windowId,
      title: name,
      icon,
      isMaximized: false,
      isMinimized: false,
      zIndex: maxZIndex + 1,
      x: 100 + (pid * 20) % 300,
      y: 100 + (pid * 20) % 200,
      width: 800,
      height: 500,
    };

    const newProcess: Process = {
      pid,
      name,
      component,
      status: 'running',
      windowId,
    };

    setMaxZIndex(z => z + 1);
    setState(prev => ({
      ...prev,
      processes: [...prev.processes, newProcess],
      windows: [...prev.windows, newWindow],
      activeWindowId: windowId,
    }));
  }, [nextPid, maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      processes: prev.processes.filter(p => p.windowId !== id),
      windows: prev.windows.filter(w => w.id !== id),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId,
    }));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId,
    }));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
    }));
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, x, y } : w),
    }));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setState(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, width, height } : w),
    }));
  }, []);

  return (
    <KernelContext.Provider value={{
      state, launchApp, closeWindow, minimizeWindow, maximizeWindow,
      focusWindow, updateWindowPosition, updateWindowSize, logout, login, boot
    }}>
      {children}
    </KernelContext.Provider>
  );
};

export const useKernel = () => {
  const context = useContext(KernelContext);
  if (!context) throw new Error('useKernel must be used within KernelProvider');
  return context;
};
