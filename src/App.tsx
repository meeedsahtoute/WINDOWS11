import React from 'react';
import { KernelProvider, useKernel } from './KernelContext.tsx';
import { BootScreen, LoginScreen } from './components/SystemScreens.tsx';
import { Taskbar } from './components/Taskbar.tsx';
import { WindowManager } from './components/WindowManager.tsx';
import { Desktop } from './components/Desktop.tsx';

const AuraShell: React.FC = () => {
  const { state } = useKernel();

  if (!state.isBooted) {
    return <BootScreen />;
  }

  if (!state.user.isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[url('https://picsum.photos/id/10/1920/1080')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Desktop Layer */}
      <Desktop />

      {/* Window Layer */}
      <WindowManager />

      {/* Shell Layer (Taskbar, Start Menu) */}
      <Taskbar />
    </div>
  );
};

export default function App() {
  return (
    <KernelProvider>
      <AuraShell />
    </KernelProvider>
  );
}
