import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, ShieldAlert, User as UserIcon } from 'lucide-react';
import { EventData, User } from '../types';
import { getEvents, getUsers, deleteEvent, updateEvent } from '../services/storage';

interface AdminViewProps {
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEvents(getEvents());
    setUsers(getUsers());
  };

  const getOrganizerName = (organizerId: string) => {
    const user = users.find(u => u.id === organizerId);
    return user ? user.name : `Unbekannt (${organizerId})`;
  };

  const handleDelete = (id: string) => {
    if (confirm("Möchtest du dieses Event wirklich unwiderruflich löschen?")) {
      deleteEvent(id);
      refreshData();
    }
  };

  const startEdit = (event: EventData) => {
    setEditingId(event.id);
    setEditTitle(event.title);
  };

  const saveEdit = (event: EventData) => {
    const updatedEvent = { ...event, title: editTitle };
    updateEvent(updatedEvent);
    setEditingId(null);
    refreshData();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white flex items-center">
           <ShieldAlert className="mr-3 text-red-500" />
           Admin Dashboard
        </h2>
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          Zurück zur Startseite
        </button>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-6 font-bold">Event Titel</th>
                <th className="p-6 font-bold">Datum</th>
                <th className="p-6 font-bold">Veranstalter / Kunde</th>
                <th className="p-6 font-bold text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    {editingId === event.id ? (
                      <input 
                        type="text" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-black/50 border border-white/20 rounded px-3 py-1 text-white w-full"
                        autoFocus
                      />
                    ) : (
                      <div className="font-bold text-white">{event.title}</div>
                    )}
                    <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">{event.id}</div>
                  </td>
                  <td className="p-6 text-slate-300 font-mono text-sm">
                    {new Date(event.date).toLocaleDateString('de-DE')}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full w-fit border border-indigo-500/20">
                      <UserIcon size={14} className="mr-2" />
                      <span className="text-sm font-medium">{getOrganizerName(event.organizerId)}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === event.id ? (
                        <>
                          <button onClick={() => saveEdit(event)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                            <Check size={18} />
                          </button>
                          <button onClick={cancelEdit} className="p-2 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 transition">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(event)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition">
                          <Edit2 size={18} />
                        </button>
                      )}
                      
                      <button onClick={() => handleDelete(event.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                    Keine Events gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};