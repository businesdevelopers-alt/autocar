import React from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  Users, 
  Calendar, 
  Package, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Globe,
  Phone
} from 'lucide-react';
import { WorkshopLandingConfig } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onCustomerLogin: () => void;
  onSupplierLogin: () => void;
  config: WorkshopLandingConfig;
}

export default function LandingPage({ onStart, onCustomerLogin, onSupplierLogin, config }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      <style>{`
        :root {
          --primary-color: ${config.primaryColor};
        }
        .bg-primary { background-color: ${config.primaryColor}; }
        .text-primary { color: ${config.primaryColor}; }
        .border-primary { border-color: ${config.primaryColor}; }
        .shadow-primary { --tw-shadow-color: ${config.primaryColor}33; }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl italic text-white shadow-lg"
              style={{ backgroundColor: config.primaryColor }}
            >
              W
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">{config.title}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">المميزات</a>
            <a href="#ai" className="hover:text-primary transition-colors">الذكاء الاصطناعي</a>
            <a href="#pricing" className="hover:text-primary transition-colors">الأسعار</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onCustomerLogin}
              className="text-slate-600 hover:text-primary font-bold text-sm transition-colors"
            >
              دخول العملاء
            </button>
            <button 
              onClick={onSupplierLogin}
              className="text-slate-600 hover:text-primary font-bold text-sm transition-colors"
            >
              دخول الموردين
            </button>
            <button 
              onClick={onStart}
              className="text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
              style={{ backgroundColor: config.primaryColor }}
            >
              دخول الورشة
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
              <Zap size={12} />
              الجيل القادم من إدارة الورش
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {config.title.split(' ')[0]} <span className="text-primary">{config.title.split(' ').slice(1).join(' ')}</span> {config.tagline}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              {config.services && `${config.services}. `}
              المنصة المتكاملة لإدارة ورش السيارات، قطع الغيار، وعلاقات العملاء. استعن بالذكاء الاصطناعي لتشخيص الأعطال وتحسين إنتاجية فريقك.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onStart}
                className="text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center gap-3 active:scale-95"
                style={{ backgroundColor: config.primaryColor }}
              >
                <span>ابدأ رحلة النجاح الآن</span>
                <ChevronLeft size={20} />
              </button>
              {config.contactPhone && (
                <a 
                  href={`tel:${config.contactPhone}`}
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <Phone size={20} className="text-primary" />
                  <span>{config.contactPhone}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
              <div className="flex -space-x-3 space-x-reverse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://picsum.photos/seed/${i + 10}/100`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                موثوق من قبل <span className="text-slate-900 font-black">+200 ورشة</span> في المنطقة
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 relative z-10">
              <div className="bg-slate-900 rounded-2xl p-6 aspect-[4/3] overflow-hidden flex flex-col">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col gap-4 animate-pulse">
                  <div className="h-4 bg-slate-700 w-1/3 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-700/50 rounded-lg"></div>
                    <div className="h-20 bg-slate-700/50 rounded-lg"></div>
                  </div>
                  <div className="h-32 bg-blue-600/20 border border-blue-500/30 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">الطلبات المكتملة</div>
                <div className="text-xl font-black text-slate-900 leading-none mt-1">452</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workshop Logo Section */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">هوية ورشتنا الاحترافية</div>
            <div className="relative group p-2 bg-gradient-to-br from-blue-50 to-white rounded-full border border-blue-100 shadow-xl shadow-blue-500/5">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-inner flex items-center justify-center bg-white relative">
                 <img 
                   src="https://images.unsplash.com/photo-1599305090598-fe1757df4f12?auto=format&fit=crop&q=80&w=300&h=300" 
                   alt="Workshop Logo" 
                   className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="absolute -bottom-4 -right-2 text-white p-3 rounded-2xl shadow-xl border-4 border-white" style={{ backgroundColor: config.primaryColor }}>
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${config.isLive ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                  {config.isLive ? 'متصل - Live' : 'مسودة - Draft'}
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">شعار الجودة والضمان</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">رمز يجسد التزامنا بأعلى معايير الدقة والاحترافية في صيانة سيارتك.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: config.primaryColor }}>لماذا {config.title.split(' ')[0]}؟</h2>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">قوة النظام بين يديك.</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              لقد صممنا كل أداة بعناية لتناسب احتياجات السوق الخليجي والشرق أوسطي، مع التركيز التام على سهولة الاستخدام وسرعة الإنجاز.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                title: 'نظام CRM متطور', 
                desc: 'سجل كامل لكل عميل وسياراته، مع تاريخ صيانة دقيق يسهل عليك العودة إليه في أي وقت.',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              { 
                icon: Calendar, 
                title: 'جدولة ذكية', 
                desc: 'نظّم مواعيد الورشة والخدمات، مع رسائل تذكير تلقائية لتقليل فترات انتظار العملاء.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              { 
                icon: Package, 
                title: 'إدارة مخزون احترافية', 
                desc: 'تتبع كل مسمار في مستودعك، مع تنبيهات فورية عند انخفاض الكميات ومقترحات إعادة الطلب.',
                color: 'text-red-600',
                bg: 'bg-red-50'
              },
              { 
                icon: Sparkles, 
                title: 'تشخيص AI فوري', 
                desc: 'استشر الذكاء الاصطناعي في حالات الأعطال المعقدة للحصول على توجيهات فنية سريعة ودقيقة.',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/10 transition-all"
              >
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section Highlight */}
      <section id="ai" className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
              استقبل المستقبل
            </div>
            <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              الذكاء الاصطناعي: <br /><span className="text-blue-500">خبيرك الفني الدائم.</span>
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              لا يقتصر "ورشة برو" على الإدارة فقط، بل يعمل كشريك تقني يساعدك في معالجة أصعب التحديات الميكانيكية والكهربائية عبر نماذج AI متخصصة في عالم السيارات.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                'تشخيص وتحليل رموز الأعطال (OBD-II)',
                'توصيات فورية لقطع الغيار المطلوبة',
                'تقدير زمني دقيق لإصلاح الأعطال',
                'تحليل الإنتاجية واكتشاف الهدر'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
               <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                   <Sparkles size={22} />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-white tracking-tight">المساعد التقني الذكي</div>
                   <div className="text-[10px] text-blue-400 font-bold uppercase mt-0.5">نشط - معالج Gemini</div>
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="bg-slate-900 rounded-xl p-4 text-[13px] text-slate-400 leading-relaxed border-r-4 border-blue-600 italic">
                   "السيارة تعاني من اهتزاز شديد عند سرعة 80 كم/س وتصدر صوتاً معدنياً من الأمام..."
                 </div>
                 <div className="bg-blue-600/10 rounded-xl p-4 text-[13px] text-blue-300 leading-relaxed border border-blue-500/20 animate-in slide-in-from-bottom-2 duration-700">
                    بناءً على المعطيات، يرجى فحص "كراسي المحرك" أو "عمود الدوران" (Propeller Shaft). يُوصى أيضاً بالتأكد من موازنة الإطارات كخطوة أولى.
                 </div>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Social Proof & CTA */}
      <section className="py-32 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center justify-center font-black text-2xl text-slate-400">TOYOTA</div>
            <div className="flex items-center justify-center font-black text-2xl text-slate-400">HYUNDAI</div>
            <div className="flex items-center justify-center font-black text-2xl text-slate-400">FORD</div>
            <div className="flex items-center justify-center font-black text-2xl text-slate-400">NISSAN</div>
          </div>
          
          <div className="space-y-6 pt-10">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">هل أنت مستعد لنقل ورشتك للمستوى القادم؟</h3>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              انضم إلى مئات أصحاب الورش الذين وثقوا في "ورشة برو" لتنظيم أعمالهم وزيادة أرباحهم بأكثر من 40% في العام الأول.
            </p>
            <div className="pt-6">
              <button 
                onClick={onStart}
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 active:scale-95"
              >
                ابدأ رحلة النجاح - مجاناً لمدة 14 يوم
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] pt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              لا حاجة لبطاقة ائتمان | إلغاء في أي وقت
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-xl italic text-white">
                W
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">ورشة برو</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-medium">
              الخيار الأول لإدارة خدمات صيانة السيارات في المنطقة. تكنولوجيا متقدمة، بساطة مطلقة، ونتائج ملموسة.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="font-black text-slate-900 text-xs tracking-widest uppercase">المنتج</h5>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li>المميزات</li>
              <li>الذكاء الاصطناعي</li>
              <li>قصص النجاح</li>
              <li>الأمان</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-black text-slate-900 text-xs tracking-widest uppercase">تواصل معنا</h5>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li className="flex items-center gap-2"><Globe size={14} /> المملكة العربية السعودية</li>
              <li>دعم فني 24/7</li>
              <li>sales@warshapro.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <div>جميع الحقوق محفوظة © 2026 ورشة برو.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-600">سياسة الخصوصية</a>
            <a href="#" className="hover:text-blue-600">شروط الخدمة</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
