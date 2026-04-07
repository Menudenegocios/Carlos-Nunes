import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialAccount } from '../../types';
import { Plus, X, Trash2, RefreshCw, CreditCard, Landmark, Banknote, PiggyBank, Wallet } from 'lucide-react';

const ACCOUNT_TYPES = [
  { value: 'conta_corrente', label: 'Conta Corrente', icon: Landmark },
  { value: 'conta_digital', label: 'Conta Digital', icon: CreditCard },
  { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { value: 'cartao_credito', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'carteira', label: 'Carteira', icon: Wallet },
  { value: 'investimento', label: 'Investimento', icon: PiggyBank },
  { value: 'caixa_fisico', label: 'Caixa Físico', icon: Banknote },
];

const COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16','#0ea5e9','#d946ef','#14b8a6','#f97316'];

interface Props { user_id: string; entityFilter: string; }

export const AccountManagement: React.FC<Props> = ({ user_id, entityFilter }) => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<FinancialAccount | null>(null);
  const [form, setForm] = useState({ name: '', type: 'conta_corrente', entity_type: entityFilter || 'personal', institution: '', initial_balance: 0, color: '#6366f1' });

  useEffect(() => { load(); }, [entityFilter]);

  const load = async () => {
    try {
      const data = await financialService.getAccounts(user_id);
      setAccounts(entityFilter === 'all' ? data : data.filter(a => a.entity_type === entityFilter));
    } catch (e) { console.error(e); }
  };

  const openNew = () => { setEditing(null); setForm({ name: '', type: 'conta_corrente', entity_type: entityFilter === 'all' ? 'personal' : entityFilter, institution: '', initial_balance: 0, color: '#6366f1' }); setIsModal(true); };
  const openEdit = (acc: FinancialAccount) => { setEditing(acc); setForm({ name: acc.name, type: acc.type, entity_type: acc.entity_type, institution: acc.institution || '', initial_balance: acc.initial_balance, color: acc.color || '#6366f1' }); setIsModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      if (editing) {
        await financialService.updateAccount(editing.id, { ...form } as any, user_id);
      } else {
        await financialService.addAccount({ ...form, user_id, current_balance: form.initial_balance, active: true } as any);
      }
      setIsModal(false); await load();
    } catch (e) { console.error(e); alert('Erro ao salvar conta.'); }
    finally { setIsSaving(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Excluir esta conta? Lançamentos vinculados podem ser impactados.')) return;
    try { await financialService.deleteAccount(id); await load(); } catch (e) { console.error(e); alert('Erro ao excluir. Verifique se há lançamentos vinculados.'); }
  };

  const totalBalance = accounts.reduce((s, a) => s + Number(a.current_balance), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#0F172A] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Saldo Consolidado</p>
          <p className={`text-3xl font-black tracking-tight ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>R$ {totalBalance.toFixed(2)}</p>
        </div>
        <button onClick={openNew} className="bg-[#F67C01] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> NOVA CONTA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <div key={acc.id} onClick={() => openEdit(acc)} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: acc.color || '#6366f1' }}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-gray-900 text-sm truncate">{acc.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{acc.institution || ACCOUNT_TYPES.find(t => t.value === acc.type)?.label}</p>
              </div>
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${acc.entity_type === 'personal' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>{acc.entity_type === 'personal' ? 'PF' : 'PJ'}</span>
            </div>
            <p className={`text-xl font-black tracking-tight ${Number(acc.current_balance) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              R$ {Number(acc.current_balance).toFixed(2)}
            </p>
            <p className="text-[9px] text-slate-400 mt-1">Saldo inicial: R$ {Number(acc.initial_balance).toFixed(2)}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full text-center py-16 opacity-40">
            <Wallet className="w-12 h-12 mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma conta cadastrada</p>
          </div>
        )}
      </div>

      {isModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{editing ? 'Editar Conta' : 'Nova Conta'}</h3>
              <div className="flex gap-2">
                {editing && <button onClick={() => { remove(editing.id); setIsModal(false); }} className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-xl"><Trash2 className="w-5 h-5" /></button>}
                <button onClick={() => setIsModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Conta</label>
                <input required className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Nubank PJ" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Perfil</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.entity_type} onChange={e => setForm({ ...form, entity_type: e.target.value })}>
                    <option value="personal">Pessoa Física</option>
                    <option value="business">Pessoa Jurídica</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Banco / Instituição</label>
                <input className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} placeholder="Ex: Nubank, Itaú..." />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo Inicial (R$)</label>
                <input type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.initial_balance} onChange={e => setForm({ ...form, initial_balance: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : (editing ? 'Atualizar' : 'Criar Conta')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
