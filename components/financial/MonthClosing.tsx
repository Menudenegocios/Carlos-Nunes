import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialMonthClosing } from '../../types';
import { Lock, Unlock, ChevronLeft, ChevronRight, Calendar, CheckCircle, Download, FileText, BarChart3, PieChart, TrendingUp, ArrowRight, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

interface Props { user_id: string; entityFilter: 'personal' | 'business'; }

export const MonthClosing: React.FC<Props> = ({ user_id, entityFilter }) => {
  const [closings, setClosings] = useState<FinancialMonthClosing[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [observations, setObservations] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [view, setView] = useState<'dashboard' | 'dre' | 'graphs'>('dashboard');
  const [realTimeData, setRealTimeData] = useState<any>(null);

  useEffect(() => { load(); loadRealTime(); }, [month, year, entityFilter]);

  const load = async () => { try { setClosings(await financialService.getMonthClosings(user_id)); } catch (e) { console.error(e); } };
  
  const loadRealTime = async () => {
    try {
      const data = await financialService.getDashboardData(user_id, month, year, entityFilter);
      setRealTimeData(data);
    } catch (e) { console.error(e); }
  };

  const currentClosing = closings.find(c => c.month === month && c.year === year);
  
  // Use closed snapshot if available, otherwise real-time
  const dre = currentClosing?.snapshot?.dre || realTimeData?.dre;

  const handleClose = async () => {
    if (!window.confirm(`Encerrar ${MONTH_NAMES[month - 1]} ${year}? O resultado será congelado.`)) return;
    setIsClosing(true);
    try {
      const dashboard = await financialService.getDashboardData(user_id, month, year, entityFilter);
      await financialService.closeMonth({
        user_id, month, year, is_closed: true, observations,
        snapshot: {
          total_income: dashboard.totalIncome,
          total_expense: dashboard.totalExpense,
          balance: dashboard.profit,
          dre: dashboard.dre,
          account_balances: dashboard.accounts.map((a: any) => ({ name: a.name, balance: Number(a.current_balance) })),
        },
      });
      await load();
    } catch (e) { console.error(e); alert('Erro ao encerrar mês.'); }
    finally { setIsClosing(false); }
  };

  const handleReopen = async (id: string) => {
    if (!window.confirm('Reabrir este mês? Os dados poderão ser alterados.')) return;
    try { await financialService.reopenMonth(id); await load(); } catch (e) { console.error(e); }
  };

  const exportExcel = () => {
    if (!dre) return;
    const items = dre.items.map((i: any) => ({ Categoria: i.name, Grupo: i.dre_group, Valor: i.value }));
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DRE items");
    XLSX.writeFile(wb, `DRE_${MONTH_NAMES[month-1]}_${year}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(`DRE - ${MONTH_NAMES[month-1]} / ${year}`, 15, 10);
    doc.setFontSize(10);
    doc.text(`Perfil: ${entityFilter === 'business' ? 'Pessoa Jurídica' : 'Pessoa Física'}`, 15, 18);
    
    const rows = [
      ['RECEITA BRUTA', '', `R$ ${dre.gross_revenue.toFixed(2)}`],
      ['(-) DEDUÇÕES', '', `R$ ${dre.deductions.toFixed(2)}`],
      ['RECEITA LÍQUIDA', '', `R$ ${dre.net_revenue.toFixed(2)}`],
      ['(-) CUSTOS DIRETOS', '', `R$ ${dre.direct_costs.toFixed(2)}`],
      ['LUCRO BRUTO', '', `R$ ${dre.gross_profit.toFixed(2)}`],
      ['(-) DESPESAS OPERACIONAIS FIXAS', '', `R$ ${dre.operating_expenses_fixed.toFixed(2)}`],
      ['(-) DESPESAS OPERACIONAIS VARIÁVEIS', '', `R$ ${dre.operating_expenses_variable.toFixed(2)}`],
      ['RESULTADO OPERACIONAL', '', `R$ ${dre.operating_result.toFixed(2)}`],
      ['OUTROS RESULTADOS', '', `R$ ${dre.other_results.toFixed(2)}`],
      ['LUCRO LÍQUIDO DO MÊS', '', `R$ ${dre.net_profit.toFixed(2)}`],
      ['MARGEM LÍQUIDA', '', `${dre.margin.toFixed(2)}%`]
    ];

    doc.autoTable({
      startY: 25,
      head: [['Título', '', 'Valor']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
      columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } }
    });

    const categoryRows = dre.items.map((i: any) => [i.name, i.dre_group, `R$ ${i.value.toFixed(2)}`]);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Categoria Atômica', 'Grupo DRE', 'Valor']],
      body: categoryRows,
      theme: 'grid'
    });

    doc.save(`DRE_${MONTH_NAMES[month-1]}_${year}.pdf`);
  };

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  if (!dre) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Carregando DRE...</div>;

  const costCompositionData = dre.items
    .filter((i: any) => i.type === 'expense')
    .map((i: any) => ({ name: i.name, value: i.value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center min-w-[140px]">
            <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900">{MONTH_NAMES[month - 1]} {year}</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
              {currentClosing?.is_closed ? <><Lock className="w-2.5 h-2.5 text-emerald-500" /> Fechado</> : <><Unlock className="w-2.5 h-2.5 text-amber-500" /> Em aberto</>}
            </p>
          </div>
          <button onClick={nextMonth} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}>
            <TrendingUp className="w-3.5 h-3.5" /> Visão Geral
          </button>
          <button onClick={() => setView('dre')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${view === 'dre' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}>
            <TableIcon className="w-3.5 h-3.5" /> DRE Completo
          </button>
          <button onClick={() => setView('graphs')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${view === 'graphs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}>
            <BarChart3 className="w-3.5 h-3.5" /> Gráficos
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={exportPDF} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={exportExcel} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" /> EXCEL
          </button>
          {!currentClosing?.is_closed ? (
            <button onClick={handleClose} disabled={isClosing} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
              {isClosing ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-3 h-3" /> ENCERRAR MÊS</>}
            </button>
          ) : (
            <button onClick={() => handleReopen(currentClosing.id)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
              <Unlock className="w-3 h-3" /> REABRIR
            </button>
          )}
        </div>
      </div>

      {view === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: 'Receita Bruta', val: dre.gross_revenue, color: 'emerald' },
              { label: 'Receita Líquida', val: dre.net_revenue, color: 'teal' },
              { label: 'Lucro Bruto', val: dre.gross_profit, color: 'blue' },
              { label: 'Lucro Líquido', val: dre.net_profit, color: 'indigo' },
              { label: 'Margem %', val: dre.margin, color: 'purple', isPerc: true },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group hover:shadow-md transition-all">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative">{kpi.label}</p>
                <p className={`text-xl font-black mt-1 relative text-${kpi.color}-600`}>
                  {kpi.isPerc ? `${kpi.val.toFixed(1)}%` : `R$ ${kpi.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Funil DRE Simples */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Funil de Performance
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Receita Bruta', val: dre.gross_revenue, color: 'bg-emerald-500', w: '100%' },
                  { label: 'Receita Líquida', val: dre.net_revenue, color: 'bg-emerald-400', w: `${(dre.net_revenue / dre.gross_revenue) * 100}%` },
                  { label: 'Lucro Bruto', val: dre.gross_profit, color: 'bg-indigo-400', w: `${(dre.gross_profit / dre.gross_revenue) * 100}%` },
                  { label: 'Lucro Líquido', val: dre.net_profit, color: 'bg-indigo-600', w: `${(dre.net_profit / dre.gross_revenue) * 100}%` },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase">{item.label}</span>
                      <span className="text-[10px] font-black text-slate-900">R$ {item.val.toLocaleString()}</span>
                    </div>
                    <div className="h-6 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: item.w || '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnóstico Rápido */}
            <div className="bg-[#0F172A] p-8 rounded-[40px] text-white shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Diagnóstico Financeiro
                </h4>
                <div className="space-y-6 mt-8">
                  <div>
                    <p className="text-2xl font-black italic tracking-tighter">
                      {dre.margin > 30 ? '💰 Alta Lucratividade!' : dre.margin > 15 ? '📈 Operação Saudável' : '⚠️ Atenção à Margem'}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Sua margem líquida atual é de <span className="text-white font-black">{dre.margin.toFixed(1)}%</span>. A cada R$ 100,00 faturados, sobram R$ {dre.net_profit > 0 ? (dre.net_profit / (dre.gross_revenue/100)).toFixed(2) : '0,00'}.</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">Principal Ralo de Dinheiro</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold">{realTimeData?.topExpenseCategories?.[0]?.name || 'N/A'}</p>
                      <p className="text-sm font-black text-rose-400">R$ {Number(realTimeData?.topExpenseCategories?.[0]?.value || 0).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => setView('dre')} className="mt-8 flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                Ver DRE Descritivo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'dre' && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Demonstrativo do Resultado (DRE)</h4>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-white rounded-xl border border-gray-100">Visão por Competência</div>
          </div>
          
          <div className="p-8 space-y-2">
            {/* DRE ROWS */}
            {[
              { label: '🔵 RECEITA BRUTA', val: dre.gross_revenue, bold: true, items: dre.items.filter((i: any) => i.dre_group === 'gross_revenue') },
              { label: '🔴 DEDUÇÕES DA RECEITA', val: dre.deductions, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'deductions') },
              { label: 'RECEITA LÍQUIDA', val: dre.net_revenue, bold: true, isResult: true, bg: 'bg-emerald-50/50' },
              { label: '🟡 CUSTOS DIRETOS (CPV/CSP)', val: dre.direct_costs, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'direct_costs') },
              { label: 'LUCRO BRUTO', val: dre.gross_profit, bold: true, isResult: true, bg: 'bg-indigo-50/50' },
              { label: '🟣 DESPESAS OPERACIONAIS FIXAS', val: dre.operating_expenses_fixed, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'operating_expenses_fixed') },
              { label: '🟣 DESPESAS OPERACIONAIS VARIÁVEIS', val: dre.operating_expenses_variable, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'operating_expenses_variable') },
              { label: 'RESULTADO OPERACIONAL (EBITDA)', val: dre.operating_result, bold: true, isResult: true, bg: 'bg-blue-50/50' },
              { label: '⚫ OUTRAS RECEITAS / DESPESAS', val: dre.other_results, items: dre.items.filter((i: any) => i.dre_group === 'other_results') },
              { label: 'LUCRO LÍQUIDO DO MÊS', val: dre.net_profit, bold: true, isResult: true, bg: 'bg-slate-900', color: 'text-white' },
              { label: 'MARGEM LÍQUIDA (%)', val: dre.margin, isPerc: true, bold: true, bg: 'bg-gray-50' },
            ].map((row, i) => (
              <React.Fragment key={i}>
                <div className={`p-4 rounded-2xl flex justify-between items-center ${row.bg || ''} ${row.color || 'text-slate-900'}`}>
                  <span className={`text-[10px] uppercase tracking-widest ${row.bold ? 'font-black' : 'font-bold'}`}>{row.label}</span>
                  <span className={`text-sm ${row.bold ? 'font-black' : 'font-bold'}`}>
                    {row.isNegative && row.val > 0 ? '-' : ''} {row.isPerc ? `${row.val.toFixed(1)}%` : `R$ ${Math.abs(row.val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
                {row.items && row.items.map((sub: any, si: number) => (
                  <div key={si} className="px-8 py-2 flex justify-between items-center opacity-70 group hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sub.color || '#cbd5e1' }} /> {sub.name}
                    </span>
                    <span className="text-[10px] font-black text-slate-900">R$ {sub.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {view === 'graphs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-[400px]">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Composição de Custos & Despesas</h4>
             <ResponsiveContainer width="100%" height="80%">
                <RePieChart>
                  <Pie
                    data={costCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costCompositionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
             </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-[400px]">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Receita Bruta vs Resultado Líquido</h4>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={[{ name: MONTH_NAMES[month-1], receita: dre.gross_revenue, lucro: dre.net_profit }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                  <Bar dataKey="lucro" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  <Legend />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
