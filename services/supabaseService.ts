import { supabase } from './supabaseClient';
import { 
  Media,
} from '../types';

export const supabaseService = {
  // --- MEDIA ---
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(path);
      
      let publicUrl = urlData.publicUrl;
      
      // Garantir que a URL inclua o segmento /public/ para buckets públicos
      if (publicUrl && !publicUrl.includes('/public/')) {
        publicUrl = publicUrl.replace(/\/object\/images\//, '/object/public/images/');
      }
        
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  getMedia: async (): Promise<Media[]> => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting media:", error);
      return [];
    }
  },

  createMedia: async (mediaData: Omit<Media, 'id' | 'created_at'>): Promise<Media> => {
    try {
      const { data, error } = await supabase
        .from('media')
        .insert({
          ...mediaData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating media:", error);
      throw error;
    }
  },

  updateMedia: async (id: string, mediaData: Partial<Media>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ ...mediaData, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating media:", error);
      throw error;
    }
  },

  deleteMedia: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  },

  // --- LOYALTY ---
  getLoyaltyCards: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('user_id', user_id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting loyalty cards:", error);
      return [];
    }
  },

  stampLoyaltyCard: async (id: string): Promise<any> => {
    try {
      const { data: card, error: fetchError } = await supabase
        .from('loyalty_cards')
        .select('stamps')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newStamps = (card.stamps || 0) + 1;
      const { data, error } = await supabase
        .from('loyalty_cards')
        .update({ stamps: newStamps, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error stamping loyalty card:", error);
      throw error;
    }
  },

  // --- PLANS ---
  upgradePlan: async (user_id: string, plan: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('id', user_id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error upgrading plan:", error);
      throw error;
    }
  },

  // --- POINTS ---
  getPointsHistory: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting points history:", error);
      return [];
    }
  },

  // --- QUOTES ---
  getQuotes: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting quotes:", error);
      return [];
    }
  },

  // --- NETWORKING ---
  getNetworkingProfiles: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('networking_profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting networking profiles:", error);
      return [];
    }
  },

  createNetworkingProfile: async (profile: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('networking_profiles')
        .insert({ ...profile, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating networking profile:", error);
      throw error;
    }
  },

  deleteNetworkingProfile: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('networking_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting networking profile:", error);
      throw error;
    }
  },

  // --- EVENTS ---
  getEvents: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  },

  createEvent: async (event: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  updateEvent: async (id: string, event: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ ...event, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // --- MARKETPLACE ---
  getAllProducts: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  },

  getOffers: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting offers:", error);
      return [];
    }
  },

  createProduct: async (product: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({ ...product, created_at: new Date().toISOString() });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, product: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  createOffer: async (offer: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({ ...offer, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  },

  addOffer: async (offer: any) => supabaseService.createOffer(offer),

  updateOffer: async (id: string, offer: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('offers')
        .update(offer)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating offer:", error);
      throw error;
    }
  },

  deleteOffer: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting offer:", error);
      throw error;
    }
  },

  getMyOffers: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('user_id', user_id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting my offers:", error);
      return [];
    }
  },

  getProducts: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user_id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  },

  // --- COUPONS ---
  getCoupons: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting coupons:", error);
      return [];
    }
  },

  createCoupon: async (coupon: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert({ ...coupon, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw error;
    }
  },

  updateCoupon: async (id: string, user_id: string, coupon: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update(coupon)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  },

  deleteCoupon: async (id: string, user_id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting coupon:", error);
      throw error;
    }
  },

  redeemCoupon: async (user_id: string, couponId: string, points: number): Promise<void> => {
    try {
      // 1. Register redemption
      const { error: redemptionError } = await supabase
        .from('coupon_redemptions')
        .insert({
          coupon_id: couponId,
          user_id: user_id,
          redeemed_at: new Date().toISOString()
        });
      
      if (redemptionError) throw redemptionError;

      // 2. Update user points
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user_id)
        .single();
      
      if (profileError) throw profileError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: (profile.points || 0) + points })
        .eq('id', user_id);
      
      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      throw error;
    }
  },

  // --- BLOG POSTS ---
  getBlogPosts: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error getting blog posts:", error?.message || error);
      return [];
    }
  },

  addBlogPost: async (post: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding blog post:", error);
      throw error;
    }
  },

  updateBlogPost: async (id: string, post: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  },

  // --- PROFILE ---
  getAllProfiles: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting all profiles:", error);
      return [];
    }
  },

  getAllProfilesWithSubscriptions: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting all profiles with subscriptions:", error);
      return [];
    }
  },

  getPublishedProfiles: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_published', true);
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error getting published profiles:", error?.message || error);
      return [];
    }
  },

  getMarketplaceProfiles: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('is_published.eq.true,role.eq.admin');
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error getting marketplace profiles:", error?.message || error);
      return [];
    }
  },

  getProfile: async (identifier: string): Promise<any | null> => {
    try {
      // Try by ID first
      const { data: profileById, error: errorById } = await supabase
        .from('profiles')
        .select(`
          *,
          display_id,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `)
        .eq('id', identifier)
        .maybeSingle();
      
      if (!errorById && profileById) return profileById;
      
      // Try by slug
      const { data: profileBySlug, error: errorBySlug } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `)
        .eq('slug', identifier)
        .maybeSingle();
      
      if (!errorBySlug && profileBySlug) return profileBySlug;

      // Try by user_id
      const { data: profileByUserId, error: errorByUserId } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `)
        .eq('user_id', identifier)
        .maybeSingle();
      
      if (!errorByUserId && profileByUserId) return profileByUserId;
      
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  },

  getProfileByUserId: async (userId: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            plan,
            current_period_end
          )
        `)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting profile by user_id:", error);
      return null;
    }
  },

  getRanking: async (limit: number = 10): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, business_name, name, logo_url, points, level, city, display_id')
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting ranking:", error);
      return [];
    }
  },

  getUserRankingPosition: async (points: number): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('points', points);
      
      if (error) throw error;
      return (count || 0) + 1;
    } catch (error) {
      console.error("Error getting user ranking position:", error);
      return 0;
    }
  },

  getReferrals: async (referrerId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, plan, points, created_at, display_id')
        .eq('referrer_id', referrerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting referrals:", error);
      return [];
    }
  },

  updateProfile: async (user_id: string, profile: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('user_id', user_id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  adminUpdateUser: async (data: { 
    userId: string, 
    business_name: string, 
    email: string, 
    password?: string, 
    plan: string, 
    level: string, 
    points: number, 
    role: string,
    menu_cash: number,
    has_founder_badge?: boolean,
    display_id?: number,
    has_local_plus?: boolean,
    cpf_cnpj?: string,
    phone?: string
  }): Promise<void> => {
    try {
      // Revertido para comunicação direta como solicitado pelo usuário (sem rota de API).
      // Nota: Alteração de senha e e-mail no Auth.users não funcionará sem um backend seguro (Service Role).
      // Mas a atualização de metadados no perfil (plano, nível, pontos) funcionará via RLS se o usuário for admin.
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: data.business_name,
          email: data.email,
          plan: data.plan,
          level: data.level,
          points: data.points,
          role: data.role,
          menu_cash: data.menu_cash,
          has_founder_badge: data.has_founder_badge,
          display_id: data.display_id,
          has_local_plus: data.has_local_plus,
          cpf_cnpj: data.cpf_cnpj,
          phone: data.phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', data.userId);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error in adminUpdateUser (Direct):", error);
      throw error;
    }
  },

  saveProfile: async (user_id: string, profile: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { ...profile, user_id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      
      if (error) throw error;
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  },

  // --- PROJECTS ---
  getProjects: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting projects:", error);
      return [];
    }
  },

  addProject: async (project: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  updateProject: async (id: string, project: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ ...project, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  // --- NOTES ---
  getNotes: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting notes:", error);
      return [];
    }
  },

  addNote: async (note: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({ ...note, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  updateNote: async (id: string, note: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ...note, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  // --- LEADS ---
  getLeads: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting leads:", error);
      return [];
    }
  },

  addLead: async (lead: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({ ...lead, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  },

  addLeads: async (leads: any[]): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert(leads.map(lead => ({ ...lead, created_at: new Date().toISOString() })));
      
      if (error) throw error;
    } catch (error) {
      console.error("Error adding leads:", error);
      throw error;
    }
  },

  updateLead: async (id: string, lead: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ ...lead, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  },

  deleteLead: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  },

  // --- VITRINE ---
  getStoreCategories: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .eq('user_id', user_id)
        .order('order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting store categories:", error);
      return [];
    }
  },

  addStoreCategory: async (category: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('store_categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding store category:", error);
      throw error;
    }
  },

  deleteStoreCategory: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('store_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting store category:", error);
      throw error;
    }
  },

  getVitrineComments: async (vitrine_user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('vitrine_comments')
        .select('*')
        .eq('vitrine_user_id', vitrine_user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting vitrine comments:", error);
      return [];
    }
  },

  addVitrineComment: async (comment: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('vitrine_comments')
        .insert({ ...comment, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding vitrine comment:", error);
      throw error;
    }
  },

  // --- CLIENTS ---
  getClients: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user_id)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting clients:", error);
      return [];
    }
  },

  addClient: async (client: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...client, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  },

  updateClient: async (id: string, client: Partial<any>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  },

  // --- FOLLOW UPS ---
  getFollowUps: async (entity_id: string, entity_type?: 'lead' | 'client' | 'task'): Promise<any[]> => {
    try {
      let query = supabase
        .from('follow_ups')
        .select('*')
        .eq('entity_id', entity_id);

      if (entity_type) {
        query = query.eq('entity_type', entity_type);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting follow ups:", error);
      return [];
    }
  },

  addFollowUp: async (followUp: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .insert({ ...followUp, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding follow up:", error);
      throw error;
    }
  },

  updateFollowUp: async (id: string, updates: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('follow_ups')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating follow up:", error);
      throw error;
    }
  },

  deleteFollowUp: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('follow_ups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting follow up:", error);
      throw error;
    }
  },

  // --- FINANCIAL ENTRIES ---
  getFinancialEntries: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('financial_entries')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting financial entries:", error);
      return [];
    }
  },

  addFinancialEntry: async (entry: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('financial_entries')
        .insert({ ...entry, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding financial entry:", error);
      throw error;
    }
  },

  deleteFinancialEntry: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('financial_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting financial entry:", error);
      throw error;
    }
  },

  // --- SMART GOALS ---
  getSmartGoals: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('smart_goals')
        .select('*')
        .eq('user_id', user_id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting SMART goals:", error);
      return [];
    }
  },

  saveSmartGoal: async (user_id: string, data: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('smart_goals')
        .upsert(
          { ...data, user_id: user_id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      
      if (error) throw error;
    } catch (error) {
      console.error("Error saving SMART goal:", error);
      throw error;
    }
  },

  // --- SWOT ANALYSIS ---
  getSwotAnalysis: async (user_id: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('swot_analysis')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error("Error getting SWOT analysis:", error);
      return null;
    }
  },

  saveSwotAnalysis: async (user_id: string, data: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('swot_analysis')
        .upsert(
          { ...data, user_id: user_id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      
      if (error) throw error;
    } catch (error) {
      console.error("Error saving SWOT analysis:", error);
      throw error;
    }
  },

  // --- BUSINESS CANVA ---
  getBusinessCanva: async (user_id: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('business_canva')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error("Error getting Business Canva:", error);
      return null;
    }
  },

  saveBusinessCanva: async (user_id: string, data: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('business_canva')
        .upsert(
          { ...data, user_id: user_id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      
      if (error) throw error;
    } catch (error) {
      console.error("Error saving Business Canva:", error);
      throw error;
    }
  },

  // --- SCHEDULE ---
  getSchedule: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('schedule_items')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting schedule:", error);
      return [];
    }
  },

  addScheduleItem: async (item: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('schedule_items')
        .insert({ ...item, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding schedule item:", error);
      throw error;
    }
  },

  deleteScheduleItem: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('schedule_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting schedule item:", error);
      throw error;
    }
  },

  // --- B2B MATCH ---
  getB2BOffers: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('b2b_offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting B2B offers:", error);
      return [];
    }
  },

  createB2BOffer: async (offer: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('b2b_offers')
        .insert({ ...offer, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating B2B offer:", error);
      throw error;
    }
  },

  getB2BTransactions: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('b2b_transactions')
        .select(`
          *,
          buyer:profiles!buyer_id(phone),
          seller:profiles!seller_id(phone)
        `)
        .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting B2B transactions:", error);
      return [];
    }
  },

  createB2BTransaction: async (transaction: any): Promise<any> => {
    try {
      // 1. Create the transaction
      const { data, error } = await supabase
        .from('b2b_transactions')
        .insert({ 
          ...transaction, 
          status: 'pending', 
          created_at: new Date().toISOString(),
          buyer_confirmed: true // Buyer confirms automatically when creating
        })
        .select()
        .single();
      
      if (error) throw error;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating B2B transaction:", error);
      throw error;
    }
  },

  confirmB2BTransaction: async (id: string, userId: string, isBuyer: boolean): Promise<void> => {
    try {
      const { error } = await supabase.rpc('confirm_and_transfer_b2b_transaction', {
        p_tx_id: id,
        p_user_id: userId,
        p_is_buyer: isBuyer
      });

      if (error) throw error;
      console.log("RPC Transaction confirmation/transfer completed successfully.");
    } catch (error) {
      console.error("Error confirming transaction via RPC:", error);
      throw error;
    }
  },

  updateB2BTransactionStatus: async (id: string, status: 'confirmed' | 'rejected'): Promise<void> => {
    try {
      const { data: tx, error: fetchError } = await supabase
        .from('b2b_transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('b2b_transactions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;

      if (error) throw error;
    } catch (error) {
      console.error("Error updating B2B transaction status:", error);
      throw error;
    }
  },


  // --- 1x1 MEETINGS ---
  getMeetings1x1: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('meetings_1x1')
        .select(`
          *,
          creator:profiles!creator_id(name, business_name),
          guest:profiles!guest_id(name, business_name)
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting 1x1 meetings:", error);
      return [];
    }
  },

  createMeeting1x1: async (meeting: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('meetings_1x1')
        .insert({ 
          ...meeting, 
          status: 'scheduled', 
          points_awarded: false,
          created_at: new Date().toISOString() 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating 1x1 meeting:", error);
      throw error;
    }
  },

  completeMeeting1x1: async (meeting_id: string): Promise<void> => {
    try {
      // 1. Get meeting data to award points
      const { data: meeting, error: fetchError } = await supabase
        .from('meetings_1x1')
        .select('*')
        .eq('id', meeting_id)
        .single();
      
      if (fetchError) throw fetchError;
      if (meeting.status === 'completed' || meeting.points_awarded) return;

      // 2. Update status
      const { error: updateError } = await supabase
        .from('meetings_1x1')
        .update({ status: 'completed', points_awarded: true })
        .eq('id', meeting_id);
      
      if (updateError) throw updateError;

      // 3. Award points to both participants (10 points each)
      const participants = [meeting.creator_id, meeting.guest_id];
      for (const pId of participants) {
        // Increment profile points
        const { data: profile } = await supabase.from('profiles').select('points').eq('user_id', pId).single();
        await supabase.from('profiles')
          .update({ points: (profile?.points || 0) + 10 })
          .eq('user_id', pId);
        
        // Add to points history
        await supabase.from('points_history').insert({
          user_id: pId,
          action: 'Reunião 1x1 Concluída',
          points: 10,
          category: 'engajamento',
          date: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error completing 1x1 meeting:", error);
      throw error;
    }
  },

  getMeetingsRanking: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, business_name, logo_url, points')
        .order('points', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting meeting ranking:", error);
      return [];
    }
  },

  // --- COMMUNITY ---
  getCommunityPosts: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:profiles!user_id(logo_url)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting community posts:", error);
      return [];
    }
  },

  createCommunityPost: async (post: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...post,
          likes: post.likes || 0,
          liked_by: post.liked_by || [],
          comments: post.comments || [],
          type: post.type || 'pitch',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating community post:", error);
      throw error;
    }
  },

  updateCommunityPost: async (id: string, content: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ content })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating community post:", error);
      throw error;
    }
  },

  deleteCommunityPost: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting community post:", error);
      throw error;
    }
  },

  addCommentToPost: async (postId: string, comment: any): Promise<void> => {
    try {
      const newComment = { ...comment, id: Math.random().toString(36).substring(7), created_at: new Date().toISOString() };
      const { error } = await supabase.rpc('add_post_comment', {
        post_id: postId,
        comment_data: newComment
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  getOpportunities: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('community_opportunities')
        .select(`
          *,
          author:profiles!user_id(name, business_name, logo_url, phone)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting opportunities:", error);
      return [];
    }
  },

  createOpportunity: async (opportunity: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('community_opportunities')
        .insert({
          ...opportunity,
          interested_user_ids: [],
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating opportunity:", error);
      throw error;
    }
  },

  updateOpportunity: async (id: string, updates: { title?: string, description?: string }): Promise<void> => {
    try {
      const { error } = await supabase
        .from('community_opportunities')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating opportunity:", error);
      throw error;
    }
  },

  deleteOpportunity: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('community_opportunities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      throw error;
    }
  },

  expressInterestInOpportunity: async (opportunityId: string, user_id: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('express_interest', {
        opp_id: opportunityId,
        user_id_val: user_id
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error expressing interest:", error);
      throw error;
    }
  },

  likePost: async (postId: string, user_id: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('like_post', {
        post_id: postId,
        user_id_val: user_id
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  // --- TASKS ---
  getTasks: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user_id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  },

  addTask: async (task: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },

  updateTask: async (id: string, task: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ ...task, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // --- QUICK MESSAGES ---
  getQuickMessages: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('quick_messages')
        .select('*')
        .eq('user_id', user_id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting quick messages:", error);
      return [];
    }
  },

  addQuickMessage: async (message: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('quick_messages')
        .insert({ ...message, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding quick message:", error);
      throw error;
    }
  },

  updateQuickMessage: async (id: string, message: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('quick_messages')
        .update({ ...message, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating quick message:", error);
      throw error;
    }
  },

  deleteQuickMessage: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('quick_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting quick message:", error);
      throw error;
    }
  },

  // --- PARTNERS ---
  getPartners: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting partners:", error);
      return [];
    }
  },

  createPartner: async (partner: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert({ ...partner, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating partner:", error);
      throw error;
    }
  },

  updatePartner: async (id: string, partner: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ ...partner, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating partner:", error);
      throw error;
    }
  },

  deletePartner: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting partner:", error);
      throw error;
    }
  },

  adminDeleteUser: async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error admin delete user (Direct):", error);
      throw error;
    }
  },

  // --- SOCIAL MESSAGING & NOTIFICATIONS ---
  searchProfiles: async (query: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, business_name, logo_url')
        .or(`name.ilike.%${query}%,business_name.ilike.%${query}%`)
        .limit(5);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching profiles:", error);
      return [];
    }
  },

  getDirectMessages: async (user1: string, user2: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  },

  getConversations: async (user_id: string): Promise<any[]> => {
    try {
      // Get all messages where user is sender or receiver
      const { data, error } = await supabase
        .from('direct_messages')
        .select('sender_id, receiver_id, content, created_at, is_read')
        .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Group by other user and pick latest message
      const conversationsMap: Record<string, any> = {};
      data?.forEach((msg: any) => {
        const otherId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
        if (!conversationsMap[otherId]) {
          conversationsMap[otherId] = msg;
        }
      });

      const results = await Promise.all(Object.keys(conversationsMap).map(async (id) => {
        const profile = await supabaseService.getProfile(id);
        return {
          other_id: id,
          other_name: profile?.name || 'Usuário',
          other_avatar: profile?.logo_url,
          last_message: conversationsMap[id].content,
          last_date: conversationsMap[id].created_at,
          unread_count: 0 // Simplificado
        };
      }));

      return results;
    } catch (error) {
      console.error("Error getting conversations:", error);
      return [];
    }
  },

  sendDirectMessage: async (msg: { sender_id: string, receiver_id: string, content: string }): Promise<void> => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({ ...msg, created_at: new Date().toISOString() });
      if (error) throw error;

      // Create notification for receiver
      const sender = await supabaseService.getProfile(msg.sender_id);
      await supabaseService.createNotification({
        user_id: msg.receiver_id,
        type: 'message',
        from_user_id: msg.sender_id,
        from_user_name: sender?.name || 'Alguém',
        from_user_avatar: sender?.logo_url,
        content: `enviou uma nova mensagem: "${msg.content.substring(0, 30)}..."`,
        link: '/messages'
      });

    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  getNotifications: async (user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  },

  createNotification: async (notif: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({ ...notif, created_at: new Date().toISOString(), is_read: false });
      if (error) throw error;
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  markAllNotificationsAsRead: async (user_id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user_id);
      if (error) throw error;
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  },

  // --- MEMBER REVIEWS ---
  getMemberReviews: async (target_user_id: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('member_reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(name, business_name, logo_url)
        `)
        .eq('target_user_id', target_user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting member reviews:", error);
      return [];
    }
  },

  addMemberReview: async (review: any): Promise<void> => {
    try {
      const { error } = await supabase
        .from('member_reviews')
        .insert({
          ...review,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error adding member review:", error);
      throw error;
    }
  },

  getAverageRating: async (target_user_id: string): Promise<{ average: number, count: number }> => {
    try {
      const { data, error } = await supabase
        .from('member_reviews')
        .select('rating')
        .eq('target_user_id', target_user_id);
      
      if (error) throw error;
      if (!data || data.length === 0) return { average: 0, count: 0 };
      
      const sum = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      return { average: sum / data.length, count: data.length };
    } catch (error) {
      console.error("Error getting average rating:", error);
      return { average: 0, count: 0 };
    }
  },

  deleteConversation: async (user_id: string, other_id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .or(`and(sender_id.eq.${user_id},receiver_id.eq.${other_id}),and(sender_id.eq.${other_id},receiver_id.eq.${user_id})`);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  },

  uploadChatImage: async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat_attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading chat image:", error);
      throw error;
  },

  subscribeToNotifications: (user_id: string, callback: (payload: any) => void) => {
    return supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user_id}`
        },
        callback
      )
      .subscribe();
  },

  subscribeToMessages: (user_id: string, callback: (payload: any) => void) => {
    return supabase
      .channel('public:direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `receiver_id=eq.${user_id}`
        },
        callback
      )
      .subscribe();
  },
};



