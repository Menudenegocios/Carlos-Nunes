import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialTransaction, FinancialAccount, FinancialCategory } from '../../types';
import { Plus, X, Trash2, RefreshCw, TrendingUp, TrendingDown, Search, Filter, CheckSquare, Square, FileText, Upload, Download, Check, AlertCircle, Tag } from 'lucide-react';

interface Props { user_id: string; entityFilter: 'personal' | 'business'; }

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export const TransactionList: React.FC<Props> = ({ user_id, entityFilter }) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isOFXModal, setIsOFXModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<FinancialTransaction | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAccount, setFilterAccount] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [batchCategory, setBatchCategory] = useState('');
  
  // Batch Edit Individual
  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [batchEditedTransactions, setBatchEditedTransactions] = useState<Record<string, string>>({});

  // OFX Import State
  const [ofxTransactions, setOfxTransactions] = useState<any[]>([]);
  const [importStep, setImportStep] = useState(1); // 1: Upload, 2: Categorize
  const [defaultImportAccount, setDefaultImportAccount] = useState('');
  
  // Quick Category Creation State
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState<{show: boolean, txId: string | null, type: 'income' | 'expense' | null}>({show: false, txId: null, type: null});
  const [newCatName, setNewCatName] = useState('');

  const emptyForm = { description: '', value: 0, type: 'expense' as 'income' | 'expense', date: new Date().toISOString().split('T')[0], account_id: '', category_id: '', status: 'realized' as 'predicted' | 'realized', entity_type: entityFilter as any, observation: '', is_recurring: false, recurrence_period: '', tags: [] as string[], is_conciliated: false, has_invoice: false };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); loadMeta(); }, [entityFilter]);

  const loadMeta = async () => {
    try {
      const [acc, cat] = await Promise.all([financialService.getAccounts(user_id), financialService.getAllCategoriesFlat(user_id)]);
      setAccounts(acc); setCategories(cat);
    } catch (e) { console.error(e); }
  };

  const load = async () => {
    try {
      const filters: any = {};
      filters.entity_type = entityFilter;
      if (filterType) filters.type = filterType;
      if (filterStatus) filters.status = filterStatus;
      if (filterAccount) filters.account_id = filterAccount;
      if (search) filters.search = search;
      const data = await financialService.getTransactions(user_id, filters);
      setTransactions(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, filterType, filterStatus, filterAccount]);

  const openNew = (type?: 'income' | 'expense') => {
    setEditing(null);
    const defaultAccount = accounts.find(a => a.entity_type === entityFilter);
    setForm({ ...emptyForm, type: type || 'expense', account_id: defaultAccount?.id || '', entity_type: entityFilter as any });
    setIsModal(true);
  };

  const parseOFX = (text: string) => {
    const transactions: any[] = [];
    const stmTrnMatches = text.match(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/g);
    
    if (stmTrnMatches) {
      stmTrnMatches.forEach(match => {
        const trnType = match.match(/<TRNTYPE>(.*)/)?.[1]?.trim();
        const dtPosted = match.match(/<DTPOSTED>(\d{8})/)?.[1];
        const trnAmt = match.match(/<TRNAMT>([^<]*)/)?.[1]?.trim().replace(',', '.');
        const name = match.match(/<NAME>([^<]*)/)?.[1]?.trim() || match.match(/<MEMO>([^<]*)/)?.[1]?.trim() || 'Sem nome';
        
        if (dtPosted && trnAmt) {
          const date = `${dtPosted.slice(0, 4)}-${dtPosted.slice(4, 6)}-${dtPosted.slice(6, 8)}`;
          const amount = parseFloat(trnAmt);
          transactions.push({
            id: Math.random().toString(36).substr(2, 9),
            description: name,
            value: Math.abs(amount),
            type: amount > 0 ? 'income' : 'expense',
            date,
            account_id: '',
            category_id: '',
            status: 'realized',
            has_invoice: false
          });
        }
      });
    }
    return transactions;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseOFX(text);
      
      // Auto-set default account if only one exists for this entity
      const entityAccounts = accounts.filter(a => a.entity_type === entityFilter);
      const initialAccountId = entityAccounts.length === 1 ? entityAccounts[0].id : '';
      setDefaultImportAccount(initialAccountId);
      
      setOfxTransactions(parsed.map(t => ({ ...t, account_id: initialAccountId })));
      setImportStep(2);
    };
    reader.readAsText(file);
  };

  const removeOfxItem = (id: string) => {
    setOfxTransactions(prev => prev.filter(t => t.id !== id));
  };

  const applyDefaultAccountToAll = (accountId: string) => {
    setDefaultImportAccount(accountId);
    setOfxTransactions(prev => prev.map(t => ({ ...t, account_id: accountId })));
  };

  const [quickParentId, setQuickParentId] = useState<string>('');

  const handleQuickAddCategory = async () => {
    if (!newCatName || !showQuickCategoryModal.type) return;
    setIsSaving(true);
    try {
      const newCat = await financialService.addCategory({
        name: newCatName,
        type: showQuickCategoryModal.type,
        parent_id: quickParentId || undefined,
        user_id,
        entity_type: entityFilter as any,
        color: showQuickCategoryModal.type === 'income' ? '#10b981' : '#f43f5e',
        dre_group: showQuickCategoryModal.type === 'income' ? 'gross_revenue' : 'operating_expenses_variable'
      });
      
      setCategories(prev => [...prev, newCat]);
      
      // Update the transaction that triggered the creation
      if (showQuickCategoryModal.txId) {
        // Try OFX list
        const ofxIdx = ofxTransactions.findIndex(t => t.id === showQuickCategoryModal.txId);
        if (ofxIdx !== -1) {
          const newTxs = [...ofxTransactions];
          newTxs[ofxIdx].category_id = newCat.id;
          setOfxTransactions(newTxs);
        } else {
          // Try batch edit state
          setBatchEditedTransactions(prev => ({
            ...prev,
            [showQuickCategoryModal.txId as string]: newCat.id
          }));
        }
      } else {
        // If coming from main modal
        setForm(prev => ({ ...prev, category_id: newCat.id }));
      }
      
      setShowQuickCategoryModal({ show: false, txId: null, type: null });
      setNewCatName('');
      setQuickParentId('');
    } catch (e) {
      console.error(e);
      alert('Erro ao criar categoria.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmOFXImport = async () => {
    const validOnes = ofxTransactions.filter(t => t.description && t.account_id);
    if (validOnes.length === 0) return alert('Selecione uma conta para as transações.');
    
    setIsSaving(true);
    try {
      for (const tx of validOnes) {
        const { id, ...payload } = tx;
        await financialService.addTransaction({ ...payload, user_id, entity_type: entityFilter } as any);
      }
      // Batch recalc accounts
      const accountsToUpdate = [...new Set(validOnes.map(t => t.account_id))];
      for (const aid of accountsToUpdate) await financialService.recalculateAccountBalance(aid, user_id);
      
      setIsOFXModal(false); setOfxTransactions([]); setImportStep(1); await load();
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const openEdit = (tx: FinancialTransaction) => {
    setEditing(tx);
    setForm({ description: tx.description, value: tx.value, type: tx.type, date: tx.date, account_id: tx.account_id, category_id: tx.category_id || '', status: tx.status, entity_type: tx.entity_type as any, observation: tx.observation || '', is_recurring: tx.is_recurring, recurrence_period: tx.recurrence_period || '', tags: tx.tags || [], is_conciliated: tx.is_conciliated, has_invoice: !!tx.has_invoice });
    setIsModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.account_id) { alert('Selecione uma conta.'); return; }
    setIsSaving(true);
    try {
      const payload: any = { ...form, user_id, category_id: form.category_id || null };
      if (editing) { await financialService.updateTransaction(editing.id, payload); }
      else { await financialService.addTransaction(payload); }
      await financialService.recalculateAccountBalance(form.account_id, user_id);
      if (editing && editing.account_id !== form.account_id) await financialService.recalculateAccountBalance(editing.account_id, user_id);
      setIsModal(false); await load();
    } catch (e) { console.error(e); alert('Erro ao salvar.'); }
    finally { setIsSaving(false); }
  };

  const remove = async (id: string, account_id: string) => {
    if (!window.confirm('Excluir este lançamento?')) return;
    try { await financialService.deleteTransaction(id); await financialService.recalculateAccountBalance(account_id, user_id); await load(); }
    catch (e) { console.error(e); }
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(selectedIds.length === transactions.length ? [] : transactions.map(t => t.id));

  const batchDelete = async () => {
    if (!window.confirm(`Excluir ${selectedIds.length} lançamentos?`)) return;
    try {
      await financialService.batchDeleteTransactions(selectedIds);
      const affectedAccounts = [...new Set(transactions.filter(t => selectedIds.includes(t.id)).map(t => t.account_id))];
      for (const accId of affectedAccounts) await financialService.recalculateAccountBalance(accId, user_id);
      setSelectedIds([]); await load();
    } catch (e) { console.error(e); }
  };

  const batchUpdateCategory = async () => {
    if (!batchCategory || selectedIds.length === 0) return;
    try {
      await financialService.batchUpdateTransactions(selectedIds, { category_id: batchCategory });
      setSelectedIds([]); setBatchCategory(''); await load();
    } catch (e) { console.error(e); }
  };

  const handleBatchIndividualSave = async () => {
    const ids = Object.keys(batchEditedTransactions);
    if (ids.length === 0) { setIsBatchEditing(false); return; }
    
    setIsSaving(true);
    try {
      for (const id of ids) {
        await financialService.updateTransaction(id, { category_id: batchEditedTransactions[id] });
      }
      setIsBatchEditing(false); setBatchEditedTransactions({}); setSelectedIds([]); await load();
    } catch (e) { console.error(e); alert('Erro ao salvar algumas transações.'); }
    finally { setIsSaving(false); }
  };

  const toggleInvoice = async (id: string, current: boolean) => {
    try {
      await financialService.updateTransaction(id, { has_invoice: !current });
      await load();
    } catch (e) { console.error(e); }
  };

  const filteredAccounts = accounts.filter(a => a.entity_type === entityFilter);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 font-bold text-sm" placeholder="Buscar lançamentos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => openNew('income')} className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm">
            <Plus className="w-3 h-3" /> RECEITA
          </button>
          <button onClick={() => openNew('expense')} className="bg-rose-600 text-white px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 shadow-sm">
            <Plus className="w-3 h-3" /> DESPESA
          </button>
          <button onClick={() => setIsOFXModal(true)} className="bg-[#0F172A] text-white px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
            <Upload className="w-3 h-3" /> IMPORTAR OFX
          </button>
        </div>

        <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl transition-all ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-100 text-slate-600 shadow-sm'}`}>
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Todos os tipos</option><option value="income">Receitas</option><option value="expense">Despesas</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option><option value="realized">Realizado</option><option value="predicted">Previsto</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
            <option value="">Todas as contas</option>
            {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      {/* Batch actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col md:flex-row items-center gap-3 bg-[#0F172A] text-white border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedIds.length} selecionados</span>
            <div className="w-px h-4 bg-slate-700 hidden md:block" />
          </div>
          
          {isBatchEditing ? (
            <div className="flex-1 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <button onClick={handleBatchIndividualSave} disabled={isSaving} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                {isSaving ? <RefreshCw className="animate-spin w-3 h-3" /> : <Check className="w-3 h-3" />} SALVAR TUDO
              </button>
              <button onClick={() => { setIsBatchEditing(false); setBatchEditedTransactions({}); }} className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest px-4 py-2 border border-slate-700 rounded-xl transition-all">CANCELAR</button>
            </div>
          ) : (
            <div className="flex-1 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500" value={batchCategory} onChange={e => setBatchCategory(e.target.value)}>
                <option value="">Aplicar mesma categoria...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.parent_id ? '↳ ' : ''}{c.name}</option>)}
              </select>
              {batchCategory && <button onClick={batchUpdateCategory} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700">APLICAR</button>}
              
              <div className="w-px h-4 bg-slate-700 hidden md:block" />
              
              <button 
                onClick={() => setIsBatchEditing(true)}
                className="text-[9px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-widest px-4 py-2 border border-amber-400/20 rounded-xl hover:bg-amber-400/5 transition-all flex items-center gap-2"
              >
                <Tag className="w-3 h-3" /> EDITAR CATEGORIAS INDIVIDUALMENTE
              </button>
              
              <button onClick={batchDelete} className="ml-auto text-[9px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest flex items-center gap-2 px-4 py-2 border border-rose-400/10 rounded-xl hover:bg-rose-400/5 transition-all">
                <Trash2 className="w-3 h-3" /> EXCLUIR TODOS
              </button>
            </div>
          )}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {transactions.length > 0 && (
          <div className="flex items-center px-5 py-3 border-b border-gray-50 bg-gray-50/50">
            <button onClick={selectAll} className="mr-3">{selectedIds.length === transactions.length ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-300" />}</button>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex-1">{transactions.length} lançamentos</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-32 text-right mr-4">Categoria</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-24 text-right mr-4">Valor</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-12 text-center">NF?</span>
            <span className="w-8 ml-2"></span>
          </div>
        )}
        {transactions.map(tx => (
          <div key={tx.id} className="flex items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all group">
            <button onClick={() => toggleSelect(tx.id)} className="mr-3">
              {selectedIds.includes(tx.id) ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-200 group-hover:text-slate-400" />}
            </button>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(tx)}>
              <div className="flex items-center flex-wrap gap-2 max-w-[250px] md:max-w-[400px]">
                {tx.account_name && (
                  <span 
                    className="text-[7px] font-black px-1.5 py-0.5 rounded-md text-white uppercase tracking-tighter"
                    style={{ backgroundColor: tx.account_color || '#64748b' }}
                  >
                    {tx.account_name}
                  </span>
                )}
                <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 whitespace-normal break-words">{tx.description}</p>
                {tx.status === 'predicted' && <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md uppercase flex-shrink-0">Previsto</span>}
                {tx.is_conciliated && <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase flex-shrink-0">✓</span>}
              </div>
              
              <p className="text-[9px] text-slate-400 font-bold mt-1">{new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="w-32 text-right mr-4 group/cat">
              {isBatchEditing && selectedIds.includes(tx.id) ? (
                <div className="relative">
                  <select 
                    className="w-full bg-slate-100 hover:bg-slate-200 border-none rounded-lg pl-2 pr-6 py-1.5 text-[9px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer text-slate-700"
                    value={batchEditedTransactions[tx.id] || tx.category_id || ''}
                    onChange={e => {
                      if (e.target.value === 'NEW_CATEGORY') {
                        setShowQuickCategoryModal({ show: true, txId: tx.id, type: tx.type });
                        return;
                      }
                      setBatchEditedTransactions({...batchEditedTransactions, [tx.id]: e.target.value});
                    }}
                  >
                    <option value="" className="text-slate-400">SELECIONAR...</option>
                    <optgroup label="Minhas Categorias">
                      {categories.filter(c => c.type === tx.type || c.type === 'both').map(c => (
                        <option key={c.id} value={c.id} className="text-slate-900 font-bold bg-white">
                          {c.parent_id ? '↳ ' : ''}{c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Atalhos">
                      <option value="NEW_CATEGORY" className="text-indigo-600 font-extrabold">+ NOVA CATEGORIA</option>
                    </optgroup>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Tag className="w-2.5 h-2.5" />
                  </div>
                </div>
              ) : (
                tx.category_name && (
                  <span 
                    className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm border border-black/5"
                    style={{ backgroundColor: `${tx.category_color}15` || '#f1f5f9', color: tx.category_color || '#64748b' }}
                  >
                    {tx.category_name}
                  </span>
                )
              )}
            </div>

            <p className={`w-24 text-right mr-4 text-sm font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {tx.type === 'income' ? '+' : '-'} R$ {Number(tx.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>

            <div className="w-12 flex justify-center">
              <button 
                onClick={() => toggleInvoice(tx.id, tx.has_invoice || false)} 
                className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${tx.has_invoice ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 hover:border-indigo-400'}`}
              >
                {tx.has_invoice && <Check className="w-3 h-3" />}
              </button>
            </div>
            <button onClick={() => remove(tx.id, tx.account_id)} className="p-1.5 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-16 opacity-40">
            <TrendingUp className="w-10 h-10 mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhum lançamento encontrado</p>
          </div>
        )}
      </div>

      {/* Main Modal */}
      {isModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{editing ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
              <div className="flex gap-2">
                {editing && <button onClick={() => { remove(editing.id, editing.account_id); setIsModal(false); }} className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-xl"><Trash2 className="w-5 h-5" /></button>}
                <button onClick={() => setIsModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <form onSubmit={save} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setForm({ ...form, description: `Prestação de serviço audiovisual - Serviços - ref. ${MONTH_NAMES[new Date().getMonth()]}/${new Date().getFullYear()}` })} className="text-[8px] font-black text-indigo-500 hover:text-indigo-700 uppercase">Sugestão Receita</button>
                    <button type="button" onClick={() => setForm({ ...form, description: `Custo direto de produção - Projeto [Nome]` })} className="text-[8px] font-black text-amber-500 hover:text-amber-700 uppercase">Sugestão Custo</button>
                    <button type="button" onClick={() => setForm({ ...form, description: `Despesa operacional - ${categories.find(c => c.id === form.category_id)?.name || 'Geral'}` })} className="text-[8px] font-black text-rose-500 hover:text-rose-700 uppercase">Sugestão Despesa</button>
                  </div>
                </div>
                <input required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-300" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Mensalidade Cliente X" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor (R$)</label>
                  <input required type="number" step="0.01" min="0.01" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.value || ''} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
                    <option value="income">Receita (+)</option><option value="expense">Despesa (-)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Data</label>
                  <input required type="date" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                    <option value="realized">Realizado</option><option value="predicted">Previsto</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Conta *</label>
                  <select required className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.account_id} onChange={e => setForm({ ...form, account_id: e.target.value })}>
                    <option value="">Selecione...</option>
                    {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.category_id} onChange={e => {
                    if (e.target.value === 'NEW_CATEGORY') {
                      setShowQuickCategoryModal({ show: true, txId: null, type: form.type });
                      return;
                    }
                    setForm({ ...form, category_id: e.target.value });
                  }}>
                    <option value="">Sem categoria</option>
                    <optgroup label="Disponíveis">
                      {categories
                        .filter(c => c.type === form.type)
                        .map(c => (<option key={c.id} value={c.id}>{c.parent_id ? '↳ ' : ''}{c.name}</option>))}
                    </optgroup>
                    <optgroup label="Ações">
                      <option value="NEW_CATEGORY" className="text-indigo-600 font-black">+ CRIAR NOVA</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              
              <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={form.has_invoice} onChange={e => setForm({ ...form, has_invoice: e.target.checked })} />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Possui NF (Nota Fiscal)?</span>
                </div>
              </label>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Perfil</label>
                <select className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={form.entity_type} onChange={e => setForm({ ...form, entity_type: e.target.value as any })}>
                  <option value="personal">Pessoa Física (PF)</option><option value="business">Pessoa Jurídica (PJ)</option>
                </select>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-lg">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : (editing ? 'Atualizar Lançamento' : 'Salvar Lançamento')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OFX Importer Modal */}
      {isOFXModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Importar Arquivo OFX</h3>
              <button onClick={() => { setIsOFXModal(false); setOfxTransactions([]); setImportStep(1); }} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              {importStep === 1 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">Selecione o arquivo .OFX</h4>
                  <p className="text-sm text-slate-500 mb-8 max-w-sm text-center font-medium">Faça o upload do extrato exportado do seu banco para categorizar os lançamentos automaticamente.</p>
                  <input type="file" accept=".ofx" onChange={handleFileUpload} className="hidden" id="ofx-file" />
                  <label htmlFor="ofx-file" className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all cursor-pointer shadow-lg">
                    Escolher Arquivo
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="md:col-span-1">
                      <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Revisão de Lançamentos</h4>
                      <p className="text-[10px] text-indigo-600 font-bold">{ofxTransactions.length} transações identificadas.</p>
                    </div>
                    
                    <div className="md:col-span-1">
                      <label className="block text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Aplicar banco em todos:</label>
                      <select 
                        className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-300 transition-all outline-none"
                        value={defaultImportAccount}
                        onChange={e => applyDefaultAccountToAll(e.target.value)}
                      >
                        <option value="">Selecione o banco...</option>
                        {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button onClick={confirmOFXImport} disabled={isSaving || ofxTransactions.length === 0} className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                        {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <><Check className="w-4 h-4" /> IMPORTAR ({ofxTransactions.length})</>}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="col-span-1">Data</div>
                      <div className="col-span-3">Descrição Original</div>
                      <div className="col-span-2">Valor</div>
                      <div className="col-span-2">Banco Destino</div>
                      <div className="col-span-2">Categoria</div>
                      <div className="col-span-1 text-center">NF?</div>
                      <div className="col-span-1 text-right pr-2">Ação</div>
                    </div>
                    {ofxTransactions.map((tx, idx) => (
                      <div key={tx.id} className="grid grid-cols-12 items-center gap-3 bg-white border border-gray-100 p-3 rounded-2xl hover:border-indigo-200 transition-all group">
                        <div className="col-span-1 text-[10px] font-black text-slate-500">{new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                        <div className="col-span-3">
                          <input className="w-full text-xs font-bold bg-gray-50 border-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-100 outline-none" value={tx.description} onChange={e => {
                            const newTxs = [...ofxTransactions];
                            newTxs[idx].description = e.target.value;
                            setOfxTransactions(newTxs);
                          }} />
                        </div>
                        <div className="col-span-2 font-black text-[11px]" style={{ color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}>
                          {tx.type === 'income' ? '+' : '-'} R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="col-span-2">
                          <select className="w-full text-[10px] font-black bg-gray-100 border-none rounded-lg px-2 py-2 outline-none" value={tx.account_id} onChange={e => {
                            const newTxs = [...ofxTransactions];
                            newTxs[idx].account_id = e.target.value;
                            setOfxTransactions(newTxs);
                          }}>
                            <option value="">Selecione Banco...</option>
                            {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <select className="w-full text-[10px] font-bold bg-gray-50 border-none rounded-lg px-2 py-2 outline-none" value={tx.category_id} onChange={e => {
                            if (e.target.value === 'NEW_CATEGORY') {
                              setShowQuickCategoryModal({ show: true, txId: tx.id, type: tx.type });
                              return;
                            }
                            const newTxs = [...ofxTransactions];
                            newTxs[idx].category_id = e.target.value;
                            setOfxTransactions(newTxs);
                          }}>
                            <option value="">Categoria...</option>
                            <optgroup label="Selecione">
                              {categories
                                .filter(c => c.type === tx.type)
                                .map(c => <option key={c.id} value={c.id}>{c.parent_id ? '↳ ' : ''}{c.name}</option>)
                              }
                            </optgroup>
                            <optgroup label="Ações">
                              <option value="NEW_CATEGORY" className="text-indigo-600 font-black">+ CRIAR NOVA</option>
                            </optgroup>
                          </select>
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-indigo-600" checked={tx.has_invoice} onChange={e => {
                            const newTxs = [...ofxTransactions];
                            newTxs[idx].has_invoice = e.target.checked;
                            setOfxTransactions(newTxs);
                          }} />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button 
                            onClick={() => removeOfxItem(tx.id)}
                            className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Remover este lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Quick Category Modal */}
      {showQuickCategoryModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-scale-in">
            <div className={`p-4 text-white flex justify-between items-center ${showQuickCategoryModal.type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nova Categoria de {showQuickCategoryModal.type === 'income' ? 'Receita' : 'Despesa'}
              </h4>
              <button onClick={() => setShowQuickCategoryModal({show: false, txId: null, type: null})} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
             <div className="p-6 space-y-4">
              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Pai (Opcional - p/ Subcategoria)</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-xs focus:ring-2 focus:ring-indigo-100 outline-none"
                  value={quickParentId}
                  onChange={e => setQuickParentId(e.target.value)}
                >
                  <option value="">Sem Categoria Pai</option>
                  {categories
                    .filter(c => !c.parent_id && (c.type === showQuickCategoryModal.type || c.type === 'both'))
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Nome da Categoria</label>
                <input 
                  autoFocus
                  className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none" 
                  placeholder="Ex: Aluguel, Alimentação..." 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleQuickAddCategory()}
                />
              </div>

              <button 
                onClick={handleQuickAddCategory}
                disabled={!newCatName || isSaving}
                className="w-full bg-[#0F172A] text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-50 mt-2"
              >
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4 mx-auto" /> : 'CRIAR CATEGORIA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
