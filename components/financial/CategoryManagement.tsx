import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialCategory } from '../../types';
import { Plus, X, Trash2, Tag, ChevronRight, GripVertical, RefreshCw } from 'lucide-react';

const COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16','#0ea5e9','#d946ef','#14b8a6','#f97316'];

export const CategoryManagement: React.FC<{ user_id: string }> = ({ user_id }) => {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [editing, setEditing] = useState<FinancialCategory | null>(null);
  const [form, setForm] = useState({ name: '', type: 'expense' as string, entity_type: 'both' as string, color: '#6366f1', icon: '', parent_id: '' });
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const [draggedCat, setDraggedCat] = useState<FinancialCategory | null>(null);
  const [dragState, setDragState] = useState<{ id: string, zone: 'top' | 'middle' | 'bottom' } | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => { try { setCategories(await financialService.getCategories(user_id)); } catch (e) { console.error(e); } };

  const flatCategories = React.useMemo(() => {
    const list: FinancialCategory[] = [];
    const flatten = (cats: FinancialCategory[]) => {
      cats.forEach(c => {
        list.push(c);
        if (c.subcategories) flatten(c.subcategories);
      });
    };
    flatten(categories);
    return list;
  }, [categories]);

  const handleDragStart = (e: React.DragEvent, cat: FinancialCategory) => {
    e.stopPropagation();
    if (cat.is_fixed) { e.preventDefault(); return; }
    setDraggedCat(cat);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetCat: FinancialCategory) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!draggedCat || draggedCat.id === targetCat.id) { setDragState(null); return; }
    
    const isDescendant = (childId: string, potentialParentId: string): boolean => {
      if (childId === potentialParentId) return true;
      let curr = flatCategories.find(c => c.id === childId);
      while(curr?.parent_id) {
         if (curr?.parent_id === potentialParentId) return true;
         curr = flatCategories.find(c => c.id === curr?.parent_id);
      }
      return false;
    };

    if (isDescendant(targetCat.id, draggedCat.id)) { setDragState(null); return; }

    const targetEl = (e.target as HTMLElement).closest('.category-row');
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let zone: 'top' | 'middle' | 'bottom' = 'middle';
    if (y < rect.height * 0.3) zone = 'top';
    else if (y > rect.height * 0.7) zone = 'bottom';
    if (targetCat.is_fixed && zone !== 'middle') zone = 'middle';
    setDragState({ id: targetCat.id, zone });
  };

  const handleDragLeave = (e: React.DragEvent) => { e.stopPropagation(); setDragState(null); }

  const handleDragEnd = (e: React.DragEvent) => { e.stopPropagation(); setDraggedCat(null); setDragState(null); }

  const handleDrop = async (e: React.DragEvent, targetCat: FinancialCategory) => {
    e.preventDefault(); e.stopPropagation();
    if (!draggedCat || !dragState) { setDragState(null); return; }
    const zone = dragState.zone;
    setDragState(null);

    let newParentId: string | null = null;
    let newSiblings: FinancialCategory[] = [];
    
    const getSiblings = (parentId: string | null) => flatCategories.filter(c => c.parent_id === parentId && c.id !== draggedCat.id);

    if (zone === 'middle') {
      newParentId = targetCat.id;
      newSiblings = [...(targetCat.subcategories || []), draggedCat];
    } else {
      newParentId = targetCat.parent_id || null;
      newSiblings = getSiblings(newParentId);
      const targetIndex = newSiblings.findIndex(c => c.id === targetCat.id);
      newSiblings.splice(zone === 'top' ? targetIndex : targetIndex + 1, 0, draggedCat);
    }

    const updates = newSiblings.map((c, i) => ({ id: c.id, sort_order: i }));
    try {
      if (draggedCat.parent_id !== newParentId) await financialService.updateCategory(draggedCat.id, { parent_id: newParentId } as any);
      await financialService.updateCategoriesOrder(updates);
      await load();
      if (newParentId && !expandedIds.includes(newParentId)) setExpandedIds([...expandedIds, newParentId]);
    } catch(err) { console.error(err); alert("Erro ao mover a categoria."); }
  };

  const openNew = (parentId?: string) => { 
    setEditing(null); 
    const parent = parentId ? flatCategories.find(c => c.id === parentId) : null;
    setForm({ name: '', type: parent?.type || 'expense', entity_type: parent?.entity_type || 'both', color: parent?.color || '#6366f1', icon: '', parent_id: parentId || '' }); 
    setIsModal(true); 
  };
  
  const openEdit = (cat: FinancialCategory) => { setEditing(cat); setForm({ name: cat.name, type: cat.type, entity_type: cat.entity_type, color: cat.color || '#6366f1', icon: cat.icon || '', parent_id: cat.parent_id || '' }); setIsModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      if (editing) await financialService.updateCategory(editing.id, { ...form, parent_id: form.parent_id || undefined } as any);
      else await financialService.addCategory({ ...form, user_id, is_fixed: false, parent_id: form.parent_id || undefined } as any);
      await load(); setIsModal(false);
      if (form.parent_id && !expandedIds.includes(form.parent_id)) setExpandedIds([...expandedIds, form.parent_id]);
    } catch (e) { console.error(e); alert('Erro ao salvar.'); } finally { setIsSaving(false); }
  };

  const remove = async (id: string) => {
    if (flatCategories.find(c => c.id === id)?.is_fixed) { alert('Categoria base não pode ser excluída.'); return; }
    if (!window.confirm('Excluir esta categoria?')) return;
    try { await financialService.deleteCategory(id); await load(); } catch { alert('Erro ao excluir.'); }
  };

  const toggleExpand = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const typeLabels: Record<string, string> = { income: 'Receita', expense: 'Despesa', both: 'Ambos' };
  const entityLabels: Record<string, string> = { personal: 'PF', business: 'PJ', both: 'Ambos' };

  const renderCategoryRecursive = (cat: FinancialCategory, level = 0) => {
    const isDragging = draggedCat?.id === cat.id;
    const isDropTarget = dragState?.id === cat.id;
    return (
      <div key={cat.id} className={`space-y-1 transition-all ${isDragging ? 'opacity-40' : 'opacity-100'}`}>
        {isDropTarget && dragState?.zone === 'top' && <div className="h-1 bg-indigo-500 rounded-full mx-4 my-1 opacity-80"></div>}
        <div 
          className={`category-row flex items-center rounded-2xl border p-4 transition-all group ${cat.is_fixed ? 'bg-slate-50 border-slate-200' : 'bg-white border-gray-100 hover:border-indigo-200'} ${isDropTarget && dragState?.zone === 'middle' ? 'border-2 border-indigo-400 bg-indigo-50' : ''}`}
          style={{ marginLeft: `${level * 20}px` }}
          draggable={!cat.is_fixed}
          onDragStart={(e) => handleDragStart(e, cat)}
          onDragOver={(e) => handleDragOver(e, cat)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, cat)}
        >
          <div className={`mr-3 p-1.5 ${cat.is_fixed ? 'opacity-20' : 'cursor-grab text-slate-300 hover:text-indigo-400'}`}><GripVertical className="w-4 h-4" /></div>
          <button type="button" onClick={() => toggleExpand(cat.id)} className={`mr-3 p-1 rounded-lg hover:bg-white/50 ${cat.subcategories?.length ? 'opacity-100' : 'opacity-20'}`}>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedIds.includes(cat.id) ? 'rotate-90' : ''}`} />
          </button>
          <div className="w-8 h-8 rounded-xl mr-4 flex items-center justify-center shadow-sm" style={{ backgroundColor: cat.color || '#6366f1' }}><Tag className="w-4 h-4 text-white opacity-40" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2"><p className={`font-black uppercase text-xs ${cat.is_fixed ? 'text-slate-900' : 'text-gray-800'}`}>{cat.name}</p>{cat.is_fixed && <span className="bg-slate-200 text-[8px] font-black px-2 py-0.5 rounded-full">BASE</span>}</div>
            <p className="text-[9px] text-slate-400 font-bold uppercase">{typeLabels[cat.type]} • {entityLabels[cat.entity_type]}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button type="button" onClick={() => openNew(cat.id)} className="px-3 py-1.5 text-[9px] font-black text-indigo-600 bg-indigo-50 rounded-xl">+ SUB</button>
            <button type="button" onClick={() => openEdit(cat)} className="px-3 py-1.5 text-[9px] font-black text-sky-600 bg-sky-50 rounded-xl">EDITAR</button>
            {!cat.is_fixed && <button type="button" onClick={() => remove(cat.id)} className="p-1.5 text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>}
          </div>
        </div>
        {isDropTarget && dragState?.zone === 'bottom' && <div className="h-1 bg-indigo-500 rounded-full mx-4 my-1 opacity-80"></div>}
        {expandedIds.includes(cat.id) && (
          <div className="ml-5 space-y-1">
            {cat.subcategories?.map(sub => renderCategoryRecursive(sub, level + 1))}
            <div className="py-1" style={{ marginLeft: `${(level + 1) * 20 + 20}px` }}>
              <button type="button" onClick={() => openNew(cat.id)} className="flex items-center gap-2 p-3 text-[9px] font-black text-slate-400 uppercase hover:text-indigo-600 w-full border border-dashed border-gray-100 rounded-xl"><Plus className="w-3 h-3" /> Nova Subcategoria</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-900 uppercase">Painel de Categorias</h3>
        <button onClick={() => openNew()} className="bg-[#F67C01] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 flex items-center gap-2"><Plus className="w-4 h-4" /> NOVA CATEGORIA</button>
      </div>
      <div className="space-y-3">{categories.map(cat => renderCategoryRecursive(cat))}</div>
      {isModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase">{editing ? 'Editar' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome</label>
                <input 
                  required 
                  disabled={editing?.is_fixed}
                  className={`w-full border-none rounded-xl p-4 font-bold ${editing?.is_fixed ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-gray-50'}`} 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  placeholder="Ex: Marketing" 
                />
                {editing?.is_fixed && <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase italic">* Nome reservado pelo sistema</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pai (Opcional)</label>
                  <select 
                    disabled={editing?.is_fixed}
                    className={`w-full border-none rounded-xl p-4 font-bold ${editing?.is_fixed ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-gray-50'}`} 
                    value={form.parent_id} 
                    onChange={e => {
                      const pid = e.target.value;
                      const parent = flatCategories.find(c => c.id === pid);
                      setForm({ 
                        ...form, 
                        parent_id: pid, 
                        type: parent?.type || form.type,
                        entity_type: parent?.entity_type || form.entity_type
                      });
                    }}
                  >
                    <option value="">Nenhuma (Principal)</option>
                    {flatCategories.filter(c => c.id !== editing?.id).map(c => (
                      <option key={c.id} value={c.id} className="whitespace-pre">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cor da Categoria</label>
                  <div className="flex flex-wrap gap-1">
                    {COLORS.slice(0, 6).map(c => (<button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-lg ${form.color === c ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />))}
                  </div>
                </div>
              </div>

              {!form.parent_id ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-xs" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="income">Receita</option><option value="expense">Despesa</option><option value="both">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Perfil</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-xs" value={form.entity_type} onChange={e => setForm({ ...form, entity_type: e.target.value })}>
                      <option value="personal">PF</option><option value="business">PJ</option><option value="both">Ambos</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Herda do Pai: {typeLabels[form.type]} • {entityLabels[form.entity_type]}</p>
                </div>
              )}

              <button type="submit" disabled={isSaving} className="w-full bg-[#10b981] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'SALVAR CATEGORIA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
