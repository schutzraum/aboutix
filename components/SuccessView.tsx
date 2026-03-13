import React, { useEffect, useState } from 'react';
import { CheckCircle2, Home, ExternalLink } from 'lucide-react';
import { EventData } from '../types';
import { TicketPreview } from './TicketPreview';

interface SuccessViewProps {
  event: EventData;
  onGoHome: () => void;
  onGoToEvent: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ event, onGoHome, onGoToEvent }) => {
  const [confetti, setConfetti] = useState<{id: number, left: number, delay: number, color: string}[]>([]);

  useEffect(() => {
    // Generate confetti
    const colors = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  }, []);

  // Added bg-no-repeat to fix artifacts
  const gradientButtonClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-[length:200%_auto] bg-no-repeat hover:bg-right transition-all duration-500 ease-out text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95 border border-white/10";
  const secondaryButtonClass = "bg-slate-800 text-slate-300 hover:bg-slate-700 active:bg-slate-600 transition-colors border border-white/5";

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl p-6 md:p-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Confetti Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 w-2 h-2 md:w-3 md:h-3 rounded-full animate-fall"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes flip-shake {
          0% { transform: perspective(800px) rotateX(90deg); opacity: 0; }
          40% { transform: perspective(800px) rotateX(-10deg); opacity: 1; }
          60% { transform: perspective(800px) rotateX(10deg); }
          80% { transform: perspective(800px) rotateX(-5deg); }
          100% { transform: perspective(800px) rotateX(0deg); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-10px) rotateX(2deg); }
          100% { transform: translateY(0px) rotateX(0deg); }
        }
        .animate-ticket-sequence {
          animation: flip-shake 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-ticket-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-in zoom-in spin-in-12 duration-700">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Event veröffentlicht!
        </h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl">
          Dein Event wurde erfolgreich erstellt und ist nun für alle sichtbar auf <span className="text-white font-bold">aboutix</span>.
        </p>

        {/* Ticket Preview with Complex Animation Sequence */}
        <div className="w-full mb-12 perspective-1000 animate-ticket-sequence">
          <div className="animate-ticket-float">
             <TicketPreview 
              title={event.title}
              category={event.category}
              date={event.date}
              startTime={event.startTime}
              location={event.location}
              coverImage={event.coverImage}
              rotate={false}
              className="shadow-2xl w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg">
          <button 
            onClick={onGoToEvent}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center ${gradientButtonClass}`}
          >
            <ExternalLink size={20} className="mr-2" />
            Zum Event
          </button>
          
          <button 
            onClick={onGoHome}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center ${secondaryButtonClass}`}
          >
            <Home size={20} className="mr-2" />
            Startseite
          </button>
        </div>
      </div>
    </div>
  );
};