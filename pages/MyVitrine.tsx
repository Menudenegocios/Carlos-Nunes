
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Store, Smartphone, Package, BookOpen, 
  Eye, ArrowUpRight, Plus, Trash2, Edit2, Calendar,
  X, Send, RefreshCw, Image as ImageIcon, Camera, Sparkles,
  Home as HomeIcon, Layout, FileText, ChevronRight, AlignLeft,
  Quote, Palette, Share2, Settings, ListTodo, Medal, Gift, History,
  LayoutGrid, Clock
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { BlogPost, Product, Coupon, Project, Profile } from '../types';

type VitrineTab = 'inicio' | 'resumo' | 'identidade' | 'blog_seo' | 'todos' | 'produtos' | 'projetos' | 'configuracoes';

export const MyVitrine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VitrineTab>('inicio');
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allVitrines, setAllVitrines] = useState<Profile[]>([]);

  // Troca de aba principal
  const handleTabChange = (tab: VitrineTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab === 'blog_seo') loadBlogData();
    if (activeTab === 'produtos') loadCatalogData();
    if (activeTab === 'projetos') loadProjectsData();
    if (activeTab === 'todos') loadAllVitrinesData();
  }, [activeTab]);

  const loadAllVitrinesData = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setAllVitrines(data as any || []);
  };

  const loadBlogData = async () => {
    if (!user) return;
    setIsLoadingBlog(true);
    try {
      const { data } = await supabase.from('blog_posts').select('*').eq('user_id', user.id);
      setBlogPosts((data as any) || []);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const loadCatalogData = async () => {
    if (!user) return;
    const { data: productsData } = await supabase.from('products').select('*').eq('user_id', user.id);
    setProducts((productsData as any) || []);
    const { data: couponsData } = await supabase.from('coupons').select('*').eq('user_id', user.id);
    setCoupons((couponsData as any) || []);
  };

  const loadProjectsData = async () => {
    if (!user) return;
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id);
    setProjects((data as any) || []);
  };

  // Handlers para Projetos
  const handleCreateProject = async () => {
    if (!user) return;
    const newProject = {
      user_id: user.id,
      name: 'Novo Projeto',
      description: 'Descrição'
    };
    await supabase.from('projects').insert([newProject]);
    loadProjectsData();
  };

  const handleDeleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    loadProjectsData();
  };

  const handleCreateProduct = async () => {
    if (!user) return;
    console.log("Create product");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    await supabase.from('products').delete().eq('id', id);
    loadCatalogData();
  };

  const handleCreateCoupon = async () => {
    if (!user) return;
    console.log("Create coupon");
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!user) return;
    await supabase.from('coupons').delete().eq('id', id);
    loadCatalogData();
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-[fade-in_0.4s_ease-out] font-sans">
      <h1>My Vitrine</h1>
    </div>
  );
};
