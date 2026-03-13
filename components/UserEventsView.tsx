import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock } from 'lucide-react';
import { EventData, User } from '../types';
import { getUserEvents } from '../services/storage';

interface UserEventsViewProps {
  user: User;
  onCreateNew: () => void;
  onEditEvent: (event: EventData) => void;
  onBack: () => void;
}

export const UserEventsView: React.FC<UserEventsViewProps> = ({ user, onCreateNew, onEditEvent, onBack }) => {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    setEvents(getUserEvents(user.id));
  }, [user.id]);

  // Gradient button class reused from other components
  const gradientButtonClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-[length:200%_auto] bg-no-repeat hover:bg-right transition-all duration-500 ease-out text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95 border border-white/10";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Meine Veranstaltungen</h1>
          <p className="text-slate-400">Verwalte deine geplanten Events.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
             <button 
                onClick={onCreateNew}
                className={`px-6 py-3 rounded-xl font-bold flex items-center ${gradientButtonClass}`}
             >
                <Plus size={18} className="mr-2" />
                Neues Event
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map(event => {
            const isPast = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
            const status = isPast ? 'past' : (event.status || 'published');

            return (
            <div 
              key={event.id} 
              onClick={() => onEditEvent(event)}
              className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all flex flex-col group cursor-pointer ${isPast ? 'opacity-60 grayscale' : ''}`}
            >
               {/* Image Thumbnail */}
               <div className="w-full h-48 relative bg-slate-800 overflow-hidden shrink-0">
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Kein Bild</div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {status === 'past' && (
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-500/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        Vergangen
                      </span>
                    )}
                    {status === 'draft' && (
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-orange-500/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        Entwurf
                      </span>
                    )}
                    {status === 'published' && (
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-green-500/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        Veröffentlicht
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                     {event.category.map(cat => (
                        <span key={cat} className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                            {cat}
                        </span>
                     ))}
                  </div>
               </div>

               {/* Info */}
               <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.title}</h3>
                  <div className="space-y-2 text-slate-400 text-sm font-medium mb-6 flex-grow">
                     <div className="flex items-center">
                        <Calendar size={16} className="mr-3 text-indigo-400"/>
                        {new Date(event.date).toLocaleDateString('de-DE')}
                     </div>
                     <div className="flex items-center">
                        <Clock size={16} className="mr-3 text-indigo-400"/>
                        {event.startTime} Uhr
                     </div>
                     <div className="flex items-center">
                        <MapPin size={16} className="mr-3 text-indigo-400"/>
                        <span className="truncate">{event.location}</span>
                     </div>
                  </div>

                  {/* Stats / Action */}
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                     <div>
                        <span className="block text-xl font-black text-white leading-none">{event.tickets.reduce((acc, t) => acc + t.available, 0)}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tickets offen</span>
                     </div>
                     <button 
                       className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors flex items-center"
                     >
                        Bearbeiten <span className="ml-1 text-lg leading-none">&rarr;</span>
                     </button>
                  </div>
               </div>
            </div>
          );
        })
        ) : (
            <div className="col-span-full text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5 border-dashed">
                <p className="text-slate-500 text-lg mb-4">Du hast noch keine Veranstaltungen erstellt.</p>
                <button onClick={onCreateNew} className="text-red-400 hover:text-red-300 font-bold underline">
                    Jetzt erstes Event anlegen
                </button>
            </div>
        )}
      </div>
    </div>
  );
};