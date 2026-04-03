import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialGoal, FinancialGoalItem } from '../../types';
import { Plus, X, Trash2, RefreshCw, Target, TrendingUp } from 'lucide-react';

interface Props { user_id: string; }

export const GoalTracker: React.FC<Props> = ({ user_id }) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'faturamento', target_value: 0, current_value: 0, start_date: new Date().toISOString().split('T')[0], end_date: '', status: 'active' as const });

  useEffect(() => { load(); }, []);
  
  const load = async () => { 
    try { 
      const data = await financialService.getGoals(user_id);
      const dash = await financialService.getDashboardData(user_id, new Date().getMonth() + 1, new Date().getFullYear());
      
      const updatedGoals = data.map(g => {
        if (g.type === 'faturamento') {
          return { ...g, current_value: dash.monthlyBilling };
        }
        return g;
      });
      setGoals(updatedGoals); 
    } catch (e) { console.error(e); } 
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try { await financialService.addGoal({ ...form, user_id } as any); setIsModal(false); await load(); }
    catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Excluir esta meta?')) return;
    try { await financialService.deleteGoal(id); await load(); } catch (e) { console.error(e); }
  };

  const updateCurrent = async (goal: FinancialGoal, value: number) => {
    try { await financialService.updateGoal(goal.id, { current_value: value }); await load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Metas Financeiras</h3>
        <button onClick={() => setIsModal(true)} className="bg-[#F67C01] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> NOVA META
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => {
          const pct = goal.target_value > 0 ? Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100) : 0;
          return (
            <div key={goal.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 hover:border-indigo-200 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-gray-900">{goal.title}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{goal.type} • até {new Date(goal.end_date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                </div>
                <button onClick={() => remove(goal.id)} className="p-1 text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-indigo-600">R$ {Number(goal.current_value).toFixed(2)}</span>
                  <span className="font-bold text-slate-400">R$ {Number(goal.target_value).toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-indigo-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] font-black text-center">{pct.toFixed(0)}% concluído</p>
              </div>
              <div className="flex gap-2">
                <input type="number" step="0.01" placeholder="Atualizar valor..." className="flex-1 bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-bold" onKeyDown={e => { if (e.key === 'Enter') { updateCurrent(goal, Number((e.target as HTMLInputElement).value)); (e.target as HTMLInputElement).value = ''; } }} />
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full text-center py-16 opacity-40">
            <Target className="w-10 h-10 mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma meta definida</p>
          </div>
        )}
      </div>

      {isModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Nova Meta</h3>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Título</label>
                <input required className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Faturar R$ 20.000" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="faturamento">Faturamento</option><option value="lucro">Lucro</option><option value="economia">Redução de Despesa</option>
                  <option value="reserva">Reserva de Caixa</option><option value="investimento">Investimento</option><option value="vendas">Nº de Vendas</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Valor Alvo (R$)</label>
                  <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.target_value || ''} onChange={e => setForm({ ...form, target_value: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Prazo</label>
                  <input required type="date" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-4 rounded-xl uppercase text-sm hover:bg-orange-600 transition-all">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Criar Meta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
