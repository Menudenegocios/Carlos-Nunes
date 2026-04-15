
export interface Media {
  id: string;
  title: string;
  description: string;
  category: 'MenuCast' | 'Treinamentos' | 'Ferramentas' | 'Eventos';
  image: string;
  youtubeEmbed?: string;
  link?: string;
  duration?: string;
  created_at: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'pre-cadastro' | 'basic' | 'pro' | 'full';
  has_local_plus?: boolean;
  points: number;
  level: 'Nível Base' | 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  menu_cash: number;
  referral_code: string;
  referrals_count: number;
  display_id?: number;
  role?: 'user' | 'partner' | 'member' | 'client' | 'admin';
  has_founder_badge?: boolean;
  phone?: string;
  business_name?: string;
  photo_url?: string;
  city?: string;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  category?: string;
  created_at: number;
}

export interface B2BOffer {
  id: string;
  user_id: string;
  business_name: string;
  businessLogo: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  terms: string;
  created_at: number;
}


export interface B2BTransaction {
  id: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  product_id?: string;
  amount: number; // Valor em dinheiro R$
  total_amount?: number; // Valor total do produto
  menu_cash_amount?: number; // Valor em Menu Cash
  description: string;
  status: 'pending' | 'confirmed' | 'rejected';
  buyer_confirmed?: boolean;
  seller_confirmed?: boolean;
  buyer_phone?: string;
  seller_phone?: string;
  created_at: number;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  action: string;
  points: number;
  created_at: number;
  category: 'assinatura' | 'indicacao' | 'engajamento' | 'especial';
}

export interface CommunityComment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: number;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  business_name?: string;
  user_avatar: string;
  content: string;
  image_url?: string;
  likes: number;
  likedBy: string[];
  comments: CommunityComment[];
  created_at: number;
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
  image_url: string;
  price: number;
  link: string;
}

export interface BioConfig {
  theme_id: string;
  font_family: 'font-sans' | 'font-serif' | 'font-mono' | 'font-display';
  links: BioLink[];
  custom_colors?: {
    background?: string;
    button?: string;
    text?: string;
  };
  mesh_gradient?: boolean;
  floating_cta?: {
    enabled: boolean;
    label: string;
    type: 'whatsapp' | 'catalog';
  };
  social_proof?: SocialProof[];
  blog_enabled?: boolean;
  blog_button_label?: string;
  showcase?: {
    enabled: boolean;
    title: string;
    type: 'products' | 'services';
    items?: BioShowcaseItem[];
  };
  share_card?: {
    enabled: boolean;
  };
}

export interface SeoConfig {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export interface CRMStage {
  id: string;
  label: string;
  bg: string;
}

export interface CRMFunnel {
  id: string;
  title: string;
  stages: CRMStage[];
}

export interface WhatsappBotConfig {
  enabled: boolean;
  name?: string;
  welcome_message?: string;
  avatar_url?: string;
}

export interface StoreConfig {
  cover_url?: string;
  banner_images?: string[]; // Suporte para até 3 fotos no banner
  theme_color?: string;
  video_url?: string;
  opening_hours?: string;
  address?: string;
  city?: string;
  google_maps_link?: string;
  business_type?: 'local_business' | 'professional';
  sales_type?: 'product' | 'service' | 'both';
  ai_chat_enabled?: boolean;
  scheduling_enabled?: boolean;
  ga_id?: string;
  pixel_id?: string;
  seo?: SeoConfig;
  whatsapp_bot?: WhatsappBotConfig;
  vitrine_theme?: 'modern' | 'classic' | 'minimal';
  whatsapp_form_enabled?: boolean;
  whatsapp_form_title?: string;
  vitrine_niche?: string;
  vitrine_city?: string;
  video_portfolio?: string[]; // Suporte para até 9 vídeos (Reels)
  // Campos para Landing Page de Especialista
  about_me?: string;
  solutions?: string;
  problems_solved?: string;
  business_interests?: string;
  highlighted_product_ids?: string[]; // Até 3 IDs de produtos em destaque
  payment_methods?: {
    pix: boolean;
    card: boolean;
    cash: boolean;
    credit: boolean;
  };
  social_links?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
  };
  calendar_link?: string;
  crm_funnels?: CRMFunnel[];
}

