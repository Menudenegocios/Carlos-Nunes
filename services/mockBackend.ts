
import { User, Profile, Offer, Lead, ExtractorResult, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction, PipelineStage, B2BOffer, PortfolioItem, VitrineComment, PlatformEvent, Client, Coupon } from '../types';
import { supabase } from './supabaseClient';

const isDemoUser = (userId: string) => 
  userId && (
  userId === 'de30de30-0000-4000-a000-000000000000' || 
  userId === 'c0a80101-0000-4000-a000-000000000000' ||
  userId === 'adadadad-0000-4000-a000-000000000000' ||
  (userId.includes && userId.includes('mock_')) ||
  (userId.includes && userId.includes('demo')) || 
  (userId.includes && userId.includes('carlos'))
);

const localStore = {
  save: (key: string, userId: string, data: any) => {
    try {
      localStorage.setItem(`menu_${key}_${userId}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage quota exceeded. Using memory only or reducing data.", e);
      // Opcional: Aqui poderíamos limpar dados antigos se necessário
    }
  },
  get: (key: string, userId: string) => {
    const saved = localStorage.getItem(`menu_${key}_${userId}`);
    return saved ? JSON.parse(saved) : null;
  },
  saveGlobal: (key: string, data: any) => {
    try {
      localStorage.setItem(`menu_global_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Global storage quota exceeded.", e);
    }
  },
  getGlobal: (key: string) => {
    const saved = localStorage.getItem(`menu_global_${key}`);
    return saved ? JSON.parse(saved) : null;
  }
};

const safeQuery = async <T>(query: any, fallback: T): Promise<T> => {
  try {
    const { data, error } = await query;
    if (error) return fallback;
    return data || fallback;
  } catch (e) {
    return fallback;
  }
};

export const mockBackend = {
  // --- ADMIN: GESTÃO DE MEMBROS ---
  createMember: async (userData: Partial<User>, profileData: Partial<Profile>) => {
    const newUserId = `mock_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id: newUserId,
      name: profileData.businessName || 'Novo Membro',
      email: userData.email || '',
      plan: userData.plan || 'profissionais',
      points: userData.points || 0,
      level: 'elite',
      menuCash: 0,
      referralCode: `REF_${newUserId.toUpperCase()}`,
      referralsCount: 0,
      role: 'user'
    };

    // Salva o usuário para permitir login simulado
    const mockUsers = localStore.getGlobal('mock_users') || [];
    localStore.saveGlobal('mock_users', [...mockUsers, { ...newUser, password: (userData as any).password }]);
    
    // Salva o perfil
    const newProfile: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      userId: newUserId,
      ...profileData,
      role: userData.role || 'user',
      plan: userData.plan || 'profissionais',
      points: userData.points || 0
    } as any;
    
    const allProfiles = localStore.getGlobal('all_profiles') || [];
    localStore.saveGlobal('all_profiles', [...allProfiles, newProfile]);
    
    return { user: newUser, profile: newProfile };
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    // Update local store for demo users
    if (isDemoUser(userId)) {
      const mockUsers = localStore.getGlobal('mock_users') || [];
      const idx = mockUsers.findIndex((u: any) => u.id === userId);
      if (idx > -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...data };
        localStore.saveGlobal('mock_users', mockUsers);
      }
      
      // Also update all_profiles for consistency in the admin list
      const allProfiles = localStore.getGlobal('all_profiles') || [];
      const pIdx = allProfiles.findIndex((p: any) => p.userId === userId);
      if (pIdx > -1) {
        allProfiles[pIdx] = { ...allProfiles[pIdx], ...data };
        localStore.saveGlobal('all_profiles', allProfiles);
      }
      return mockUsers[idx];
    }

    // Update Supabase profiles table which stores role, plan, points
    const updateData: any = {};
    if (data.role) updateData.role = data.role;
    if (data.plan) updateData.plan = data.plan;
    if (data.points !== undefined) updateData.points = data.points;
    if (data.level) updateData.level = data.level;
    if (data.menuCash !== undefined) updateData.menu_cash = data.menuCash;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error("Error updating user in Supabase:", error);
      throw error;
    }
    return updated?.[0];
  },

  deleteMember: async (userId: string) => {
    if (isDemoUser(userId)) {
      const mockUsers = localStore.getGlobal('mock_users') || [];
      localStore.saveGlobal('mock_users', mockUsers.filter((u: any) => u.id !== userId));
      
      const allProfiles = localStore.getGlobal('all_profiles') || [];
      localStore.saveGlobal('all_profiles', allProfiles.filter((p: any) => p.userId !== userId));
      return;
    }

    // Delete from profiles table
    const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
    if (error) {
      console.error("Error deleting member in Supabase:", error);
      throw error;
    }
  },

  // --- EVENTOS ---
  getEvents: async (): Promise<PlatformEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('platform_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      return data.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        location: e.location,
        description: e.description,
        type: e.type
      }));
    } catch (e) {
      console.warn("Falling back to local events:", e);
      return localStore.getGlobal('platform_events') || [
        { id: 'e1', title: 'Workshop de Vendas local', date: '2024-10-25', location: 'Google Meet', description: 'Como vender mais no bairro.', type: 'Online' },
        { id: 'e2', title: 'Networking Curitiba', date: '2024-11-05', location: 'Av. Batel, 100', description: 'Encontro presencial.', type: 'Presencial' },
      ];
    }
  },

  createEvent: async (event: Omit<PlatformEvent, 'id'>): Promise<PlatformEvent> => {
    try {
      const { data, error } = await supabase
        .from('platform_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("Creating event locally:", e);
      const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
      const local = localStore.getGlobal('platform_events') || [];
      localStore.saveGlobal('platform_events', [...local, newEvent]);
      return newEvent;
    }
  },

  updateEvent: async (id: string, event: Partial<PlatformEvent>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('platform_events')
        .update(event)
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.warn("Updating event locally:", e);
      const local = localStore.getGlobal('platform_events') || [];
      const updated = local.map((e: any) => e.id === id ? { ...e, ...event } : e);
      localStore.saveGlobal('platform_events', updated);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('platform_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.warn("Deleting event locally:", e);
      const local = localStore.getGlobal('platform_events') || [];
      localStore.saveGlobal('platform_events', local.filter((e: any) => e.id !== id));
    }
  },

  // --- CLIENTES ---
  getClients: async (userId: string): Promise<Client[]> => {
    if (isDemoUser(userId)) return localStore.get('clients', userId) || [];
    const data = await safeQuery(supabase.from('clients').select('*').eq('user_id', userId).order('name', { ascending: true }), []);
    return data.map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      company: c.company,
      notes: c.notes,
      createdAt: c.created_at,
      lastContact: c.last_contact,
      tags: c.tags,
      totalValue: c.total_value
    }));
  },

  addClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    if (isDemoUser(client.userId)) {
      const current = localStore.get('clients', client.userId) || [];
      const newClient = { ...client, id: Math.random().toString(), createdAt: Date.now() };
      localStore.save('clients', client.userId, [newClient, ...current]);
      return newClient as Client;
    }
    const { data } = await supabase.from('clients').insert({
      user_id: client.userId,
      name: client.name,
      phone: client.phone,
      email: client.email,
      company: client.company,
      notes: client.notes,
      tags: client.tags,
      created_at: Date.now()
    }).select().single();
    return data ? { ...data, userId: data.user_id, createdAt: data.created_at, lastContact: data.last_contact, totalValue: data.total_value } : { ...client, id: Math.random().toString(), createdAt: Date.now() } as Client;
  },

  updateClient: async (id: string, data: Partial<Client>): Promise<void> => {
    const userId = data.userId || '';
    if (userId && isDemoUser(userId)) {
      const current = localStore.get('clients', userId) || [];
      localStore.save('clients', userId, current.map((c: any) => c.id === id ? { ...c, ...data } : c));
      return;
    }
    await supabase.from('clients').update({
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company,
      notes: data.notes,
      tags: data.tags
    }).eq('id', id);
  },

  deleteClient: async (id: string, userId: string): Promise<void> => {
    if (isDemoUser(userId)) {
      const current = localStore.get('clients', userId) || [];
      localStore.save('clients', userId, current.filter((c: any) => c.id !== id));
      return;
    }
    await supabase.from('clients').delete().eq('id', id).eq('user_id', userId);
  },

  // --- CRM / LEADS ---
  getLeads: async (userId: string): Promise<Lead[]> => {
    if (isDemoUser(userId)) return localStore.get('leads', userId) || [];
    const data = await safeQuery(supabase.from('leads').select('*').eq('user_id', userId).order('created_at', { ascending: false }), []);
    return data.map((l: any) => ({ id: l.id, userId: l.user_id, name: l.name, phone: l.phone, source: l.source, stage: l.stage, notes: l.notes, value: l.value, createdAt: l.created_at }));
  },

  addLeads: async (leads: Partial<Lead>[]): Promise<void> => {
    const userId = leads[0]?.userId || '';
    if (isDemoUser(userId)) {
      const current = localStore.get('leads', userId) || [];
      localStore.save('leads', userId, [...leads.map(l => ({ ...l, id: Math.random().toString(), createdAt: Date.now() })), ...current]);
      return;
    }
    await supabase.from('leads').insert(leads.map(l => ({ user_id: l.userId, name: l.name, phone: l.phone, source: l.source || 'manual', stage: l.stage || 'new', notes: l.notes, value: l.value || 0, created_at: Date.now() })));
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<void> => {
    const userId = data.userId || '';
    if (userId && isDemoUser(userId)) {
      const current = localStore.get('leads', userId) || [];
      localStore.save('leads', userId, current.map((l: any) => l.id === id ? { ...l, ...data } : l));
      return;
    }
    await supabase.from('leads').update({ name: data.name, phone: data.phone, stage: data.stage, value: data.value, notes: data.notes }).eq('id', id);
  },

  updateLeadStage: async (leadId: string, stage: PipelineStage): Promise<void> => {
    await supabase.from('leads').update({ stage }).eq('id', leadId);
  },

  deleteLead: async (id: string): Promise<void> => {
    await supabase.from('leads').delete().eq('id', id);
  },

  // --- FINANCEIRO ---
  getFinanceEntries: async (userId: string): Promise<FinancialEntry[]> => {
    if (isDemoUser(userId)) return localStore.get('finance', userId) || [];
    const data = await safeQuery(supabase.from('financial_entries').select('*').eq('user_id', userId).order('date', { ascending: false }), []);
    return data.map((e: any) => ({ id: e.id, userId: e.user_id, description: e.description, value: e.value, type: e.type, date: e.date, category: e.category, entityType: e.entity_type }));
  },

  addFinanceEntry: async (entry: Omit<FinancialEntry, 'id'>): Promise<FinancialEntry> => {
    if (isDemoUser(entry.userId)) {
      const current = localStore.get('finance', entry.userId) || [];
      const newEntry = { ...entry, id: Math.random().toString() };
      localStore.save('finance', entry.userId, [newEntry, ...current]);
      return newEntry as FinancialEntry;
    }
    const { data } = await supabase.from('financial_entries').insert({ user_id: entry.userId, description: entry.description, value: entry.value, type: entry.type, date: entry.date, category: entry.category, entity_type: entry.entityType }).select().single();
    return data ? { ...data, userId: data.user_id, entityType: data.entity_type } : { ...entry, id: Math.random().toString() } as FinancialEntry;
  },

  updateFinanceEntry: async (id: string, entry: Partial<FinancialEntry>): Promise<void> => {
    const userId = entry.userId || '';
    if (userId && isDemoUser(userId)) {
      const current = localStore.get('finance', userId) || [];
      localStore.save('finance', userId, current.map((e: any) => e.id === id ? { ...e, ...entry } : e));
      return;
    }
    await supabase.from('financial_entries').update({ description: entry.description, value: entry.value, type: entry.type, date: entry.date, category: entry.category }).eq('id', id);
  },

  deleteFinanceEntry: async (id: string): Promise<void> => {
    await supabase.from('financial_entries').delete().eq('id', id);
  },

  // --- AGENDA ---
  getSchedule: async (userId: string): Promise<ScheduleItem[]> => {
    if (isDemoUser(userId)) return localStore.get('schedule', userId) || [];
    const data = await safeQuery(supabase.from('schedule_items').select('*').eq('user_id', userId).order('date', { ascending: true }), []);
    return data.map((s: any) => ({ id: s.id, userId: s.user_id, title: s.title, client: s.client, date: s.date, time: s.time, type: s.type, status: s.status }));
  },

  addScheduleItem: async (item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> => {
    if (isDemoUser(item.userId)) {
      const current = localStore.get('schedule', item.userId) || [];
      const newItem = { ...item, id: Math.random().toString() };
      localStore.save('schedule', item.userId, [...current, newItem]);
      return newItem as ScheduleItem;
    }
    const { data } = await supabase.from('schedule_items').insert({ user_id: item.userId, title: item.title, client: item.client, date: item.date, time: item.time, type: item.type, status: item.status }).select().single();
    return data ? { ...data, userId: data.user_id } : { ...item, id: Math.random().toString() } as ScheduleItem;
  },

  updateScheduleItem: async (id: string, item: Partial<ScheduleItem>): Promise<void> => {
    await supabase.from('schedule_items').update(item).eq('id', id);
  },

  deleteScheduleItem: async (id: string): Promise<void> => {
    await supabase.from('schedule_items').delete().eq('id', id);
  },

  // --- PERFIL ---
  getProfile: async (identifier: string): Promise<Profile | null> => {
    const allProfiles = localStore.getGlobal('all_profiles') || [];
    // Busca por userId ou slug
    const found = allProfiles.find((p: any) => p.userId === identifier || p.slug === identifier);
    if (found) return found;

    if (isDemoUser(identifier)) return localStore.get('profile', identifier);
    
    // Tenta UUID ou Slug no Supabase
    // Agora que a coluna 'slug' existe, podemos buscar por user_id ou slug
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`user_id.eq.${identifier},slug.eq.${identifier}`)
      .single();
    
    if (error) {
      console.error("Erro ao buscar perfil no Supabase (detalhes):", JSON.stringify(error, null, 2));
      return null;
    }
    if (!data) return null;
    // Fix: Corrected logo_url mapping to logoUrl as per Profile interface
    return { id: data.id, userId: data.user_id, slug: data.slug, businessName: data.business_name, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logoUrl: data.logo_url, vitrineCategory: data.vitrine_category, isPublished: data.is_published, socialLinks: data.social_links, storeConfig: data.store_config, bioConfig: data.bio_config };
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    if (isDemoUser(userId)) {
      const allProfiles = localStore.getGlobal('all_profiles') || [];
      const idx = allProfiles.findIndex((p: any) => p.userId === userId);
      if (idx > -1) {
        allProfiles[idx] = { ...allProfiles[idx], ...data };
        localStore.saveGlobal('all_profiles', allProfiles);
      }
      return allProfiles[idx];
    }

    // Map camelCase to snake_case for Supabase
    const supabaseData: any = {};
    if (data.businessName) supabaseData.business_name = data.businessName;
    if (data.category) supabaseData.category = data.category;
    if (data.phone) supabaseData.phone = data.phone;
    if (data.address) supabaseData.address = data.address;
    if (data.city) supabaseData.city = data.city;
    if (data.neighborhood) supabaseData.neighborhood = data.neighborhood;
    if (data.bio) supabaseData.bio = data.bio;
    if (data.logoUrl) supabaseData.logo_url = data.logoUrl;
    if (data.vitrineCategory) supabaseData.vitrine_category = data.vitrineCategory;
    if (data.isPublished !== undefined) {
      supabaseData.is_published = data.isPublished;
      console.log("Salvando is_published no Supabase:", data.isPublished);
    }
    if (data.socialLinks) supabaseData.social_links = data.socialLinks;
    if (data.storeConfig) supabaseData.store_config = data.storeConfig;
    if (data.bioConfig) supabaseData.bio_config = data.bioConfig;
    if ((data as any).plan) supabaseData.plan = (data as any).plan;
    if ((data as any).points !== undefined) supabaseData.points = (data as any).points;
    if ((data as any).role) supabaseData.role = (data as any).role;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(supabaseData)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error("Error updating profile in Supabase:", { error, supabaseData, userId });
      throw error;
    }
    return updated?.[0];
  },

  getPublishedProfiles: async (): Promise<Profile[]> => {
    // Busca todos do Supabase
    const { data: sbProfiles, error: sbError } = await supabase.from('profiles').select('*');
    if (sbError) console.error("Erro ao buscar perfis no Supabase:", sbError);
    
    // Removemos o filtro de is_published temporariamente para exibir todos os perfis
    // Filtramos perfis com businessName nulo ou indefinido para evitar duplicidade/perfis vazios
    const mappedSb = (sbProfiles || [])
      .filter((p: any) => typeof p.business_name === 'string' && p.business_name.trim() !== "")
      .map((p: any) => ({ 
      id: p.id, 
      userId: p.user_id, 
      slug: p.slug, 
      businessName: p.business_name, 
      category: p.category, 
      phone: p.phone,
      logoUrl: p.logo_url,
      vitrineCategory: p.vitrine_category,
      isPublished: p.is_published,
      storeConfig: p.store_config
    }));
    
    return mappedSb;
  },

  getAllProfiles: async () => {
    const sbData = await safeQuery(supabase.from('profiles').select('*'), []);
    const mappedSb = sbData.map((p: any) => ({ 
      id: p.id, 
      userId: p.user_id, 
      slug: p.slug, 
      businessName: p.business_name, 
      category: p.category, 
      city: p.city, 
      bio: p.bio, 
      logoUrl: p.logo_url, 
      vitrineCategory: p.vitrine_category, 
      plan: p.plan, 
      points: p.points,
      role: p.role,
      level: p.level,
      menuCash: p.menu_cash,
      referralCode: p.referral_code,
      referralsCount: p.referrals_count,
      email: p.email // Note: email might need to be fetched separately or stored in profiles if allowed
    }));
    const local = localStore.getGlobal('all_profiles') || [];
    return [...mappedSb, ...local];
  },

  // --- PRODUTOS ---
  getProducts: async (userId: string) => {
    if (isDemoUser(userId)) return localStore.get('products', userId) || [];
    const data = await safeQuery(supabase.from('products').select('*').eq('user_id', userId), []);
    return data.map((p: any) => ({ ...p, userId: p.user_id, imageUrl: p.image_url, videoUrl: p.video_url, promoPrice: p.promo_price, storeCategoryId: p.store_category_id, pointsReward: p.points_reward, isLocal: p.is_local, stock: p.stock, buttonType: p.button_type }));
  },

  createProduct: async (product: Product) => {
    if (isDemoUser(product.userId)) {
        const current = localStore.get('products', product.userId) || [];
        const next = [...current, { ...product, id: Math.random().toString() }];
        localStore.save('products', product.userId, next);
        return { ...product, id: Math.random().toString() };
    }
    const { data } = await supabase.from('products').insert({ user_id: product.userId, store_category_id: product.storeCategoryId, name: product.name, description: product.description, price: product.price, promo_price: product.promoPrice, image_url: product.imageUrl, video_url: product.videoUrl, category: product.category, available: product.available, variations: product.variations, button_type: product.buttonType || 'buy', external_link: product.externalLink, stock: product.stock, points_reward: product.pointsReward, is_local: product.isLocal }).select().single();
    return data ? { ...data, userId: data.user_id, imageUrl: data.image_url, video_url: data.video_url, stock: data.stock, buttonType: data.button_type } : { ...product, id: Math.random().toString() };
  },

  getAllProducts: async (): Promise<any[]> => {
    const { data } = await supabase.from('products').select('*, profiles(business_name, logo_url, phone, neighborhood, store_config)');
    return (data || []).map((p: any) => ({ ...p, userId: p.user_id, imageUrl: p.image_url, videoUrl: p.video_url, businessName: p.profiles?.business_name || 'Loja Local', businessLogo: p.profiles?.logo_url, businessPhone: p.profiles?.phone, neighborhood: p.profiles?.neighborhood, pointsReward: p.points_reward, isLocal: p.is_local, stock: p.stock, buttonType: p.button_type }));
  },

  getStoreCategories: async (userId: string) => {
    if (isDemoUser(userId)) return localStore.get('categories', userId) || [];
    const data = await safeQuery(supabase.from('store_categories').select('*').eq('user_id', userId).order('order', { ascending: true }), []);
    return data.map((c: any) => ({ ...c, userId: c.user_id }));
  },

  createStoreCategory: async (userId: string, name: string) => {
    if (isDemoUser(userId)) {
        const current = localStore.get('categories', userId) || [];
        const next = [...current, { id: Math.random().toString(), user_id: userId, name, order: 0 }];
        localStore.save('categories', userId, next);
        return { id: Math.random().toString(), userId, name, order: 0 };
    }
    const { data } = await supabase.from('store_categories').insert({ user_id: userId, name, order: 0 }).select().single();
    return { ...data, userId: data?.user_id || userId };
  },

  deleteStoreCategory: async (id: string, userId: string) => {
    if (isDemoUser(userId)) {
        const current = localStore.get('categories', userId) || [];
        localStore.save('categories', userId, current.filter((c: any) => c.id !== id));
        return;
    }
    await supabase.from('store_categories').delete().eq('id', id).eq('user_id', userId);
  },

  // --- BLOG POSTS ---
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const sbData = await safeQuery(supabase.from('blog_posts').select('*'), []);
    const localData = localStore.getGlobal('blog_posts') || [];
    const all = [...(sbData || []), ...localData];
    const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
    unique.sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime());
    return unique.map((p: any) => ({ ...p, imageUrl: p.image_url || p.imageUrl, userId: p.user_id || p.userId }));
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const newPost = { 
      ...post, 
      id: Math.random().toString(36).substr(2, 9), 
      date: new Date().toLocaleDateString('pt-BR'), 
      created_at: new Date().toISOString() 
    } as BlogPost;
    const local = localStore.getGlobal('blog_posts') || [];
    localStore.saveGlobal('blog_posts', [newPost, ...local]);
    if (post.userId && !isDemoUser(post.userId)) {
        await supabase.from('blog_posts').insert({ 
          user_id: post.userId, 
          title: post.title, 
          summary: post.summary, 
          content: post.content, 
          author: post.author, 
          category: post.category, 
          image_url: post.imageUrl, 
          date: newPost.date,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          seo_keywords: post.seoKeywords,
          slug: post.slug,
          alt_text: post.altText,
          gmb_sync: post.googleMyBusinessSync,
          og_title: post.ogTitle,
          og_description: post.ogDescription,
          og_image: post.ogImage
        });
    }
    return newPost;
  },

  updateBlogPost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    const local = localStore.getGlobal('blog_posts') || [];
    const idx = local.findIndex((p: any) => p.id === id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...post };
      localStore.saveGlobal('blog_posts', local);
    }

    if (post.userId && !isDemoUser(post.userId)) {
      await supabase.from('blog_posts').update({
        title: post.title,
        summary: post.summary,
        content: post.content,
        author: post.author,
        category: post.category,
        image_url: post.imageUrl,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
        seo_keywords: post.seoKeywords,
        slug: post.slug,
        alt_text: post.altText,
        gmb_sync: post.googleMyBusinessSync,
        og_title: post.ogTitle,
        og_description: post.ogDescription,
        og_image: post.ogImage
      }).eq('id', id);
    }
    return { ...post, id } as BlogPost;
  },

  deleteBlogPost: async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    const local = localStore.getGlobal('blog_posts') || [];
    localStore.saveGlobal('blog_posts', local.filter((p: any) => p.id !== id));
  },

  // --- OUTROS ---
  getOffers: async (filters?: any) => {
    let query = supabase.from('offers').select('*');
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.userId) {
        if (isDemoUser(filters.userId)) return localStore.get('offers', filters.userId) || [];
        query = query.eq('user_id', filters.userId);
    }
    const { data } = await query;
    return (data || []).map((o: any) => ({ id: o.id, userId: o.user_id, title: o.title, description: o.description, category: o.category, city: o.city, price: o.price, createdAt: o.created_at, imageUrl: o.image_url, videoUrl: o.video_url, logoUrl: o.logo_url, socialLinks: o.social_links, coupons: o.coupons, scheduling: o.scheduling }));
  },

  getMyOffers: async (userId: string) => mockBackend.getOffers({ userId }),

  createOffer: async (userId: string, offer: any): Promise<Offer> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        const next = [...current, { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() }];
        localStore.save('offers', userId, next);
        return { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() };
    }
    const { data } = await supabase.from('offers').insert({ user_id: userId, title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.image_url, video_url: offer.video_url, logo_url: offer.logoUrl, social_links: offer.socialLinks, scheduling: offer.scheduling, created_at: Date.now() }).select().single();
    return data ? { id: data.id, userId: data.user_id, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price, createdAt: data.created_at, imageUrl: data.image_url, videoUrl: data.video_url, logoUrl: data.logo_url, socialLinks: data.social_links, coupons: data.coupons, scheduling: data.scheduling } : { id: Math.random().toString(), userId, title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, createdAt: Date.now(), imageUrl: offer.image_url, videoUrl: offer.video_url, logoUrl: offer.logo_url, socialLinks: offer.social_links, coupons: offer.coupons, scheduling: offer.scheduling };
  },

  updateOffer: async (userId: string, offerId: string, offer: any): Promise<Offer> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        const next = current.map((o: any) => o.id === offerId ? { ...o, ...offer } : o);
        localStore.save('offers', userId, next);
        return { ...offer, id: offerId, userId };
    }
    const { data } = await supabase.from('offers').update({ title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.image_url, video_url: offer.video_url, logo_url: offer.logoUrl, social_links: offer.socialLinks, scheduling: offer.scheduling }).eq('id', offerId).eq('user_id', userId).select().single();
    return data ? { id: data.id, userId: data.user_id, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price, createdAt: data.created_at, imageUrl: data.image_url, videoUrl: data.video_url, logoUrl: data.logo_url, socialLinks: data.social_links, coupons: data.coupons, scheduling: data.scheduling } : { id: offerId, userId, title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, createdAt: Date.now(), imageUrl: offer.image_url, videoUrl: offer.video_url, logoUrl: offer.logo_url, socialLinks: offer.social_links, coupons: offer.coupons, scheduling: offer.scheduling };
  },

  deleteOffer: async (id: string, userId: string): Promise<void> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        localStore.save('offers', userId, current.filter((o: any) => o.id !== id));
        return;
    }
    await supabase.from('offers').delete().eq('id', id).eq('user_id', userId);
  },

  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const { data: posts } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    const local = localStore.getGlobal('community_posts') || [];
    const all = [...(posts || []), ...local];
    const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
    unique.sort((a, b) => b.createdAt - a.createdAt);
    return unique.map(post => ({ ...post, userId: post.user_id || post.userId, userName: post.user_name || post.userName, businessName: post.business_name || post.businessName, userAvatar: post.user_avatar || post.userAvatar, imageUrl: post.image_url || post.imageUrl, likedBy: post.liked_by || post.likedBy || [], comments: (post.comments || []).map((c: any) => ({ ...c, userId: c.user_id || c.userId, userName: c.user_name || c.userName, userAvatar: c.user_avatar || c.userAvatar })), createdAt: post.created_at || post.createdAt }));
  },

  createCommunityPost: async (post: Partial<CommunityPost>): Promise<CommunityPost> => {
    const newPost: CommunityPost = { id: Math.random().toString(36).substr(2, 9), userId: post.userId || '', userName: post.userName || '', businessName: post.businessName || '', userAvatar: post.userAvatar || '', content: post.content || '', likes: 0, likedBy: [], comments: [], createdAt: Date.now() };
    const local = localStore.getGlobal('community_posts') || [];
    localStore.saveGlobal('community_posts', [newPost, ...local]);
    if (post.userId && !isDemoUser(post.userId)) {
        await supabase.from('community_posts').insert({ user_id: newPost.userId, user_name: newPost.userName, business_name: newPost.businessName, user_avatar: newPost.userAvatar, content: newPost.content, created_at: newPost.createdAt });
    }
    return newPost;
  },

  getB2BOffers: async (): Promise<B2BOffer[]> => {
    const sbData = await safeQuery(supabase.from('b2b_offers').select('*'), []);
    const localData = localStore.getGlobal('b2b_offers') || [];
    const all = [...(sbData || []), ...localData];
    const unique = Array.from(new Map(all.map(o => [o.id, o])).values());
    unique.sort((a, b) => (b.created_at || b.createdAt) - (a.created_at || a.createdAt));
    return unique.map((o: any) => ({ ...o, userId: o.user_id || o.userId, businessName: o.business_name || o.businessName, businessLogo: o.business_logo || o.businessLogo, createdAt: o.created_at || o.createdAt }));
  },

  createB2BOffer: async (offer: any): Promise<B2BOffer> => {
    const newOffer: B2BOffer = { ...offer, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
    const local = localStore.getGlobal('b2b_offers') || [];
    localStore.saveGlobal('b2b_offers', [newOffer, ...local]);
    if (offer.userId && !isDemoUser(offer.userId)) {
        await supabase.from('b2b_offers').insert({ user_id: offer.userId, business_name: offer.businessName, business_logo: offer.businessLogo, title: offer.title, description: offer.description, discount: offer.discount, category: offer.category, terms: offer.terms, created_at: newOffer.createdAt });
    }
    return newOffer;
  },

  upgradePlan: async (userId: string, plan: string) => {
    if (isDemoUser(userId)) return plan;
    await supabase.from('profiles').update({ plan }).eq('user_id', userId);
    return plan;
  },

  runExtractor: async (type: string, keyword: string): Promise<ExtractorResult[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return [ { id: 'ext1', name: `${keyword} A`, phone: '5511999990001', address: 'Rua das Flores, 123', source: type as any, category: keyword }, { id: 'ext2', name: `${keyword} B`, phone: '5511999990002', address: 'Av. Brasil, 456', source: type as any, category: keyword } ];
  },

  getQuotes: async () => [],
  getReviews: async () => [],
  getLoyaltyCards: async (): Promise<LoyaltyCard[]> => [ { id: '1', businessName: 'Café Central', reward: 'Café Grátis', totalStamps: 5, currentStamps: 2, color: 'bg-amber-600' } ],
  stampLoyaltyCard: async (id: string): Promise<LoyaltyCard> => ({ id, businessName: 'Sushi Bar', reward: 'Combinado 15 peças', totalStamps: 10, currentStamps: 9, color: 'bg-rose-600' }),
  getNetworkingProfiles: async () => [],
  createNetworkingProfile: async (data: any) => data,
  deleteNetworkingProfile: async (id: string) => {},
  // --- CUPONS ---
  getCoupons: async (userId: string): Promise<Coupon[]> => {
    if (isDemoUser(userId)) return localStore.get('coupons', userId) || [];
    const data = await safeQuery(supabase.from('coupons').select('*').eq('user_id', userId).order('created_at', { ascending: false }), []);
    return data.map((c: any) => ({ ...c, userId: c.user_id, pointsReward: c.points_reward, expiryDate: c.expiry_date, createdAt: c.created_at }));
  },

  createCoupon: async (coupon: Omit<Coupon, 'id' | 'createdAt'>): Promise<Coupon> => {
    if (isDemoUser(coupon.userId)) {
      const current = localStore.get('coupons', coupon.userId) || [];
      const newCoupon = { ...coupon, id: Math.random().toString(), createdAt: Date.now() };
      localStore.save('coupons', coupon.userId, [newCoupon, ...current]);
      return newCoupon as Coupon;
    }
    const { data } = await supabase.from('coupons').insert({
      user_id: coupon.userId,
      code: coupon.code,
      title: coupon.title,
      discount: coupon.discount,
      type: coupon.type,
      points_reward: coupon.pointsReward,
      description: coupon.description,
      expiry_date: coupon.expiryDate,
      active: coupon.active,
      created_at: Date.now()
    }).select().single();
    return data ? { ...data, userId: data.user_id, pointsReward: data.points_reward, expiryDate: data.expiry_date, createdAt: data.created_at } : { ...coupon, id: Math.random().toString(), createdAt: Date.now() } as Coupon;
  },

  deleteCoupon: async (id: string, userId: string): Promise<void> => {
    if (isDemoUser(userId)) {
      const current = localStore.get('coupons', userId) || [];
      localStore.save('coupons', userId, current.filter((c: any) => c.id !== id));
      return;
    }
    await supabase.from('coupons').delete().eq('id', id).eq('user_id', userId);
  },

  updateCoupon: async (id: string, userId: string, data: Partial<Coupon>): Promise<void> => {
    if (isDemoUser(userId)) {
      const current = localStore.get('coupons', userId) || [];
      const updated = current.map((c: any) => c.id === id ? { ...c, ...data } : c);
      localStore.save('coupons', userId, updated);
      return;
    }
    await supabase.from('coupons').update({
      code: data.code,
      title: data.title,
      discount: data.discount,
      type: data.type,
      points_reward: data.pointsReward,
      description: data.description,
      expiry_date: data.expiryDate,
      active: data.active
    }).eq('id', id).eq('user_id', userId);
  },
  
  redeemCoupon: async (userId: string, couponId: string, points: number) => {},
  addCoupon: async (userId: string, offerId: string, data: any) => {},
  getPointsHistory: async (userId: string) => [],
  likePost: async (postId: string, userId: string) => ({} as any),
  
  // --- VITRINE COMMENTS ---
  getVitrineComments: async (vitrineUserId: string): Promise<VitrineComment[]> => {
    const local = localStore.getGlobal('vitrine_comments') || [];
    return local.filter((c: any) => c.vitrineUserId === vitrineUserId).sort((a: any, b: any) => b.createdAt - a.createdAt);
  },

  addVitrineComment: async (comment: Omit<VitrineComment, 'id' | 'createdAt'>): Promise<VitrineComment> => {
    const newComment: VitrineComment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    const local = localStore.getGlobal('vitrine_comments') || [];
    localStore.saveGlobal('vitrine_comments', [newComment, ...local]);
    return newComment;
  },

  // --- B2B TRANSACTIONS ---
  getB2BTransactions: async (userId: string): Promise<any[]> => {
    const local = localStore.getGlobal('b2b_transactions') || [];
    return local.filter((t: any) => t.buyerId === userId || t.sellerId === userId).sort((a: any, b: any) => b.createdAt - a.createdAt);
  },

  createB2BTransaction: async (transaction: any): Promise<any> => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: Date.now()
    };
    const local = localStore.getGlobal('b2b_transactions') || [];
    localStore.saveGlobal('b2b_transactions', [newTransaction, ...local]);
    return newTransaction;
  },

  updateB2BTransactionStatus: async (transactionId: string, status: 'confirmed' | 'rejected'): Promise<void> => {
    const local = localStore.getGlobal('b2b_transactions') || [];
    const updated = local.map((t: any) => t.id === transactionId ? { ...t, status } : t);
    localStore.saveGlobal('b2b_transactions', updated);
  }
};
