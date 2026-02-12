import React, { useState } from 'react';
import { generateMarketingCopy, generateMarketingImage, editMarketingImage } from '../services/geminiService';
import { Sparkles, Copy, RefreshCw, Image as ImageIcon, Type, Instagram, Layout, Download, Wand2, Upload, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MarketingAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'edit'>('text');
  
  // Text State
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  
  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState('');

  // Image Edit State
  const [originalImage, setOriginalImage] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType.trim() || !description.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    setResult('');

    try {
      const copy = await generateMarketingCopy(businessType, description);
      setResult(copy);
    } catch (err) {
      setError('Ocorreu um erro ao gerar a copy. Verifique sua API Key ou tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) {
      setError('Por favor, descreva a imagem.');
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedImage('');

    try {
      const img = await generateMarketingImage(imagePrompt, aspectRatio);
      setGeneratedImage(img);
    } catch (err) {
      setError('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(''); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImage || !editPrompt.trim()) {
      setError('Por favor, carregue uma imagem e descreva a edição.');
      return;
    }

    setError('');
    setIsLoading(true);
    setEditedImage('');

    try {
      const img = await editMarketingImage(originalImage, editPrompt);
      setEditedImage(img);
    } catch (err) {
      setError('Erro ao editar imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-yellow-300" />
          <h1 className="text-3xl font-bold">MenuIA - Creative Studio</h1>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Crie textos persuasivos, gere imagens incríveis ou edite fotos existentes com Inteligência Artificial.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-4 mt-8 bg-black/20 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'text' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/10'
            }`}
          >
            <Type className="w-4 h-4" /> Copywriter
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'image' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Gerador
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/10'
            }`}
          >
            <Wand2 className="w-4 h-4" /> Editor Mágico
          </button>
        </div>
      </div>

      {activeTab === 'text' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gerador de Legendas</h2>
            <form onSubmit={handleGenerateText} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Negócio
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                  placeholder="Ex: Pizzaria, Consultoria..."
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O que você quer divulgar?
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                  placeholder="Ex: Promoção de dia dos namorados, 2 pizzas por 1..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Escrevendo...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Gerar Texto
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Text Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Resultado</h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium"
                >
                  <Copy className="h-4 w-4" /> Copiar
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 overflow-y-auto">
              {result ? (
                <div className="prose prose-sm prose-indigo max-w-none text-gray-800">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                  <Type className="h-10 w-10 mb-2 opacity-50" />
                  <p>Aguardando instruções...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Criar Imagem (Grátis)</h2>
            <form onSubmit={handleGenerateImage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descreva a imagem
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                  placeholder="Ex: Uma foto profissional de um hambúrguer gourmet suculento, iluminação de estúdio..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Formato para Instagram
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                      aspectRatio === '1:1' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                    <span className="text-xs font-bold">Square (1:1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('3:4')}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                      aspectRatio === '3:4' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-5 h-7 border-2 border-current rounded-sm"></div>
                    <span className="text-xs font-bold">Portrait (4:5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                      aspectRatio === '9:16' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-4 h-7 border-2 border-current rounded-sm"></div>
                    <span className="text-xs font-bold">Story (9:16)</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Criando arte...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Gerar Imagem
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Image Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
             {isLoading ? (
               <div className="text-center">
                 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500 font-medium">A IA está desenhando...</p>
                 <p className="text-xs text-gray-400 mt-1">Isso pode levar alguns segundos.</p>
               </div>
             ) : generatedImage ? (
               <div className="w-full h-full flex flex-col items-center">
                 <div className="relative group w-full flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={generatedImage} 
                      alt="Gerada por IA" 
                      className="max-h-[500px] w-auto object-contain shadow-lg rounded-lg"
                    />
                    <a 
                      href={generatedImage} 
                      download={`menuia-${Date.now()}.png`}
                      className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Baixar
                    </a>
                 </div>
                 <div className="mt-4 flex gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Instagram className="w-4 h-4" /> Pronto para postar</span>
                 </div>
               </div>
             ) : (
               <div className="text-center text-gray-400">
                 <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                 <p className="text-lg font-medium">Sua arte aparecerá aqui</p>
                 <p className="text-sm">Preencha o formulário para começar</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor Mágico</h2>
            <form onSubmit={handleEditImage} className="space-y-6">
              
              {/* Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Carregue a imagem original
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                    {originalImage ? (
                      <img src={originalImage} alt="Original" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500"><span className="font-semibold">Clique para upload</span> ou arraste</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {originalImage && (
                       <button 
                         type="button" 
                         onClick={(e) => { e.preventDefault(); setOriginalImage(''); }}
                         className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    )}
                  </label>
                </div>
              </div>

              {/* Prompt Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2. O que você quer mudar?
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                  placeholder="Ex: Adicione um filtro retrô, remova a pessoa do fundo, mude o céu para o pôr do sol..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !originalImage}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Editando...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    Aplicar Edição
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Edit Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
             {isLoading ? (
               <div className="text-center">
                 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500 font-medium">Aplicando mágica...</p>
                 <p className="text-xs text-gray-400 mt-1">A IA está processando suas alterações.</p>
               </div>
             ) : editedImage ? (
               <div className="w-full h-full flex flex-col items-center">
                 <div className="relative group w-full flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={editedImage} 
                      alt="Editada por IA" 
                      className="max-h-[500px] w-auto object-contain shadow-lg rounded-lg"
                    />
                    <a 
                      href={editedImage} 
                      download={`menuia-edit-${Date.now()}.png`}
                      className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Baixar
                    </a>
                 </div>
                 <div className="mt-4 flex gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Instagram className="w-4 h-4" /> Edição concluída</span>
                 </div>
               </div>
             ) : (
               <div className="text-center text-gray-400">
                 <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                 <p className="text-lg font-medium">Resultado da Edição</p>
                 <p className="text-sm">O resultado aparecerá aqui após o processamento.</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};