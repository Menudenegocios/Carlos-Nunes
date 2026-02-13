
import { User, Profile, Offer, OfferCategory, Lead, ExtractorResult, Coupon, BlogPost, NetworkingProfile, LoyaltyCard, Quote, ScheduleItem, Review, Product, StoreCategory, FinancialEntry, CommunityPost, CommunityComment, PointsTransaction } from '../types';

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
  COMMUNITY: 'menu_community',
  POINTS_HISTORY: 'menu_points_history'
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
      points: 50, 
      level: 'bronze',
      referralCode: 'REF' + Math.floor(Math.random() * 10000),
      referralsCount: 0
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    
    await mockBackend.addPoints(newUser.id, 'Cadastro Inicial', 50, 'engajamento');

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

  // Points & Rewards System
  addPoints: async (userId: number, action: string, points: number, category: PointsTransaction['category']): Promise<User> => {
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) throw new Error('User not found');

    users[userIdx].points += points;

    if (users[userIdx].points >= 5000) users[userIdx].level = 'ouro';
    else if (users[userIdx].points >= 1000) users[userIdx].level = 'prata';
    else users[userIdx].level = 'bronze';

    setStorage(STORAGE_KEYS.USERS, users);

    const history = getStorage<PointsTransaction>(STORAGE_KEYS.POINTS_HISTORY);
    history.push({
      id: Math.random().toString(36).substr(2, 9),
      userId,
      action,
      points,
      category,
      createdAt: Date.now()
    });
    setStorage(STORAGE_KEYS.POINTS_HISTORY, history);

    const { password: _, ...updatedUser } = users[userIdx];
    return updatedUser;
  },

  getPointsHistory: async (userId: number): Promise<PointsTransaction[]> => {
    const history = getStorage<PointsTransaction>(STORAGE_KEYS.POINTS_HISTORY);
    return history.filter(t => t.userId === userId).sort((a,b) => b.createdAt - a.createdAt);
  },

  upgradePlan: async (userId: number, plan: any): Promise<User> => {
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index].plan = plan;
    setStorage(STORAGE_KEYS.USERS, users);

    const pointsToAdd = plan === 'negocios' ? 300 : 50;
    await mockBackend.addPoints(userId, `Assinatura Plano ${plan.toUpperCase()}`, pointsToAdd, 'assinatura');

    const finalUser = (await getStorage<User>(STORAGE_KEYS.USERS).find(u => u.id === userId))!;
    return finalUser;
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
          businessName: 'Menu de Negócios Oficial',
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
    
    await mockBackend.addPoints(postData.userId, 'Interação na Comunidade', 20, 'engajamento');

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
        await mockBackend.addPoints(userId, 'Curtida na Comunidade', 20, 'engajamento');
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
      
      await mockBackend.addPoints(commentData.userId, 'Comentário na Comunidade', 20, 'engajamento');

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
       await mockBackend.addPoints(userId, 'Completar Perfil', 20, 'engajamento');
    }

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
    if (offers.length === 0) {
      const seeds: Offer[] = [
        {
          id: 101, userId: 1, title: 'Consultoria Estratégica Digital', 
          description: 'Aumente suas vendas locais com estratégias de tráfego pago e posicionamento de marca.',
          category: OfferCategory.SERVICOS_PROFISSIONAIS, city: 'São Paulo', price: 'A partir de R$ 450',
          createdAt: Date.now(), imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 102, userId: 2, title: 'Terapia Holística e Bem-estar', 
          description: 'Sessões de reiki e meditação guiada para equilíbrio emocional e redução de estresse.',
          category: OfferCategory.SAUDE_BEM_ESTAR, city: 'Rio de Janeiro', price: 'R$ 150/sessão',
          createdAt: Date.now(), imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8966bf?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 103, userId: 3, title: 'Apartamento Studio Centro', 
          description: 'Excelente oportunidade para locação em região privilegiada com fácil acesso ao metrô.',
          category: OfferCategory.IMOVEIS_SERVICOS, city: 'Curitiba', price: 'R$ 1.800/mês',
          createdAt: Date.now(), imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 104, userId: 4, title: 'Mentoria: Gestão para Pequenos', 
          description: 'Aprenda a organizar seu fluxo de caixa e gerir sua equipe de forma eficiente.',
          category: OfferCategory.OPORTUNIDADES, city: 'Belo Horizonte', price: 'Grátis p/ Membros Pro',
          createdAt: Date.now(), imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
        }
      ];
      setStorage(STORAGE_KEYS.OFFERS, seeds);
      offers = seeds;
    }

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
    
    await mockBackend.addPoints(userId, 'Criar Novo Anúncio', 20, 'engajamento');

    return newOffer;
  },
  updateOffer: async (userId: number, id: number, data: any): Promise<Offer> => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS);
    const idx = offers.findIndex(o => o.id === id && o.userId === userId);
    if (idx === -1) throw new Error('Offer not found');
    offers[idx] = { ...offers[idx], ...data };
    setStorage(STORAGE_KEYS.OFFERS, offers);
    
    await mockBackend.addPoints(userId, 'Atualizar Anúncio', 20, 'engajamento');

    return offers[idx];
  },
  deleteOffer: async (id: number, userId: number) => {
    const offers = getStorage<Offer>(STORAGE_KEYS.OFFERS).filter(o => !(o.id === id && o.userId === userId));
    setStorage(STORAGE_KEYS.OFFERS, offers);
  },

  // Products
  getProducts: async (userId: number) => getStorage<Product>(STORAGE_KEYS.PRODUCTS).filter(p => p.userId === userId),
  getAllProducts: async (): Promise<any[]> => {
    let products = getStorage<Product>(STORAGE_KEYS.PRODUCTS);
    if (products.length === 0) {
      const seeds: Product[] = [
        { id: 'p1', userId: 10, name: 'Hambúrguer Artesanal Smash', description: 'Duas carnes suculentas de 100g, queijo cheddar e molho especial.', price: 34.90, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', category: 'Gastronomia', available: true },
        { id: 'p2', userId: 11, name: 'Combo Café da Manhã', description: 'Café expresso, pão de queijo recheado e fatia de bolo do dia.', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800', category: 'Gastronomia', available: true }
      ];
      setStorage(STORAGE_KEYS.PRODUCTS, seeds);
      products = seeds;
    }
    const profiles = getStorage<Profile>(STORAGE_KEYS.PROFILES);
    return products.map(p => {
      const prof = profiles.find(pr => pr.userId === p.userId);
      return {
        ...p,
        businessName: prof?.businessName || 'Loja Local',
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

    await mockBackend.addPoints(data.userId, 'Adicionar Produto ao Catálogo', 20, 'engajamento');

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
    
    await mockBackend.addPoints(userId, 'Criar Categoria no Catálogo', 20, 'engajamento');

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
      
      await mockBackend.addPoints(userId, 'Criar Novo Cupom', 20, 'engajamento');
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
      const updatedUser = await mockBackend.addPoints(userId, `Resgate de Cupom`, points, 'especial');
      return updatedUser;
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
          author: 'Equipe Menu de Negócios',
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
