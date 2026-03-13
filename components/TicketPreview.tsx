import React, { useRef, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';

interface TicketPreviewProps {
  title: string;
  category: string[];
  date: string;
  startTime: string;
  location: string;
  coverImage: string | null;
  className?: string;
  rotate?: boolean;
}

export const TicketPreview: React.FC<TicketPreviewProps> = ({ 
  title, 
  category, 
  date, 
  startTime, 
  location, 
  coverImage, 
  className = "",
  rotate = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const formatDatePreview = (dateStr: string) => {
    if (!dateStr) return "DD.MM.YYYY";
    return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const categoryDisplay = category && category.length > 0 ? category.join(' & ') : "KATEGORIE";

  const getTitleSizeClass = (text: string) => {
    const len = text.length;
    if (len < 10) return 'text-2xl md:text-3xl lg:text-4xl';
    if (len < 20) return 'text-xl md:text-2xl lg:text-3xl';
    if (len < 35) return 'text-lg md:text-xl lg:text-2xl';
    if (len < 50) return 'text-base md:text-lg lg:text-xl';
    return 'text-sm md:text-base lg:text-lg';
  };

  const titleSizeClass = getTitleSizeClass(title || "");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
    cardRef.current.style.setProperty('--px', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--py', `${(y / rect.height) * 100}%`);
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', `0deg`);
    cardRef.current.style.setProperty('--ry', `0deg`);
    cardRef.current.style.setProperty('--px', `50%`);
    cardRef.current.style.setProperty('--py', `50%`);
  };

  // Base transform logic
  const transformStyle = isHovering 
    ? 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(1.02, 1.02, 1.02)' 
    : (rotate ? 'perspective(1000px) rotate(1deg)' : 'perspective(1000px)');

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-[21/9] bg-slate-900 rounded-xl shadow-2xl flex overflow-hidden border border-slate-700 shrink-0 ticket-3d-wrapper ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Styles for Holo Effect */}
      <style>
        {`
          .ticket-3d-wrapper {
            --holo-opacity: 0;
            --watermark-opacity: 0;
          }
          .ticket-3d-wrapper:hover {
            --holo-opacity: 0.6;
            --watermark-opacity: 1;
          }
          .holo-glare {
            position: absolute;
            inset: 0;
            background-image: linear-gradient(
              125deg,
              rgba(255,255,255, 0) 30%,
              rgba(255,255,255, 0.1) 40%,
              rgba(255,255,255, 0.3) 50%,
              rgba(255,255,255, 0.1) 60%,
              rgba(255,255,255, 0) 70%
            );
            background-size: 250% 250%;
            background-position: var(--px, 50%) var(--py, 50%);
            mix-blend-mode: overlay;
            z-index: 40;
            pointer-events: none;
            opacity: var(--holo-opacity);
            transition: opacity 0.3s ease;
            transform: translateZ(30px);
          }
          .holo-shimmer {
            position: absolute;
            inset: 0;
            background-image: linear-gradient(
              115deg,
              transparent 20%,
              rgba(255, 0, 128, 0.2) 30%,
              rgba(128, 0, 255, 0.2) 40%,
              rgba(0, 200, 255, 0.2) 50%,
              rgba(128, 255, 0, 0.2) 60%,
              rgba(255, 128, 0, 0.2) 70%,
              transparent 80%
            );
            background-size: 300% 300%;
            background-position: calc(100% - var(--px, 50%)) calc(100% - var(--py, 50%));
            mix-blend-mode: color-dodge;
            z-index: 41;
            pointer-events: none;
            opacity: var(--holo-opacity);
            transition: opacity 0.3s ease;
            transform: translateZ(40px);
          }
          .holo-watermark {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 15;
            pointer-events: none;
            font-weight: 900;
            font-style: italic;
            letter-spacing: 0.1em;
            color: transparent;
            background-image: linear-gradient(
              125deg,
              rgba(255, 255, 255, 0.01) 35%,
              rgba(255, 255, 255, 0.06) 50%,
              rgba(255, 255, 255, 0.01) 65%
            );
            background-size: 200% 200%;
            background-position: var(--px, 50%) var(--py, 50%);
            -webkit-background-clip: text;
            background-clip: text;
            opacity: var(--watermark-opacity);
            transition: opacity 0.3s ease;
            transform: translateZ(20px);
          }
        `}
      </style>

      {/* Left Side (Image) */}
      <div className="w-1/3 h-full relative bg-slate-800 border-r border-dashed border-slate-700 shrink-0">
        {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
            <div className={`w-full h-full bg-slate-800 flex flex-col items-center justify-center p-2 text-center`}>
              <span className="text-[8px] md:text-[10px] lg:text-xs text-slate-600 uppercase tracking-widest font-bold">Teaser Bild</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 lg:bottom-6 lg:left-6 text-white">
          <p className="text-[8px] md:text-[10px] lg:text-xs uppercase tracking-wider font-bold opacity-60 text-indigo-300 mb-0.5">Datum</p>
          <p className="font-mono font-bold text-sm md:text-base lg:text-lg text-white">{formatDatePreview(date)}</p>
        </div>
      </div>

      {/* Right Side (Content) */}
      <div className="w-2/3 h-full flex flex-col justify-between relative bg-slate-900 overflow-hidden">
          
          {/* Content Area - Top Part (Category & Title) */}
          <div className="w-full px-4 md:px-6 lg:px-8 pt-3 md:pt-4 lg:pt-6 text-right flex flex-col items-end">
              <span className="inline-block px-2 py-0.5 rounded-[4px] text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 mb-1 md:mb-2 border border-indigo-500/20 truncate max-w-full">
                {categoryDisplay}
              </span>
              
              {/* Title Container with strict wrapping */}
              <div className="w-full relative">
                 <h3 className={`font-black text-white leading-[0.9] uppercase line-clamp-2 break-words text-right w-full ${titleSizeClass}`}>
                  {title || "EVENT NAME"}
                </h3>
              </div>
          </div>

          {/* Content Area - Bottom Part (Time & Location & Barcode) */}
          <div className="w-full px-4 md:px-6 lg:px-8 pb-3 md:pb-4 lg:pb-6 flex justify-between items-end">
              {/* Time and Location */}
              <div className="flex flex-col items-start space-y-1 md:space-y-2">
                  <div className="flex items-center text-[10px] md:text-xs lg:text-sm text-slate-400 font-mono">
                    <Clock className="mr-1.5 md:mr-2 text-indigo-500 w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                    <span>{startTime || "--:--"} Uhr</span>
                  </div>
                  <div className="flex items-center text-[10px] md:text-xs lg:text-sm text-slate-400 font-mono">
                    <MapPin className="mr-1.5 md:mr-2 text-indigo-500 w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                    <span className="truncate max-w-[100px] md:max-w-[140px] lg:max-w-[180px] text-left">{location || "Ort"}</span>
                  </div>
              </div>

              {/* Barcode */}
              <div className="flex items-end h-6 md:h-8 lg:h-10 opacity-60 gap-[1px] md:gap-[2px]">
                 {[1,3,1,2,1,4,1,2,2,1,3,1,1,2,4,1,2,1,3,2,1].map((w, i) => (
                    <div key={i} className="bg-white h-full" style={{ width: `${w * 1.5}px` }}></div>
                 ))}
              </div>
          </div>
      </div>

      {/* Holographic Overlays & Watermark (Rendered last to be on top) */}
      <div className="holo-watermark text-5xl md:text-7xl lg:text-8xl">ABOUTIX</div>
      <div className="holo-glare rounded-xl"></div>
      <div className="holo-shimmer rounded-xl"></div>
    </div>
  );
};
