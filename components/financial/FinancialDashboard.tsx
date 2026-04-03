import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialAccount } from '../../types';
import { TrendingUp, TrendingDown, Wallet, DollarSign, ArrowUpCircle, ArrowDownCircle, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

interface Props { user_id: string; entityFilter: string; }

export const FinancialDashboard: React.FC<Props> = ({ user_id, entityFilter }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [month, year, entityFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await financialService.getDashboardData(user_id, month, year, entityFilter);
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  if (loading || !data) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;

  const { 
    totalIncome = 0, 
    totalExpense = 0, 
    profit = 0, 
    totalBalance = 0, 
    accounts = [], 
    topExpenseCategories = [], 
    pendingPayables = 0, 
    pendingReceivables = 0 
  } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Month Navigator */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
        <h3 className="text-lg font-black uppercase tracking-widest text-gray-800 min-w-[200px] text-center">{MONTH_NAMES[month - 1]} {year}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={TrendingUp} label="Receitas" value={totalIncome} color="emerald" />
        <KPICard icon={TrendingDown} label="Despesas" value={totalExpense} color="rose" />
        <KPICard icon={DollarSign} label={profit >= 0 ? "Lucro" : "Prejuízo"} value={profit} color={profit >= 0 ? "indigo" : "rose"} />
        <KPICard icon={Wallet} label="Saldo Total" value={totalBalance} color="violet" />
      </div>

      {/* Pending Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <ArrowDownCircle className="w-8 h-8 text-amber-500" />
          <div>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Contas a Pagar</p>
            <p className="text-xl font-black text-amber-700">R$ {pendingPayables.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-center gap-4">
          <ArrowUpCircle className="w-8 h-8 text-sky-500" />
          <div>
            <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest">Contas a Receber</p>
            <p className="text-xl font-black text-sky-700">R$ {pendingReceivables.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Accounts + Categories side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saldo por Conta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo por Conta</h4>
          {accounts.length > 0 ? accounts.map((acc: FinancialAccount) => (
            <div key={acc.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: acc.color || '#6366f1' }}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{acc.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{acc.institution || acc.type}</p>
                </div>
              </div>
              <p className={`text-sm font-black ${Number(acc.current_balance) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {Number(acc.current_balance).toFixed(2)}
              </p>
            </div>
          )) : <p className="text-sm text-slate-400 text-center py-4">Nenhuma conta cadastrada</p>}
        </div>

        {/* Top Despesas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Top Categorias de Despesa</h4>
          {topExpenseCategories.length > 0 ? topExpenseCategories.map((cat: any, i: number) => {
            const maxVal = topExpenseCategories[0]?.value || 1;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{cat.name}</span>
                  <span className="font-black text-rose-600">R$ {cat.value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full transition-all" style={{ width: `${(cat.value / maxVal) * 100}%` }} />
                </div>
              </div>
            );
          }) : <p className="text-sm text-slate-400 text-center py-4">Sem despesas no período</p>}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color] || colors.indigo}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 opacity-60" />
        <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</p>
      </div>
      <p className="text-2xl font-black tracking-tight">R$ {Math.abs(value).toFixed(2)}</p>
    </div>
  );
};
