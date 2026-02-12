
import React, { useState } from 'react';
import { generateMarketingCopy, generateMarketingImage, editMarketingImage } from '../services/geminiService';
import { Sparkles, Copy, RefreshCw, Image as ImageIcon, Type, Instagram, Download, Wand2, Upload, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MarketingAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'edit'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const copy = await generateMarketingCopy(businessType, description);
      setResult(copy);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
               <Sparkles className="h-10 w-10 text-yellow-300" />
            </div>
            <div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tight">MenuIA Creative</h1>
               <p className="text-indigo-200 text-lg font-medium">Sua agência de marketing pessoal turbinada com IA.</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] w-fit border border-white/10">
            <button onClick={() => setActiveTab('text')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all ${activeTab === 'text' ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
              <Type className="w-4 h-4" /> COPYWRITER
            </button>
            <button onClick={() => setActiveTab('image')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all ${activeTab === 'image' ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
              <ImageIcon className="w-4 h-4" /> GERADOR
            </button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Configurações</h3>
            <form onSubmit={handleGenerateText} className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Seu Negócio</label>
                  <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" placeholder="Ex: Pizzaria Artesanal" value={businessType} onChange={e => setBusinessType(e.target.value)} />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">O que você quer vender?</label>
                  <textarea rows={4} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm focus:ring-2 focus:ring-indigo-100" placeholder="Descreva sua oferta..." value={description} onChange={e => setDescription(e.target.value)} />
               </div>
               <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-700 shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  {isLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />} GERAR COPY AGORA
               </button>
            </form>
         </div>

         <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-gray-900">Resultado da IA</h3>
               {result && <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Copy className="w-5 h-5" /></button>}
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 overflow-y-auto min-h-[300px]">
               {result ? (
                 <div className="prose prose-indigo max-w-none"><ReactMarkdown>{result}</ReactMarkdown></div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-40">
                    <Sparkles className="w-16 h-16" />
                    <p className="font-black uppercase tracking-widest text-xs">Aguardando seu comando...</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
