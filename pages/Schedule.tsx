
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { ScheduleItem } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export const Schedule: React.FC = () => {
  const { user } = useAuth(); // Added useAuth hook
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const data = await firebaseService.getSchedule(user.id);
      setItems(data || []);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Minha Agenda</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
           + Novo Compromisso
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid gap-0">
          {items.map((item, idx) => (
            <div key={item.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 min-w-[60px]">
                     <span className="text-xs font-bold text-gray-500 uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                     <span className="text-xl font-bold text-gray-900">{new Date(item.date).getDate()}</span>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                     <p className="text-gray-500 text-sm">Cliente: {item.client}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                     <Clock className="w-4 h-4" /> {item.time}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    item.type === 'visita' ? 'bg-purple-100 text-purple-700' :
                    item.type === 'reuniao' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.type}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
