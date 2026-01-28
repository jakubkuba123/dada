
import React, { useState } from 'react';
import { Chicken, AppState } from '../types';
import { HeartPulse, Baby, FlaskConical, ChevronRight, Activity } from 'lucide-react';

interface HealthBroodingProps {
  chickens: Chicken[];
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const HealthBrooding: React.FC<HealthBroodingProps> = ({ chickens, updateState }) => {
  const [selectedChickenId, setSelectedChickenId] = useState<string | null>(null);
  
  const updateChicken = (id: string, updates: Partial<Chicken>) => {
    updateState(prev => ({
      ...prev,
      chickens: prev.chickens.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const selectedChicken = chickens.find(c => c.id === selectedChickenId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Zdraví a hnízdění</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chicken Selector */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
          <h3 className="font-bold mb-4 text-stone-600 uppercase text-xs tracking-widest">Vyberte slepici</h3>
          <div className="space-y-2">
            {chickens.map(c => (
              <button 
                key={c.id}
                onClick={() => setSelectedChickenId(c.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedChickenId === c.id ? 'bg-amber-600 text-white shadow-md' : 'hover:bg-stone-50 text-stone-700'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${c.status === 'healthy' ? 'bg-green-500' : c.status === 'sick' ? 'bg-red-500' : 'bg-blue-400'}`} />
                   <span className="font-bold">{c.name}</span>
                </div>
                <ChevronRight size={16} className={selectedChickenId === c.id ? 'text-white' : 'text-stone-300'} />
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedChicken ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-stone-800">{selectedChicken.name}</h3>
                  <p className="text-stone-500">{selectedChicken.breed} • Aktuální stav: 
                    <span className={`ml-2 font-bold ${selectedChicken.status === 'healthy' ? 'text-green-600' : selectedChicken.status === 'sick' ? 'text-red-600' : 'text-blue-600'}`}>
                       {selectedChicken.status === 'healthy' ? 'V pořádku' : selectedChicken.status === 'sick' ? 'Nemocná' : 'Kvoká / Sedí na vejcích'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => updateChicken(selectedChicken.id, { status: 'healthy', medication: '', sicknessStartDate: '', cluckingStartDate: '', expectedHatchDate: '' })}
                     className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-100 hover:bg-green-100"
                   >Označit za zdravou</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Health & Medication */}
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <h4 className="flex items-center gap-2 font-bold text-red-800 mb-4">
                    <HeartPulse size={20} /> Zdravotní péče
                  </h4>
                  <div className="space-y-4">
                    <button 
                      onClick={() => updateChicken(selectedChicken.id, { status: 'sick', sicknessStartDate: new Date().toISOString().split('T')[0] })}
                      className="w-full py-2 bg-red-600 text-white rounded-lg font-bold text-sm shadow-sm"
                    >Nahlásit nemoc</button>
                    <div>
                      <label className="block text-xs font-bold text-red-800/60 uppercase mb-1">Nasazené léky / péče</label>
                      <textarea 
                        value={selectedChicken.medication || ''}
                        onChange={e => updateChicken(selectedChicken.id, { medication: e.target.value })}
                        className="w-full p-2 bg-white border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm h-24"
                        placeholder="Např. vitamíny do vody, izolace..."
                      />
                    </div>
                    {selectedChicken.sicknessStartDate && (
                      <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                        <Activity size={14}/> Trvá od: {new Date(selectedChicken.sicknessStartDate).toLocaleDateString('cs-CZ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Brooding / Clucking */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-4">
                    <Baby size={20} /> Kvokání a hnízdění
                  </h4>
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        const start = new Date();
                        const hatch = new Date();
                        hatch.setDate(start.getDate() + 21); // Standard chicken incubation
                        updateChicken(selectedChicken.id, { 
                          status: 'clucking', 
                          cluckingStartDate: start.toISOString().split('T')[0],
                          expectedHatchDate: hatch.toISOString().split('T')[0]
                        });
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm"
                    >Nasytit na vejce</button>
                    <div>
                      <label className="block text-xs font-bold text-blue-800/60 uppercase mb-1">Očekávané líhnutí</label>
                      <input 
                        type="date"
                        value={selectedChicken.expectedHatchDate || ''}
                        onChange={e => updateChicken(selectedChicken.id, { expectedHatchDate: e.target.value })}
                        className="w-full p-2 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {selectedChicken.cluckingStartDate && (
                      <div className="p-3 bg-white rounded-xl text-xs border border-blue-100 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Začátek sezení:</span>
                          <span className="font-bold">{new Date(selectedChicken.cluckingStartDate).toLocaleDateString('cs-CZ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Zbývá cca:</span>
                          <span className="font-bold text-blue-600">
                             {Math.max(0, Math.ceil((new Date(selectedChicken.expectedHatchDate || '').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} dní
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50 border-2 border-dashed rounded-2xl py-20">
              <FlaskConical size={48} className="mb-4 opacity-20" />
              <p>Vyberte slepici ze seznamu vlevo pro správu jejího zdraví</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthBrooding;
