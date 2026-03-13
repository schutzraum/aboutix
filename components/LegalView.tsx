import React from 'react';
import { ArrowLeft, Scale, FileText } from 'lucide-react';

interface LegalViewProps {
  title: string;
  type: 'IMPRESSUM' | 'AGB';
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ title, type, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
      >
        <ArrowLeft size={20} className="mr-2" />
        Zurück
      </button>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center mb-8 pb-8 border-b border-white/5">
          <div className="p-4 bg-white/5 rounded-2xl mr-6">
             {type === 'IMPRESSUM' ? <Scale size={32} className="text-red-500"/> : <FileText size={32} className="text-blue-500"/>}
          </div>
          <h1 className="text-4xl font-black text-white">{title}</h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-light leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          
          <h3>§1 Geltungsbereich</h3>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          
          <h3>§2 Vertragsabschluss</h3>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>
          
          <h3>§3 Haftungsausschluss</h3>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
          </p>
          
          <p className="pt-8 text-sm text-slate-500 italic border-t border-white/5 mt-8">
            Stand: {new Date().getFullYear()} - aboutix Platform Inc.
          </p>
        </div>
      </div>
    </div>
  );
};