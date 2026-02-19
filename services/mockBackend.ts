
import { User, Profile, Offer, Lead, ExtractorResult, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction, PipelineStage, B2BOffer, PortfolioItem } from '../types';
import { supabase } from './supabaseClient';

const isDemoUser = (userId: string) => 
  userId === 'de30de30-0000-4000-a000-000000000000' || 
  userId === 'c0a80101-0000-4000-a000-000000000000' ||
  userId === 'adadadad-0000-4000-a000-000000000000' ||
  userId.includes('mock_') ||
  userId.includes('demo') || 
  userId.includes('carlos');

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

const safeQuery = async <T>(query: Promise<{data: T | null, error: any}>, fallback: T): Promise<T> => {
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
      level: 'bronze',
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
      ...profileData
    };
    
    const allProfiles = localStore.getGlobal('all_profiles') || [];
    localStore.saveGlobal('all_profiles', [...allProfiles, newProfile]);
    
    return { user: newUser, profile: newProfile };
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
    return data.map((e: any) => ({ id: e.id, userId: e.user_id, description: e.description, value: e.value, type: e.type, date: e.date, category: e.category }));
  },

  addFinanceEntry: async (entry: Omit<FinancialEntry, 'id'>): Promise<FinancialEntry> => {
    if (isDemoUser(entry.userId)) {
      const current = localStore.get('finance', entry.userId) || [];
      const newEntry = { ...entry, id: Math.random().toString() };
      localStore.save('finance', entry.userId, [newEntry, ...current]);
      return newEntry as FinancialEntry;
    }
    const { data } = await supabase.from('financial_entries').insert({ user_id: entry.userId, description: entry.description, value: entry.value, type: entry.type, date: entry.date, category: entry.category }).select().single();
    return data ? { ...data, userId: data.user_id } : { ...entry, id: Math.random().toString() } as FinancialEntry;
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
  getProfile: async (userId: string): Promise<Profile | null> => {
    const allProfiles = localStore.getGlobal('all_profiles') || [];
    const found = allProfiles.find((p: any) => p.userId === userId);
    if (found) return found;

    if (isDemoUser(userId)) return localStore.get('profile', userId);
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error || !data) return null;
    return { id: data.id, userId: data.user_id, businessName: data.business_name, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logoUrl: data.logo_url, socialLinks: data.social_links, storeConfig: data.store_config, bioConfig: data.bio_config };
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    const allProfiles = localStore.getGlobal('all_profiles') || [];
    const idx = allProfiles.findIndex((p: any) => p.userId === userId);
    if (idx > -1) {
      allProfiles[idx] = { ...allProfiles[idx], ...data };
      localStore.saveGlobal('all_profiles', allProfiles);
    }
    
    localStore.save('profile', userId, { ...data, userId });
    if (!isDemoUser(userId)) {
        await supabase.from('profiles').update({ business_name: data.businessName, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logo_url: data.logoUrl, social_links: data.socialLinks, store_config: (data as any).storeConfig, bio_config: (data as any).bioConfig }).eq('user_id', userId);
    }
  },

  getAllProfiles: async () => {
    const sbData = await safeQuery(supabase.from('profiles').select('*'), []);
    const mappedSb = sbData.map((p: any) => ({ id: p.id, userId: p.user_id, businessName: p.business_name, category: p.category, city: p.city, bio: p.bio, logoUrl: p.logo_url, plan: p.plan, points: p.points }));
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
    const newPost = { ...post, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleDateString('pt-BR'), created_at: new Date().toISOString() } as BlogPost;
    const local = localStore.getGlobal('blog_posts') || [];
    localStore.saveGlobal('blog_posts', [newPost, ...local]);
    if (post.userId && !isDemoUser(post.userId)) {
        await supabase.from('blog_posts').insert({ user_id: post.userId, title: post.title, summary: post.summary, content: post.content, author: post.author, category: post.category, image_url: post.imageUrl, date: newPost.date });
    }
    return newPost;
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
    return (data || []).map((o: any) => ({ id: o.id, userId: o.user_id, title: o.title, description: o.description, category: o.category, city: o.city, price: o.price, createdAt: o.created_at, imageUrl: o.image_url, videoUrl: o.video_url, logo_url: o.logo_url, social_links: o.social_links, coupons: o.coupons, scheduling: o.scheduling }));
  },

  getMyOffers: async (userId: string) => mockBackend.getOffers({ userId }),

  createOffer: async (userId: string, offer: any): Promise<Offer> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        const next = [...current, { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() }];
        localStore.save('offers', userId, next);
        return { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() };
    }
    const { data } = await supabase.from('offers').insert({ user_id: userId, title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.image_url, video_url: offer.video_url, logo_url: offer.logo_url, social_links: offer.social_links, scheduling: offer.scheduling, created_at: Date.now() }).select().single();
    return data ? { id: data.id, userId: data.user_id, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price, createdAt: data.created_at, imageUrl: data.image_url, videoUrl: data.video_url, logo_url: data.logo_url, social_links: data.social_links, coupons: data.coupons, scheduling: data.scheduling } : { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() };
  },

  updateOffer: async (userId: string, offerId: string, offer: any): Promise<Offer> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        const next = current.map((o: any) => o.id === offerId ? { ...o, ...offer } : o);
        localStore.save('offers', userId, next);
        return { ...offer, id: offerId, userId };
    }
    const { data } = await supabase.from('offers').update({ title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.image_url, video_url: offer.video_url, logo_url: offer.logo_url, social_links: offer.social_links, scheduling: offer.scheduling }).eq('id', offerId).eq('user_id', userId).select().single();
    return data ? { id: data.id, userId: data.user_id, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price, createdAt: data.created_at, imageUrl: data.image_url, videoUrl: data.video_url, logo_url: data.logo_url, social_links: data.social_links, coupons: data.coupons, scheduling: data.scheduling } : { ...offer, id: offerId, userId };
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
  redeemCoupon: async (userId: string, couponId: string, points: number) => {},
  deleteCoupon: async (userId: string, offerId: string, couponId: string) => {},
  updateCoupon: async (userId: string, offerId: string, couponId: string, data: any) => {},
  addCoupon: async (userId: string, offerId: string, data: any) => {},
  getPointsHistory: async (userId: string) => [],
  likePost: async (postId: string, userId: string) => ({} as any),
};
