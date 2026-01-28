
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { Bird, Egg, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { getChickenTips } from '../geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoadingTips(true);
        const newTips = await getChickenTips();
        setTips(newTips);
      } catch (err) {
        console.error("Dashboard tips error:", err);
      } finally {
        setIsLoadingTips(false);
      }
    };
    fetchTips();
  }, []);

  const totalChickens = state?.chickens?.length || 0;
  const sickChickens = state?.chickens?.filter(c => c.status === 'sick').length || 0;
  const totalRevenue = state?.sales?.reduce((acc, s) => acc + (s.priceCzk || 0), 0) || 0;

  // Chart data for last 7 days production
  const productionData = (state?.eggRecords || []).slice(-7).map(r => ({
    date: new Date(r.date).toLocaleDateString('cs-CZ', { weekday: 'short' }),
    total: (r.normalCount || 0) + (r.extraLargeCount || 0) + (r.extraSmallCount || 0)
  }));

  const currentEggStock = state?.eggStock ? 
    ((state.eggStock.normal || 0) + (state.eggStock.extraLarge || 0) + (state.eggStock.extraSmall || 0)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Dnešní přehled</h2>
        <div className="bg-white px-3 py-1 rounded-full text-stone-500 text-sm shadow-sm border">
          {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Bird size={24}/></div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Celkem slepic</p>
            <p className="text-2xl font-bold text-stone-800">{totalChickens}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Egg size={24}/></div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Skladem vajec</p>
            <p className="text-2xl font-bold text-stone-800">
              {currentEggStock}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Celkový zisk</p>
            <p className="text-2xl font-bold text-stone-800">{totalRevenue} Kč</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${sickChickens > 0 ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-400'}`}>
            <AlertCircle size={24}/>
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Nemocné</p>
            <p className="text-2xl font-bold text-stone-800">{sickChickens}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-semibold mb-6">Produkce vajec (posledních 7 dní)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {productionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === productionData.length - 1 ? '#d97706' : '#fbbf24'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Tips Section */}
        <div className="bg-amber-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-400" size={20} />
              <h3 className="text-lg font-bold">Chytré rady pro farmáře</h3>
            </div>
            <div className="space-y-4">
              {isLoadingTips ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-amber-800 rounded w-full"></div>
                  <div className="h-4 bg-amber-800 rounded w-5/6"></div>
                  <div className="h-4 bg-amber-800 rounded w-4/6"></div>
                </div>
              ) : (
                tips.length > 0 ? tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-amber-400 font-bold">•</span>
                    <p className="text-sm text-amber-50/90 leading-relaxed">{tip}</p>
                  </div>
                )) : <p className="text-sm text-amber-200/50">Tipy se načítají...</p>
              )}
            </div>
          </div>
          <button 
            onClick={async () => {
              setIsLoadingTips(true);
              const t = await getChickenTips();
              setTips(t);
              setIsLoadingTips(false);
            }}
            className="mt-6 w-full py-2 bg-amber-800/50 hover:bg-amber-800 border border-amber-700 rounded-lg text-xs font-medium transition-colors"
          >
            Obnovit rady
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
