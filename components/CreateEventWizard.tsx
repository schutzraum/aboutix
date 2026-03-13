import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Upload, ArrowRight, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, X, Calendar, MapPin, Tag as TagIcon, Check } from 'lucide-react';
import { EventData, TicketProduct } from '../types';
import { generateEventDescription, generateEventImage } from '../services/gemini';
import { generateDefaultImages } from '../services/defaults';
import { TicketPreview } from './TicketPreview';

interface CreateEventWizardProps {
  onComplete: (event: Omit<EventData, 'id' | 'organizerId' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: EventData | null;
}

export const CreateEventWizard: React.FC<CreateEventWizardProps> = ({ onComplete, onCancel, initialData }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const topRef = useRef<HTMLDivElement>(null);
  
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  
  // Custom image prompt state
  const [customCoverPrompt, setCustomCoverPrompt] = useState("");
  const [showCoverPrompt, setShowCoverPrompt] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || [] as string[],
    location: initialData?.location || '',
    date: initialData?.date || '',
    doorsOpen: initialData?.doorsOpen || '',
    startTime: initialData?.startTime || '',
    keywords: '', // "K.I. Anweisungen"
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || '',
    tickets: initialData?.tickets || [] as TicketProduct[],
    status: initialData?.status || 'draft'
  });

  const [newTicket, setNewTicket] = useState({ 
    name: '', 
    price: '', 
    amount: '',
    salesEnd: '',
    discountType: 'none' as 'none' | 'percent' | 'fixed',
    discountValue: ''
  });
  const [showAdvancedTicket, setShowAdvancedTicket] = useState(false);

  const categories = ['Musik', 'Technologie', 'Kunst', 'Party', 'Essen', 'Sport & Streaming', 'Diskussion & Debatten', 'Sonstiges'];

  // Scroll to top on step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  // Generate default images when category changes
  useEffect(() => {
    if (formData.category.length > 0 && !formData.coverImage) {
      const defaults = generateDefaultImages(formData.category);
      setFormData(prev => ({ ...prev, coverImage: defaults.cover }));
    }
  }, [formData.category]);

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = () => {
    switch(step) {
      case 1: return formData.title && formData.category.length > 0;
      case 2: return formData.date && formData.doorsOpen && formData.startTime;
      case 3: return formData.location;
      case 4: return formData.description;
      case 5: return true; // Image is optional or default
      case 6: return formData.tickets.length > 0;
      default: return false;
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
        const isSelected = prev.category.includes(cat);
        if (isSelected) {
            return { ...prev, category: prev.category.filter(c => c !== cat) };
        } else {
            return { ...prev, category: [...prev.category, cat] };
        }
    });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || formData.category.length === 0) return;
    setLoadingText(true);
    try {
      const desc = await generateEventDescription(formData.title, formData.category, formData.keywords);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.title || formData.category.length === 0) return;
    setLoadingImage(true);
    try {
      const img = await generateEventImage(formData.title, formData.category, formData.keywords, customCoverPrompt);
      setFormData(prev => ({ ...prev, coverImage: img }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleAddTicket = () => {
    if (newTicket.name && newTicket.price && newTicket.amount) {
      const ticket: TicketProduct = {
        id: Date.now().toString(),
        name: newTicket.name,
        price: parseFloat(newTicket.price),
        currency: 'EUR',
        available: parseInt(newTicket.amount),
        salesEnd: newTicket.salesEnd || null,
        discountType: newTicket.discountType !== 'none' ? newTicket.discountType : null,
        discountValue: newTicket.discountValue ? parseFloat(newTicket.discountValue) : null
      };
      setFormData(prev => ({ ...prev, tickets: [...prev.tickets, ticket] }));
      setNewTicket({ name: '', price: '', amount: '', salesEnd: '', discountType: 'none', discountValue: '' });
      setShowAdvancedTicket(false);
    }
  };

  const handleRemoveTicket = (id: string) => {
    setFormData(prev => ({ ...prev, tickets: prev.tickets.filter(t => t.id !== id) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Added bg-no-repeat to fix artifacts
  const gradientButtonClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-[length:200%_auto] bg-no-repeat hover:bg-right transition-all duration-500 ease-out text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95 border border-white/10";
  const secondaryButtonClass = "bg-slate-800 text-slate-300 hover:bg-slate-700 active:bg-slate-600 transition-colors border border-white/5";
  const inputClass = "w-full p-4 text-lg bg-black/50 border border-white/10 rounded-2xl focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition text-white placeholder:text-slate-600";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div ref={topRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
           <h2 className="text-2xl font-black text-white">Event erstellen</h2>
           <span className="text-slate-500 font-mono text-sm">Schritt {step} / {totalSteps}</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Form Section (Left 1/2) */}
        <div className="order-2 lg:order-1 space-y-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl w-full lg:w-1/2">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Worum geht es?</h3>
              <div>
                <label className={labelClass}>Event Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className={inputClass}
                  placeholder="z.B. Neon Future Night"
                  autoFocus
                />
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                    <label className={labelClass}>Kategorie</label>
                    <span className="text-xs text-slate-500 italic">(Mehrere möglich)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => {
                    const isSelected = formData.category.includes(cat);
                    return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all text-left flex justify-between items-center ${
                            isSelected 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                            : 'bg-black/30 text-slate-400 border border-white/5 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check size={16} />}
                        </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Wann findet es statt?</h3>
              <div>
                <label className={labelClass}>Datum</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelClass}>Einlass</label>
                   <input
                    type="time"
                    value={formData.doorsOpen}
                    onChange={e => setFormData({...formData, doorsOpen: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                   <label className={labelClass}>Beginn</label>
                   <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
               <h3 className="text-xl font-bold text-white mb-4">Wo findet es statt?</h3>
               <div>
                <label className={labelClass}>Veranstaltungsort</label>
                 <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className={`${inputClass} pl-12`}
                    placeholder="Stadt, Location Name"
                    autoFocus
                  />
                 </div>
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Details & KI-Text</h3>
                
                {/* AI Instructions Field with Animated Border */}
                <div className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] animate-gradient-xy">
                  <div className="bg-slate-900 rounded-2xl p-1">
                    <label className="block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400 uppercase tracking-wider mb-2 ml-2 mt-2">
                       <Sparkles size={12} className="inline mr-1 text-purple-400" />
                       K.I. Anweisungen
                    </label>
                    <textarea
                      value={formData.keywords}
                      onChange={e => setFormData({...formData, keywords: e.target.value})}
                      className="w-full p-3 bg-transparent text-white placeholder:text-slate-600 outline-none resize-none h-20 rounded-xl"
                      placeholder="Beschreibe dein Event grob (z.B. Techno Party, düster, Berlin Vibes...)"
                    />
                  </div>
                </div>

                <div>
                   <div className="flex justify-between items-end mb-2">
                      <label className={labelClass}>Beschreibung</label>
                      <button 
                        onClick={handleGenerateDescription}
                        disabled={loadingText}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center transition-colors"
                      >
                         {loadingText ? <Loader2 size={12} className="animate-spin mr-1"/> : <RefreshCw size={12} className="mr-1"/>}
                         KI Generieren
                      </button>
                   </div>
                   <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className={`${inputClass} h-40 resize-none leading-relaxed`}
                    placeholder="Detaillierte Eventbeschreibung..."
                  />
                </div>
             </div>
          )}

          {step === 5 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Visuals (Teaser-Bild)</h3>
                
                <div className="space-y-4">
                  {/* Custom Prompt Toggle */}
                  <button 
                    onClick={() => setShowCoverPrompt(!showCoverPrompt)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-300 flex items-center"
                  >
                     {showCoverPrompt ? <ChevronUp size={14} className="mr-1"/> : <ChevronDown size={14} className="mr-1"/>}
                     Genauere Anweisung geben
                  </button>
                  
                  {showCoverPrompt && (
                    <div className="animate-in slide-in-from-top-2">
                      <textarea
                        value={customCoverPrompt}
                        onChange={e => setCustomCoverPrompt(e.target.value)}
                        className={`${inputClass} text-sm h-24`}
                        placeholder="Z.B.: Eine futuristische Stadt bei Nacht, neonpinke Lichter, 3D Clay Style..."
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button
                      onClick={handleGenerateImage}
                      disabled={loadingImage}
                      className={`flex-1 py-4 rounded-xl flex items-center justify-center font-bold text-sm ${loadingImage ? 'opacity-70 cursor-not-allowed' : ''} ${secondaryButtonClass} bg-slate-800 border-indigo-500/30 text-indigo-300 hover:bg-slate-700`}
                     >
                       {loadingImage ? <Loader2 size={18} className="animate-spin mr-2"/> : <Sparkles size={18} className="mr-2 text-purple-400"/>}
                       KI Bild Erstellen
                     </button>
                     <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button className={`w-full h-full py-4 rounded-xl flex items-center justify-center font-bold text-sm ${secondaryButtonClass}`}>
                          <Upload size={18} className="mr-2"/>
                          Eigenes Bild
                        </button>
                     </div>
                  </div>
                </div>
             </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
               <h3 className="text-xl font-bold text-white mb-4">Tickets</h3>
               
               <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <input
                      type="text"
                      value={newTicket.name}
                      onChange={e => setNewTicket({...newTicket, name: e.target.value})}
                      className={inputClass}
                      placeholder="Ticket Name (z.B. Standard)"
                    />
                     <input
                      type="number"
                      value={newTicket.price}
                      onChange={e => setNewTicket({...newTicket, price: e.target.value})}
                      className={inputClass}
                      placeholder="Preis (€)"
                    />
                  </div>
                  <div className="flex gap-4">
                     <input
                      type="number"
                      value={newTicket.amount}
                      onChange={e => setNewTicket({...newTicket, amount: e.target.value})}
                      className={inputClass}
                      placeholder="Anzahl verfügbar"
                    />
                    <button 
                      onClick={handleAddTicket}
                      disabled={!newTicket.name || !newTicket.price || !newTicket.amount}
                      className="bg-white text-black font-bold px-6 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>

                  {/* Advanced Options Toggle */}
                  <button 
                    onClick={() => setShowAdvancedTicket(!showAdvancedTicket)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-300 flex items-center mt-2"
                  >
                     {showAdvancedTicket ? <ChevronUp size={14} className="mr-1"/> : <ChevronDown size={14} className="mr-1"/>}
                     Weitere Informationen
                  </button>
                  
                  {showAdvancedTicket && (
                    <div className="animate-in slide-in-from-top-2 space-y-4 pt-2 border-t border-white/5 mt-2">
                       <div>
                         <label className={labelClass}>Verkaufsende</label>
                         <input
                           type="datetime-local"
                           value={newTicket.salesEnd}
                           onChange={e => setNewTicket({...newTicket, salesEnd: e.target.value})}
                           className={inputClass}
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className={labelClass}>Rabatt Art</label>
                           <select
                             value={newTicket.discountType}
                             onChange={e => setNewTicket({...newTicket, discountType: e.target.value as any})}
                             className={inputClass}
                           >
                             <option value="none">Kein Rabatt</option>
                             <option value="percent">Prozent (%)</option>
                             <option value="fixed">Euro (€)</option>
                           </select>
                         </div>
                         <div>
                           <label className={labelClass}>Rabatt Wert</label>
                           <input
                             type="number"
                             value={newTicket.discountValue}
                             onChange={e => setNewTicket({...newTicket, discountValue: e.target.value})}
                             className={inputClass}
                             placeholder={newTicket.discountType === 'percent' ? '%' : '€'}
                             disabled={newTicket.discountType === 'none'}
                           />
                         </div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="space-y-3 mt-6">
                 {formData.tickets.map(ticket => (
                   <div key={ticket.id} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                      <div>
                        <div className="font-bold text-white">{ticket.name}</div>
                        <div className="text-sm text-slate-500">{ticket.available} Stück verfügbar</div>
                        {(ticket.salesEnd || ticket.discountType) && (
                          <div className="text-xs text-slate-400 mt-1">
                            {ticket.salesEnd && <span>Bis: {new Date(ticket.salesEnd).toLocaleString('de-DE')} </span>}
                            {ticket.discountType === 'percent' && <span>| Rabatt: {ticket.discountValue}%</span>}
                            {ticket.discountType === 'fixed' && <span>| Rabatt: {ticket.discountValue}€</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-mono font-bold text-indigo-400">{ticket.price.toFixed(2)} €</div>
                        <button onClick={() => handleRemoveTicket(ticket.id)} className="text-red-500 hover:text-red-400">
                          <X size={18} />
                        </button>
                      </div>
                   </div>
                 ))}
                 {formData.tickets.length === 0 && (
                   <div className="text-center text-slate-500 py-4 italic">Noch keine Tickets angelegt.</div>
                 )}
               </div>
            </div>
          )}

          {/* Navigation */}
          <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center sticky bottom-0 bg-slate-900/95 backdrop-blur-xl p-4 -mx-4 -mb-4 rounded-b-3xl md:bg-transparent md:backdrop-blur-none md:p-0 md:static md:mx-0 md:mb-0">
             {step > 1 ? (
               <button onClick={handleBack} className="text-slate-400 font-bold hover:text-white flex items-center px-4 py-2">
                 <ArrowLeft size={18} className="mr-2"/> Zurück
               </button>
             ) : (
                <button onClick={onCancel} className="text-slate-500 font-bold hover:text-white px-4 py-2">
                  Abbrechen
                </button>
             )}

             {step < totalSteps ? (
               <button 
                onClick={handleNext} 
                disabled={!validateStep()}
                className={`px-6 py-3 rounded-full font-bold flex items-center ${validateStep() ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
               >
                 Weiter <ArrowRight size={18} className="ml-2"/>
               </button>
             ) : (
               <div className="flex gap-4">
                 <button 
                  onClick={() => onComplete({...formData, status: 'draft'})}
                  disabled={!validateStep()}
                  className={`px-6 py-3 rounded-full font-bold flex items-center shadow-lg ${validateStep() ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                 >
                   Als Entwurf speichern
                 </button>
                 <button 
                  onClick={() => onComplete({...formData, status: 'published'})}
                  disabled={!validateStep()}
                  className={`px-8 py-3 rounded-full font-bold flex items-center shadow-lg ${validateStep() ? gradientButtonClass : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                 >
                   {initialData ? 'Änderungen veröffentlichen' : 'Event veröffentlichen'} <Sparkles size={18} className="ml-2"/>
                 </button>
               </div>
             )}
          </div>

        </div>

        {/* Live Preview (Right 1/2) */}
        <div className="w-full lg:w-1/2 perspective-1000 order-1 lg:order-2">
           <div className="sticky top-24 transform transition-all duration-700 hover:scale-[1.02] w-full">
              <TicketPreview
                title={formData.title}
                category={formData.category}
                date={formData.date}
                startTime={formData.startTime}
                location={formData.location}
                coverImage={formData.coverImage}
                rotate={true}
                className="w-full max-w-none" // Force full width and override default max-w
              />
              <div className="mt-4 text-center">
                 <p className="text-slate-500 text-xs italic">
                    Live Vorschau deines Event-Tickets
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};