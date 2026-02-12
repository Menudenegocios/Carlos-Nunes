
import { User, Profile, Offer, OfferCategory, Lead, ExtractorResult, Coupon, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment } from '../types';

const STORAGE_KEYS = {
  USERS: 'menu_users',
  PROFILES: 'menu_profiles',
  OFFERS: 'menu_offers',
  LEADS: 'menu_leads',
  BLOG: 'menu_blog',
  NETWORKING: 'menu_networking',
  LOYALTY: 'menu_loyalty',
  QUOTES: 'menu_quotes',
  SCHEDULE: 'menu_schedule',
  REVIEWS: 'menu_reviews',
  PRODUCTS: 'menu_products',
  STORE_CATEGORIES: 'menu_store_categories',
  FINANCE: 'menu_finance',
  COMMUNITY: 'menu_community'
};

const getStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockBackend = {
  // Auth
  register: async (name: string, email: string, password: string, referredByCode?: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === email)) throw new Error('E-mail já cadastrado');

    const newUser: User & { password: string } = {
      id: Date.now(),
      name,
      email,
      password,
      plan: 'profissionais',
      points: 10,
      level: 'iniciante',
      referralCode: 'REF' + Math.floor(Math.random() * 10000),
      referralsCount: 0
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciais inválidas');
    const { password: _, ...userWithoutPass } = user;
    return { user: userWithoutPass, token: `fake-jwt-${user.id}` };
  },

  upgradePlan: async (userId: number, plan: any): Promise<User> => {
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index].plan = plan;
    setStorage(STORAGE_KEYS.USERS, users);
    const { password: _, ...userWithoutPass } = users[index];
    return userWithoutPass;
  },

  // Community Feed
  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const posts = getStorage<CommunityPost>(STORAGE_KEYS.COMMUNITY);
    if (posts.length === 0) {
      const seed: CommunityPost[] = [
        {
          id: 'post1',
          userId: 999,
          userName: 'Admin',
          businessName: 'Menu ADS Oficial',
          userAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Menu',
          content: 'Bem-vindos à nossa nova Comunidade! Aqui você pode trocar experiências, encontrar parceiros e crescer junto com outros empreendedores locais. 🚀',
          likes: 5,
          likedBy: [],
          comments: [],
          createdAt: Date.now() - 3600000
        }
      ];
      setStorage(STORAGE_KEYS.COMMUNITY, seed);
      return seed;
    }
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  },

  createCommunityPost: async (postData: Omit<CommunityPost, 'id' | 'likes' | 'likedBy' | 'comments' | 'createdAt'>): Promise<CommunityPost> => {
    const posts = getStorage<CommunityPost>(STORAGE_KEYS.COMMUNITY);
    const newPost: CommunityPost = {
      ...postData,
      id: Math.random().toString(36).substr(2, 9),
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now()
    };
    posts.push(newPost);
    setStorage(STORAGE_KEYS.COMMUNITY, posts);
    return newPost;
  },

  likePost: async (postId: string, userId: number): Promise<CommunityPost> => {
    const posts = getStorage<CommunityPost>(STORAGE_KEYS.COMMUNITY);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      const post = posts[idx];
      const likedIdx = post.likedBy.indexOf(userId);
      if (likedIdx === -1) {
        post.likedBy.push(userId);
        post.likes += 1;
      } else {
        post.likedBy.splice(likedIdx, 1);
        post.likes -= 1;
      }
      posts[idx] = post;
      setStorage(STORAGE_KEYS.COMMUNITY, posts);
      return post;
    }
    throw new Error('Post not found');
  },

  addCommunityComment: async (postId: string, commentData: Omit<CommunityComment, 'id' | 'createdAt'>): Promise<CommunityPost> => {
    const posts = getStorage<CommunityPost>(STORAGE_KEYS.COMMUNITY);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      const newComment: CommunityComment = {
        ...commentData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      posts[idx].comments.push(newComment);
      setStorage(STORAGE_KEYS.COMMUNITY, posts);
      return posts[idx];
    }
    throw new Error('Post not found');
  },

  // Finance
  getFinanceEntries: async (userId: number) => getStorage<FinancialEntry>(STORAGE_KEYS.FINANCE).filter(f => f.userId === userId),
  addFinanceEntry: async (entry: Omit<FinancialEntry, 'id'>) => {
    const entries = getStorage<FinancialEntry>(STORAGE_KEYS.FINANCE);
    const newEntry = { ...entry, id: Math.random().toString(36).substr(2, 9) };
    entries.push(newEntry);
    setStorage(STORAGE_KEYS.FINANCE, entries);
    return newEntry;
  },
  deleteFinanceEntry: async (id: string) => {
    const entries = getStorage<FinancialEntry>(STORAGE_KEYS.FINANCE).filter(e => e.id !== id);
    setStorage(STORAGE_KEYS.FINANCE, entries);
  },

  // CRM & Schedule
  getLeads: async (userId: number) => getStorage<Lead>(STORAGE_KEYS.LEADS),
  updateLeadStage: async (leadId: string, stage: any) => {
    const leads = getStorage<Lead>(STORAGE_KEYS.LEADS);
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx !== -1) {
      leads[idx].stage = stage;
      setStorage(STORAGE_KEYS.LEADS, leads);
    }
  },
  addLeads: async (newLeads: Lead[]) => {
    const leads = getStorage<Lead>(STORAGE_KEYS.LEADS);
    setStorage(STORAGE_KEYS.LEADS, [...leads, ...newLeads]);
  },
  deleteLead: async (leadId: string) => {
    const leads = getStorage<Lead>(STORAGE_KEYS.LEADS).filter(l => l.id !== leadId);
    setStorage(STORAGE_KEYS.LEADS, leads);
  },
  updateLead: async (leadId: string, data: any) => {
    const leads = getStorage<Lead>(STORAGE_KEYS.LEADS);
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx !== -1) {
      leads[idx] = { ...leads[idx], ...data };
      setStorage(STORAGE_KEYS.LEADS, leads);
    }
  },
  getSchedule: async (userId: number) => getStorage<ScheduleItem>(STORAGE_KEYS.SCHEDULE).filter(s => s.userId === userId),
  addScheduleItem: async (item: Omit<ScheduleItem, 'id'>) => {
    const items = getStorage<ScheduleItem>(STORAGE_KEYS.SCHEDULE);
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    items.push(newItem);
    setStorage(STORAGE_KEYS.SCHEDULE, items);
    return newItem;
  },
  updateScheduleItem: async (id: string, data: any) => {
    const items = getStorage<ScheduleItem>(STORAGE_KEYS.SCHEDULE);
    const idx = items.findIndex(s => s.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...data };
      setStorage(STORAGE_KEYS.SCHEDULE, items);
    }
  },
  deleteScheduleItem: async (id: string) => {
    const items = getStorage<ScheduleItem>(STORAGE_KEYS.SCHEDULE).filter(s => s.id !== id);
    setStorage(STORAGE_KEYS.SCHEDULE, items);
  },

  // Profile
  getProfile: async (userId: number) => getStorage<Profile>(STORAGE_KEYS.PROFILES).find(p => p.userId === userId),
  updateProfile: async (userId: number, data: Partial<Profile>) => {
    const profiles = getStorage<Profile>(STORAGE_KEYS.PROFILES);
    const index = profiles.findIndex(p => p.userId === userId);
    if (index === -1) {
      const newProfile: Profile = { id: Date.now(), userId, ...data };
      profiles.push(newProfile);
      setStorage(STORAGE_KEYS.PROFILES, profiles);
      return newProfile;
    }
    profiles[index] = { ...profiles[index], ...data };
    setStorage(STORAGE_KEYS.PROFILES, profiles);
    return profiles[index];
  },
  getAllProfiles: async () => getStorage<Profile>(STORAGE_KEYS.PROFILES),

  // Offers
  getOffers: async (filters?: any) => {
    let offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        offers = offers.filter(o => o.title.toLowerCase().includes(search) || o.description.toLowerCase().includes(search));
      }
      if (filters.city) {
        offers = offers.filter(o => o.city.toLowerCase().includes(filters.city.toLowerCase()));
      }
      if (filters.category) {
        offers = offers.filter(o => o.category === filters.category);
      }
    }
    return offers;
  },
  getMyOffers: async (userId: number) => getStorage<Offer>(STORAGE_KEYS.OFFERS).filter(o => o.userId === userId),
  createOffer: async (userId: number, data: any): Promise<Offer> => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const newOffer: Offer = { ...data, id: Date.now(), userId, createdAt: Date.now() };
    offers.push(newOffer);
    setStorage(STORAGE_KEYS.OFFERS, offers);
    return newOffer;
  },
  updateOffer: async (userId: number, id: number, data: any): Promise<Offer> => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const idx = offers.findIndex(o => o.id === id && o.userId === userId);
    if (idx === -1) throw new Error('Offer not found');
    offers[idx] = { ...offers[idx], ...data };
    setStorage(STORAGE_KEYS.OFFERS, offers);
    return offers[idx];
  },
  deleteOffer: async (id: number, userId: number) => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS).filter(o => !(o.id === id && o.userId === userId));
    setStorage(STORAGE_KEYS.OFFERS, offers);
  },

  // Products
  getProducts: async (userId: number) => getStorage<Product>(STORAGE_KEYS.PRODUCTS).filter(p => p.userId === userId),
  getAllProducts: async (): Promise<any[]> => {
    const products = getStorage<Product>(STORAGE_KEYS.PRODUCTS);
    const profiles = getStorage<Profile>(STORAGE_KEYS.PROFILES);
    return products.map(p => {
      const prof = profiles.find(pr => pr.userId === p.userId);
      return {
        ...p,
        businessName: prof?.businessName,
        businessLogo: prof?.logoUrl,
        businessPhone: prof?.phone || prof?.socialLinks?.whatsapp
      };
    });
  },
  createProduct: async (data: Product): Promise<Product> => {
    const products = getStorage<Product>(STORAGE_KEYS.PRODUCTS);
    const newProd = { ...data, id: Math.random().toString(36).substr(2, 9) };
    products.push(newProd);
    setStorage(STORAGE_KEYS.PRODUCTS, products);
    return newProd;
  },
  deleteProduct: async (id: string, userId: number) => {
    const products = getStorage<Product>(STORAGE_KEYS.PRODUCTS).filter(p => !(p.id === id && p.userId === userId));
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  // Store Categories
  getStoreCategories: async (userId: number) => getStorage<StoreCategory>(STORAGE_KEYS.STORE_CATEGORIES).filter(c => c.userId === userId),
  createStoreCategory: async (userId: number, name: string): Promise<StoreCategory> => {
    const cats = getStorage<StoreCategory>(STORAGE_KEYS.STORE_CATEGORIES);
    const newCat = { id: Math.random().toString(36).substr(2, 9), userId, name, order: cats.length };
    cats.push(newCat);
    setStorage(STORAGE_KEYS.STORE_CATEGORIES, cats);
    return newCat;
  },
  deleteStoreCategory: async (id: string, userId: number) => {
    const cats = getStorage<StoreCategory>(STORAGE_KEYS.STORE_CATEGORIES).filter(c => !(c.id === id && c.userId === userId));
    setStorage(STORAGE_KEYS.STORE_CATEGORIES, cats);
  },

  // Coupons
  addCoupon: async (userId: number, offerId: number, data: any) => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const idx = offers.findIndex(o => o.id === offerId && o.userId === userId);
    if (idx !== -1) {
      const newCoupon = { ...data, id: Math.random().toString(36).substr(2, 9) };
      if (!offers[idx].coupons) offers[idx].coupons = [];
      offers[idx].coupons!.push(newCoupon);
      setStorage(STORAGE_KEYS.OFFERS, offers);
    }
  },
  updateCoupon: async (userId: number, offerId: number, couponId: string, data: any) => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const oIdx = offers.findIndex(o => o.id === offerId && o.userId === userId);
    if (oIdx !== -1 && offers[oIdx].coupons) {
      const cIdx = offers[oIdx].coupons!.findIndex(c => c.id === couponId);
      if (cIdx !== -1) {
        offers[oIdx].coupons![cIdx] = { ...offers[oIdx].coupons![cIdx], ...data };
        setStorage(STORAGE_KEYS.OFFERS, offers);
      }
    }
  },
  deleteCoupon: async (userId: number, offerId: number, couponId: string) => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const oIdx = offers.findIndex(o => o.id === offerId && o.userId === userId);
    if (oIdx !== -1 && offers[oIdx].coupons) {
      offers[oIdx].coupons = offers[oIdx].coupons!.filter(c => c.id !== couponId);
      setStorage(STORAGE_KEYS.OFFERS, offers);
    }
  },
  redeemCoupon: async (userId: number, couponId: string, points: number) => {
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].points += points;
      setStorage(STORAGE_KEYS.USERS, users);
      const { password: _, ...user } = users[idx];
      return user;
    }
    throw new Error('User not found');
  },

  // Networking
  getNetworkingProfiles: async () => getStorage<NetworkingProfile>(STORAGE_KEYS.NETWORKING),
  createNetworkingProfile: async (data: any): Promise<NetworkingProfile> => {
    const profiles = getStorage<NetworkingProfile>(STORAGE_KEYS.NETWORKING);
    const newProfile = { ...data, id: Date.now() };
    profiles.push(newProfile);
    setStorage(STORAGE_KEYS.NETWORKING, profiles);
    return newProfile;
  },
  deleteNetworkingProfile: async (id: number) => {
    const profiles = getStorage<NetworkingProfile>(STORAGE_KEYS.NETWORKING).filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.NETWORKING, profiles);
  },

  // Loyalty
  getLoyaltyCards: async () => getStorage<LoyaltyCard>(STORAGE_KEYS.LOYALTY),
  stampLoyaltyCard: async (id: string): Promise<LoyaltyCard> => {
    const cards = getStorage<LoyaltyCard>(STORAGE_KEYS.LOYALTY);
    const idx = cards.findIndex(c => c.id === id);
    if (idx !== -1) {
      if (cards[idx].currentStamps < cards[idx].totalStamps) {
        cards[idx].currentStamps += 1;
      }
      setStorage(STORAGE_KEYS.LOYALTY, cards);
      return cards[idx];
    }
    throw new Error('Card not found');
  },

  // Extractor
  runExtractor: async (type: string, keyword: string): Promise<ExtractorResult[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return [
      { id: 'ext1', name: `${keyword} A`, phone: '5511999990001', address: 'Rua das Flores, 123', source: type as any, category: keyword },
      { id: 'ext2', name: `${keyword} B`, phone: '5511999990002', address: 'Av. Brasil, 456', source: type as any, category: keyword },
    ];
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const posts = getStorage<BlogPost>(STORAGE_KEYS.BLOG);
    const seed: BlogPost[] = [
        {
          id: 1,
          title: 'Como aumentar suas vendas locais em 2024',
          summary: 'Descubra 5 estratégias simples para atrair mais clientes do seu bairro.',
          content: 'O marketing de proximidade nunca foi tão importante...',
          author: 'Equipe Menu ADS',
          date: '10/05/2024',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
          category: 'Vendas'
        }
    ];
    
    if (posts.length === 0) {
      setStorage(STORAGE_KEYS.BLOG, seed);
      return seed;
    }
    return posts;
  },
  getMyBlogPosts: async (userId: number): Promise<BlogPost[]> => {
    const posts = getStorage<BlogPost>(STORAGE_KEYS.BLOG);
    return posts.filter(p => p.userId === userId);
  },
  createBlogPost: async (data: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const posts = getStorage<BlogPost>(STORAGE_KEYS.BLOG);
    const newPost = { ...data, id: Date.now() };
    posts.push(newPost);
    setStorage(STORAGE_KEYS.BLOG, posts);
    return newPost;
  },
  deleteBlogPost: async (id: number) => {
    const posts = getStorage<BlogPost>(STORAGE_KEYS.BLOG).filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.BLOG, posts);
  },

  // Others
  getQuotes: async () => getStorage<Quote>(STORAGE_KEYS.QUOTES),
  getReviews: async () => getStorage<Review>(STORAGE_KEYS.REVIEWS)
};
