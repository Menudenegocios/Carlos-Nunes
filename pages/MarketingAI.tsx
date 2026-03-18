
import React, { useState } from 'react';
import { generateMarketingCopy, generateMarketingImage } from '../services/geminiService';
import { 
  Sparkles, Copy, RefreshCw, Image as ImageIcon, 
  Type, Download, Wand2, Plus, 
  Monitor, Layout, Check, ChevronRight, X,
  Maximize2, Share2, Palette, Sliders, Home as HomeIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SectionLanding } from '../components/SectionLanding';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export const MarketingAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'text' | 'image'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [textResult, setTextResult] = useState('');
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [business_type, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [copied, setCopied] = useState(false);

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business_type || !description) return;
    setIsLoading(true);
    try {
      const copy = await generateMarketingCopy(business_type, description);
      setTextResult(copy);
    } finally { setIsLoading(false); }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt) return;
    setIsLoading(true);
    try {
      const img = await generateMarketingImage(imagePrompt, aspectRatio);
      setImageResult(img);
    } catch (err) {
      alert("Houve um erro ao gerar a imagem. Tente um prompt mais detalhado ou diferente.");
    } finally { setIsLoading(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!imageResult) return;
    const link = document.createElement('a');
    link.href = imageResult;
    link.download = `menu-flow-studio-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Studio Header Estilo Unificado */}
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-emerald-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Wand2 className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase">Studio Menu Flow</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Sua agência de IA para vendas locais</p>
              </div>
            </div>
            
            {/* Abas Padronizadas com Sublegenda e Gap-1 */}
            <div className="flex p-1.5 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-x-auto scrollbar-hide gap-1">
                {[
                    { id: 'home', label: 'Início', desc: 'Galeria', icon: HomeIcon },
                    { id: 'text', label: 'Copy', desc: 'Textos IA', icon: Type },
                    { id: 'image', label: 'Fotos', desc: 'Criar Imagens', icon: ImageIcon },
                ].map((tab) => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveTab(tab.id as any)} 
                      className={`flex flex-col items-center justify-center min-w-[110px] px-6 py-3 rounded-[1.4rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                    >
                        <div className="flex items-center gap-2 mb-0.5">
                          <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                          <span className="font-black text-[10px] tracking-widest uppercase italic">{tab.label}</span>
                        </div>
                        <span className={`text-[8px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {activeTab === 'home' && (
            <SectionLanding 
                title="Produção de Conteúdo com IA" 
                subtitle="Studio Menu Flow" 
                description="Produza conteúdos de nível profissional sem precisar de designers ou redatores. O Studio Menu Flow utiliza inteligência artificial de ponta para criar textos persuasivos e imagens cinematográficas exclusivas para o seu negócio."
                summaryText="Transforme suas ideias em marketing de alta conversão. Use nossa inteligência artificial para gerar textos persuasivos para posts e anúncios, além de criar imagens realistas de produtos em segundos. É como ter uma agência de publicidade completa dentro da sua vitrine."
                benefits={[
                "Copywriter Pro: Crie legendas, anúncios e roteiros que vendem.",
                "IA Image Studio: Gere fotos realistas de produtos em segundos.",
                "Enquadramentos: Formatos prontos para Stories, Posts e Banners.",
                "Personalização: IA treinada nas melhores práticas do varejo local.",
                "Economia: Tenha uma agência completa dentro do seu dashboard."
                ]}
                ctaLabel="ABRIR FERRAMENTAS"
                onStart={() => setActiveTab('text')}
                icon={Wand2}
                accentColor="brand"
            />
         )}

         {activeTab === 'text' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
               <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-8 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Type className="w-6 h-6" /></div>
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Copywriter Pro</h3>
                  </div>

                  <form onSubmit={handleGenerateText} className="space-y-6">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Seu Nicho de Atuação</label>
                        <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" placeholder="Ex: Hamburgueria Artesanal" value={business_type} onChange={e => setBusinessType(e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">O que você quer promover?</label>
                        <textarea required rows={4} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none" placeholder="Ex: Combo de inauguração com 30% de desconto..." value={description} onChange={e => setDescription(e.target.value)} />
                     </div>
                     <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-black py-6 rounded-[2rem] hover:bg-orange-600 shadow-2xl shadow-orange-900/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-95">
                        {isLoading ? <RefreshCw className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />} GERAR TEXTO VENDEDOR
                     </button>
                  </form>
               </div>

               <div className="lg:col-span-7 space-y-6">
                  {textResult ? (
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl min-h-[500px] flex flex-col animate-fade-in relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                           <h3 className="text-2xl font-black text-gray-900 italic">Resultado IA</h3>
                           <div className="flex gap-2">
                                <button onClick={copyToClipboard} className={`p-4 rounded-2xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${copied ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar'}
                                </button>
                                <button onClick={() => setTextResult('')} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="w-4 h-4" /></button>
                           </div>
                        </div>
                        <div className="flex-1 prose prose-slate max-w-none relative z-10 font-medium text-lg leading-relaxed bg-gray-50/50 p-8 rounded-[2.5rem]">
                           <ReactMarkdown>{textResult}</ReactMarkdown>
                        </div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center min-h-[500px]">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8"><Type className="w-12 h-12" /></div>
                        <h4 className="text-xl font-black text-gray-300 uppercase tracking-widest">Aguardando seu comando...</h4>
                    </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'image' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-8 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary"><ImageIcon className="w-6 h-6" /></div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Menu Flow Image</h3>
                    </div>

                    <form onSubmit={handleGenerateImage} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">O que você quer ver? (Seja específico)</label>
                            {/* Fix: Updated onChange handler to correctly call setImagePrompt with target value */}
                            <textarea required rows={4} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none" placeholder="Ex: Um hambúrguer suculento em um prato de madeira, luz natural, fundo desfocado de restaurante rústico, ultra detalhado..." value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Formato</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: '1:1', label: 'Post (1:1)' },
                                    { id: '9:16', label: 'Story (9:16)' },
                                    { id: '16:9', label: 'Banner (16:9)' }
                                ].map(ratio => (
                                    <button key={ratio.id} type="button" onClick={() => setAspectRatio(ratio.id as AspectRatio)} className={`p-4 rounded-2xl border text-[9px] font-black uppercase tracking-tighter transition-all flex flex-col items-center gap-2 ${aspectRatio === ratio.id ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>
                                        <div className={`border-2 rounded-sm ${aspectRatio === ratio.id ? 'border-white' : 'border-gray-200'} ${ratio.id === '1:1' ? 'w-4 h-4' : ratio.id === '9:16' ? 'w-3 h-5' : 'w-5 h-3'}`}></div>
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-black py-6 rounded-[2rem] hover:bg-orange-600 shadow-2xl shadow-orange-900/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-95">
                            {isLoading ? <RefreshCw className="animate-spin w-6 h-6" /> : <ImageIcon className="w-6 h-6" />} CRIAR FOTO PREMIUM
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-7">
                    {imageResult ? (
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl animate-fade-in space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic">Arte Final</h3>
                                <div className="flex gap-2">
                                    <button onClick={downloadImage} className="p-4 bg-brand-primary text-white rounded-2xl hover:bg-orange-600 shadow-lg transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                        <Download className="w-4 h-4" /> Baixar
                                    </button>
                                    <button onClick={() => setImageResult(null)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="mx-auto rounded-[3rem] overflow-hidden shadow-2xl bg-black/5 flex items-center justify-center group relative">
                                <img src={imageResult} className="w-full h-auto object-contain" alt="Geração IA" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <button onClick={downloadImage} className="p-8 bg-white rounded-full text-brand-primary shadow-2xl transform scale-50 group-hover:scale-100 transition-transform"><Download className="w-10 h-10" /></button>
                                </div>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-20 text-center min-h-[600px] space-y-8">
                            <div className="relative">
                                <div className="w-32 h-32 bg-brand-primary/10 rounded-full animate-ping absolute inset-0"></div>
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-xl relative z-10 border border-orange-100">
                                    <RefreshCw className="w-12 h-12 animate-spin" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">O Menu Flow está pincelando sua arte...</h4>
                                <p className="text-gray-500 mt-2 font-medium">Isso pode levar alguns segundos dependendo da complexidade.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center min-h-[600px]">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8"><ImageIcon className="w-12 h-12" /></div>
                            <h4 className="text-xl font-black text-gray-300 uppercase tracking-widest">Sua Próxima Campanha</h4>
                            <p className="text-gray-400 max-w-xs mt-4 font-medium uppercase tracking-tighter">Gere fotos de produtos, conceitos visuais ou posts para Instagram em segundos.</p>
                        </div>
                    )}
                </div>
            </div>
         )}
      </div>
    </div>
  );
};
