
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bird, 
  Egg, 
  Wallet, 
  Wrench, 
  HeartPulse, 
  Info,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FlockManager from './components/FlockManager';
import ProductionTracker from './components/ProductionTracker';
import FinanceManager from './components/FinanceManager';
import Maintenance from './components/Maintenance';
import HealthBrooding from './components/HealthBrooding';
import { AppState, Chicken, EggRecord, FeedRecord, Customer, Sale, Task } from './types';

const STORAGE_KEY = 'slepicarna_pro_state';

const initialData: AppState = {
  chickens: [
    { id: '1', name: 'Berta', breed: 'Vlaška', hatchDate: '2023-03-15', status: 'healthy' },
    { id: '2', name: 'Božena', breed: 'Maranska', hatchDate: '2023-04-10', status: 'healthy' }
  ],
  eggRecords: [],
  feedRecords: [],
  customers: [],
  sales: [],
  tasks: [],
  eggStock: { normal: 0, extraLarge: 0, extraSmall: 0 }
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => updater(prev));
  };

  const navItems = [
    { id: 'dashboard', label: 'Přehled', icon: LayoutDashboard },
    { id: 'flock', label: 'Slepice', icon: Bird },
    { id: 'production', label: 'Snáška', icon: Egg },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'maintenance', label: 'Údržba', icon: Wrench },
    { id: 'health', label: 'Zdraví & Kvokání', icon: HeartPulse },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'flock': return <FlockManager chickens={state.chickens} updateState={updateState} />;
      case 'production': return <ProductionTracker state={state} updateState={updateState} />;
      case 'finance': return <FinanceManager state={state} updateState={updateState} />;
      case 'maintenance': return <Maintenance tasks={state.tasks} updateState={updateState} />;
      case 'health': return <HealthBrooding chickens={state.chickens} updateState={updateState} />;
      default: return <Dashboard state={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-amber-800 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bird size={24} /> Slepičárna Pro
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className={`
        fixed inset-0 z-40 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-stone-900 text-stone-200 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-stone-800">
          <Bird className="text-amber-500" size={28} />
          <h1 className="text-xl font-bold text-white">Slepičárna Pro</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800 text-xs text-stone-500 text-center">
          Verze 1.0.4 • © 2024 FarmAssist
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
