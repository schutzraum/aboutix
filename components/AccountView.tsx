import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface AccountViewProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ user, onLogout, onBack }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
           <UserIcon size={48} className="text-slate-300" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2">{user.name}</h1>
        <p className="text-slate-400 mb-8">{user.email}</p>

        <div className="space-y-4">
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">User ID</p>
                <p className="text-slate-300 font-mono text-sm truncate">{user.id}</p>
             </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <button 
                onClick={onLogout}
                className="w-full py-4 rounded-xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-center border border-transparent hover:border-red-500/20"
            >
                <LogOut size={20} className="mr-2"/>
                Ausloggen
            </button>
            <button 
                onClick={onBack}
                className="text-slate-500 hover:text-white text-sm font-medium transition-colors"
            >
                Zurück zur Übersicht
            </button>
        </div>
      </div>
    </div>
  );
};