import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { ContentItem } from '../types';
import { SimpleModal } from '../components/SimpleModal';
import { 
  BookOpen, Plus, LayoutGrid, Calendar, List, 
  Search, Filter, ChevronRight, CheckCircle, Clock,
  ArrowLeft, Save, Edit3, Trash2, GripVertical, User
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ViewMode = 'table' | 'kanban' | 'calendar';

export const ContentManagement: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [data, profileData] = await Promise.all([
        supabaseService.getContentItems(user.id),
        supabaseService.getAllProfiles()
      ]);
      setItems(data);
      setProfiles(profileData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    try {
      const newItem = {
        user_id: user.id,
        title: 'Novo Conteúdo',
        post_date: new Date().toISOString(),
        status: 'Ideia',
        format: 'Feed',
        responsible_id: profiles.find((p:any) => p.user_id === user.id)?.name || user.id
      };
      const created = await supabaseService.addContentItem(newItem);
      setItems([created, ...items]);
      setActiveItem(created);
    } catch (e) {
      console.error(e);
      alert('Erro ao criar conteúdo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabaseService.deleteContentItem(id);
      setItems(items.filter(i => i.id !== id));
      if (activeItem?.id === id) setActiveItem(null);
      setItemToDelete(null);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir conteúdo');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<ContentItem>) => {
    try {
      // Optimistic update
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
      if (activeItem && activeItem.id === id) {
        setActiveItem({ ...activeItem, ...updates });
      }
      await supabaseService.updateContentItem(id, updates);
    } catch (e) {
      console.error(e);
      // Revert or show error
      loadData();
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-4 px-4 font-sans animate-fade-in">
      {!activeItem ? (
        <>
          <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                  <BookOpen className="h-10 w-10 text-brand-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase">Gestão de Conteúdo</span>
                  </h1>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Planejamento e Produção</p>
                </div>
              </div>
              <button 
                onClick={handleCreate}
                className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> NOVO CONTEÚDO
              </button>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex bg-gray-50 rounded-2xl p-1 w-fit">
                <button onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-indigo-500'}`}>
                  <List className="w-4 h-4" /> Tabela
                </button>
                <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-indigo-500'}`}>
                  <LayoutGrid className="w-4 h-4" /> Kanban
                </button>
                <button onClick={() => setViewMode('calendar')} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-indigo-500'}`}>
                  <Calendar className="w-4 h-4" /> Calendário
                </button>
              </div>

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar conteúdo..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : filteredItems.length === 0 && !searchQuery ? (
              <div className="text-center py-20 opacity-60">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Nenhum conteúdo criado ainda.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                {viewMode === 'table' && <ContentTableView items={filteredItems} onOpen={setActiveItem} onUpdate={handleUpdate} onDelete={setItemToDelete} profiles={profiles} />}
                {viewMode === 'kanban' && <ContentKanbanView items={filteredItems} onOpen={setActiveItem} onUpdate={handleUpdate} />}
                {viewMode === 'calendar' && <ContentCalendarView items={filteredItems} onOpen={setActiveItem} onUpdate={handleUpdate} onCreate={handleCreate} />}
              </div>
            )}
          </div>

          <SimpleModal 
            isOpen={!!itemToDelete}
            onClose={() => setItemToDelete(null)}
            onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
            title="Excluir Conteúdo"
            message="Você tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita."
            type="error"
            confirmText="Excluir"
          />
        </>
      ) : (
        <ContentDetailPage 
          item={activeItem} 
          onClose={() => setActiveItem(null)} 
          onUpdate={(updates: Partial<ContentItem>) => handleUpdate(activeItem.id, updates)} 
          onDelete={() => setItemToDelete(activeItem.id)}
          profiles={profiles}
        />
      )}
    </div>
  );
};

// --- TABLE VIEW ---
const ContentTableView = ({ items, onOpen, onUpdate, onDelete, profiles }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horário</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formato</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plataforma</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
            <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => onOpen(item)}>
              <td className="py-4 px-4 font-bold text-gray-900">{item.title || 'Sem título'}</td>
              <td className="py-4 px-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                {item.post_date ? format(parseISO(item.post_date), 'dd/MM/yyyy') : '-'}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                {item.post_time || '-'}
              </td>
              <td className="py-4 px-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{item.format || '-'}</span>
              </td>
              <td className="py-4 px-4">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">{item.platform || '-'}</span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {profiles.find((p:any) => p.user_id === item.responsible_id)?.name || item.responsible_id || '-'}
              </td>
              <td className="py-4 px-4 text-right">
                <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- KANBAN VIEW ---
const ContentKanbanView = ({ items, onOpen, onUpdate }: any) => {
  const columns = ['Ideia', 'Produção', 'Revisão', 'Postado'];
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedId) {
      onUpdate(draggedId, { status });
      setDraggedId(null);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
      {columns.map(col => (
        <div key={col} className="min-w-[300px] flex-1 snap-start" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, col)}>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-500">{col}</h3>
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-xs font-bold">{items.filter((i:any) => i.status === col).length}</span>
          </div>
          <div className="bg-gray-50 rounded-[2rem] p-4 min-h-[500px] space-y-3">
            {items.filter((i:any) => i.status === col).map((item:any) => (
              <div 
                key={item.id} 
                draggable 
                onDragStart={() => setDraggedId(item.id)}
                onClick={() => onOpen(item)}
                className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-all ${draggedId === item.id ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{item.format || '-'}</span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{item.platform || '-'}</span>
                  </div>
                  <GripVertical className="w-4 h-4 text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-900 leading-tight mb-3">{item.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.post_date ? format(parseISO(item.post_date), 'dd/MM') : '-'}</span>
                  {item.post_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.post_time}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- CALENDAR VIEW ---
const ContentCalendarView = ({ items, onOpen, onUpdate, onCreate }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <button onClick={nextMonth} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className="bg-gray-50 py-2 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">{d}</div>
        ))}
        {days.map((day, i) => {
          const dayItems = items.filter((item:any) => item.post_date && isSameDay(parseISO(item.post_date), day));
          return (
            <div key={day.toString()} className={`min-h-[100px] bg-white p-2 ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`} onClick={() => {
               // Optional: create item on this day
            }}>
              <span className={`text-xs font-bold ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500'}`}>{format(day, 'd')}</span>
              <div className="mt-1 space-y-1">
                {dayItems.map((item:any) => (
                  <div key={item.id} onClick={(e) => { e.stopPropagation(); onOpen(item); }} className="text-[10px] bg-indigo-50 text-indigo-700 p-1 rounded font-bold truncate cursor-pointer hover:bg-indigo-100">
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- DETAIL PAGE ---
const ContentDetailPage = ({ item, onClose, onUpdate, onDelete, profiles }: any) => {
  const [data, setData] = useState<ContentItem>(item);
  const [saveTimeout, setSaveTimeout] = useState<any>(null);

  const handleChange = (field: keyof ContentItem, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    
    // Autosave
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(() => {
      onUpdate({ [field]: value });
    }, 1000));
  };

  return (
    <div className="bg-white rounded-[3rem] min-h-[800px] border border-gray-100 shadow-2xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> VOLTAR
        </button>
        <div className="flex items-center gap-4">
          <button onClick={onDelete} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" /> Salvo automaticamente
          </span>
        </div>
      </div>

      <div className="p-10 max-w-4xl mx-auto w-full space-y-10">
        <input 
          type="text" 
          value={data.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Título do Post"
          className="w-full text-5xl font-black text-gray-900 border-none outline-none focus:ring-0 p-0 placeholder:text-gray-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <select value={data.status} onChange={e => handleChange('status', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option value="Ideia">Ideia</option>
              <option value="Produção">Produção</option>
              <option value="Revisão">Revisão</option>
              <option value="Postado">Postado</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</label>
            <input 
              type="date" 
              value={data.post_date ? data.post_date.split('T')[0] : ''} 
              onChange={e => handleChange('post_date', e.target.value ? e.target.value + 'T12:00:00Z' : null)} 
              className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horário</label>
            <input type="time" value={data.post_time || ''} onChange={e => handleChange('post_time', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plataforma</label>
            <select value={data.platform || ''} onChange={e => handleChange('platform', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option value="">Selecione...</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formato</label>
            <select value={data.format} onChange={e => handleChange('format', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option value="Reels">Reels</option>
              <option value="Carrossel">Carrossel</option>
              <option value="Story">Story</option>
              <option value="Feed">Feed</option>
              <option value="Vídeo">Vídeo</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</label>
            <input list="content-profiles" value={profiles.find((p:any) => p.user_id === data.responsible_id)?.name || data.responsible_id || ''} onChange={e => handleChange('responsible_id', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Nome do responsável" />
            <datalist id="content-profiles">
              {profiles.map((p:any) => (
                <option key={p.user_id} value={p.name} />
              ))}
            </datalist>
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <label className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Link</label>
            <input type="url" value={data.content_link || ''} onChange={e => handleChange('content_link', e.target.value)} placeholder="https://" className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="space-y-8">
          <ContentBlock title="GANCHO INICIAL / TÍTULO" value={data.hook || ''} onChange={(val:any) => handleChange('hook', val)} placeholder="Qual a frase de impacto que vai prender a atenção nos primeiros 3 segundos?" />
          <ContentBlock title="ORIENTAÇÕES DE GRAVAÇÃO E DESIGN" value={data.design_guidelines || ''} onChange={(val:any) => handleChange('design_guidelines', val)} placeholder="Descreva o cenário, estilo visual, referências, cores, texturas..." isTextArea />
          <ContentBlock title="ROTEIRO DO POST" value={data.script || ''} onChange={(val:any) => handleChange('script', val)} placeholder="Escreva o roteiro completo aqui..." isTextArea />
          <ContentBlock title="LEGENDA" value={data.caption || ''} onChange={(val:any) => handleChange('caption', val)} placeholder="Legenda para a rede social, com hashtags..." isTextArea />
          <ContentBlock title="OBSERVAÇÕES" value={data.notes || ''} onChange={(val:any) => handleChange('notes', val)} placeholder="Notas adicionais..." isTextArea />
        </div>
      </div>
    </div>
  );
};

const ContentBlock = ({ title, value, onChange, placeholder, isTextArea }: any) => {
  return (
    <div className="group">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {title}
      </h3>
      {isTextArea ? (
        <textarea 
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl p-4 text-gray-700 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-y min-h-[100px]"
        />
      ) : (
        <input 
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl p-4 text-gray-700 font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-600';
  if (status === 'Ideia') color = 'bg-sky-100 text-sky-700';
  if (status === 'Produção') color = 'bg-amber-100 text-amber-700';
  if (status === 'Revisão') color = 'bg-purple-100 text-purple-700';
  if (status === 'Postado') color = 'bg-emerald-100 text-emerald-700';

  return (
    <span className={`${color} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
      {status}
    </span>
  );
};
