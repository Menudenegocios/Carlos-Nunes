
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'profissionais' | 'freelancers' | 'negocios';
  points: number;
  level: 'bronze' | 'prata' | 'ouro';
  referralCode: string;
  referralsCount: number;
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
}

export interface StoreConfig {
  coverUrl?: string;
  themeColor?: string;
  videoUrl?: string;
  openingHours?: string;
  salesType?: 'product' | 'service' | 'both';
  aiChatEnabled?: boolean;
  schedulingEnabled?: boolean;
  gaId?: string;
  pixelId?: string;
  paymentMethods?: {
    pix: {
      enabled: boolean;
      key?: string;
      keyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
    };
    mercadoPago: {
      enabled: boolean;
      accessToken?: string;
      publicKey?: string;
    };
    onDelivery: boolean;
    creditCard: boolean;
  };
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
  businessName?: string;
  category?: string;
  phone?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  bio?: string;
  logoUrl?: string;
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
  code: string;
  title: string;
  discount: string;
  pointsReward: number;
  description: string;
  expiryDate?: string;
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
}

export type PipelineStage = 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost';

export interface LeadTimelineEvent {
  id: string;
  type: 'creation' | 'stage_change' | 'contact' | 'note';
  content: string;
  createdAt: number;
}

export interface Lead {
  id: string;
  userId: string;
  name: string;
  phone: string;
  source: 'maps' | 'instagram' | 'cnpj' | 'manual';
  stage: PipelineStage;
  notes?: string;
  lastContact?: number;
  value?: number;
  createdAt?: number;
  timeline?: LeadTimelineEvent[];
}

export interface FinancialEntry {
  id: string;
  userId: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
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
