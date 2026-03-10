
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
import { mockBackend } from '../services/mockBackend';
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
    const vitrines = await mockBackend.getAllProfiles();
    setAllVitrines(vitrines);
  };

  const loadBlogData = async () => {
    if (!user) return;
    setIsLoadingBlog(true);
    try {
      const posts = await mockBackend.getBlogPosts();
      setBlogPosts(posts.filter(p => p.userId === user.id));
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const loadCatalogData = async () => {
    if (!user) return;
    const products = await mockBackend.getProducts(user.id);
    setProducts(products);
    const coupons = await mockBackend.getCoupons(user.id);
    setCoupons(coupons);
  };

  const loadProjectsData = async () => {
    if (!user) return;
    const projects = await mockBackend.getProjects(user.id);
    setProjects(projects);
  };

  // Handlers para Projetos
  const handleCreateProject = async () => {
    if (!user) return;
    const newProject: Omit<Project, 'id' | 'createdAt'> = {
      userId: user.id,
      name: 'Novo Projeto',
      description: 'Descrição'
    };
    await mockBackend.createProject(newProject);
    loadProjectsData();
  };

  const handleDeleteProject = async (id: string) => {
    await mockBackend.deleteProject(id);
    loadProjectsData();
  };

  const handleCreateProduct = async () => {
    if (!user) return;
    console.log("Create product");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    await mockBackend.deleteProduct(id);
    loadCatalogData();
  };

  const handleCreateCoupon = async () => {
    if (!user) return;
    console.log("Create coupon");
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!user) return;
    await mockBackend.deleteCoupon(id, user.id);
    loadCatalogData();
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-[fade-in_0.4s_ease-out] font-sans">
      <h1>My Vitrine</h1>
    </div>
  );
};
