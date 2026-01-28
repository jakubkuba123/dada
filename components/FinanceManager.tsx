
import React, { useState } from 'react';
import { AppState, Customer, Sale, FeedRecord } from '../types';
import { Plus, UserPlus, Coins, ShoppingCart, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FinanceManagerProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ state, updateState }) => {
  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'expenses'>('sales');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  
  const [newSale, setNewSale] = useState({ customerId: '', count: 0, price: 0 });
  const [newFeed, setNewFeed] = useState({ amount: 0, cost: 0, water: 0, duration: 0 });

  const handleAddCustomer = () => {
    if (!newCustomerName) return;
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName,
      totalPaid: 0,
      eggsTaken: 0
    };
    updateState(prev => ({ ...prev, customers: [...prev.customers, customer] }));
    setNewCustomerName('');
    setShowCustomerForm(false);
  };

  const handleAddSale = () => {
    if (!newSale.customerId || newSale.count <= 0) return;
    
    const sale: Sale = {
      id: Date.now().toString(),
      customerId: newSale.customerId,
      date: new Date().toISOString(),
      eggCount: newSale.count,
      priceCzk: newSale.price
    };

    updateState(prev => {
      // Automatic egg stock deduction
      let remaining = newSale.count;
      const newStock = { ...prev.eggStock };
      
      // Greedy deduction: normal first, then extra small, then extra large
      const deduct = (type: keyof typeof newStock) => {
        const canTake = Math.min(newStock[type], remaining);
        newStock[type] -= canTake;
        remaining -= canTake;
      };
      deduct('normal');
      deduct('extraSmall');
      deduct('extraLarge');

      return {
        ...prev,
        sales: [sale, ...prev.sales],
        eggStock: newStock,
        customers: prev.customers.map(c => 
          c.id === newSale.customerId 
            ? { ...c, totalPaid: c.totalPaid + newSale.price, eggsTaken: c.eggsTaken + newSale.count }
            : c
        )
      };
    });
    setNewSale({ customerId: '', count: 0, price: 0 });
  };

  const handleAddFeed = () => {
    const feed: FeedRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amountKg: newFeed.amount,
      costCzk: newFeed.cost,
      waterLiters: newFeed.water,
      durationDays: newFeed.duration
    };
    updateState(prev => ({ ...prev, feedRecords: [feed, ...prev.feedRecords] }));
    setNewFeed({ amount: 0, cost: 0, water: 0, duration: 0 });
  };

  const totalExpenses = state.feedRecords.reduce((acc, f) => acc + f.costCzk, 0);
  const totalIncome = state.sales.reduce((acc, s) => acc + s.priceCzk, 0);

  const pieData = [
    { name: 'Krmivo', value: totalExpenses, color: '#ef4444' },
    { name: 'Ostatní', value: 0, color: '#f97316' },
    { name: 'Příjmy', value: totalIncome, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-stone-800">Finance a prodej</h2>
        <div className="flex bg-stone-200 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('sales')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'sales' ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Prodej vajec
          </button>
          <button 
            onClick={() => setActiveSubTab('expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'expenses' ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Výdaje (Krmení)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeSubTab === 'sales' ? (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2"><ShoppingCart size={20} className="text-amber-600"/> Nový prodej</h3>
                  <button onClick={() => setShowCustomerForm(true)} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                    <UserPlus size={14}/> Přidat odběratele
                  </button>
                </div>

                {showCustomerForm && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl flex gap-4 items-end animate-in fade-in">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-amber-700 uppercase mb-1">Jméno nového zákazníka</label>
                      <input 
                        type="text" 
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Např. Sousedka Alena"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddCustomer} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Přidat</button>
                      <button onClick={() => setShowCustomerForm(false)} className="bg-stone-200 text-stone-600 px-4 py-2 rounded-lg text-sm font-bold">Zrušit</button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-sm text-stone-500 mb-1">Odběratel</label>
                    <select 
                      value={newSale.customerId}
                      onChange={e => setNewSale({...newSale, customerId: e.target.value})}
                      className="w-full p-2 border rounded-lg outline-none"
                    >
                      <option value="">Vyberte...</option>
                      {state.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-stone-500 mb-1">Počet vajec</label>
                    <input 
                      type="number" 
                      value={newSale.count}
                      onChange={e => setNewSale({...newSale, count: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-500 mb-1">Cena (Kč)</label>
                    <input 
                      type="number" 
                      value={newSale.price}
                      onChange={e => setNewSale({...newSale, price: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <button onClick={handleAddSale} className="bg-amber-600 text-white py-2 rounded-lg font-bold">Prodat</button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="font-bold mb-4">Seznam odběratelů</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.customers.map(customer => (
                    <div key={customer.id} className="p-4 rounded-xl border border-stone-100 flex justify-between items-center bg-stone-50/50">
                      <div>
                        <p className="font-bold text-stone-800">{customer.name}</p>
                        <p className="text-xs text-stone-500">Odebráno: {customer.eggsTaken} ks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-green-600">{customer.totalPaid} Kč</p>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Celkem zaplaceno</p>
                      </div>
                    </div>
                  ))}
                  {state.customers.length === 0 && <p className="col-span-2 text-center text-stone-400 py-4 italic">Zatím žádní odběratelé</p>}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-8">
              <div>
                <h3 className="font-bold mb-6 flex items-center gap-2"><Coins size={20} className="text-red-500"/> Náklady na krmivo a vodu</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Krmivo (kg)</label>
                    <input 
                      type="number" 
                      value={newFeed.amount}
                      onChange={e => setNewFeed({...newFeed, amount: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Cena (Kč)</label>
                    <input 
                      type="number" 
                      value={newFeed.cost}
                      onChange={e => setNewFeed({...newFeed, cost: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Voda (litry)</label>
                    <input 
                      type="number" 
                      value={newFeed.water}
                      onChange={e => setNewFeed({...newFeed, water: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Vydrží (dní)</label>
                    <input 
                      type="number" 
                      value={newFeed.duration}
                      onChange={e => setNewFeed({...newFeed, duration: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg outline-none"
                    />
                  </div>
                  <button onClick={handleAddFeed} className="md:col-span-4 bg-stone-800 text-white py-2 rounded-lg font-bold mt-2">Uložit nákup krmení</button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold mb-4 text-stone-600">Historie krmení</h4>
                <div className="space-y-3">
                  {state.feedRecords.map(f => (
                    <div key={f.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-100 text-sm">
                      <div className="flex items-center gap-4">
                         <span className="font-medium">{new Date(f.date).toLocaleDateString('cs-CZ')}</span>
                         <span className="text-stone-500">{f.amountKg}kg / {f.waterLiters}l</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-stone-400">Vydrželo: <b className="text-stone-700">{f.durationDays || '?'} dní</b></span>
                        <span className="font-bold text-red-600">{f.costCzk} Kč</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-stone-800"><PieChartIcon size={20}/> Rozdělení financí</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Celkový zisk</span>
                <span className="font-bold text-green-600">+{totalIncome} Kč</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Celkové výdaje</span>
                <span className="font-bold text-red-500">-{totalExpenses} Kč</span>
              </div>
              <div className="flex justify-between text-base font-black border-t pt-2">
                <span>Bilance</span>
                <span className={totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {totalIncome - totalExpenses} Kč
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManager;
