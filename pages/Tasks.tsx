
import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical, CheckCircle, Clock, Circle, DollarSign, User, Briefcase, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

interface Deal {
  id: string;
  client_name: string;
  title: string; // Product or Service
  value: number;
  status: 'prospecting' | 'proposal' | 'negotiation' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

export const Tasks: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('menu_crm_deals');
    return saved ? JSON.parse(saved) : [
      { id: '1', client_name: 'Empório do Pão', title: 'Consultoria Mensal', value: 1500, status: 'negotiation', priority: 'high' },
      { id: '2', client_name: 'Academia Fit', title: 'Gestão de Redes Sociais', value: 800, status: 'prospecting', priority: 'medium' },
      { id: '3', client_name: 'Restaurante Sabor', title: 'Criação de Site', value: 2500, status: 'closed', priority: 'high' },
    ];
  });

  // Drag and Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Form State
  const [newDeal, setNewDeal] = useState({ client_name: '', title: '', value: '' });
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('menu_crm_deals', JSON.stringify(deals));
  }, [deals]);

  const addDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.client_name.trim() || !newDeal.title.trim()) return;

    const deal: Deal = {
      id: Date.now().toString(),
      client_name: newDeal.client_name,
      title: newDeal.title,
      value: Number(newDeal.value) || 0,
      status: 'prospecting',
      priority
    };

    setDeals([...deals, deal]);
    setNewDeal({ client_name: '', title: '', value: '' });
    setIsFormOpen(false);
  };

  const deleteDeal = (id: string) => {
    if (window.confirm('Remover esta oportunidade?')) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const moveDeal = (id: string, currentStatus: Deal['status'], direction: 'next' | 'prev') => {
    const stages: Deal['status'][] = ['prospecting', 'proposal', 'negotiation', 'closed'];
    const currentIndex = stages.indexOf(currentStatus);
    
    if (direction === 'next' && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setDeals(deals.map(d => d.id === id ? { ...d, status: nextStage } : d));
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevStage = stages[currentIndex - 1];
      setDeals(deals.map(d => d.id === id ? { ...d, status: prevStage } : d));
    }
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Visual tweak for the ghost image opacity if needed, 
    // but standard browser behavior usually suffices.
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Deal['status']) => {
    e.preventDefault();
    if (!draggedId) return;

    const updatedDeals = deals.map(d => 
      d.id === draggedId ? { ...d, status: targetStatus } : d
    );
    setDeals(updatedDeals);
    setDraggedId(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const totalPipeline = deals.filter(d => d.status !== 'closed').reduce((acc, curr) => acc + curr.value, 0);
  const totalClosed = deals.filter(d => d.status === 'closed').reduce((acc, curr) => acc + curr.value, 0);

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const Column = ({ title, status, icon: Icon, color, accentColor }: { title: string, status: Deal['status'], icon: any, color: string, accentColor: string }) => {
    const columnDeals = deals.filter(d => d.status === status);
    const columnTotal = columnDeals.reduce((acc, curr) => acc + curr.value, 0);
    const isDragTarget = draggedId && deals.find(d => d.id === draggedId)?.status !== status;

    return (
      <div 
        className={`flex flex-col h-full bg-gray-50 rounded-2xl border transition-colors min-w-[300px] w-full md:w-[320px] ${isDragTarget ? 'border-dashed border-indigo-400 bg-indigo-50/30' : 'border-gray-200'}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        {/* Column Header */}
        <div className={`p-4 rounded-t-xl border-b border-gray-100 bg-white`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 font-bold ${accentColor}`}>
               <Icon className="w-5 h-5" />
               <h3>{title}</h3>
            </div>
            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs font-bold text-gray-600">
              {columnDeals.length}
            </span>
          </div>
          <div className="text-xs font-medium text-gray-500">
             Total: <span className="text-gray-900 font-bold">{formatCurrency(columnTotal)}</span>
          </div>
          <div className={`h-1 w-full rounded-full mt-3 ${color.replace('text', 'bg').replace('700', '200')}`}>
             <div className={`h-full rounded-full ${color.replace('text', 'bg').replace('700', '500')} w-1/3`}></div>
          </div>
        </div>

        {/* Deals List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {columnDeals.map(deal => (
            <div 
              key={deal.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, deal.id)}
              className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm group hover:shadow-md transition-all relative cursor-grab active:cursor-grabbing ${draggedId === deal.id ? 'opacity-50 ring-2 ring-indigo-400 rotate-2' : ''}`}
            >
               
               {/* Priority Tag & Actions */}
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                   <GripVertical className="w-4 h-4 text-gray-300" />
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(deal.priority)}`}>
                     {deal.priority === 'high' ? 'Quente' : deal.priority === 'medium' ? 'Morno' : 'Frio'}
                   </span>
                 </div>
                 <button 
                   onClick={() => deleteDeal(deal.id)} 
                   className="text-gray-300 hover:text-red-500 transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
               
               {/* Deal Info */}
               <h4 className="font-bold text-gray-900 mb-1">{deal.client_name}</h4>
               <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                 <Briefcase className="w-3 h-3" /> {deal.title}
               </p>
               
               {/* Value */}
               <div className="bg-gray-50 p-2 rounded-lg text-center mb-3">
                 <span className="text-sm font-bold text-gray-900">{formatCurrency(deal.value)}</span>
               </div>
               
               {/* Controls (kept for accessibility) */}
               <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => moveDeal(deal.id, status, 'prev')} 
                    className={`text-gray-400 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors ${status === 'prospecting' ? 'invisible' : ''}`}
                    title="Mover para trás"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => moveDeal(deal.id, status, 'next')} 
                    className={`text-gray-400 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors ${status === 'closed' ? 'invisible' : ''}`}
                    title="Mover para frente"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
          {columnDeals.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl mx-2">
              <p className="text-xs">Arraste ou adicione aqui</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100 overflow-hidden">
      
      {/* 1. Header & Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
                Pipeline de Vendas
              </h1>
              <p className="text-sm text-gray-500">Gerencie seus negócios e acompanhe o funil.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                 <p className="text-xs text-blue-600 font-bold uppercase">Em Aberto</p>
                 <p className="text-lg font-bold text-blue-900">{formatCurrency(totalPipeline)}</p>
              </div>
              <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                 <p className="text-xs text-green-600 font-bold uppercase">Fechado</p>
                 <p className="text-lg font-bold text-green-900">{formatCurrency(totalClosed)}</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" /> Novo Negócio
              </button>
           </div>
        </div>

        {/* Quick Add Form */}
        {isFormOpen && (
          <form onSubmit={addDeal} className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-[fade-in-down_0.2s_ease-out]">
             <h4 className="text-sm font-bold text-gray-700 mb-3">Adicionar Nova Oportunidade</h4>
             <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                   <input 
                     required
                     type="text" 
                     placeholder="Nome do Cliente" 
                     className="w-full border-gray-300 rounded-lg text-sm"
                     value={newDeal.client_name}
                     onChange={(e) => setNewDeal({...newDeal, client_name: e.target.value})}
                   />
                </div>
                <div className="flex-1">
                   <input 
                     required
                     type="text" 
                     placeholder="Serviço/Produto (Ex: Consultoria)" 
                     className="w-full border-gray-300 rounded-lg text-sm"
                     value={newDeal.title}
                     onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                   />
                </div>
                <div className="w-32">
                   <input 
                     type="number" 
                     placeholder="Valor R$" 
                     className="w-full border-gray-300 rounded-lg text-sm"
                     value={newDeal.value}
                     onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                   />
                </div>
                <div className="w-32">
                   <select 
                     className="w-full border-gray-300 rounded-lg text-sm"
                     value={priority}
                     onChange={(e) => setPriority(e.target.value as any)}
                   >
                     <option value="low">Frio</option>
                     <option value="medium">Morno</option>
                     <option value="high">Quente</option>
                   </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 rounded-lg font-bold hover:bg-green-700 text-sm">
                  Salvar
                </button>
             </div>
          </form>
        )}
      </div>

      {/* 2. Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
         <div className="flex gap-6 h-full min-w-max">
            <Column 
              title="Prospecção" 
              status="prospecting" 
              icon={User} 
              color="text-blue-700" 
              accentColor="text-blue-600"
            />
            <Column 
              title="Proposta Enviada" 
              status="proposal" 
              icon={Briefcase} 
              color="text-yellow-700" 
              accentColor="text-amber-600"
            />
            <Column 
              title="Em Negociação" 
              status="negotiation" 
              icon={Clock} 
              color="text-purple-700" 
              accentColor="text-purple-600"
            />
            <Column 
              title="Fechado" 
              status="closed" 
              icon={CheckCircle} 
              color="text-green-700" 
              accentColor="text-green-600"
            />
         </div>
      </div>
    </div>
  );
};
