
import { User, Profile, Offer, Lead, ExtractorResult, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction, PipelineStage, B2BOffer } from '../types';
import { supabase } from './supabaseClient';

// Helper to safely execute supabase queries
const safeQuery = async <T>(query: Promise<{data: T | null, error: any}>, fallback: T): Promise<T> => {
  try {
    const { data, error } = await query;
    if (error) {
      if (error.message === 'Failed to fetch') return fallback;
      throw error;
    }
    return data || fallback;
  } catch (e: any) {
    if (e.message === 'Failed to fetch') return fallback;
    throw e;
  }
};

export const mockBackend = {
  // B2B Marketplace
  getB2BOffers: async (): Promise<B2BOffer[]> => {
    return [
      {
        id: 'b2b-1',
        userId: 'u1',
        businessName: 'Gráfica Rápida Express',
        businessLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Grafica',
        title: 'Desconto em Cartões de Visita',
        description: '20% de desconto para membros do Menu ADS em qualquer tiragem de cartões premium.',
        discount: '20% OFF',
        category: 'Serviços',
        terms: 'Válido apenas para membros ativos.',
        createdAt: Date.now()
      }
    ];
  },

  createB2BOffer: async (offer: Omit<B2BOffer, 'id' | 'createdAt'>): Promise<B2BOffer> => {
    const newOffer = { ...offer, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
    await mockBackend.addPoints(offer.userId, 'Criar Parceria B2B', 30, 'engajamento');
    return newOffer;
  },

  addPoints: async (userId: string, action: string, points: number, category: PointsTransaction['category']): Promise<void> => {
    try {
      const { data: profile } = await supabase.from('profiles').select('points').eq('user_id', userId).single();
      const currentPoints = profile?.points || 0;
      const newPoints = currentPoints + points;

      let level: User['level'] = 'bronze';
      if (newPoints >= 5000) level = 'ouro';
      else if (newPoints >= 1000) level = 'prata';

      await supabase.from('profiles').update({ points: newPoints, level }).eq('user_id', userId);
      await supabase.from('points_history').insert({
        user_id: userId,
        action,
        points,
        category,
        created_at: new Date().getTime()
      });
    } catch (e) {}
  },

  getPointsHistory: async (userId: string): Promise<PointsTransaction[]> => {
    const data = await safeQuery(
      supabase.from('points_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      []
    );
    return data.map((t: any) => ({ id: t.id, userId: t.user_id, action: t.action, points: t.points, createdAt: t.created_at, category: t.category }));
  },

  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    try {
      const { data: posts, error } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
      if (error || !posts) return [];
      const postsWithComments = await Promise.all(posts.map(async post => {
        const { data: comments } = await supabase.from('community_comments').select('*').eq('post_id', post.id);
        return {
          id: post.id,
          userId: post.user_id,
          userName: post.user_name,
          businessName: post.business_name,
          userAvatar: post.user_avatar,
          content: post.content,
          imageUrl: post.image_url,
          likes: post.likes,
          likedBy: post.liked_by || [],
          comments: (comments || []).map((c: any) => ({ id: c.id, userId: c.user_id, userName: c.user_name, userAvatar: c.user_avatar, content: c.content, createdAt: c.created_at })),
          createdAt: post.created_at
        };
      }));
      return postsWithComments;
    } catch (e) { return []; }
  },

  createCommunityPost: async (postData: Omit<CommunityPost, 'id' | 'likes' | 'likedBy' | 'comments' | 'createdAt'>): Promise<CommunityPost> => {
    const { data, error } = await supabase.from('community_posts').insert({
      user_id: postData.userId,
      user_name: postData.userName,
      business_name: postData.businessName,
      user_avatar: postData.userAvatar,
      content: postData.content,
      likes: 0,
      liked_by: [],
      created_at: new Date().getTime()
    }).select().single();
    if (error) {
      if (error.message === 'Failed to fetch') return { ...postData, id: 'temp-id', likes: 0, likedBy: [], comments: [], createdAt: Date.now() };
      throw error;
    }
    return { ...data, id: data.id, userId: data.user_id, userName: data.user_name, businessName: data.business_name, userAvatar: data.user_avatar, likedBy: [], comments: [], createdAt: data.created_at };
  },

  likePost: async (postId: string, userId: string): Promise<CommunityPost> => {
    try {
      const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
      if (!post) throw new Error('Post not found');
      const likedBy = post.liked_by || [];
      const likedIdx = likedBy.indexOf(userId);
      let newLikes = post.likes;
      if (likedIdx === -1) { likedBy.push(userId); newLikes += 1; } else { likedBy.splice(likedIdx, 1); newLikes -= 1; }
      const { data: updated } = await supabase.from('community_posts').update({ liked_by: likedBy, likes: newLikes }).eq('id', postId).select().single();
      const { data: comments } = await supabase.from('community_comments').select('*').eq('post_id', postId);
      return { 
        ...updated, 
        id: updated.id, userId: updated.user_id, userName: updated.user_name, businessName: updated.business_name, userAvatar: updated.user_avatar, likedBy: updated.liked_by, 
        comments: (comments || []).map((c: any) => ({ id: c.id, userId: c.user_id, userName: c.user_name, userAvatar: c.user_avatar, content: c.content, createdAt: c.created_at })),
        createdAt: updated.created_at 
      };
    } catch (e) { throw e; }
  },

  getFinanceEntries: async (userId: string) => {
    const data = await safeQuery(supabase.from('financial_entries').select('*').eq('user_id', userId), []);
    return data.map((e: any) => ({ ...e, userId: e.user_id }));
  },

  addFinanceEntry: async (entry: Omit<FinancialEntry, 'id'>) => {
    try {
      const { data, error } = await supabase.from('financial_entries').insert({
        user_id: entry.userId, description: entry.description, value: entry.value, type: entry.type, date: entry.date, category: entry.category
      }).select().single();
      if (error) {
        if (error.message === 'Failed to fetch') return { ...entry, id: 'temp-f-' + Date.now() };
        throw error;
      }
      return { ...data, userId: data.user_id };
    } catch (e) { return { ...entry, id: 'temp-f-' + Date.now() }; }
  },

  /* Fix: Add deleteFinanceEntry method */
  deleteFinanceEntry: async (id: string) => {
    try { await supabase.from('financial_entries').delete().eq('id', id); } catch (e) {}
  },

  getLeads: async (userId: string) => {
    const data = await safeQuery(supabase.from('leads').select('*').eq('user_id', userId), []);
    return data.map((l: any) => ({ ...l, userId: l.user_id }));
  },

  /* Fix: Add updateLead method */
  updateLead: async (id: string, data: Partial<Lead>) => {
    try { await supabase.from('leads').update(data).eq('id', id); } catch (e) {}
  },

  updateLeadStage: async (leadId: string, stage: PipelineStage) => {
    try { await supabase.from('leads').update({ stage }).eq('id', leadId); } catch (e) {}
  },

  /* Fix: Add deleteLead method */
  deleteLead: async (id: string) => {
    try { await supabase.from('leads').delete().eq('id', id); } catch (e) {}
  },

  /* Fix: Add addLeads method for bulk import */
  addLeads: async (leads: Lead[]) => {
    try {
      const leadsToInsert = leads.map(l => ({
        user_id: l.userId, name: l.name, phone: l.phone, source: l.source, stage: l.stage, notes: l.notes, value: l.value, created_at: l.createdAt || Date.now()
      }));
      await supabase.from('leads').insert(leadsToInsert);
    } catch (e) {}
  },

  getSchedule: async (userId: string) => {
    const data = await safeQuery(supabase.from('schedule_items').select('*').eq('user_id', userId), []);
    return data.map((s: any) => ({ ...s, userId: s.user_id }));
  },

  addScheduleItem: async (item: Omit<ScheduleItem, 'id'>) => {
    try {
      const { data, error } = await supabase.from('schedule_items').insert({
        user_id: item.userId, title: item.title, client: item.client, date: item.date, time: item.time, type: item.type, status: item.status
      }).select().single();
      if (error) return { ...item, id: 'temp-s-' + Date.now() };
      return { ...data, userId: data.user_id };
    } catch (e) { return { ...item, id: 'temp-s-' + Date.now() }; }
  },

  getProfile: async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
      if (error || !data) return null;
      return { id: data.id, userId: data.user_id, businessName: data.business_name, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logoUrl: data.logo_url, socialLinks: data.social_links, storeConfig: data.store_config, bioConfig: data.bio_config };
    } catch (e) { return null; }
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    try {
      const profileData = { business_name: data.businessName, category: data.category, phone: data.phone, address: data.address, city: data.city, neighborhood: data.neighborhood, bio: data.bio, logo_url: data.logoUrl, social_links: data.socialLinks, store_config: data.storeConfig, bio_config: data.bioConfig };
      const { data: updated } = await supabase.from('profiles').update(profileData).eq('user_id', userId).select().single();
      return updated;
    } catch (e) { return data; }
  },

  getAllProfiles: async () => {
    const data = await safeQuery(supabase.from('profiles').select('*'), []);
    return data.map((p: any) => ({ id: p.id, userId: p.user_id, businessName: p.business_name, category: p.category, city: p.city, bio: p.bio, logoUrl: p.logo_url, storeConfig: p.store_config }));
  },

  getOffers: async (filters?: any) => {
    try {
      let query = supabase.from('offers').select('*');
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.city) query = query.ilike('city', `%${filters.city}%`);
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      const { data } = await query;
      return (data || []).map((o: any) => ({ id: o.id, userId: o.user_id, title: o.title, description: o.description, category: o.category, city: o.city, price: o.price, createdAt: o.created_at, imageUrl: o.image_url, videoUrl: o.video_url, logoUrl: o.logo_url, socialLinks: o.social_links, coupons: o.coupons, scheduling: o.scheduling }));
    } catch (e) { return []; }
  },

  /* Fix: Add getMyOffers method */
  getMyOffers: async (userId: string) => {
    return mockBackend.getOffers({ userId });
  },

  /* Fix: Add deleteOffer method */
  deleteOffer: async (id: string, userId: string) => {
    try { await supabase.from('offers').delete().eq('id', id).eq('user_id', userId); } catch (e) {}
  },

  /* Fix: Add updateOffer method */
  updateOffer: async (userId: string, offerId: string, data: any) => {
    try {
      const { data: updated } = await supabase.from('offers').update({
        title: data.title, description: data.description, category: data.category, city: data.city, price: data.price,
        image_url: data.imageUrl, video_url: data.videoUrl, logo_url: data.logoUrl, social_links: data.socialLinks, scheduling: data.scheduling
      }).eq('id', offerId).eq('user_id', userId).select().single();
      return { ...updated, id: updated.id, userId: updated.user_id, imageUrl: updated.image_url, videoUrl: updated.video_url, logoUrl: updated.logo_url, socialLinks: updated.social_links };
    } catch (e) { return data; }
  },

  /* Fix: Add createOffer method */
  createOffer: async (userId: string, data: any) => {
    try {
      const { data: created } = await supabase.from('offers').insert({
        user_id: userId, title: data.title, description: data.description, category: data.category, city: data.city, price: data.price,
        image_url: data.imageUrl, video_url: data.videoUrl, logo_url: data.logoUrl, social_links: data.socialLinks, scheduling: data.scheduling,
        created_at: Date.now()
      }).select().single();
      return { ...created, id: created.id, userId: created.user_id, imageUrl: created.image_url, videoUrl: created.video_url, logoUrl: created.logo_url, socialLinks: created.social_links };
    } catch (e) { return { ...data, id: 'temp-' + Date.now(), userId, createdAt: Date.now() }; }
  },

  /* Fix: Add upgradePlan method */
  upgradePlan: async (userId: string, plan: string) => {
    try {
      await supabase.from('profiles').update({ plan }).eq('user_id', userId);
      return plan;
    } catch (e) { throw e; }
  },

  /* Fix: Add coupon methods */
  redeemCoupon: async (userId: string, couponId: string, points: number) => {
    await mockBackend.addPoints(userId, 'Resgate de Cupom', points, 'engajamento');
    return true;
  },

  deleteCoupon: async (userId: string, offerId: string, couponId: string) => {
    try {
      const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
      if (offer && offer.coupons) {
        const newCoupons = offer.coupons.filter((c: any) => c.id !== couponId);
        await supabase.from('offers').update({ coupons: newCoupons }).eq('id', offerId);
      }
    } catch (e) {}
  },

  updateCoupon: async (userId: string, offerId: string, couponId: string, data: any) => {
    try {
      const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
      if (offer && offer.coupons) {
        const newCoupons = offer.coupons.map((c: any) => c.id === couponId ? { ...c, ...data } : c);
        await supabase.from('offers').update({ coupons: newCoupons }).eq('id', offerId);
      }
    } catch (e) {}
  },

  addCoupon: async (userId: string, offerId: string, data: any) => {
    try {
      const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
      const coupons = offer?.coupons || [];
      const newCoupon = { id: Math.random().toString(36).substr(2, 9), ...data };
      await supabase.from('offers').update({ coupons: [...coupons, newCoupon] }).eq('id', offerId);
    } catch (e) {}
  },

  getProducts: async (userId: string) => {
    const data = await safeQuery(supabase.from('products').select('*').eq('user_id', userId), []);
    return data.map((p: any) => ({ ...p, userId: p.user_id, imageUrl: p.image_url, videoUrl: p.video_url, promoPrice: p.promo_price, storeCategoryId: p.store_category_id }));
  },

  /* Fix: Add createProduct method */
  createProduct: async (product: Product) => {
    try {
      const insertData = {
        user_id: product.userId, store_category_id: product.storeCategoryId, name: product.name, description: product.description, price: product.price,
        promo_price: product.promoPrice, image_url: product.imageUrl, video_url: product.videoUrl, category: product.category, available: product.available,
        variations: product.variations, button_type: product.buttonType, external_link: product.externalLink, stock: product.stock
      };
      const { data: created } = await supabase.from('products').insert(insertData).select().single();
      return { ...created, id: created.id, userId: created.user_id, imageUrl: created.image_url, videoUrl: created.video_url, promoPrice: created.promo_price, storeCategoryId: created.store_category_id };
    } catch (e) { return { ...product, id: 'temp-p-' + Date.now() }; }
  },

  getAllProducts: async (): Promise<any[]> => {
    try {
      const { data: products } = await supabase.from('products').select('*, profiles(business_name, logo_url, phone)');
      return (products || []).map((p: any) => ({ ...p, userId: p.user_id, imageUrl: p.image_url, businessName: p.profiles?.business_name || 'Loja Local', businessLogo: p.profiles?.logo_url, businessPhone: p.profiles?.phone }));
    } catch (e) { return []; }
  },

  getStoreCategories: async (userId: string) => {
    const data = await safeQuery(supabase.from('store_categories').select('*').eq('user_id', userId).order('order', { ascending: true }), []);
    return data.map((c: any) => ({ ...c, userId: c.user_id }));
  },

  /* Fix: Add createStoreCategory method */
  createStoreCategory: async (userId: string, name: string) => {
    try {
      const { data: created } = await supabase.from('store_categories').insert({ user_id: userId, name, order: 0 }).select().single();
      return { ...created, id: created.id, userId: created.user_id };
    } catch (e) { return { id: 'temp-c-' + Date.now(), userId, name, order: 0 }; }
  },

  /* Fix: Add deleteStoreCategory method */
  deleteStoreCategory: async (id: string, userId: string) => {
    try { await supabase.from('store_categories').delete().eq('id', id).eq('user_id', userId); } catch (e) {}
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const data = await safeQuery(supabase.from('blog_posts').select('*'), []);
    return data.map((p: any) => ({ ...p, id: p.id, imageUrl: p.image_url, userId: p.user_id }));
  },

  runExtractor: async (type: string, keyword: string): Promise<ExtractorResult[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return [
      { id: 'ext1', name: `${keyword} A`, phone: '5511999990001', address: 'Rua das Flores, 123', source: type as any, category: keyword },
      { id: 'ext2', name: `${keyword} B`, phone: '5511999990002', address: 'Av. Brasil, 456', source: type as any, category: keyword },
    ];
  },
  
  getQuotes: async () => [],
  getReviews: async () => [],
  getLoyaltyCards: async (): Promise<LoyaltyCard[]> => [
    { id: '1', businessName: 'Café Central', reward: 'Café Grátis', totalStamps: 5, currentStamps: 2, color: 'bg-amber-600' }
  ],
  stampLoyaltyCard: async (id: string): Promise<LoyaltyCard> => ({ id, businessName: 'Sushi Bar', reward: 'Combinado 15 peças', totalStamps: 10, currentStamps: 9, color: 'bg-rose-600' }),

  /* Fix: Add networking profile methods */
  getNetworkingProfiles: async () => {
    const data = await safeQuery(supabase.from('networking_profiles').select('*'), []);
    return data.map((p: any) => ({ ...p, id: p.id, userId: p.user_id }));
  },

  createNetworkingProfile: async (data: any) => {
    try {
      const { data: created } = await supabase.from('networking_profiles').insert({
        user_id: data.userId, name: data.name, business_name: data.businessName, sector: data.sector, avatar: data.avatar, looking_for: data.lookingFor
      }).select().single();
      return { ...created, id: created.id, userId: created.user_id };
    } catch (e) { return { ...data, id: 'temp-n-' + Date.now() }; }
  },

  deleteNetworkingProfile: async (id: string) => {
    try { await supabase.from('networking_profiles').delete().eq('id', id); } catch (e) {}
  }
};
