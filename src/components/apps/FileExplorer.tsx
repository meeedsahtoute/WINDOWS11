import React, { useState, useEffect } from 'react';
import { useKernel } from '../../KernelContext.tsx';
import { AuraFile } from '../../types.ts';
import { Folder, File, ChevronRight, Home, ArrowLeft, ArrowUp } from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<AuraFile[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async (parentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fs/list?parentId=${parentId}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath[currentPath.length - 1]);
  }, [currentPath]);

  const navigateTo = (id: string, type: string) => {
    if (type === 'dir') {
      setCurrentPath([...currentPath, id]);
    }
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 font-sans">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 border-b border-slate-200 bg-slate-50">
        <button onClick={goBack} className="p-1 hover:bg-slate-200 rounded disabled:opacity-30" disabled={currentPath.length <= 1}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-1 text-sm text-slate-500 overflow-hidden">
          <Home size={14} />
          {currentPath.map((p, i) => (
            <React.Fragment key={p}>
              <ChevronRight size={12} />
              <span className="hover:underline cursor-pointer whitespace-nowrap">{p}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400">Loading VFS...</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
            {files.map(file => (
              <div
                key={file.id}
                onDoubleClick={() => navigateTo(file.id, file.type)}
                className="flex flex-col items-center gap-2 p-2 rounded hover:bg-blue-50 cursor-pointer group transition-colors"
              >
                <div className="text-blue-500 group-hover:scale-110 transition-transform">
                  {file.type === 'dir' ? <Folder size={48} fill="currentColor" fillOpacity={0.2} /> : <File size={48} />}
                </div>
                <span className="text-xs text-center break-all line-clamp-2">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
