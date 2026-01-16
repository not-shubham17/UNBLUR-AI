import React, { useState } from 'react';
import NavBar from './components/NavBar';
import UpscaleView from './components/UpscaleView';
import ChatView from './components/ChatView';
import AnalyzeView from './components/AnalyzeView';
import GenerateView from './components/GenerateView';
import EditView from './components/EditView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.UPSCALE);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.UPSCALE: return <UpscaleView />;
      case AppMode.CHAT: return <ChatView />;
      case AppMode.ANALYZE: return <AnalyzeView />;
      case AppMode.GENERATE: return <GenerateView />;
      case AppMode.EDIT: return <EditView />;
      default: return <UpscaleView />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <NavBar currentMode={currentMode} setMode={setCurrentMode} />
      <main className="flex-1 overflow-auto pb-20 md:pb-0 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-900/0 to-zinc-950 pointer-events-none" />
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
