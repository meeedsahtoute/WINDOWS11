import React from 'react';
import { useKernel } from '../KernelContext.tsx';
import { Folder, FileText, Globe } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { launchApp } = useKernel();

  const desktopIcons = [
    { name: 'This PC', component: 'FileExplorer', icon: <Folder className="text-blue-500" /> },
    { name: 'Terminal', component: 'Terminal', icon: <Globe className="text-emerald-500" /> },
  ];

  return (
    <div className="absolute inset-0 p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 content-start justify-start">
      {desktopIcons.map(icon => (
        <button
          key={icon.name}
          onDoubleClick={() => launchApp(icon.name, icon.component, icon.name)}
          className="w-20 h-24 flex flex-col items-center justify-center gap-1 rounded hover:bg-white/10 transition-colors group select-none"
        >
          <div className="text-white drop-shadow-md group-hover:scale-110 transition-transform">
            {React.cloneElement(icon.icon as React.ReactElement, { size: 40 })}
          </div>
          <span className="text-[11px] text-white text-center font-medium drop-shadow-md px-1 break-all line-clamp-2">
            {icon.name}
          </span>
        </button>
      ))}
    </div>
  );
};
