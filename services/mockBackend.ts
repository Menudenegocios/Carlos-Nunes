
import { User, Profile, Offer, Lead, ExtractorResult, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction, PipelineStage } from '../types';
import { supabase } from './supabaseClient';

export const mockBackend = {
  // Points & Rewards System
  addPoints: async (userId: string, action: string, points: number, category: PointsTransaction['category']): Promise<void> => {
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
  },

  getPointsHistory: async (userId: string): Promise<PointsTransaction[]> => {
    const { data } = await supabase
      .from('points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return (data || []).map(t => ({
      id: t.id,
      userId: t.user_id,
      action: t.action,
      points: t.points,
      createdAt: t.created_at,
      category: t.category
    }));
  },

  upgradePlan: async (userId: string, plan: User['plan']): Promise<User> => {
    const pointsToAdd = plan === 'negocios' ? 300 : 50;
    await supabase.from('profiles').update({ plan }).eq('user_id', userId);
    await mockBackend.addPoints(userId, `Assinatura Plano ${plan.toUpperCase()}`, pointsToAdd, 'assinatura');
    
    const { data: p } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    return {
      id: userId,
      name: p.full_name,
      email: p.email,
      plan: p.plan,
      points: p.points,
      level: p.level,
      referralCode: p.referral_code,
      referralsCount: p.referrals_count
    };
  },

  // Community Feed
  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const { data: posts } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    if (!posts) return [];

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
        comments: (comments || []).map(c => ({
          id: c.id,
          userId: c.user_id,
          userName: c.user_name,
          userAvatar: c.user_avatar,
          content: c.content,
          createdAt: c.created_at
        })),
        createdAt: post.created_at
      };
    }));

    return postsWithComments;
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

    if (error) throw error;
    await mockBackend.addPoints(postData.userId, 'Interação na Comunidade', 20, 'engajamento');

    return { ...data, id: data.id, userId: data.user_id, userName: data.user_name, businessName: data.business_name, userAvatar: data.user_avatar, likedBy: [], comments: [], createdAt: data.created_at };
  },

  likePost: async (postId: string, userId: string): Promise<CommunityPost> => {
    const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
    if (!post) throw new Error('Post not found');

    const likedBy = post.liked_by || [];
    const likedIdx = likedBy.indexOf(userId);
    let newLikes = post.likes;

    if (likedIdx === -1) {
      likedBy.push(userId);
      newLikes += 1;
      await mockBackend.addPoints(userId, 'Curtida na Comunidade', 20, 'engajamento');
    } else {
      likedBy.splice(likedIdx, 1);
      newLikes -= 1;
    }

    const { data: updated } = await supabase.from('community_posts').update({ liked_by: likedBy, likes: newLikes }).eq('id', postId).select().single();
    const { data: comments } = await supabase.from('community_comments').select('*').eq('post_id', postId);

    return { 
      ...updated, 
      id: updated.id, 
      userId: updated.user_id, 
      userName: updated.user_name, 
      businessName: updated.business_name, 
      userAvatar: updated.user_avatar, 
      likedBy: updated.liked_by, 
      comments: (comments || []).map(c => ({ id: c.id, userId: c.user_id, userName: c.user_name, userAvatar: c.user_avatar, content: c.content, createdAt: c.created_at })),
      createdAt: updated.created_at 
    };
  },

  // Finance
  getFinanceEntries: async (userId: string) => {
    const { data } = await supabase.from('financial_entries').select('*').eq('user_id', userId);
    return (data || []).map(e => ({ ...e, userId: e.user_id }));
  },
  addFinanceEntry: async (entry: Omit<FinancialEntry, 'id'>) => {
    const { data } = await supabase.from('financial_entries').insert({
      user_id: entry.userId,
      description: entry.description,
      value: entry.value,
      type: entry.type,
      date: entry.date,
      category: entry.category
    }).select().single();
    return { ...data, userId: data.user_id };
  },
  deleteFinanceEntry: async (id: string) => {
    await supabase.from('financial_entries').delete().eq('id', id);
  },

  // CRM & Schedule
  getLeads: async (userId: string) => {
    const { data } = await supabase.from('leads').select('*').eq('user_id', userId);
    return (data || []).map(l => ({ ...l, userId: l.user_id }));
  },
  updateLeadStage: async (leadId: string, stage: PipelineStage) => {
    await supabase.from('leads').update({ stage }).eq('id', leadId);
  },
  addLeads: async (leads: Lead[]) => {
    const leadsToInsert = leads.map(l => ({
      user_id: l.userId,
      name: l.name,
      phone: l.phone,
      source: l.source,
      stage: l.stage,
      notes: l.notes,
      value: l.value
    }));
    await supabase.from('leads').insert(leadsToInsert);
  },
  deleteLead: async (leadId: string) => {
    await supabase.from('leads').delete().eq('id', leadId);
  },
  updateLead: async (leadId: string, data: Partial<Lead>) => {
    await supabase.from('leads').update(data).eq('id', leadId);
  },
  getSchedule: async (userId: string) => {
    const { data } = await supabase.from('schedule_items').select('*').eq('user_id', userId);
    return (data || []).map(s => ({ ...s, userId: s.user_id }));
  },
  addScheduleItem: async (item: Omit<ScheduleItem, 'id'>) => {
    const { data } = await supabase.from('schedule_items').insert({
      user_id: item.userId,
      title: item.title,
      client: item.client,
      date: item.date,
      time: item.time,
      type: item.type,
      status: item.status
    }).select().single();
    return { ...data, userId: data.user_id };
  },
  updateScheduleItem: async (id: string, data: Partial<ScheduleItem>) => {
    await supabase.from('schedule_items').update(data).eq('id', id);
  },
  deleteScheduleItem: async (id: string) => {
    await supabase.from('schedule_items').delete().eq('id', id);
  },

  // Profile
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (!data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      category: data.category,
      phone: data.phone,
      address: data.address,
      city: data.city,
      neighborhood: data.neighborhood,
      bio: data.bio,
      logoUrl: data.logo_url,
      socialLinks: data.social_links,
      storeConfig: data.store_config,
      bioConfig: data.bio_config
    };
  },
  updateProfile: async (userId: string, data: Partial<Profile>) => {
    const profileData = {
      business_name: data.businessName,
      category: data.category,
      phone: data.phone,
      address: data.address,
      city: data.city,
      neighborhood: data.neighborhood,
      bio: data.bio,
      logo_url: data.logoUrl,
      social_links: data.socialLinks,
      store_config: data.storeConfig,
      bio_config: data.bioConfig
    };
    
    // Check if profile exists
    const { data: existing } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!existing) {
      await mockBackend.addPoints(userId, 'Completar Perfil', 20, 'engajamento');
    }

    const { data: updated } = await supabase.from('profiles').update(profileData).eq('user_id', userId).select().single();
    return updated;
  },
  getAllProfiles: async () => {
    const { data } = await supabase.from('profiles').select('*');
    return (data || []).map(p => ({
      id: p.id,
      userId: p.user_id,
      businessName: p.business_name,
      category: p.category,
      city: p.city,
      bio: p.bio,
      logoUrl: p.logo_url,
      storeConfig: p.store_config
    }));
  },

  // Offers
  getOffers: async (filters?: any) => {
    let query = supabase.from('offers').select('*');
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.city) query = query.ilike('city', `%${filters.city}%`);
    if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

    const { data } = await query;
    return (data || []).map(o => ({
      id: o.id,
      userId: o.user_id,
      title: o.title,
      description: o.description,
      category: o.category,
      city: o.city,
      price: o.price,
      createdAt: o.created_at,
      imageUrl: o.image_url,
      videoUrl: o.video_url,
      logoUrl: o.logo_url,
      socialLinks: o.social_links,
      coupons: o.coupons,
      scheduling: o.scheduling
    }));
  },
  getMyOffers: async (userId: string) => {
    const { data } = await supabase.from('offers').select('*').eq('user_id', userId);
    return (data || []).map(o => ({ ...o, userId: o.user_id, createdAt: o.created_at, imageUrl: o.image_url, videoUrl: o.video_url, logoUrl: o.logo_url, socialLinks: o.social_links }));
  },
  createOffer: async (userId: string, data: any): Promise<Offer> => {
    const { data: newOffer, error } = await supabase.from('offers').insert({
      user_id: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      price: data.price,
      image_url: data.imageUrl,
      video_url: data.videoUrl,
      logo_url: data.logoUrl,
      social_links: data.socialLinks,
      scheduling: data.scheduling,
      created_at: new Date().getTime()
    }).select().single();
    
    if (error) throw error;
    await mockBackend.addPoints(userId, 'Criar Novo Anúncio', 20, 'engajamento');
    return newOffer;
  },
  updateOffer: async (userId: string, id: string, data: any): Promise<Offer> => {
    const { data: updated } = await supabase.from('offers').update({
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      price: data.price,
      image_url: data.imageUrl,
      video_url: data.videoUrl,
      logo_url: data.logoUrl,
      social_links: data.socialLinks,
      scheduling: data.scheduling
    }).eq('id', id).eq('user_id', userId).select().single();
    
    await mockBackend.addPoints(userId, 'Atualizar Anúncio', 20, 'engajamento');
    return updated;
  },
  deleteOffer: async (id: string, userId: string) => {
    await supabase.from('offers').delete().eq('id', id).eq('user_id', userId);
  },

  // Products
  getProducts: async (userId: string) => {
    const { data } = await supabase.from('products').select('*').eq('user_id', userId);
    return (data || []).map(p => ({ ...p, userId: p.user_id, imageUrl: p.image_url, videoUrl: p.video_url, promoPrice: p.promo_price, storeCategoryId: p.store_category_id }));
  },
  getAllProducts: async (): Promise<any[]> => {
    const { data: products } = await supabase.from('products').select('*, profiles(business_name, logo_url, phone)');
    return (products || []).map(p => ({
      ...p,
      userId: p.user_id,
      imageUrl: p.image_url,
      businessName: p.profiles?.business_name || 'Loja Local',
      businessLogo: p.profiles?.logo_url,
      businessPhone: p.profiles?.phone
    }));
  },
  createProduct: async (data: Product): Promise<Product> => {
    const { data: newProd } = await supabase.from('products').insert({
      user_id: data.userId,
      name: data.name,
      description: data.description,
      price: data.price,
      promo_price: data.promoPrice,
      image_url: data.imageUrl,
      category: data.category,
      store_category_id: data.storeCategoryId,
      available: data.available,
      external_link: data.externalLink
    }).select().single();

    await mockBackend.addPoints(data.userId, 'Adicionar Produto ao Catálogo', 20, 'engajamento');
    return newProd;
  },
  deleteProduct: async (id: string, userId: string) => {
    await supabase.from('products').delete().eq('id', id).eq('user_id', userId);
  },

  // Store Categories
  getStoreCategories: async (userId: string) => {
    const { data } = await supabase.from('store_categories').select('*').eq('user_id', userId).order('order', { ascending: true });
    return (data || []).map(c => ({ ...c, userId: c.user_id }));
  },
  createStoreCategory: async (userId: string, name: string): Promise<StoreCategory> => {
    const { count } = await supabase.from('store_categories').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    const { data: newCat } = await supabase.from('store_categories').insert({
      user_id: userId,
      name,
      order: count || 0
    }).select().single();
    
    await mockBackend.addPoints(userId, 'Criar Categoria no Catálogo', 20, 'engajamento');
    return newCat;
  },
  deleteStoreCategory: async (id: string, userId: string) => {
    await supabase.from('store_categories').delete().eq('id', id).eq('user_id', userId);
  },

  // Academy Quiz Completion
  completeAcademyQuiz: async (userId: string, courseTitle: string) => {
    await mockBackend.addPoints(userId, `Quiz da Academy: ${courseTitle}`, 20, 'especial');
    const { data: p } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    return {
      id: userId,
      name: p.full_name,
      email: p.email,
      plan: p.plan,
      points: p.points,
      level: p.level,
      referralCode: p.referral_code,
      referralsCount: p.referrals_count
    };
  },

  // Networking
  getNetworkingProfiles: async () => {
    const { data } = await supabase.from('profiles').select('id, user_id, full_name, business_name, category, logo_url, bio').not('business_name', 'is', null);
    return (data || []).map(p => ({
      id: p.id,
      userId: p.user_id,
      name: p.full_name,
      businessName: p.business_name,
      sector: p.category,
      avatar: p.logo_url,
      lookingFor: p.bio
    }));
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const { data } = await supabase.from('blog_posts').select('*');
    return (data || []).map(p => ({
      ...p,
      id: p.id,
      imageUrl: p.image_url,
      userId: p.user_id
    }));
  },

  // Extras
  runExtractor: async (type: string, keyword: string): Promise<ExtractorResult[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return [
      { id: 'ext1', name: `${keyword} A`, phone: '5511999990001', address: 'Rua das Flores, 123', source: type as any, category: keyword },
      { id: 'ext2', name: `${keyword} B`, phone: '5511999990002', address: 'Av. Brasil, 456', source: type as any, category: keyword },
    ];
  },
  getQuotes: async () => [],
  getReviews: async () => [],

  // Added missing methods for Coupons, Networking, and Loyalty
  redeemCoupon: async (userId: string, couponId: string, points: number): Promise<User> => {
    await mockBackend.addPoints(userId, `Uso de Cupom: ${couponId}`, points, 'engajamento');
    const { data: p } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (!p) throw new Error('Profile not found');
    return {
      id: userId,
      name: p.full_name,
      email: p.email,
      plan: p.plan,
      points: p.points,
      level: p.level,
      referralCode: p.referral_code,
      referralsCount: p.referrals_count
    };
  },
  addCoupon: async (userId: string, offerId: string, coupon: any) => {
    const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
    const coupons = offer?.coupons || [];
    const newCoupon = { ...coupon, id: Math.random().toString(36).substr(2, 9) };
    await supabase.from('offers').update({ coupons: [...coupons, newCoupon] }).eq('id', offerId);
  },
  updateCoupon: async (userId: string, offerId: string, couponId: string, couponData: any) => {
    const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
    const coupons = (offer?.coupons || []).map((c: any) => c.id === couponId ? { ...c, ...couponData } : c);
    await supabase.from('offers').update({ coupons }).eq('id', offerId);
  },
  deleteCoupon: async (userId: string, offerId: string, couponId: string) => {
    const { data: offer } = await supabase.from('offers').select('coupons').eq('id', offerId).single();
    const coupons = (offer?.coupons || []).filter((c: any) => c.id !== couponId);
    await supabase.from('offers').update({ coupons }).eq('id', offerId);
  },
  createNetworkingProfile: async (data: any): Promise<NetworkingProfile> => {
    const { data: updated } = await supabase.from('profiles').update({
      full_name: data.name,
      business_name: data.businessName,
      category: data.sector,
      bio: data.lookingFor,
      logo_url: data.avatar
    }).eq('user_id', data.userId).select().single();
    if (!updated) throw new Error('Profile update failed');
    return {
      id: updated.id,
      userId: updated.user_id,
      name: updated.full_name,
      businessName: updated.business_name,
      sector: updated.category,
      avatar: updated.logo_url,
      lookingFor: updated.bio
    };
  },
  deleteNetworkingProfile: async (id: string) => {
    await supabase.from('profiles').update({ business_name: null }).eq('id', id);
  },
  getLoyaltyCards: async (): Promise<LoyaltyCard[]> => {
    return [
      { id: '1', businessName: 'Café Central', reward: 'Café Grátis', totalStamps: 5, currentStamps: 2, color: 'bg-amber-600' },
      { id: '2', businessName: 'Sushi Bar', reward: 'Combinado 15 peças', totalStamps: 10, currentStamps: 8, color: 'bg-rose-600' }
    ];
  },
  stampLoyaltyCard: async (id: string): Promise<LoyaltyCard> => {
    return { id, businessName: 'Sushi Bar', reward: 'Combinado 15 peças', totalStamps: 10, currentStamps: 9, color: 'bg-rose-600' };
  }
};
