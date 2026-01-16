import React from 'react';
import { AppMode } from '../types';
import { Sparkles, MessageSquare, ScanEye, ImagePlus, Wand2 } from 'lucide-react';

interface NavBarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.UPSCALE, label: 'Unblur & 4K', icon: Sparkles },
    { mode: AppMode.CHAT, label: 'Deep Chat', icon: MessageSquare },
    { mode: AppMode.ANALYZE, label: 'Analyze', icon: ScanEye },
    { mode: AppMode.GENERATE, label: 'Generate', icon: ImagePlus },
    { mode: AppMode.EDIT, label: 'Magic Edit', icon: Wand2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-2 md:static md:w-64 md:h-screen md:border-r md:border-t-0 flex md:flex-col justify-around md:justify-start gap-1 z-50">
      <div className="hidden md:flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Clarity AI
        </h1>
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentMode === item.mode;
        return (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-zinc-800 text-indigo-400 shadow-lg shadow-indigo-500/10' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
              }`}
          >
            <Icon className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;
