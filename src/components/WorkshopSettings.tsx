import React from 'react';
import { Palette, Share2, Globe, Phone, Info, Layout, CheckCircle2 } from 'lucide-react';
import { WorkshopLandingConfig } from '../types';

interface WorkshopSettingsProps {
  config: WorkshopLandingConfig;
  onChange: (config: WorkshopLandingConfig) => void;
  subscriptionLevel: 'free' | 'premium';
}

export default function WorkshopSettings({ config, onChange, subscriptionLevel }: WorkshopSettingsProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Palette size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">تخصيص الهوية البصرية</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">تحكم في مظهر صفحة الهبوط الخاصة بك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
            اسم الورشة (العنوان)
            <Info size={12} className="text-slate-300" />
          </label>
          <input 
            type="text" 
            value={config.title}
            onChange={(e) => onChange({...config, title: e.target.value})}
            placeholder="مثال: ورشة الأمان المتقدمة"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الوصف التشويقي</label>
          <input 
            type="text" 
            value={config.tagline}
            onChange={(e) => onChange({...config, tagline: e.target.value})}
            placeholder="مثال: ريادة في صيانة السيارات..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">اللون الرئيسي</label>
          <div className="flex gap-2">
             <input 
              type="color" 
              value={config.primaryColor}
              onChange={(e) => onChange({...config, primaryColor: e.target.value})}
              className="w-10 h-10 p-0.5 border border-slate-200 rounded-lg cursor-pointer bg-white"
             />
             <input 
              type="text" 
              value={config.primaryColor}
              readOnly
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 uppercase flex items-center px-3"
             />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">رقم الهاتف للتواصل</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={config.contactPhone}
              onChange={(e) => onChange({...config, contactPhone: e.target.value})}
              placeholder="05xxxxxxx"
              className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">خدمات الورشة (قائمة مفصولة بفاصلة)</label>
        <textarea 
          value={config.services}
          onChange={(e) => onChange({...config, services: e.target.value})}
          placeholder="ميكانيكا، كهرباء، فحص كمبيوتر..."
          rows={2}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all leading-relaxed"
        />
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${config.isLive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                onClick={() => onChange({...config, isLive: !config.isLive})}
           >
              {config.isLive ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
              <span className="text-xs font-black uppercase tracking-widest">{config.isLive ? 'منشور (Live)' : 'مسودة (Draft)'}</span>
           </div>
        </div>
        
        <div className="flex gap-2">
          {subscriptionLevel === 'premium' ? (
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              <Globe size={16} /> نشر الصفحة
            </button>
          ) : (
            <div className="text-[9px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 font-bold flex items-center gap-2">
              <Info size={14} /> الترقية مطلوبة لنشر الصفحة على نطاق مخصص
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
