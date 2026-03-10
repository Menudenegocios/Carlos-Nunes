
export interface Media {
  id: string;
  title: string;
  description: string;
  category: 'MenuCast' | 'Treinamentos' | 'Ferramentas' | 'Eventos';
  image: string;
  youtubeEmbed?: string;
  link?: string;
  duration?: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'profissionais' | 'freelancers' | 'negocios';
  points: number;
  level: 'elite' | 'bronze' | 'ouro' | 'diamante';
  menuCash: number;
  referralCode: string;
  referralsCount: number;
  role?: 'user' | 'partner' | 'member' | 'client' | 'admin';
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  createdAt: number;
}

export interface B2BOffer {
  id: string;
  userId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  terms: string;
  createdAt: number;
}

export interface B2BTransaction {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  description: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  action: string;
  points: number;
  createdAt: number;
  category: 'assinatura' | 'indicacao' | 'engajamento' | 'especial';
}

export interface CommunityComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  businessName?: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  comments: CommunityComment[];
  createdAt: number;
}

export interface BioLink {
  id: string;
  type: 'whatsapp' | 'instagram' | 'website' | 'location' | 'email' | 'custom';
  label: string;
  url: string;
  active: boolean;
}

export interface SocialProof {
  id: string;
  author: string;
  text: string;
  stars: number;
}

export interface BioShowcaseItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  link: string;
}

export interface BioConfig {
  themeId: string;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono' | 'font-display';
  links: BioLink[];
  customColors?: {
    background?: string;
    button?: string;
    text?: string;
  };
  meshGradient?: boolean;
  floatingCTA?: {
    enabled: boolean;
    label: string;
    type: 'whatsapp' | 'catalog';
  };
  socialProof?: SocialProof[];
  blogEnabled?: boolean;
  blogButtonLabel?: string;
  showcase?: {
    enabled: boolean;
    title: string;
    type: 'products' | 'services';
    items?: BioShowcaseItem[];
  };
  shareCard?: {
    enabled: boolean;
  };
}

export interface SeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface WhatsappBotConfig {
  enabled: boolean;
  name?: string;
  welcomeMessage?: string;
  avatarUrl?: string;
}

export interface StoreConfig {
  coverUrl?: string;
  bannerImages?: string[]; // Suporte para até 3 fotos no banner
  themeColor?: string;
  videoUrl?: string;
  openingHours?: string;
  address?: string;
  city?: string;
  googleMapsLink?: string;
  businessType?: 'local_business' | 'professional';
  salesType?: 'product' | 'service' | 'both';
  aiChatEnabled?: boolean;
  schedulingEnabled?: boolean;
  gaId?: string;
  pixelId?: string;
  seo?: SeoConfig;
  whatsappBot?: WhatsappBotConfig;
  vitrineTheme?: 'modern' | 'classic' | 'minimal';
  whatsappFormEnabled?: boolean;
  whatsappFormTitle?: string;
  vitrineNiche?: string;
  vitrineCity?: string;
  videoPortfolio?: string[]; // Suporte para até 9 vídeos (Reels)
  // Campos para Landing Page de Especialista
  aboutMe?: string;
  solutions?: string;
  problemsSolved?: string;
  businessInterests?: string;
  highlightedProductIds?: string[]; // Até 3 IDs de produtos em destaque
  paymentMethods?: {
    pix: boolean;
    card: boolean;
    cash: boolean;
    credit: boolean;
  };
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
  };
  calendarLink?: string;
}

export interface StoreCategory {
  id: string;
  userId: string;
  name: string;
  order: number;
}

export interface Profile {
  id: string;
  userId: string;
  isPublished?: boolean;
  slug?: string;
  businessName?: string;
  category?: string;
  phone?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  bio?: string;
  logoUrl?: string;
  vitrineCategory?: 'Produtos' | 'Serviços' | 'Oportunidades';
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
  };
  storeConfig?: StoreConfig;
  bioConfig?: BioConfig;
}

export interface Coupon {
  id: string;
  userId: string;
  code: string;
  title: string;
  discount: string; // Ex: "10%" ou "R$ 50,00"
  type: 'percentage' | 'fixed';
  pointsReward?: number;
  description?: string;
  expiryDate?: string;
  createdAt: number;
  active: boolean;
}

export interface SchedulingConfig {
  enabled: boolean;
  durationMinutes: number;
  meetingType: 'google_meet' | 'in_person' | 'phone';
  googleCalendarConnected: boolean;
  availability?: string;
}

