import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialCategory } from '../../types';
import { Plus, X, Trash2, RefreshCw, Tag, ChevronRight } from 'lucide-react';

const COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16','#0ea5e9','#d946ef','#14b8a6','#f97316'];

interface Props { user_id: string; }

export const CategoryManagement: React.FC<Props> = ({ user_id }) => {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<FinancialCategory | null>(null);
  const [form, setForm] = useState({ name: '', type: 'expense' as string, entity_type: 'both' as string, color: '#6366f1', icon: '', parent_id: '' });
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => { try { setCategories(await financialService.getCategories(user_id)); } catch (e) { console.error(e); } };

  const openNew = (parentId?: string) => { setEditing(null); setForm({ name: '', type: 'expense', entity_type: 'both', color: '#6366f1', icon: '', parent_id: parentId || '' }); setIsModal(true); };
  const openEdit = (cat: FinancialCategory) => { setEditing(cat); setForm({ name: cat.name, type: cat.type, entity_type: cat.entity_type, color: cat.color || '#6366f1', icon: cat.icon || '', parent_id: cat.parent_id || '' }); setIsModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      if (editing) { await financialService.updateCategory(editing.id, { ...form, parent_id: form.parent_id || undefined } as any); }
      else { await financialService.addCategory({ ...form, user_id, parent_id: form.parent_id || undefined } as any); }
      setIsModal(false); await load();
    } catch (e) { console.error(e); alert('Erro ao salvar.'); }
    finally { setIsSaving(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Excluir esta categoria?')) return;
    try { await financialService.deleteCategory(id); await load(); } catch { alert('Erro ao excluir. Pode haver subcategorias ou lançamentos vinculados.'); }
  };

  const toggleExpand = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const typeLabels: Record<string, string> = { income: 'Receita', expense: 'Despesa', both: 'Ambos' };
  const entityLabels: Record<string, string> = { personal: 'PF', business: 'PJ', both: 'Ambos' };
  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Categorias Financeiras</h3>
        <button onClick={() => openNew()} className="bg-[#F67C01] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> CATEGORIA
        </button>
      </div>

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id}>
            <div className="flex items-center bg-white rounded-xl border border-gray-100 p-4 hover:border-indigo-200 transition-all group">
              {cat.subcategories && cat.subcategories.length > 0 && (
                <button onClick={() => toggleExpand(cat.id)} className="mr-2"><ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedIds.includes(cat.id) ? 'rotate-90' : ''}`} /></button>
              )}
              <div className="w-6 h-6 rounded-md mr-3" style={{ backgroundColor: cat.color || '#6366f1' }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{cat.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{typeLabels[cat.type]} • {entityLabels[cat.entity_type]}</p>
              </div>
              <button onClick={() => openNew(cat.id)} className="px-2 py-1 text-[9px] font-black text-indigo-600 bg-indigo-50 rounded-lg mr-2 opacity-0 group-hover:opacity-100 transition-all">+ Sub</button>
              <button onClick={() => openEdit(cat)} className="px-2 py-1 text-[9px] font-black text-sky-600 bg-sky-50 rounded-lg mr-2 opacity-0 group-hover:opacity-100 transition-all">Editar</button>
              <button onClick={() => remove(cat.id)} className="p-1 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
            {expandedIds.includes(cat.id) && cat.subcategories?.map(sub => (
              <div key={sub.id} className="flex items-center bg-gray-50 rounded-xl border border-gray-50 p-3 ml-8 mt-1 hover:bg-white transition-all group">
                <div className="w-4 h-4 rounded-sm mr-3" style={{ backgroundColor: sub.color || cat.color || '#6366f1' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-700 text-xs">{sub.name}</p>
                </div>
                <button onClick={() => openEdit(sub)} className="px-2 py-1 text-[9px] font-black text-sky-600 bg-sky-50 rounded-lg mr-2 opacity-0 group-hover:opacity-100">Editar</button>
                <button onClick={() => remove(sub.id)} className="p-1 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-16 opacity-40">
            <Tag className="w-10 h-10 mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma categoria criada</p>
          </div>
        )}
      </div>

      {isModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{editing ? 'Editar' : form.parent_id ? 'Nova Subcategoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome</label>
                <input required className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Marketing" />
              </div>
              {!form.parent_id && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="income">Receita</option><option value="expense">Despesa</option><option value="both">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Perfil</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.entity_type} onChange={e => setForm({ ...form, entity_type: e.target.value })}>
                      <option value="personal">PF</option><option value="business">PJ</option><option value="both">Ambos</option>
                    </select>
                  </div>
                </div>
              )}
              {form.parent_id && (
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria Pai</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                    {parentCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (<button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-lg ${form.color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`} style={{ backgroundColor: c }} />))}
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
