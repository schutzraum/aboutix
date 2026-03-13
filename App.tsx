import React, { useState, useEffect } from 'react';
import { Plus, LogIn, LogOut, User as UserIcon, Menu, X, Smartphone, Zap, Calendar, UserCircle } from 'lucide-react';
import { ViewState, EventData, User, EventGroup } from './types';
import { getEvents, saveEvent, getCurrentUser, loginUser, logoutUser, seedData } from './services/storage';
import { CreateEventWizard } from './components/CreateEventWizard';
import { EventCard } from './components/EventCard';
import { EventDetail } from './components/EventDetail';
import { AdminView } from './components/AdminView';
import { LegalView } from './components/LegalView';
import { UserEventsView } from './components/UserEventsView';
import { AccountView } from './components/AccountView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [pendingEvent, setPendingEvent] = useState<Omit<EventData, 'id' | 'organizerId' | 'createdAt'> | null>(null);
  const [lastCreatedEvent, setLastCreatedEvent] = useState<EventData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    seedData();
    setEvents(getEvents());
    setUser(getCurrentUser());
  }, []);

  const handleCreateStart = () => {
    setView(ViewState.CREATE);
    setIsMenuOpen(false);
  };

  const handleCreateComplete = (eventData: Omit<EventData, 'id' | 'organizerId' | 'createdAt'>) => {
    if (view === ViewState.EDIT_EVENT && selectedEvent) {
      // Update existing event
      const updatedEvent: EventData = {
        ...eventData,
        id: selectedEvent.id,
        organizerId: selectedEvent.organizerId,
        createdAt: selectedEvent.createdAt
      };
      saveEvent(updatedEvent);
      setEvents(getEvents());
      setView(ViewState.MY_EVENTS);
    } else {
      // Create new event
      if (!user) {
        setPendingEvent(eventData);
        setView(ViewState.LOGIN);
      } else {
        finalizeEventCreation(eventData, user.id);
      }
    }
  };

  const finalizeEventCreation = (eventData: Omit<EventData, 'id' | 'organizerId' | 'createdAt'>, userId: string) => {
    const newEvent: EventData = {
      ...eventData,
      id: 'evt-' + Date.now(),
      organizerId: userId,
      createdAt: Date.now()
    };
    saveEvent(newEvent);
    setEvents(getEvents());
    setPendingEvent(null);
    setLastCreatedEvent(newEvent);
    setView(ViewState.MY_EVENTS);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      const loggedUser = loginUser(email, name);
      setUser(loggedUser);
      
      if (pendingEvent) {
        finalizeEventCreation(pendingEvent, loggedUser.id);
      } else {
        setView(ViewState.MY_EVENTS);
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setView(ViewState.HOME);
    setIsMenuOpen(false);
  };

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
    setView(ViewState.EVENT_DETAIL);
  };

  const handleEditEvent = (event: EventData) => {
    setSelectedEvent(event);
    setView(ViewState.EDIT_EVENT);
  };

  const handleMenuLinkClick = (targetView: ViewState | 'SCAN' | 'ADVANTAGES') => {
    setIsMenuOpen(false);
    if (targetView === ViewState.LOGIN) setView(ViewState.LOGIN);
    if (targetView === ViewState.MY_EVENTS) setView(ViewState.MY_EVENTS);
    if (targetView === ViewState.ACCOUNT) setView(ViewState.ACCOUNT);
    // Scan and Advantages are placeholders for now
  };

  // Group events by month
  const getGroupedEvents = (): EventGroup[] => {
    const groups: { [key: string]: EventData[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });

    return Object.keys(groups).map(key => ({
      month: key,
      events: groups[key]
    }));
  };

  // Added bg-no-repeat to fix potential tiling artifacts
  const gradientButtonClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-[length:200%_auto] bg-no-repeat hover:bg-right transition-all duration-500 ease-out text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95 border border-white/10";
  const glassCardClass = "bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl";

  return (
    <div className="min-h-screen font-sans text-slate-200 selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND EFFECTS (Dark + Wabernd Red/Blue) */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Animated Orbs Global */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-900/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Particle Success Animation Overlay */}
      {/* Removed ParticleSuccess */}

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Floating Navbar */}
        <nav className="fixed top-4 md:top-6 left-0 right-0 z-[110] w-[95%] max-w-7xl mx-auto rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300">
          <div className="px-4 md:px-8">
            <div className="flex justify-between h-16 md:h-20 items-center">
              
              {/* Left Side: Hamburger (Desktop) + Logo */}
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="hidden md:flex p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div 
                  className="flex items-center cursor-pointer group" 
                  onClick={() => setView(user ? ViewState.MY_EVENTS : ViewState.HOME)}
                >
                  <span className="text-2xl md:text-3xl font-black tracking-tighter text-white hover:tracking-wide transition-all duration-300">
                    aboutix<span className="text-red-500">.</span>
                  </span>
                </div>
              </div>
              
              {/* Right Side: Actions + Hamburger (Mobile) */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {user ? (
                  <div className="hidden md:flex items-center space-x-2 mr-2">
                    <span className="text-sm font-handwriting text-slate-400 font-medium">Eingeloggt als {user.name}</span>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={handleCreateStart}
                      className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center ${gradientButtonClass}`}
                    >
                      <Plus size={16} className="mr-1 md:mr-2" />
                      <span className="hidden md:inline">Event erstellen</span>
                      <span className="md:hidden">Neu</span>
                    </button>
                    <button 
                      onClick={() => setView(ViewState.LOGIN)}
                      className="hidden md:flex items-center text-sm font-bold text-white hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10"
                    >
                      <LogIn size={16} className="mr-2" />
                      Login
                    </button>
                  </>
                )}

                {/* Hamburger Menu Trigger (Mobile) */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Overlay for Mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden" 
            onClick={() => setIsMenuOpen(false)} 
          />
        )}

        {/* Sidebar Panel */}
        <div className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-slate-900/95 backdrop-blur-3xl border-r border-white/10 z-[100] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-6 pt-32 flex flex-col h-full overflow-y-auto">
              <div className="space-y-6 flex-grow">
                {user ? (
                  <>
                    <button onClick={() => handleMenuLinkClick(ViewState.MY_EVENTS)} className="group flex items-center gap-4 text-lg font-bold text-white hover:text-red-400 transition-colors w-full text-left">
                      <Calendar className="text-slate-500 group-hover:text-red-400 transition-colors" size={24} />
                      Meine Veranstaltungen
                    </button>
                    <button onClick={() => handleMenuLinkClick(ViewState.ACCOUNT)} className="group flex items-center gap-4 text-lg font-bold text-white hover:text-red-400 transition-colors w-full text-left">
                      <UserCircle className="text-slate-500 group-hover:text-red-400 transition-colors" size={24} />
                      Mein Konto
                    </button>
                    <div className="pt-6 mt-6 border-t border-white/10">
                      <button onClick={handleLogout} className="group flex items-center gap-4 text-lg font-bold text-slate-500 hover:text-red-500 transition-colors w-full text-left">
                        <LogOut className="text-slate-500 group-hover:text-red-500 transition-colors" size={24} />
                        Ausloggen
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleMenuLinkClick('ADVANTAGES')} className="group flex items-center gap-4 text-lg font-bold text-white hover:text-red-400 transition-colors w-full text-left">
                      <Zap className="text-slate-500 group-hover:text-red-400 transition-colors" size={24} />
                      Vorteile für Veranstalter
                    </button>
                    <button onClick={() => handleMenuLinkClick('SCAN')} className="group flex items-center gap-4 text-lg font-bold text-white hover:text-red-400 transition-colors w-full text-left">
                      <Smartphone className="text-slate-500 group-hover:text-red-400 transition-colors" size={24} />
                      Ticket-Scan App
                    </button>
                    <div className="pt-6 mt-6 border-t border-white/10">
                      <button onClick={() => handleMenuLinkClick(ViewState.LOGIN)} className="group flex items-center gap-4 text-lg font-bold text-white hover:text-red-400 transition-colors w-full text-left">
                        <LogIn className="text-slate-500 group-hover:text-red-400 transition-colors" size={24} />
                        Login & Registrierung
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-auto pt-8 text-slate-600 text-xs font-mono">
                aboutix platform &copy; {new Date().getFullYear()}
              </div>
           </div>
        </div>

        {/* Main Content - Added top padding to account for fixed navbar */}
        <main className="flex-grow pt-32">
          
          {/* HOME VIEW */}
          {view === ViewState.HOME && !user && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Hero Section */}
              <div className="relative text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 py-10">
                
                {/* HERO SPECIFIC BACKGROUND BLOBS */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-red-600/20 blur-[80px] rounded-full -z-10 animate-[pulse_6s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[40%] w-[300px] md:w-[500px] h-[300px] md:h-[400px] bg-blue-600/20 blur-[80px] rounded-full -z-10 animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight relative z-10">
                  Deine Bühne.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-gradient-x">
                    Ohne Grenzen.
                  </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
                  Erstelle Events in Sekunden mit der Power von KI. 
                  Teile deine Leidenschaft auf <span className="text-white font-bold">aboutix</span>.
                </p>
                
                {/* Only show "Start" button in Hero if NOT logged in, or generic CTA */}
                <div className="flex justify-center gap-4 relative z-10">
                   <button 
                      onClick={handleCreateStart}
                      className={`px-8 py-4 rounded-full text-lg font-bold ${gradientButtonClass}`}
                    >
                      Jetzt Event starten
                   </button>
                </div>
              </div>

              {/* Event List */}
              <div className="space-y-16">
                {getGroupedEvents().length > 0 ? (
                  getGroupedEvents().map((group) => (
                    <div key={group.month} className="animate-in fade-in duration-700">
                      <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4 flex items-center">
                        {group.month}
                      </h2>
                      {/* Grid Layout: Max 2 columns for larger tiles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {group.events.map(event => (
                          <div key={event.id} className="h-full">
                            <EventCard event={event} onClick={handleEventClick} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-20 rounded-3xl ${glassCardClass}`}>
                    <p className="text-slate-400 text-lg mb-4">Noch keine Events geplant.</p>
                    <button 
                      onClick={handleCreateStart}
                      className="text-red-400 font-bold hover:text-red-300 underline"
                    >
                      Sei der Erste!
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREATE EVENT WIZARD */}
          {view === ViewState.CREATE && (
            <div className="w-[95%] max-w-7xl mx-auto px-4 py-8 relative z-10">
              <CreateEventWizard 
                onComplete={handleCreateComplete} 
                onCancel={() => setView(user ? ViewState.MY_EVENTS : ViewState.HOME)} 
              />
            </div>
          )}

          {/* EDIT EVENT WIZARD */}
          {view === ViewState.EDIT_EVENT && selectedEvent && (
            <div className="w-[95%] max-w-7xl mx-auto px-4 py-8 relative z-10">
              <CreateEventWizard 
                initialData={selectedEvent}
                onComplete={handleCreateComplete} 
                onCancel={() => setView(ViewState.MY_EVENTS)} 
              />
            </div>
          )}

          {/* EVENT DETAIL VIEW */}
          {view === ViewState.EVENT_DETAIL && selectedEvent && (
            <div className="max-w-7xl mx-auto px-4 py-4">
              <EventDetail 
                event={selectedEvent} 
                onBack={() => setView(ViewState.HOME)} 
              />
            </div>
          )}

          {/* ADMIN VIEW */}
          {view === ViewState.ADMIN && (
             <AdminView onBack={() => setView(ViewState.HOME)} />
          )}

          {/* USER EVENTS VIEW */}
          {(view === ViewState.MY_EVENTS || (view === ViewState.HOME && user)) && user && (
             <UserEventsView 
                user={user} 
                onCreateNew={handleCreateStart}
                onEditEvent={handleEditEvent}
                onBack={() => setView(ViewState.HOME)}
             />
          )}

          {/* USER ACCOUNT VIEW */}
          {view === ViewState.ACCOUNT && user && (
             <AccountView 
                user={user} 
                onLogout={handleLogout}
                onBack={() => setView(ViewState.HOME)}
             />
          )}

          {/* IMPRESSUM VIEW */}
          {view === ViewState.IMPRESSUM && (
            <LegalView title="Impressum" type="IMPRESSUM" onBack={() => setView(ViewState.HOME)} />
          )}

          {/* AGB VIEW */}
          {view === ViewState.AGB && (
            <LegalView title="Allgemeine Geschäftsbedingungen" type="AGB" onBack={() => setView(ViewState.HOME)} />
          )}

          {/* LOGIN / REGISTER VIEW */}
          {view === ViewState.LOGIN && (
            <div className="relative flex items-center justify-center min-h-[60vh] px-4 py-12">
              {/* Blurred Background Image */}
              {pendingEvent?.coverImage && (
                <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
                    style={{ backgroundImage: `url(${pendingEvent.coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-black/80" />
                </div>
              )}

              <div className={`relative z-10 p-8 rounded-3xl w-full max-w-sm animate-in zoom-in-95 duration-500 ${glassCardClass}`}>
                <div className="text-center mb-6">
                   {/* Ticket Pictogram */}
                   <div className="relative group inline-block mb-4 cursor-pointer">
                     {/* Energetic Color Fade Background (Hover) */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-purple-500 to-blue-500 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out" />
                     
                     {/* Ticket Shape */}
                     <div className="relative w-36 h-16 bg-[#1a1a1a] border border-white/10 rounded-xl flex shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 overflow-hidden">
                       {/* Image */}
                       <div 
                         className="w-12 h-full bg-cover bg-center border-r border-white/5 shrink-0"
                         style={{ backgroundImage: `url(${pendingEvent?.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'})` }}
                       />
                       {/* Content (Gray Bars) */}
                       <div className="flex-1 p-2 flex flex-col gap-1.5 justify-center bg-gradient-to-r from-white/5 to-transparent">
                         <div className="w-full h-1 bg-white/20 rounded-full" />
                         <div className="w-3/4 h-1 bg-white/20 rounded-full" />
                         <div className="w-1/2 h-1 bg-white/10 rounded-full mt-auto" />
                       </div>
                       
                       {/* Ticket Notches */}
                       <div className="absolute -top-1.5 left-[42px] w-3 h-3 bg-black rounded-full border border-white/10" />
                       <div className="absolute -bottom-1.5 left-[42px] w-3 h-3 bg-black rounded-full border border-white/10" />
                     </div>
                   </div>

                   <h2 className="text-2xl font-bold text-white">
                      {user ? 'Mein Profil' : 'Event managen'}
                   </h2>
                   <p className="text-slate-400 mt-2 text-sm">
                     {user ? 'Du bist bereits eingeloggt.' : 'Registriere dich, um dein Event zu verwalten und erfolgreich zu veröffentlichen.'}
                   </p>
                </div>
                
                {user ? (
                   <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 text-center border border-white/5">
                        <div className="text-xl font-bold text-white mb-1">{user.name}</div>
                        <div className="text-slate-500 text-sm">{user.email}</div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full py-4 rounded-xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-colors text-white"
                      >
                        Abmelden
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setView(ViewState.HOME)}
                        className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                      >
                        Zurück zur Startseite
                      </button>
                   </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        placeholder="Dein Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        placeholder="deine@email.com"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className={`w-full py-4 rounded-xl font-bold text-lg mt-4 ${gradientButtonClass}`}
                    >
                      Registrieren / Login
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setView(ViewState.HOME)}
                      className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                    >
                      Abbrechen
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </main>

        <footer className="mt-20 border-t border-white/5 bg-black/80 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
               <button onClick={() => setView(ViewState.IMPRESSUM)} className="text-slate-500 hover:text-white transition-colors">Impressum</button>
               <button onClick={() => setView(ViewState.AGB)} className="text-slate-500 hover:text-white transition-colors">AGB</button>
               <button onClick={() => setView(ViewState.ADMIN)} className="text-slate-500 hover:text-red-500 transition-colors">Admin</button>
            </div>
            <p className="text-slate-600 text-sm mb-2">&copy; {new Date().getFullYear()} aboutix. All rights reserved.</p>
            <p className="text-slate-700 text-xs">Made with AI.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;