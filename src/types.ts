export type FileType = 'file' | 'dir';

export interface AuraFile {
  id: string;
  name: string;
  parent_id: string | null;
  type: FileType;
  content?: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface Process {
  pid: number;
  name: string;
  component: string; // The app component name
  status: 'running' | 'suspended' | 'terminated';
  windowId: string;
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SystemState {
  user: {
    name: string;
    isLoggedIn: boolean;
  };
  isBooted: boolean;
  processes: Process[];
  windows: WindowState[];
  activeWindowId: string | null;
}
