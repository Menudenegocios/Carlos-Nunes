
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  onCrop: (blob: Blob) => void;
  aspectRatio?: number;
  triggerLabel?: string;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ 
  onCrop, 
  aspectRatio = 1, 
  triggerLabel = "Upload Logo",
  className = ""
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setIsModalOpen(true);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!canvasRef.current || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400; // Final size of the logo
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    
    // Move to center to rotate
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    // Draw image centered at position
    const img = imgRef.current;
    const imgRatio = img.width / img.height;
    let drawW, drawH;
    
    if (imgRatio > 1) {
      drawH = size;
      drawW = size * imgRatio;
    } else {
      drawW = size;
      drawH = size / imgRatio;
    }

    ctx.drawImage(
      img, 
      -drawW / 2 + position.x / zoom, 
      -drawH / 2 + position.y / zoom, 
      drawW, 
      drawH
    );
    
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
        setIsModalOpen(false);
        setImage(null);
      }
    }, 'image/png');
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-indigo-300 transition-all text-[10px] font-black uppercase tracking-widest text-slate-500"
      >
        <Camera className="w-5 h-5 text-indigo-500" />
        {triggerLabel}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {isModalOpen && image && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Ajustar Imagem</h3>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Arraste e redimensione</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Preview/Crop Area */}
              <div 
                className="relative aspect-square w-full bg-slate-100 rounded-3xl overflow-hidden cursor-move border-4 border-slate-50 shadow-inner"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none z-10 flex items-center justify-center">
                   <div className="w-full h-full border border-white/40 border-dashed rounded-full"></div>
                </div>
                <img
                  ref={imgRef}
                  src={image}
                  alt="To crop"
                  className="absolute pointer-events-none origin-center transition-transform duration-75"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    maxWidth: 'none',
                    width: '100%'
                  }}
                />
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setRotation(r => r - 90)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <RotateCw className="w-4 h-4 rotate-[-90deg]" /> Rodar
                  </button>
                  <button
                    onClick={handleCrop}
                    className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Check className="w-5 h-5" /> CONCLUIR AJUSTE
                  </button>
                </div>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};
