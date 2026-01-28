
import React, { useState } from 'react';
import { Task, AppState } from '../types';
import { CheckCircle2, Circle, Calendar, Trash2, Brush, Sparkles } from 'lucide-react';

interface MaintenanceProps {
  tasks: Task[];
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ tasks, updateState }) => {
  const [newTask, setNewTask] = useState({ title: '', date: '', type: 'cleaning' as Task['type'] });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.date) return;
    const task: Task = {
      id: Date.now().toString(),
      type: newTask.type,
      scheduledDate: newTask.date,
      completed: false,
      title: newTask.title
    };
    updateState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    setNewTask({ title: '', date: '', type: 'cleaning' });
  };

  const toggleTask = (id: string) => {
    updateState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    updateState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Údržba kurníku</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="font-bold mb-6">Plán úkolů</h3>
            <div className="space-y-4">
              {sortedTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${task.completed ? 'bg-stone-50 border-stone-100 opacity-60' : 'bg-white border-stone-100 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task.id)} className={task.completed ? 'text-green-500' : 'text-stone-300 hover:text-amber-500'}>
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <div>
                      <h4 className={`font-bold ${task.completed ? 'line-through text-stone-500' : 'text-stone-800'}`}>{task.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                        <Calendar size={12} />
                        <span>{new Date(task.scheduledDate).toLocaleDateString('cs-CZ')}</span>
                        <span className="mx-1 text-stone-200">|</span>
                        <span className="uppercase tracking-widest text-[10px] font-bold">
                          {task.type === 'cleaning' ? 'Čištění' : 'Podestýlka'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-stone-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  <Sparkles size={32} className="mx-auto mb-2 opacity-20" />
                  <p>Žádné naplánované úkoly. Kurník je čistý!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-900 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Brush size={20} className="text-amber-400"/> Naplánovat údržbu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200/60 uppercase mb-1">Co je třeba udělat?</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-2 bg-amber-800/50 border border-amber-700 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Např. Velký úklid"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-200/60 uppercase mb-1">Typ úkonu</label>
                <select 
                  value={newTask.type}
                  onChange={e => setNewTask({...newTask, type: e.target.value as Task['type']})}
                  className="w-full p-2 bg-amber-800/50 border border-amber-700 rounded-lg outline-none"
                >
                  <option value="cleaning">Čištění kurníku</option>
                  <option value="bedding">Výměna podestýlky</option>
                  <option value="custom">Jiný úkol</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-200/60 uppercase mb-1">Kdy</label>
                <input 
                  type="date" 
                  value={newTask.date}
                  onChange={e => setNewTask({...newTask, date: e.target.value})}
                  className="w-full p-2 bg-amber-800/50 border border-amber-700 rounded-lg outline-none"
                />
              </div>
              <button 
                onClick={handleAddTask}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl transition-all shadow-md"
              >
                Přidat úkol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
