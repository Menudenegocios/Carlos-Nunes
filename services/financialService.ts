import { supabase } from './supabaseClient';
import type {
  FinancialAccount,
  FinancialCategory,
  FinancialTransaction,
  FinancialGoal,
  FinancialGoalItem,
  FinancialImportRule,
  FinancialMonthClosing,
} from '../types';

export const financialService = {
  // ===================== ACCOUNTS =====================
  getAccounts: async (user_id: string): Promise<FinancialAccount[]> => {
    const { data, error } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  addAccount: async (account: Omit<FinancialAccount, 'id' | 'created_at'>): Promise<FinancialAccount> => {
    const { data, error } = await supabase
      .from('financial_accounts')
      .insert({ ...account, current_balance: account.initial_balance })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateAccount: async (id: string, account: Partial<FinancialAccount>, user_id?: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_accounts')
      .update(account)
      .eq('id', id);
    if (error) throw error;

    if (user_id && account.initial_balance !== undefined) {
      await financialService.recalculateAccountBalance(id, user_id);
    }
  },

  deleteAccount: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_accounts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  recalculateAccountBalance: async (account_id: string, user_id: string): Promise<number> => {
    // Get initial balance
    const { data: account } = await supabase
      .from('financial_accounts')
      .select('initial_balance')
      .eq('id', account_id)
      .single();

    const initialBalance = account?.initial_balance || 0;

    // Get all realized transactions for this account
    const { data: transactions } = await supabase
      .from('financial_transactions')
      .select('value, type')
      .eq('account_id', account_id)
      .eq('user_id', user_id)
      .eq('status', 'realized');

    let balance = Number(initialBalance);
    (transactions || []).forEach((t: any) => {
      balance += t.type === 'income' ? Number(t.value) : -Number(t.value);
    });

    await supabase
      .from('financial_accounts')
      .update({ current_balance: balance })
      .eq('id', account_id);

    return balance;
  },

  // ===================== CATEGORIES =====================
  getCategories: async (user_id: string): Promise<FinancialCategory[]> => {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .eq('user_id', user_id)
      .order('name', { ascending: true });
    if (error) throw error;
    
    // Build hierarchy
    const all = data || [];
    const parents = all.filter((c: any) => !c.parent_id);
    return parents.map((p: any) => ({
      ...p,
      subcategories: all.filter((c: any) => c.parent_id === p.id),
    }));
  },

  getAllCategoriesFlat: async (user_id: string): Promise<FinancialCategory[]> => {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .eq('user_id', user_id)
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  addCategory: async (cat: Omit<FinancialCategory, 'id' | 'created_at' | 'subcategories'>): Promise<FinancialCategory> => {
    const { data, error } = await supabase
      .from('financial_categories')
      .insert(cat)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateCategory: async (id: string, cat: Partial<FinancialCategory>): Promise<void> => {
    const { subcategories, ...rest } = cat as any;
    const { error } = await supabase
      .from('financial_categories')
      .update(rest)
      .eq('id', id);
    if (error) throw error;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ===================== TRANSACTIONS =====================
  getTransactions: async (user_id: string, filters?: {
    entity_type?: string;
    account_id?: string;
    category_id?: string;
    month?: number;
    year?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<FinancialTransaction[]> => {
    let query = supabase
      .from('financial_transactions')
      .select(`
        *,
        financial_accounts!financial_transactions_account_id_fkey (name, color),
        financial_categories!financial_transactions_category_id_fkey (name, color)
      `)
      .eq('user_id', user_id)
      .order('date', { ascending: false });

    if (filters?.entity_type) query = query.eq('entity_type', filters.entity_type);
    if (filters?.account_id) query = query.eq('account_id', filters.account_id);
    if (filters?.category_id) query = query.eq('category_id', filters.category_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.search) query = query.ilike('description', `%${filters.search}%`);
    if (filters?.month && filters?.year) {
      const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
      const endMonth = filters.month === 12 ? 1 : filters.month + 1;
      const endYear = filters.month === 12 ? filters.year + 1 : filters.year;
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      query = query.gte('date', startDate).lt('date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((t: any) => ({
      ...t,
      account_name: t.financial_accounts?.name,
      account_color: t.financial_accounts?.color,
      category_name: t.financial_categories?.name,
      category_color: t.financial_categories?.color,
    }));
  },

  addTransaction: async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'account_name' | 'category_name'>): Promise<FinancialTransaction> => {
    const { account_name, category_name, ...cleanData } = transaction as any;
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(cleanData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateTransaction: async (id: string, transaction: Partial<FinancialTransaction>): Promise<void> => {
    const { account_name, category_name, ...cleanData } = transaction as any;
    const { error } = await supabase
      .from('financial_transactions')
      .update(cleanData)
      .eq('id', id);
    if (error) throw error;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  batchUpdateTransactions: async (ids: string[], updates: Partial<FinancialTransaction>): Promise<void> => {
    const { account_name, category_name, ...cleanData } = updates as any;
    for (const id of ids) {
      const { error } = await supabase
        .from('financial_transactions')
        .update(cleanData)
        .eq('id', id);
      if (error) throw error;
    }
  },

  batchDeleteTransactions: async (ids: string[]): Promise<void> => {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .in('id', ids);
    if (error) throw error;
  },

  // ===================== GOALS =====================
  getGoals: async (user_id: string): Promise<FinancialGoal[]> => {
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*, financial_goal_items(*)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((g: any) => ({
      ...g,
      items: g.financial_goal_items || [],
    }));
  },

  addGoal: async (goal: Omit<FinancialGoal, 'id' | 'created_at' | 'items'>): Promise<FinancialGoal> => {
    const { data, error } = await supabase
      .from('financial_goals')
      .insert(goal)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateGoal: async (id: string, goal: Partial<FinancialGoal>): Promise<void> => {
    const { items, ...rest } = goal as any;
    const { error } = await supabase
      .from('financial_goals')
      .update(rest)
      .eq('id', id);
    if (error) throw error;
  },

  deleteGoal: async (id: string): Promise<void> => {
    // Delete items first
    await supabase.from('financial_goal_items').delete().eq('goal_id', id);
    const { error } = await supabase.from('financial_goals').delete().eq('id', id);
    if (error) throw error;
  },

  addGoalItem: async (item: Omit<FinancialGoalItem, 'id'>): Promise<FinancialGoalItem> => {
    const { data, error } = await supabase
      .from('financial_goal_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateGoalItem: async (id: string, item: Partial<FinancialGoalItem>): Promise<void> => {
    const { error } = await supabase
      .from('financial_goal_items')
      .update(item)
      .eq('id', id);
    if (error) throw error;
  },

  deleteGoalItem: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_goal_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ===================== IMPORT RULES =====================
  getImportRules: async (user_id: string): Promise<FinancialImportRule[]> => {
    const { data, error } = await supabase
      .from('financial_import_rules')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    return data || [];
  },

  addImportRule: async (rule: Omit<FinancialImportRule, 'id'>): Promise<FinancialImportRule> => {
    const { data, error } = await supabase
      .from('financial_import_rules')
      .insert(rule)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteImportRule: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_import_rules')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ===================== MONTH CLOSINGS =====================
  getMonthClosings: async (user_id: string): Promise<FinancialMonthClosing[]> => {
    const { data, error } = await supabase
      .from('financial_month_closings')
      .select('*')
      .eq('user_id', user_id)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  closeMonth: async (closing: Omit<FinancialMonthClosing, 'id'>): Promise<FinancialMonthClosing> => {
    // Check if already exists
    const { data: existing } = await supabase
      .from('financial_month_closings')
      .select('id')
      .eq('user_id', closing.user_id)
      .eq('month', closing.month)
      .eq('year', closing.year)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('financial_month_closings')
        .update({ ...closing, closed_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('financial_month_closings')
      .insert({ ...closing, closed_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  reopenMonth: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('financial_month_closings')
      .update({ is_closed: false, closed_at: null })
      .eq('id', id);
    if (error) throw error;
  },

  seedBasicCategories: async (user_id: string): Promise<void> => {
    const categories = [
      // RECEITA BRUTA
      { name: 'Serviços Audiovisuais', type: 'income', entity_type: 'business', color: '#10b981', dre_group: 'gross_revenue' },
      { name: 'Contratos Recorrentes', type: 'income', entity_type: 'business', color: '#059669', dre_group: 'gross_revenue' },
      { name: 'Adicionais / Extras', type: 'income', entity_type: 'business', color: '#34d399', dre_group: 'gross_revenue' },
      
      // DEDUÇÕES
      { name: 'Impostos (Simples/MEI)', type: 'expense', entity_type: 'business', color: '#f43f5e', dre_group: 'deductions' },
      { name: 'Taxas de Plataforma', type: 'expense', entity_type: 'business', color: '#fb7185', dre_group: 'deductions' },
      { name: 'Descontos Concedidos', type: 'expense', entity_type: 'both', color: '#fda4af', dre_group: 'deductions' },

      // CUSTOS DIRETOS
      { name: 'Freelancers (Edição/Captação)', type: 'expense', entity_type: 'business', color: '#f59e0b', dre_group: 'direct_costs' },
      { name: 'Locação de Equipamentos', type: 'expense', entity_type: 'business', color: '#fbbf24', dre_group: 'direct_costs' },
      { name: 'Custos de Produção', type: 'expense', entity_type: 'business', color: '#d97706', dre_group: 'direct_costs' },
      { name: 'Softwares de Projeto', type: 'expense', entity_type: 'business', color: '#b45309', dre_group: 'direct_costs' },

      // DESPESAS OPERACIONAIS FIXAS
      { name: 'Pró-Labore', type: 'expense', entity_type: 'business', color: '#8b5cf6', dre_group: 'operating_expenses_fixed' },
      { name: 'Contabilidade', type: 'expense', entity_type: 'business', color: '#7c3aed', dre_group: 'operating_expenses_fixed' },
      { name: 'Aluguel / Escritório', type: 'expense', entity_type: 'both', color: '#6d28d9', dre_group: 'operating_expenses_fixed' },
      { name: 'Softwares Admin / SaaS', type: 'expense', entity_type: 'both', color: '#4c1d95', dre_group: 'operating_expenses_fixed' },

      // DESPESAS OPERACIONAIS VARIÁVEIS
      { name: 'Tráfego Pago', type: 'expense', entity_type: 'business', color: '#ec4899', dre_group: 'operating_expenses_variable' },
      { name: 'Comissão de Vendas', type: 'expense', entity_type: 'business', color: '#db2777', dre_group: 'operating_expenses_variable' },
      { name: 'Taxas Bancárias', type: 'expense', entity_type: 'both', color: '#be185d', dre_group: 'operating_expenses_variable' },

      // OUTROS
      { name: 'Outras Receitas', type: 'income', entity_type: 'both', color: '#3b82f6', dre_group: 'other_results' },
      { name: 'Outras Despesas', type: 'expense', entity_type: 'both', color: '#64748b', dre_group: 'other_results' },
    ];
    
    const { data: existing } = await supabase.from('financial_categories').select('id').eq('user_id', user_id).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('financial_categories').insert(categories.map(c => ({ ...c, user_id })));
    }
  },

  // ===================== DASHBOARD AGGREGATIONS =====================
  getDashboardData: async (user_id: string, month: number, year: number, entityFilter?: string) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    let txQuery = supabase
      .from('financial_transactions')
      .select('value, type, category_id, status, entity_type, financial_categories!financial_transactions_category_id_fkey (name, dre_group)')
      .eq('user_id', user_id)
      .eq('status', 'realized')
      .gte('date', startDate)
      .lt('date', endDate);

    if (entityFilter && entityFilter !== 'all') {
      txQuery = txQuery.eq('entity_type', entityFilter);
    }

    const { data: transactions } = await txQuery;

    let accountsQuery = supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user_id)
      .eq('active', true);

    if (entityFilter && entityFilter !== 'all') {
      accountsQuery = accountsQuery.eq('entity_type', entityFilter);
    }

    const { data: accounts } = await accountsQuery;

    // DRE Logic
    const dre = {
      gross_revenue: 0,
      deductions: 0,
      net_revenue: 0,
      direct_costs: 0,
      gross_profit: 0,
      operating_expenses_fixed: 0,
      operating_expenses_variable: 0,
      operating_result: 0,
      other_results: 0,
      net_profit: 0,
      margin: 0,
      items: [] as any[]
    };

    const categoryMap: Record<string, { name: string; value: number; type: string; dre_group: string }> = {};

    (transactions || []).forEach((t: any) => {
      const cat = t.financial_categories;
      const catName = cat?.name || 'Sem Categoria';
      const group = cat?.dre_group || 'other_results';
      const val = Number(t.value);

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, value: 0, type: t.type, dre_group: group };
      }
      categoryMap[catName].value += val;

      if (group === 'gross_revenue') dre.gross_revenue += val;
      else if (group === 'deductions') dre.deductions += val;
      else if (group === 'direct_costs') dre.direct_costs += val;
      else if (group === 'operating_expenses_fixed') dre.operating_expenses_fixed += val;
      else if (group === 'operating_expenses_variable') dre.operating_expenses_variable += val;
      else if (group === 'other_results') {
        if (t.type === 'income') dre.other_results += val;
        else dre.other_results -= val;
      }
    });

    dre.net_revenue = dre.gross_revenue - dre.deductions;
    dre.gross_profit = dre.net_revenue - dre.direct_costs;
    dre.operating_result = dre.gross_profit - (dre.operating_expenses_fixed + dre.operating_expenses_variable);
    dre.net_profit = dre.operating_result + dre.other_results;
    dre.margin = dre.gross_revenue > 0 ? (dre.net_profit / dre.gross_revenue) * 100 : 0;
    dre.items = Object.values(categoryMap);

    // Pending (predicted)
    let pendingQuery = supabase
      .from('financial_transactions')
      .select('value, type')
      .eq('user_id', user_id)
      .eq('status', 'predicted')
      .gte('date', startDate)
      .lt('date', endDate);

    if (entityFilter && entityFilter !== 'all') {
      pendingQuery = pendingQuery.eq('entity_type', entityFilter);
    }

    const { data: pendingTx } = await pendingQuery;
    const pendingPayables = (pendingTx || []).filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.value), 0);
    const pendingReceivables = (pendingTx || []).filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.value), 0);

    const totalIncome = (transactions || [])
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.value), 0);

    const totalExpense = (transactions || [])
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.value), 0);

    const totalBalance = (accounts || []).reduce((sum: number, a: any) => sum + Number(a.current_balance), 0);

    return {
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
      totalBalance,
      accounts: accounts || [],
      dre,
      topExpenseCategories: Object.values(categoryMap).filter(i => i.type === 'expense').sort((a,b) => b.value - a.value).slice(0, 10),
      monthlyBilling: dre.gross_revenue,
      pendingPayables,
      pendingReceivables,
    };
  },
};
