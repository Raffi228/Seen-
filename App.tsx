
import React, { useState } from 'react';
import Header from './components/Header';
import GuidedWriting from './components/GuidedWriting';
import JDCustomization from './components/JDCustomization';

type ActiveView = 'guided' | 'customization';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('guided');

  const navButtonClasses = (view: ActiveView) =>
    `px-6 py-3 font-semibold text-lg rounded-t-lg transition-all duration-300 focus:outline-none ${
      activeView === view
        ? 'bg-white text-slate-800 shadow-md'
        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveView('guided')}
            className={navButtonClasses('guided')}
          >
            AI 引导写简历
          </button>
          <button
            onClick={() => setActiveView('customization')}
            className={navButtonClasses('customization')}
          >
            "千岗千历" 定制
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeView === 'guided' && <GuidedWriting />}
          {activeView === 'customization' && <JDCustomization />}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Seen/知遇 - 让每个求职者的闪光点被看见</p>
      </footer>
    </div>
  );
};

export default App;