export interface StoreCategory {
  id: string;
  user_id: string;
  name: string;
  order: number;
}

export interface Profile {
  id: string;
  user_id: string;
  slug?: string;
  business_name?: string;
  category?: string;
  phone?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  bio?: string;
  logo_url?: string;
  vitrine_category?: 'Produtos' | 'Serviços' | 'Oportunidades';
  social_links?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
  };
  store_config?: StoreConfig;
  bio_config?: BioConfig;
  // Admin/Subscription related fields
  name?: string;
  email?: string;
  plan?: string;
  has_local_plus?: boolean;
  points?: number;
  level?: string;
  role?: string;
  menu_cash?: number;
  referral_code?: string;
  referrals_count?: number;
  display_id?: number;
  subscriptions?: Subscription[] | Subscription;
  is_published?: boolean;
  has_founder_badge?: boolean;
  asaas_customer_id?: string;
  cpf_cnpj?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  asaas_customer_id?: string;
  asaas_subscription_id?: string;
  asaas_payment_id?: string;
  plan?: string;
  status?: string;
  current_period_end?: string | number;
  created_at?: number;
}

export interface Coupon {
  id: string;
  user_id: string;
  code: string;
  title: string;
  discount: string; // Ex: "10%" ou "R$ 50,00"
  type: 'percentage' | 'fixed';
  points_reward?: number;
  description?: string;
  expiry_date?: string;
  created_at: number;
  active: boolean;
}

export interface SchedulingConfig {
  enabled: boolean;
  duration_minutes: number;
  meeting_type: 'google_meet' | 'in_person' | 'phone';
  google_calendar_connected: boolean;
  availability?: string;
}

export interface Offer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  price?: string;
  created_at: number;
  image_url?: string;
  video_url?: string;
  logo_url?: string;
  store_name?: string;
  discount_display?: string;
  store_logo_url?: string;
  social_links?: {
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
  image_url: string;
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
  user_id: string;
  store_category_id?: string;
  name: string;
  description: string;
  price: number;
  promo_price?: number;
  image_url: string;
  video_url?: string;
  category: string;
  available: boolean;
  variations?: string[];
  button_type?: 'buy' | 'quote';
  external_link?: string;
  stock?: number;
  points_reward?: number;
  is_local?: boolean;
  accepts_menu_cash?: boolean;
  menu_cash_percentage?: number;
  product_type?: 'Produto' | 'Serviço' | 'Mentoria';
  price_on_request?: boolean;
}

