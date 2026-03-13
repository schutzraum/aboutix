import React from 'react';
import { Calendar, MapPin, Tag, ArrowLeft, Share2, Heart, Ticket, Clock, DoorOpen, Plus } from 'lucide-react';
import { EventData } from '../types';

interface EventDetailProps {
  event: EventData;
  onBack: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  const dateObj = new Date(event.date);
  // Added bg-no-repeat to fix artifacts
  const gradientButtonClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-[length:200%_auto] bg-no-repeat hover:bg-right transition-all duration-500 ease-out text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 border border-white/10";

  const categories = Array.isArray(event.category) ? event.category : [event.category];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
      >
        <ArrowLeft size={20} className="mr-2" />
        Zurück zur Übersicht
      </button>

      {/* Hero Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden shadow-2xl mb-8 group border border-white/10">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <span className="text-white/20 font-bold uppercase tracking-widest">Kein Bild</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end gap-6">
          <div className="text-white flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {categories.map((cat, idx) => (
                <span key={idx} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {cat}
                </span>
              ))}
              <span className="flex items-center text-sm font-medium text-slate-300 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar size={14} className="mr-2" />
                {dateObj.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 drop-shadow-xl">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
              <div className="flex items-center">
                 <MapPin size={18} className="mr-2 text-red-500" />
                 <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <DoorOpen size={18} className="mr-2 text-blue-500" />
                <span>Einlass: {event.doorsOpen}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-purple-500" />
                <span>Beginn: {event.startTime}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 shrink-0">
             <button className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all">
               <Share2 size={20} />
             </button>
             <button className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all">
               <Heart size={20} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-red-500 rounded-full mr-3"></span>
              Über das Event
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg font-light">
              {event.description}
            </p>
          </div>
        </div>

        {/* Sidebar / Tickets */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Ticket className="mr-3 text-red-500" />
              Tickets
            </h3>
            
            <div className="space-y-4">
              {event.tickets && event.tickets.length > 0 ? (
                event.tickets.map(ticket => (
                  <div key={ticket.id} className="bg-black/30 border border-white/5 rounded-xl p-4 hover:border-red-500/50 transition cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white group-hover:text-red-400 transition-colors">{ticket.name}</span>
                      <span className="font-black text-xl text-white">{ticket.price.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                      <span>Verfügbar: {ticket.available}</span>
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all">
                        <Plus size={14} />
                      </div>
                    </div>
                    {(ticket.salesEnd || ticket.discountType) && (
                      <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
                        {ticket.salesEnd && <div className="mb-1">Bis: {new Date(ticket.salesEnd).toLocaleString('de-DE')}</div>}
                        {ticket.discountType === 'percent' && <div>Rabatt: {ticket.discountValue}%</div>}
                        {ticket.discountType === 'fixed' && <div>Rabatt: {ticket.discountValue}€</div>}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-slate-500 bg-white/5 rounded-xl border border-white/5 italic">
                  Keine Tickets verfügbar.
                </div>
              )}
            </div>

            <button className={`w-full mt-8 py-4 rounded-xl font-bold text-lg shadow-lg ${gradientButtonClass}`}>
              Jetzt buchen
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Sichere Bezahlung via aboutix Secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};