export interface Offer {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  price?: string;
  createdAt: number;
  imageUrl?: string;
  videoUrl?: string;
  logoUrl?: string;
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
  };
  coupons?: Coupon[];
  scheduling?: SchedulingConfig;
}

export interface Prize {
  id: string;
  title: string;
  cost: number;
  imageUrl: string;
}

export enum OfferCategory {
  SERVICOS_PROFISSIONAIS = 'Serviços Profissionais',
  NEGOCIOS_LOCAIS = 'Negócios Locais',
  SAUDE_BEM_ESTAR = 'Saúde e Bem-estar',
  IMOVEIS_SERVICOS = 'Imóveis e Residencial',
  OPORTUNIDADES = 'Oportunidades e Parcerias'
}

export interface Product {
  id: string;
  userId: string;
  storeCategoryId?: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  available: boolean;
  variations?: string[];
  buttonType?: 'buy' | 'quote';
  externalLink?: string;
  stock?: number;
  pointsReward?: number;
  isLocal?: boolean;
}

export interface BlogPost {
  id: string;
  userId?: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  // added for internal tracking and sorting in StoreView.tsx
  created_at?: string;
  // added for consistency with other backend objects
  createdAt?: string | number;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug?: string;
  altText?: string;
  googleMyBusinessSync?: boolean;
  // Social fields
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export type PipelineStage = 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost';

export interface LeadTimelineEvent {
  id: string;
  type: 'creation' | 'stage_change' | 'contact' | 'note';
  content: string;
  createdAt: number;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  notes?: string;
  createdAt: number;
  lastContact?: number;
  tags?: string[];
  totalValue?: number;
  birthDate?: string;
}

export interface Lead {
  id: string;
  userId: string;
  name: string;
  phone: string;
  source: 'maps' | 'instagram' | 'cnpj' | 'manual' | 'vitrine_publica' | 'bot_whatsapp';
  stage: PipelineStage;
  notes?: string;
  lastContact?: number;
  value?: number;
  createdAt?: number;
  timeline?: LeadTimelineEvent[];
  clientId?: string; // Link opcional para um cliente convertido
}

export interface FinancialEntry {
  id: string;
  userId: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  entityType: 'personal' | 'business';
}

export interface ScheduleItem {
  id: string;
  userId: string;
  title: string;
  client: string;
  date: string;
  time: string;
  type: 'visita' | 'reuniao' | 'servico';
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ExtractorResult {
  id: string;
  name: string;
  phone: string;
  address?: string;
  category?: string;
  source: 'maps' | 'instagram' | 'cnpj';
}

export interface NetworkingProfile {
  id: string;
  userId?: string;
  name: string;
  businessName: string;
  sector: string;
  avatar: string;
  lookingFor: string;
}

export interface LoyaltyCard {
  id: string;
  businessName: string;
  reward: string;
  totalStamps: number;
  currentStamps: number;
  color: string;
}

export interface Quote {
  id: string;
  clientName: string;
  serviceInterest: string;
  date: string;
  status: 'pendente' | 'respondido' | 'fechado';
  message: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface VitrineComment {
  id: string;
  vitrineUserId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
}

export interface PlatformEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'Online' | 'Presencial';
  image?: string;
}

export interface CRMTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: number;
  status: 'pending' | 'completed';
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'other';
  relatedTo?: {
    type: 'lead' | 'client';
    id: string;
    name: string;
  };
  createdAt: number;
}

export interface QuickMessageTemplate {
  id: string;
  userId: string;
  category: 'primeiro_contato' | 'apos_proposta' | 'lembrete_decisao' | 'pos_venda' | 'reativacao' | 'outros';
  title: string;
  content: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  smartGoalId?: string;
  createdAt: string;
}

export interface SWOTAnalysis {
  id: string;
  projectId?: string;
  userId: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  createdAt: string;
}

export interface SMARTGoal {
  id: string;
  projectId?: string;
  userId: string;
  specific: string;
  measurable: string;
  attainable: string;
  relevant: string;
  timeBound: string;
  createdAt: string;
}

export interface BusinessCanva {
  id: string;
  projectId?: string;
  userId: string;
  keyPartners: string;
  keyActivities: string;
  valuePropositions: string;
  customerRelationships: string;
  customerSegments: string;
  keyResources: string;
  channels: string;
  costStructure: string;
  revenueStreams: string;
  createdAt: string;
}
