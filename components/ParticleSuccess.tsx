import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

interface ParticleSuccessProps {
  onComplete: () => void;
}

export const ParticleSuccess: React.FC<ParticleSuccessProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#ef4444', '#3b82f6', '#a855f7']; // Red, Blue, Purple
    const maxDist = Math.max(canvas.width, canvas.height);

    // Create particles
    for (let i = 0; i < 2000; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * maxDist * 1.2 + 100, // Start outside
        speed: Math.random() * 6 + 2, // Speed moving inward
        // Uniform direction (positive) but varying individual speeds for organic feel
        spinSpeed: Math.random() * 0.03 + 0.01, 
        // 70% smaller (multiply by 0.3)
        size: (Math.random() * 3 + 1) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        blinkSpeed: Math.random() * 0.1 + 0.05,
        opacity: Math.random()
      });
    }

    let animationFrame: number;
    let startTime: number | null = null;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate global fade (starts at 3.5s, ends at 5s)
      let globalFade = 1;
      if (elapsed > 3500) {
        globalFade = Math.max(0, 1 - (elapsed - 3500) / 1500);
      }

      particles.forEach(p => {
        // Spiral inward
        p.distance = Math.max(0, p.distance - p.speed);
        
        // Spin faster as it gets closer to the center
        const currentSpin = p.spinSpeed * (1 + (maxDist - p.distance) / maxDist);
        p.angle += currentSpin;
        
        const x = canvas.width / 2 + Math.cos(p.angle) * p.distance;
        const y = canvas.height / 2 + Math.sin(p.angle) * p.distance;

        // Blinking
        p.opacity += p.blinkSpeed;
        const currentOpacity = ((Math.sin(p.opacity) + 1) / 2) * globalFade;

        if (currentOpacity > 0.01) {
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentOpacity;
            ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;

      if (elapsed < 5000) {
        animationFrame = requestAnimationFrame(render);
      } else {
        // Ensure it's completely black at the end
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrame = requestAnimationFrame(render);

    // Show checkmark at 4 seconds (during the fade)
    const checkTimeout = setTimeout(() => {
      setShowCheck(true);
    }, 4000);

    // Complete animation after 6.5 seconds (gives 1.5s to see the checkmark clearly)
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(checkTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <style>{`
        @keyframes fancyBlurIn {
          0% { filter: blur(24px); opacity: 0; transform: scale(0.85); }
          50% { filter: blur(8px); opacity: 0.8; transform: scale(1.02); }
          100% { filter: blur(0px); opacity: 1; transform: scale(1); }
        }
        .animate-fancy-blur-in {
          animation: fancyBlurIn 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {showCheck && (
        <div className="relative z-10 flex flex-col items-center animate-fancy-blur-in">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.6)] mb-6">
            <Check size={64} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
            Event angelegt
          </h2>
        </div>
      )}
    </div>
  );
};
