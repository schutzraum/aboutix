import React from 'react';
import { MapPin, Tag, Clock } from 'lucide-react';
import { EventData } from '../types';

interface EventCardProps {
  event: EventData;
  onClick: (event: EventData) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const monthShort = dateObj.toLocaleString('de-DE', { month: 'short' });

  // Handle category display
  const categoryDisplay = Array.isArray(event.category) 
    ? event.category.join(' • ') 
    : event.category;

  return (
    <div 
      onClick={() => onClick(event)}
      className="group bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 cursor-pointer flex flex-col md:flex-row h-full overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:rotate-1 hover:border-indigo-500/30"
    >
      {/* Date Badge Mobile / Visual Element. Width w-64 for balance */}
      <div className="relative md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-600">Kein Bild</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg p-2 text-center min-w-[60px] border border-white/10 shadow-lg">
          <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest">{monthShort}</span>
          <span className="block text-2xl font-black text-white">{day}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between flex-grow min-w-0">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-3 truncate">
            <Tag size={12} className="shrink-0" />
            <span className="truncate">{categoryDisplay}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">
            {event.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5 whitespace-nowrap" title={`Einlass: ${event.doorsOpen}`}>
              <Clock size={15} className="shrink-0 text-slate-500" />
              <span>{event.startTime} Uhr</span>
            </div>
            <div className="flex items-center space-x-1.5 min-w-0">
              <MapPin size={15} className="shrink-0 text-slate-500" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};