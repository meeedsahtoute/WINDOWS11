import React from 'react';
import { useKernel } from '../../KernelContext.tsx';
import { Monitor, Shield, User, Wifi, Volume2, Battery, Info } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state } = useKernel();

  const sections = [
    { icon: <Monitor size={20} />, name: 'System', desc: 'Display, sound, notifications' },
    { icon: <Wifi size={20} />, name: 'Network & internet', desc: 'Wi-Fi, airplane mode, VPN' },
    { icon: <User size={20} />, name: 'Accounts', desc: 'Email, accounts, family' },
    { icon: <Shield size={20} />, name: 'Privacy & security', desc: 'Permissions, security' },
    { icon: <Info size={20} />, name: 'About', desc: 'AuraOS v1.0.0, Kernel 6.2.0' },
  ];

  return (
    <div className="flex h-full bg-[#f3f3f3] text-slate-900 font-sans">
      <div className="w-64 bg-[#ebebeb] p-4 flex flex-col gap-1">
        <div className="flex items-center gap-3 p-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{state.user.name}</span>
            <span className="text-[10px] text-slate-500">Local Account</span>
          </div>
        </div>
        {sections.map(s => (
          <button key={s.name} className="flex items-center gap-3 p-2 rounded hover:bg-black/5 text-left transition-colors">
            <span className="text-slate-600">{s.icon}</span>
            <span className="text-xs font-medium">{s.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="grid gap-4">
          {sections.map(s => (
            <div key={s.name} className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-blue-600">{s.icon}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-xs text-slate-500">{s.desc}</span>
                </div>
              </div>
              <span className="text-slate-300">&gt;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
