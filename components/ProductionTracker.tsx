
import React, { useState } from 'react';
import { AppState, EggRecord } from '../types';
import { Plus, Archive, History, Sparkles } from 'lucide-react';

interface ProductionTrackerProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const ProductionTracker: React.FC<ProductionTrackerProps> = ({ state, updateState }) => {
  const [newEntry, setNewEntry] = useState({
    normal: 0,
    extraLarge: 0,
    extraSmall: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddProduction = () => {
    if (newEntry.normal + newEntry.extraLarge + newEntry.extraSmall === 0) return;

    const record: EggRecord = {
      id: Date.now().toString(),
      date: newEntry.date,
      normalCount: newEntry.normal,
      extraLargeCount: newEntry.extraLarge,
      extraSmallCount: newEntry.extraSmall
    };

    updateState(prev => ({
      ...prev,
      eggRecords: [record, ...prev.eggRecords],
      eggStock: {
        normal: prev.eggStock.normal + newEntry.normal,
        extraLarge: prev.eggStock.extraLarge + newEntry.extraLarge,
        extraSmall: prev.eggStock.extraSmall + newEntry.extraSmall
      }
    }));

    setNewEntry({
      normal: 0,
      extraLarge: 0,
      extraSmall: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Record Entry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="text-amber-600" size={20} />
              <h3 className="text-lg font-bold">Zaznamenat dnešní snášku</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs font-bold text-stone-500 uppercase mb-2">Klasická</span>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setNewEntry(p => ({...p, normal: Math.max(0, p.normal - 1)}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >-</button>
                  <span className="text-2xl font-black w-8">{newEntry.normal}</span>
                  <button 
                    onClick={() => setNewEntry(p => ({...p, normal: p.normal + 1}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >+</button>
                </div>
              </div>
              
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs font-bold text-amber-700 uppercase mb-2 flex items-center justify-center gap-1">
                  <Sparkles size={12}/> Extra velká
                </span>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setNewEntry(p => ({...p, extraLarge: Math.max(0, p.extraLarge - 1)}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >-</button>
                  <span className="text-2xl font-black w-8">{newEntry.extraLarge}</span>
                  <button 
                    onClick={() => setNewEntry(p => ({...p, extraLarge: p.extraLarge + 1}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >+</button>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs font-bold text-blue-700 uppercase mb-2">Extra malá</span>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setNewEntry(p => ({...p, extraSmall: Math.max(0, p.extraSmall - 1)}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >-</button>
                  <span className="text-2xl font-black w-8">{newEntry.extraSmall}</span>
                  <button 
                    onClick={() => setNewEntry(p => ({...p, extraSmall: p.extraSmall + 1}))}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm text-stone-600 hover:bg-stone-100"
                  >+</button>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm text-stone-500 mb-1">Datum snášky</label>
                <input 
                  type="date" 
                  value={newEntry.date}
                  onChange={e => setNewEntry(p => ({...p, date: e.target.value}))}
                  className="w-full p-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <button 
                onClick={handleAddProduction}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-900/10 transition-all"
              >
                Uložit záznam
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <History className="text-stone-400" size={20} />
              <h3 className="text-lg font-bold">Historie snášky</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-stone-400 uppercase tracking-wider border-b">
                    <th className="pb-3">Datum</th>
                    <th className="pb-3">Klasická</th>
                    <th className="pb-3">Velká</th>
                    <th className="pb-3">Malá</th>
                    <th className="pb-3">Celkem</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {state.eggRecords.map(record => (
                    <tr key={record.id} className="text-stone-700">
                      <td className="py-3 font-medium">{new Date(record.date).toLocaleDateString('cs-CZ')}</td>
                      <td className="py-3">{record.normalCount}</td>
                      <td className="py-3 text-amber-600">{record.extraLargeCount}</td>
                      <td className="py-3 text-blue-600">{record.extraSmallCount}</td>
                      <td className="py-3 font-bold">{record.normalCount + record.extraLargeCount + record.extraSmallCount} ks</td>
                    </tr>
                  ))}
                  {state.eggRecords.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-stone-400">Žádné záznamy</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Column */}
        <div className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-amber-700" size={20} />
              <h3 className="text-lg font-bold text-amber-900">Aktuální sklad</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <span className="text-stone-600">Klasická</span>
                <span className="text-2xl font-black text-amber-700">{state.eggStock.normal}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <span className="text-stone-600">Extra velká</span>
                <span className="text-2xl font-black text-amber-600">{state.eggStock.extraLarge}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <span className="text-stone-600">Extra malá</span>
                <span className="text-2xl font-black text-blue-600">{state.eggStock.extraSmall}</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-amber-900 font-bold px-2">
                <span>Celkem</span>
                <span>{state.eggStock.normal + state.eggStock.extraLarge + state.eggStock.extraSmall} ks</span>
              </div>
            </div>
          </div>
          
          <div className="bg-stone-900 text-white p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <History size={18} className="text-amber-500" /> Čerstvost
            </h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              Poslední snáška byla přidána před 
              <span className="text-white font-bold ml-1">
                {state.eggRecords.length > 0 ? 
                  Math.floor((Date.now() - new Date(state.eggRecords[0].date).getTime()) / (1000 * 60 * 60 * 24))
                  : '?'
                } dny
              </span>.
            </p>
            <div className="mt-4 h-1 bg-stone-800 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 w-3/4"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductionTracker;
