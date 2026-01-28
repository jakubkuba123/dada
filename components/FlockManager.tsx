
import React, { useState } from 'react';
import { Chicken, AppState } from '../types';
import { Plus, Trash2, Calendar, Bird } from 'lucide-react';

interface FlockManagerProps {
  chickens: Chicken[];
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const FlockManager: React.FC<FlockManagerProps> = ({ chickens, updateState }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChicken, setNewChicken] = useState<Partial<Chicken>>({
    name: '',
    breed: '',
    hatchDate: new Date().toISOString().split('T')[0],
    status: 'healthy'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChicken.name) return;
    
    updateState(prev => ({
      ...prev,
      chickens: [...prev.chickens, {
        ...newChicken as Chicken,
        id: Date.now().toString()
      }]
    }));
    setShowAddForm(false);
    setNewChicken({ name: '', breed: '', hatchDate: new Date().toISOString().split('T')[0], status: 'healthy' });
  };

  const calculateAge = (hatchDate: string) => {
    const birth = new Date(hatchDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 1) return "Novorozená";
    if (months < 12) return `${months} měs.`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years}r ${remainingMonths}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Moje hejno</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={18} /> Přidat slepici
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-6 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Jméno</label>
              <input 
                type="text" 
                value={newChicken.name}
                onChange={e => setNewChicken({...newChicken, name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Plemeno</label>
              <input 
                type="text" 
                value={newChicken.breed}
                onChange={e => setNewChicken({...newChicken, breed: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Datum líhnutí</label>
              <input 
                type="date" 
                value={newChicken.hatchDate}
                onChange={e => setNewChicken({...newChicken, hatchDate: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-medium">Uložit</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-stone-100 text-stone-600 py-2 rounded-lg">Zrušit</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chickens.map(chicken => (
          <div key={chicken.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:border-amber-200 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <Bird size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">{chicken.name}</h4>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">{chicken.breed || 'Neznámé plemeno'}</p>
                </div>
              </div>
              <button 
                onClick={() => updateState(prev => ({...prev, chickens: prev.chickens.filter(c => c.id !== chicken.id)}))}
                className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar size={16} className="text-stone-400" />
                <span>{calculateAge(chicken.hatchDate)}</span>
              </div>
              <div className={`flex items-center gap-2 font-medium ${
                chicken.status === 'healthy' ? 'text-green-600' : 
                chicken.status === 'sick' ? 'text-red-600' : 'text-amber-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  chicken.status === 'healthy' ? 'bg-green-600' : 
                  chicken.status === 'sick' ? 'bg-red-600' : 'bg-amber-600'
                }`} />
                <span>
                  {chicken.status === 'healthy' ? 'Zdravá' : 
                   chicken.status === 'sick' ? 'Nemocná' : 'Kvoká'}
                </span>
              </div>
            </div>
            
            <div className="text-xs text-stone-400 border-t pt-3 flex justify-between">
              <span>Datum líhnutí:</span>
              <span>{new Date(chicken.hatchDate).toLocaleDateString('cs-CZ')}</span>
            </div>
          </div>
        ))}
      </div>
      
      {chickens.length === 0 && (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
          <Bird size={48} className="mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500">Zatím nemáte žádné slepice. Přidejte svou první!</p>
        </div>
      )}
    </div>
  );
};

export default FlockManager;
