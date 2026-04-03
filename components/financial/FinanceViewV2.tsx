import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialDashboard } from './FinancialDashboard';
import { AccountManagement } from './AccountManagement';
import { TransactionList } from './TransactionList';
import { CategoryManagement } from './CategoryManagement';
import { GoalTracker } from './GoalTracker';
import { MonthClosing } from './MonthClosing';
import { LayoutDashboard, CreditCard, ArrowLeftRight, Tag, Target, Lock, User, Briefcase, Globe } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Contas', icon: CreditCard },
  { id: 'transactions', label: 'Lançamentos', icon: ArrowLeftRight },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'closing', label: 'Fechamento', icon: Lock },
];

interface Props { user_id: string; }

export const FinanceViewV2: React.FC<Props> = ({ user_id }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entityFilter, setEntityFilter] = useState<'personal' | 'business'>('business');

  useEffect(() => {
    financialService.seedBasicCategories(user_id);
  }, [user_id]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Entity Selector */}
      <div className="flex p-1.5 bg-white rounded-2xl border border-gray-100 w-fit gap-1 shadow-sm">
        <button onClick={() => setEntityFilter('personal')} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${entityFilter === 'personal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100'}`}>
          <User className="w-3.5 h-3.5" /> PF
        </button>
        <button onClick={() => setEntityFilter('business')} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${entityFilter === 'business' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100'}`}>
          <Briefcase className="w-3.5 h-3.5" /> PJ
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="flex p-1 bg-white rounded-2xl border border-gray-100 w-full gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-md' : 'text-slate-400 hover:bg-gray-50'}`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <FinancialDashboard user_id={user_id} entityFilter={entityFilter} />}
      {activeTab === 'accounts' && <AccountManagement user_id={user_id} entityFilter={entityFilter} />}
      {activeTab === 'transactions' && <TransactionList user_id={user_id} entityFilter={entityFilter} />}
      {activeTab === 'categories' && <CategoryManagement user_id={user_id} />}
      {activeTab === 'goals' && <GoalTracker user_id={user_id} />}
      {activeTab === 'closing' && <MonthClosing user_id={user_id} entityFilter={entityFilter} />}
    </div>
  );
};
