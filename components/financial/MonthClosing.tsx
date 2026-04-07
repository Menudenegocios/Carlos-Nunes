import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/financialService';
import { FinancialMonthClosing } from '../../types';
import { Lock, Unlock, ChevronLeft, ChevronRight, Calendar, CheckCircle, Download, FileText, BarChart3, PieChart, TrendingUp, TrendingDown, ArrowRight, Table as TableIcon, Wallet, Activity, FileCheck, AlertCircle, Receipt } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

interface Props { user_id: string; entityFilter: 'personal' | 'business' | 'all'; }

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
    if (!dre || !realTimeData) return;
    try {
      const doc = new jsPDF({ format: 'a4' });
      const stats = realTimeData.invoiceStats;
      
      // HEADER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`RELATÓRIO MENSAL DE FECHAMENTO FINANCEIRO`, 14, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // slate-400
      doc.text(`Competência: ${MONTH_NAMES[month-1]} de ${year}`, 14, 28);
      doc.text(`Perfil: ${entityFilter === 'business' ? 'Pessoa Jurídica' : entityFilter === 'personal' ? 'Pessoa Física' : 'Geral'}`, 14, 34);
      doc.text(`Filtro: ${entityFilter.toUpperCase()}`, 14, 40);
      doc.setDrawColor(241, 245, 249);
      doc.line(14, 45, 196, 45);

      // --- 1. DRE SUMMARY ---
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('I. Demonstrativo de Resultado (Consolidado)', 14, 55);

      const dreRows = [
        ['RECEITA BRUTA', `R$ ${dre.gross_revenue.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['(-) DEDUÇÕES DA RECEITA', `R$ ${dre.deductions.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['= RECEITA LÍQUIDA', `R$ ${dre.net_revenue.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['(-) DESPESAS OPERACIONAIS FIXAS', `R$ ${dre.operating_expenses_fixed.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['(-) DESPESAS OPERACIONAIS VARIÁVEIS', `R$ ${dre.operating_expenses_variable.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['= RESULTADO OPERACIONAL', `R$ ${dre.operating_result.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['(+/-) OUTROS RESULTADOS', `R$ ${dre.other_results.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['= LUCRO LÍQUIDO DO MÊS', `R$ ${dre.net_profit.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['MARGEM LÍQUIDA', `${dre.margin.toFixed(2)}%`],
      ];

      autoTable(doc, {
        startY: 60,
        head: [['Rubrica Financeira', 'Valor (R$)']],
        body: dreRows,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 120 }, 1: { halign: 'right', fontStyle: 'bold' } },
        willDrawCell: (data: any) => {
          if (data.row.section === 'body' && Array.isArray(data.row.raw) && data.row.raw[0]?.toString().startsWith('=')) {
             doc.setFillColor(248, 250, 252); 
          }
        }
      });

      // --- 2. NF STATUS (CHART EMULATION) ---
      let nextY = (doc as any).lastAutoTable.finalY + 15;
      doc.text('II. Controle de Notas Fiscais (NF-e) de Entradas', 14, nextY);
      
      const invoiceData = [
        ['Total Faturado (Receita)', `R$ ${stats.totalIncome.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['NFs Emitidas (Comprovado)', `R$ ${stats.issuedValue.toLocaleString('pt-BR', {minimumFractionDigits:2})}`],
        ['Pendente de NF', `R$ ${stats.missingValue.toLocaleString('pt-BR', {minimumFractionDigits:2})}`]
      ];

      autoTable(doc, {
        startY: nextY + 5,
        body: invoiceData,
        theme: 'plain',
        columnStyles: { 0: { cellWidth: 120 }, 1: { halign: 'right', fontStyle: 'bold' } },
      });

      // Simple bar visual for NF coverage
      const coverageWidth = stats.totalIncome > 0 ? (stats.issuedValue / stats.totalIncome) * 100 : 0;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(241, 245, 249);
      doc.rect(14, (doc as any).lastAutoTable.finalY + 2, 182, 4, 'F');
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.rect(14, (doc as any).lastAutoTable.finalY + 2, (182 * coverageWidth) / 100, 4, 'F');
      doc.setFontSize(8);
      doc.text(`Cobertura de Notas Fiscais: ${coverageWidth.toFixed(1)}%`, 14, (doc as any).lastAutoTable.finalY + 10);

      // --- 3. DETAILED TRANSACTION LIST ---
      doc.addPage();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('III. Extrato Detalhado de Lançamentos do Mês', 14, 20);

      const txRows = (realTimeData.transactions || [])
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((t: any) => {
          let formattedDate = 'N/A';
          if (t.date) {
            // Safe date formatting for YYYY-MM-DD strings
            const parts = t.date.split('-');
            if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            else formattedDate = new Date(t.date).toLocaleDateString('pt-BR');
          }
          return [
            formattedDate,
            t.description || '-',
            t.financial_accounts?.name || 'Conta Padrão',
            t.financial_categories?.name || 'Geral',
            t.has_invoice ? 'SIM' : 'NÃO',
            `R$ ${Number(t.value).toLocaleString('pt-BR', {minimumFractionDigits:2})}`
          ];
        });

      autoTable(doc, {
        startY: 25,
        head: [['Data', 'Descrição', 'Banco/Conta', 'Categoria', 'NF', 'Valor']],
        body: txRows,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: { 
          0: { cellWidth: 20 },
          4: { halign: 'center' },
          5: { halign: 'right', fontStyle: 'bold' } 
        },
        styles: { fontSize: 8 }
      });

      doc.save(`FECHAMENTO_${MONTH_NAMES[month-1]}_${year}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar PDF detalhado.');
    }
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
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Geral</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Atual</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">R$ {(realTimeData?.totalBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(realTimeData?.pendingReceivables > 0) ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {(realTimeData?.pendingReceivables > 0) ? 'A Receber' : 'Recebido'}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entradas no Mês</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">R$ {(realTimeData?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              {(realTimeData?.pendingReceivables > 0) && (
                <p className="text-[10px] font-bold text-amber-500 mt-2">Proj: +R$ {realTimeData.pendingReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(realTimeData?.pendingPayables > 0) ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {(realTimeData?.pendingPayables > 0) ? 'A Pagar' : 'Pago'}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saídas no Mês</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">R$ {(realTimeData?.totalExpense || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              {(realTimeData?.pendingPayables > 0) && (
                <p className="text-[10px] font-bold text-amber-500 mt-2">Proj: +R$ {realTimeData.pendingPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              )}
            </div>

            <div className={`p-6 rounded-[32px] border shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all ${dre.net_profit >= 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                  {dre.margin.toFixed(1)}% Margem
                </span>
              </div>
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Resultado Líquido</p>
              <h3 className="text-2xl font-black text-white tracking-tight">R$ {dre.net_profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>

          {/* NF-e Control Row */}
          <div className="bg-white p-6 rounded-[32px] border border-indigo-100 shadow-[0_4px_24px_rgba(79,70,229,0.04)] flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Monitoramento de Notas Fiscais</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Resumo de cobertura fiscal de entradas</p>
              </div>
            </div>

            <div className="flex flex-1 max-w-2xl gap-8">
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Receita Total</p>
                   <p className="text-xs font-black text-slate-900">R$ {(realTimeData?.invoiceStats?.totalIncome || 0).toLocaleString('pt-BR')}</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 w-full" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1"><FileCheck className="w-3 h-3" /> NFs Emitidas (Y)</p>
                   <p className="text-xs font-black text-emerald-600">R$ {(realTimeData?.invoiceStats?.issuedValue || 0).toLocaleString('pt-BR')}</p>
                </div>
                <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${(realTimeData?.invoiceStats?.issuedValue / (realTimeData?.invoiceStats?.totalIncome || 1)) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Falta Emitir (Z)</p>
                   <p className="text-xs font-black text-rose-600">R$ {(realTimeData?.invoiceStats?.missingValue || 0).toLocaleString('pt-BR')}</p>
                </div>
                <div className="h-2 bg-rose-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-1000" 
                    style={{ width: `${(realTimeData?.invoiceStats?.missingValue / (realTimeData?.invoiceStats?.totalIncome || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Onde seu dinheiro foi parar? */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-indigo-500" /> Composição de Despesas
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-64">
                  {realTimeData?.topExpenseCategories?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={realTimeData.topExpenseCategories.filter((c:any)=>c.value>0)}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {realTimeData.topExpenseCategories.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">Sem despesas registradas</div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {realTimeData?.topExpenseCategories?.slice(0,5).map((cat: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-slate-600 uppercase w-32 truncate">{cat.name}</span>
                          <span className="text-[10px] font-black text-slate-900">R$ {cat.value.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((cat.value / (realTimeData?.totalExpense || 1)) * 100, 100)}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnóstico Rápido e Atalhos */}
            <div className="space-y-6">
              <div className="bg-[#0F172A] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-50 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Diagnóstico do Mês
                </h4>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-2xl font-black italic tracking-tighter">
                      {dre.margin > 30 ? '💰 Alta Lucratividade!' : dre.margin > 15 ? '📈 Operação Saudável' : dre.margin > 0 ? '⚠️ Baixa Margem' : '🚨 Prejuízo Operacional'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-3 font-medium leading-relaxed">
                      Sua margem líquida atual é de <span className="text-white font-black">{dre.margin.toFixed(1)}%</span>. 
                      {dre.net_profit > 0 
                        ? ` Para cada R$ 100 faturados, sobram R$ ${(dre.net_profit / (dre.gross_revenue/100)).toFixed(2)} livres no seu caixa.` 
                        : ` Você gastou R$ ${Math.abs(dre.net_profit).toLocaleString('pt-BR')} a mais do que faturou.`}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">Principal Ralo de Dinheiro</p>
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-bold w-3/4 truncate">{realTimeData?.topExpenseCategories?.[0]?.name || 'N/A'}</p>
                      <p className="text-sm font-black text-rose-400">R$ {Number(realTimeData?.topExpenseCategories?.[0]?.value || 0).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setView('dre')} className="group flex items-center justify-between w-full bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <TableIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-900">Ver DRE Descritivo</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Detalhamento Completo</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors group-hover:translate-x-1" />
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
              { label: '🟣 DESPESAS OPERACIONAIS FIXAS', val: dre.operating_expenses_fixed, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'operating_expenses_fixed') },
              { label: '🟣 DESPESAS OPERACIONAIS VARIÁVEIS', val: dre.operating_expenses_variable, isNegative: true, items: dre.items.filter((i: any) => i.dre_group === 'operating_expenses_variable' || i.dre_group === 'direct_costs') },
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
             <ResponsiveContainer width="100%" height="90%">
                <RePieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={costCompositionData}
                    cx="50%"
                    cy="40%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costCompositionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '20px', bottom: 0, fontSize: '10px' }} 
                  />
                </RePieChart>
             </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-[400px]">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Receita Bruta vs Resultado Líquido</h4>
             <ResponsiveContainer width="100%" height="90%">
                <BarChart data={[{ name: MONTH_NAMES[month-1], receita: dre.gross_revenue, lucro: dre.net_profit }]} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                  <Bar dataKey="lucro" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '20px', bottom: 0, fontSize: '10px' }} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
