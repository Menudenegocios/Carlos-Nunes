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
        .select('*');
      
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
        .select('*')
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
        .select('user_id, business_name, name, logo_url, points, level, city')
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting ranking:", error);
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
    role: string 
  }): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.error("Error in adminUpdateUser:", error);
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
        .upsert({ ...data, user_id: user_id, updated_at: new Date().toISOString() });
      
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
        .upsert({ ...data, user_id: user_id, updated_at: new Date().toISOString() });
      
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
        .upsert({ ...data, user_id: user_id, updated_at: new Date().toISOString() });
      
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
        .select('*')
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
      const { data, error } = await supabase
        .from('b2b_transactions')
        .insert({ ...transaction, status: 'pending', created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating B2B transaction:", error);
      throw error;
    }
  },

  updateB2BTransactionStatus: async (id: string, status: 'confirmed' | 'rejected'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('b2b_transactions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating B2B transaction status:", error);
      throw error;
    }
  },


  // --- COMMUNITY ---
  getCommunityPosts: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
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
          likes: 0,
          liked_by: [],
          comments: [],
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

  likePost: async (postId: string, user_id: string): Promise<void> => {
    try {
      const { data: post, error: fetchError } = await supabase
        .from('community_posts')
        .select('liked_by, likes')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const likedBy = post.liked_by || [];
      if (!likedBy.includes(user_id)) {
        const { error: updateError } = await supabase
          .from('community_posts')
          .update({
            likes: (post.likes || 0) + 1,
            liked_by: [...likedBy, user_id]
          })
          .eq('id', postId);
        
        if (updateError) throw updateError;
      }
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

};
