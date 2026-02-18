
import { User, Profile, Offer, Lead, ExtractorResult, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction, PipelineStage, B2BOffer } from '../types';
import { supabase } from './supabaseClient';

const isDemoUser = (userId: string) => 
  userId === 'de30de30-0000-4000-a000-000000000000' || 
  userId === 'c0a80101-0000-4000-a000-000000000000' ||
  userId.includes('demo') || 
  userId.includes('carlos');

// Helper para salvar localmente em caso de falha ou modo demo
const localStore = {
  save: (key: string, userId: string, data: any) => {
    localStorage.setItem(`menu_${key}_${userId}`, JSON.stringify(data));
  },
  get: (key: string, userId: string) => {
    const saved = localStorage.getItem(`menu_${key}_${userId}`);
    return saved ? JSON.parse(saved) : null;
  }
};

const safeQuery = async <T>(query: Promise<{data: T | null, error: any}>, fallback: T): Promise<T> => {
  try {
    const { data, error } = await query;
    if (error) {
      if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return fallback;
      }
      return fallback;
    }
    return data || fallback;
  } catch (e) {
    return fallback;
  }
};

export const mockBackend = {
  // --- CRM / LEADS ---
  getLeads: async (userId: string): Promise<Lead[]> => {
    if (isDemoUser(userId)) return localStore.get('leads', userId) || [];
    const data = await safeQuery(supabase.from('leads').select('*').eq('user_id', userId).order('created_at', { ascending: false }), []);
    const leads = data.map((l: any) => ({ id: l.id, userId: l.user_id, name: l.name, phone: l.phone, source: l.source, stage: l.stage, notes: l.notes, value: l.value, createdAt: l.created_at }));
    if (leads.length === 0) return localStore.get('leads', userId) || [];
    return leads;
  },

  addLeads: async (leads: Partial<Lead>[]): Promise<void> => {
    const userId = leads[0]?.userId || '';
    if (isDemoUser(userId)) {
      const current = localStore.get('leads', userId) || [];
      localStore.save('leads', userId, [...leads.map(l => ({ ...l, id: Math.random().toString(), createdAt: Date.now() })), ...current]);
      return;
    }
    const { error } = await supabase.from('leads').insert(leads.map(l => ({ user_id: l.userId, name: l.name, phone: l.phone, source: l.source || 'manual', stage: l.stage || 'new', notes: l.notes, value: l.value || 0, created_at: Date.now() })));
    if (error) {
      const current = localStore.get('leads', userId) || [];
      localStore.save('leads', userId, [...leads, ...current]);
    }
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

  // --- FINANCEIRO (CAIXA) ---
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
    await supabase.from('financial_entries').update(entry).eq('id', id);
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
    if (isDemoUser(userId)) return localStore.get('profile', userId);
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error || !data) return localStore.get('profile', userId);
    return { id: data.id, userId: data.user_id, businessName: data.business_name, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logoUrl: data.logo_url, socialLinks: data.social_links, storeConfig: data.store_config, bioConfig: data.bio_config };
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    localStore.save('profile', userId, { ...data, userId });
    if (!isDemoUser(userId)) {
        // Fix: corrected property name 'bioConfig' to match interface definition in types.ts
        await supabase.from('profiles').update({ business_name: data.businessName, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logo_url: data.logoUrl, social_links: data.socialLinks, store_config: data.storeConfig, bio_config: data.bioConfig }).eq('user_id', userId);
    }
  },

  getAllProfiles: async () => {
    const data = await safeQuery(supabase.from('profiles').select('*'), []);
    return data.map((p: any) => ({ id: p.id, userId: p.user_id, businessName: p.business_name, category: p.category, city: p.city, bio: p.bio, logoUrl: p.logo_url, storeConfig: p.store_config }));
  },

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
    return data ? { ...data, userId: data.user_id, imageUrl: data.image_url, videoUrl: data.video_url, stock: data.stock, buttonType: data.button_type } : { ...product, id: Math.random().toString() };
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
    const { data } = await supabase.from('offers').insert({ user_id: userId, title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.imageUrl, video_url: offer.videoUrl, logo_url: offer.logoUrl, social_links: offer.social_links, scheduling: offer.scheduling, created_at: Date.now() }).select().single();
    return data ? { id: data.id, userId: data.user_id, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price, createdAt: data.created_at, imageUrl: data.image_url, videoUrl: data.video_url, logo_url: data.logo_url, social_links: data.social_links, coupons: data.coupons, scheduling: data.scheduling } : { ...offer, id: Math.random().toString(), userId, createdAt: Date.now() };
  },

  updateOffer: async (userId: string, offerId: string, offer: any): Promise<Offer> => {
    if (isDemoUser(userId)) {
        const current = localStore.get('offers', userId) || [];
        const next = current.map((o: any) => o.id === offerId ? { ...o, ...offer } : o);
        localStore.save('offers', userId, next);
        return { ...offer, id: offerId, userId };
    }
    const { data } = await supabase.from('offers').update({ title: offer.title, description: offer.description, category: offer.category, city: offer.city, price: offer.price, image_url: offer.imageUrl, video_url: offer.videoUrl, logo_url: offer.logo_url, social_links: offer.social_links, scheduling: offer.scheduling }).eq('id', offerId).eq('user_id', userId).select().single();
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

  getPointsHistory: async (userId: string): Promise<PointsTransaction[]> => {
    if (isDemoUser(userId)) return [];
    const data = await safeQuery(supabase.from('points_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }), []);
    return data.map((t: any) => ({ id: t.id, userId: t.user_id, action: t.action, points: t.points, createdAt: t.created_at, category: t.category }));
  },

  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const { data: posts } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    if (!posts) return [];
    return Promise.all(posts.map(async post => {
      const { data: comments } = await safeQuery(supabase.from('community_comments').select('*').eq('post_id', post.id), { data: [] });
      return { id: post.id, userId: post.user_id, userName: post.user_name, businessName: post.business_name, userAvatar: post.user_avatar, content: post.content, imageUrl: post.image_url, likes: post.likes, likedBy: post.liked_by || [], comments: (comments || []).map((c: any) => ({ id: c.id, userId: c.user_id, userName: c.user_name, userAvatar: c.user_avatar, content: c.content, createdAt: c.created_at })), createdAt: post.created_at };
    }));
  },

  // Implementation of missing createCommunityPost method
  createCommunityPost: async (post: Partial<CommunityPost>): Promise<CommunityPost> => {
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      userId: post.userId || '',
      userName: post.userName || '',
      businessName: post.businessName || '',
      userAvatar: post.userAvatar || '',
      content: post.content || '',
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now()
    };
    await supabase.from('community_posts').insert({
      user_id: newPost.userId,
      user_name: newPost.userName,
      business_name: newPost.businessName,
      user_avatar: newPost.userAvatar,
      content: newPost.content,
      created_at: newPost.createdAt
    });
    return newPost;
  },

  // Implementation of missing likePost method
  likePost: async (postId: string, userId: string): Promise<CommunityPost> => {
    const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
    if (!post) throw new Error("Post not found");
    
    const likedBy = post.liked_by || [];
    const idx = likedBy.indexOf(userId);
    let nextLikedBy = [...likedBy];
    if (idx > -1) nextLikedBy.splice(idx, 1);
    else nextLikedBy.push(userId);

    const { data: updated } = await supabase.from('community_posts')
      .update({ liked_by: nextLikedBy, likes: nextLikedBy.length })
      .eq('id', postId)
      .select()
      .single();

    return {
      id: updated.id,
      userId: updated.user_id,
      userName: updated.user_name,
      businessName: updated.business_name,
      userAvatar: updated.user_avatar,
      content: updated.content,
      likes: updated.likes,
      likedBy: updated.liked_by,
      comments: [], // Simplified, would need a fetch in a real app
      createdAt: updated.created_at
    };
  },

  getB2BOffers: async (): Promise<B2BOffer[]> => {
    const data = await safeQuery(supabase.from('b2b_offers').select('*'), []);
    return data.map((o: any) => ({ ...o, userId: o.user_id, businessName: o.business_name, businessLogo: o.business_logo, createdAt: o.created_at }));
  },

  createB2BOffer: async (offer: any): Promise<B2BOffer> => {
    const { data } = await supabase.from('b2b_offers').insert({ user_id: offer.userId, business_name: offer.businessName, business_logo: offer.business_logo, title: offer.title, description: offer.description, discount: offer.discount, category: offer.category, terms: offer.terms, created_at: Date.now() }).select().single();
    return { ...data, id: data?.id || Math.random().toString(), userId: data?.user_id || offer.userId };
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const sbData = await safeQuery(supabase.from('blog_posts').select('*'), []);
    // Concatenar com dados locais para que o usuário veja seus posts imediatamente mesmo sem Supabase ativo ou em modo offline
    const localData = JSON.parse(localStorage.getItem('menu_blog_global') || '[]');
    const allPosts = [...sbData, ...localData];
    
    // Remover duplicatas por ID e mapear campos
    const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());
    
    return uniquePosts.map((p: any) => ({ 
      ...p, 
      imageUrl: p.image_url || p.imageUrl, 
      userId: p.user_id || p.userId 
    }));
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const newPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('pt-BR'),
        created_at: new Date().toISOString()
    } as BlogPost;

    // Salvar localmente como redundância principal para visibilidade imediata
    const local = JSON.parse(localStorage.getItem('menu_blog_global') || '[]');
    localStorage.setItem('menu_blog_global', JSON.stringify([newPost, ...local]));

    // Tentar persistir no Supabase se não for demo
    if (post.userId && !isDemoUser(post.userId)) {
        await supabase.from('blog_posts').insert({
            user_id: post.userId,
            title: post.title,
            summary: post.summary,
            content: post.content,
            author: post.author,
            category: post.category,
            image_url: post.imageUrl,
            date: newPost.date
        });
    }
    
    return newPost;
  },

  deleteBlogPost: async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    const local = JSON.parse(localStorage.getItem('menu_blog_global') || '[]');
    localStorage.setItem('menu_blog_global', JSON.stringify(local.filter((p: any) => p.id !== id)));
  },

  runExtractor: async (type: string, keyword: string): Promise<ExtractorResult[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return [ { id: 'ext1', name: `${keyword} A`, phone: '5511999990001', address: 'Rua das Flores, 123', source: type as any, category: keyword }, { id: 'ext2', name: `${keyword} B`, phone: '5511999990002', address: 'Av. Brasil, 456', source: type as any, category: keyword } ];
  },

  upgradePlan: async (userId: string, plan: string) => {
    if (isDemoUser(userId)) return plan;
    await supabase.from('profiles').update({ plan }).eq('user_id', userId);
    return plan;
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
  addCoupon: async (userId: string, offerId: string, data: any) => {}
};