export interface BlogPost {
  id: string;
  user_id?: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
  category: string;
  // added for consistency with other backend objects
  created_at?: string;
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  slug?: string;
  alt_text?: string;
  google_my_business_sync?: boolean;
  // Social fields
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export type PipelineStage = string; // Permitir IDs dinâmicos de etapas

export interface LeadTimelineEvent {
  id: string;
  type: 'creation' | 'stage_change' | 'contact' | 'note';
  content: string;
  created_at: number;
}

export interface FollowUp {
  id: string;
  user_id: string;
  entity_type: 'lead' | 'client' | 'task';
  entity_id: string;
  content: string;
  checklist?: { text: string; done: boolean }[];
  due_date?: string;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  notes?: string;
  created_at: number;
  last_contact?: number;
  tags?: string[];
  totalValue?: number;
  birthDate?: string;
  razao_social?: string;
  cnpj?: string;
  tipo?: string;
  rua_av?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  responsavel?: string;
  ultimo_follow_up?: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  source: 'maps' | 'instagram' | 'cnpj' | 'manual' | 'vitrine_publica' | 'bot_whatsapp';
  stage: PipelineStage;
  notes?: string;
  last_contact?: number;
  value?: number;
  created_at?: number;
  timeline?: LeadTimelineEvent[];
  client_id?: string; // Link opcional para um cliente convertido
  ultimo_follow_up?: string;
}

export interface FinancialEntry {
  id: string;
  user_id: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  entity_type: 'personal' | 'business';
}

// --- Financial Module V2 ---

export type FinAccountType = 'conta_corrente' | 'conta_digital' | 'dinheiro' | 'cartao_credito' | 'carteira' | 'investimento' | 'caixa_fisico' | 'recebíveis';

export interface FinancialAccount {
  id: string;
  user_id: string;
  name: string;
  type: FinAccountType;
  entity_type: 'personal' | 'business';
  institution?: string;
  initial_balance: number;
  current_balance: number;
  color?: string;
  icon?: string;
  active: boolean;
  created_at: string;
}

export interface FinancialCategory {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  entity_type: 'personal' | 'business' | 'both';
  color: string;
  icon?: string;
  parent_id?: string;
  dre_group?: 'gross_revenue' | 'deductions' | 'direct_costs' | 'operating_expenses_fixed' | 'operating_expenses_variable' | 'other_results';
  is_fixed?: boolean;
  created_at: string;
  // Virtual
  subcategories?: FinancialCategory[];
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id?: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  status: 'predicted' | 'realized';
  entity_type: 'personal' | 'business';
  observation?: string;
  is_recurring: boolean;
  recurrence_period?: 'weekly' | 'monthly' | 'yearly' | 'custom';
  installments_total?: number;
  installment_current?: number;
  parent_transaction_id?: string;
  attachments?: string[];
  tags?: string[];
  is_conciliated: boolean;
  has_invoice?: boolean;
  created_at: string;
  // Virtual (joined)
  account_name?: string;
  account_color?: string;
  category_name?: string;
  category_color?: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  items?: FinancialGoalItem[];
}

export interface FinancialGoalItem {
  id: string;
  goal_id: string;
  label: string;
  target_value: number;
  current_value: number;
}

export interface FinancialImportRule {
  id: string;
  user_id: string;
  search_term: string;
  category_id: string;
}

export interface FinancialMonthClosing {
  id: string;
  user_id: string;
  month: number;
  year: number;
  snapshot: {
    total_income: number;
    total_expense: number;
    balance: number;
    dre?: {
      gross_revenue: number;
      deductions: number;
      net_revenue: number;
      direct_costs: number;
      gross_profit: number;
      operating_expenses_fixed: number;
      operating_expenses_variable: number;
      operating_result: number;
      other_results: number;
      net_profit: number;
      margin: number;
      items: any[];
    };
    account_balances?: { name: string; balance: number }[];
  };
  is_closed: boolean;
  observations?: string;
  closed_at?: string;
}

export interface ScheduleItem {
  id: string;
  user_id: string;
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
  user_id?: string;
  name: string;
  business_name: string;
  sector: string;
  avatar: string;
  lookingFor: string;
}

export interface LoyaltyCard {
  id: string;
  business_name: string;
  reward: string;
  totalStamps: number;
  currentStamps: number;
  color: string;
}

export interface Quote {
  id: string;
  client_name: string;
  service_interest: string;
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
  vitrine_user_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: number;
}

export interface PlatformEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'Online' | 'Presencial';
  image?: string;
  external_link?: string;
}

export interface CRMTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: number;
  status: 'pending' | 'completed';
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'other';
  related_to?: {
    type: 'lead' | 'client';
    id: string;
    name: string;
  };
  created_at: number;
}

export interface QuickMessageTemplate {
  id: string;
  user_id: string;
  category: 'primeiro_contato' | 'apos_proposta' | 'lembrete_decisao' | 'pos_venda' | 'reativacao' | 'outros';
  title: string;
  content: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  smart_goal_id?: string;
  created_at: string;
}

export interface SWOTAnalysis {
  id: string;
  project_id?: string;
  user_id: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  created_at: string;
}

export interface SMARTGoal {
  id: string;
  project_id?: string;
  user_id: string;
  specific: string;
  measurable: string;
  attainable: string;
  relevant: string;
  time_bound: string;
  created_at: string;
}

export interface BusinessCanva {
  id: string;
  project_id?: string;
  user_id: string;
  key_partners: string;
  key_activities: string;
  value_propositions: string;
  customer_relationships: string;
  customer_segments: string;
  key_resources: string;
  channels: string;
  cost_structure: string;
  revenue_streams: string;
  created_at: string;
}
