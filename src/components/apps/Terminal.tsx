import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['AuraOS Kernel v1.0.0 (build 2026)', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = '';

    switch (trimmed) {
      case 'help':
        response = 'Available commands: help, clear, whoami, ver, uname, ls, date';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        response = 'aura_user_01';
        break;
      case 'ver':
        response = 'AuraOS 1.0.0 [Version 10.0.22621.1]';
        break;
      case 'uname':
        response = 'AuraOS-Kernel-x86_64-Generic';
        break;
      case 'date':
        response = new Date().toLocaleString();
        break;
      case 'ls':
        response = 'Desktop  Documents  Downloads  Music  Pictures  Videos';
        break;
      default:
        response = `Command not found: ${trimmed}`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, response]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-[#cccccc] font-mono p-2 text-sm selection:bg-white selection:text-black">
      <div ref={scrollRef} className="flex-1 overflow-auto mb-2 whitespace-pre-wrap">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-emerald-500 mr-2">C:\Users\Guest&gt;</span>
        <input
          autoFocus
          className="flex-1 bg-transparent outline-none border-none text-[#cccccc]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
};
