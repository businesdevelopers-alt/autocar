/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  Plus,
  Car,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar as CalendarIcon,
  History,
  Info,
  Mail,
  Phone,
  MapPin,
  Zap,
  Globe,
  Palette,
  Monitor,
  Rocket,
  Shield,
  Truck,
  MessageSquare,
  Send,
  X,
  Bot
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { generateZatcaTlv } from './lib/zatca';
import { 
  mockCustomers, 
  mockVehicles, 
  mockParts, 
  mockJobCards, 
  mockInvoices, 
  mockAppointments, 
  mockMaintenanceRecords,
  mockServiceTemplates,
  mockSuppliers,
  mockSupplierParts,
  mockPurchaseOrders
} from './mockData';
import { CompatibleVehicle } from './types';
import { getRepairAdvice, predictMaintenance, askAssistant, suggestParts } from './lib/gemini';
import LandingPage from './components/LandingPage';
import CustomerPortal from './components/CustomerPortal';
import SupplierPortal from './components/SupplierPortal';
import WorkshopSettings from './components/WorkshopSettings';

const revenueData = [
  { name: 'السبت', value: 4500 },
  { name: 'الأحد', value: 5200 },
  { name: 'الاثنين', value: 3800 },
  { name: 'الثلاثاء', value: 6100 },
  { name: 'الأربعاء', value: 5900 },
  { name: 'الخميس', value: 7200 },
  { name: 'الجمعة', value: 2500 },
];

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
  bg: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, bg, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center ${color} transition-transform group-hover:scale-105`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'app' | 'customer-portal' | 'supplier-portal'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartCompatibility, setNewPartCompatibility] = useState<CompatibleVehicle[]>([]);
  const [compatInputs, setCompatInputs] = useState<CompatibleVehicle>({ make: '', model: '', yearStart: 2010, yearEnd: 2024 });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [jobTemplates, setJobTemplates] = useState(mockServiceTemplates);
  const [maintenancePrediction, setMaintenancePrediction] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [assistantChat, setAssistantChat] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [subscriptionLevel, setSubscriptionLevel] = useState<'free' | 'premium'>('free');
  const [suggestedParts, setSuggestedParts] = useState<string | null>(null);
  const [loadingParts, setLoadingParts] = useState(false);
  const [selectedVehicleForParts, setSelectedVehicleForParts] = useState<string | null>(null);
  const [workshopLandingConfig, setWorkshopLandingConfig] = useState({
    title: 'ورشة الأمان المتقدمة',
    tagline: 'ريادة في صيانة السيارات بأحدث التقنيات',
    primaryColor: '#2563eb',
    services: 'ميكانيكا، كهرباء، فحص كمبيوتر، غيار زيوت',
    contactPhone: '0551234567',
    isLive: false
  });

  const stats = [
    { label: 'إجمالي المبيعات', value: '74,500 ر.س', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'بطاقات العمل النشطة', value: '12', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'قطع منخفضة المخزون', value: '4', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'العملاء الجدد', value: '28', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleAiAdvice = async () => {
    setLoadingAi(true);
    const advice = await getRepairAdvice("صوت طقطقة عند الدوران لليسار في سيارة تويوتا كامري");
    setAiAnalysis(advice || "فشل الحصول على الاستشارة");
    setLoadingAi(false);
  };

  const handlePredictMaintenance = async (customerId: string) => {
    setPredicting(true);
    const history = mockMaintenanceRecords
      .filter(m => mockVehicles.find(v => v.id === m.vehicleId && v.ownerId === customerId))
      .map(m => `${m.date}: ${m.serviceDescription}`)
      .join(', ');
    
    if (!history) {
      setMaintenancePrediction("لا يوجد سجل صيانة كافٍ للتنبؤ.");
    } else {
      const prediction = await predictMaintenance(history);
      setMaintenancePrediction(prediction);
    }
    setPredicting(false);
  };

  const handleSuggestParts = async (vehicle: any) => {
    setSelectedVehicleForParts(vehicle.id);
    setLoadingParts(true);
    const result = await suggestParts(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);
    setSuggestedParts(result);
    setLoadingParts(false);
  };

  const handleAssistantSendMessage = async () => {
    if (!assistantInput.trim()) return;
    
    const userMsg = { role: 'user' as const, content: assistantInput };
    setAssistantChat(prev => [...prev, userMsg]);
    setAssistantInput('');
    setAssistantLoading(true);
    
    let context = "Workshop general context";
    if (activeTab === 'inventory') context = "Inventory and parts management";
    if (activeTab === 'customers' && selectedCustomerId) {
      const customer = mockCustomers.find(c => c.id === selectedCustomerId);
      context = `Viewing customer ${customer?.name}. Products/Vehicles managed here.`;
    }

    const response = await askAssistant(assistantInput, context);
    setAssistantChat(prev => [...prev, { role: 'assistant', content: response || "عذراً، لم أستطع فهم ذلك." }]);
    setAssistantLoading(false);
  };

  return (
    <div dir="rtl">
      {currentPage === 'landing' ? (
        <LandingPage 
          onStart={() => setCurrentPage('app')} 
          onCustomerLogin={() => setCurrentPage('customer-portal')}
          onSupplierLogin={() => setCurrentPage('supplier-portal')}
          config={workshopLandingConfig}
        />
      ) : currentPage === 'customer-portal' ? (
        <CustomerPortal 
          customer={mockCustomers[0]} 
          vehicles={mockVehicles.filter(v => v.ownerId === mockCustomers[0].id)}
          records={mockMaintenanceRecords.filter(m => mockVehicles.find(v => v.id === m.vehicleId && v.ownerId === mockCustomers[0].id))}
          invoices={mockInvoices.filter(i => i.customerId === mockCustomers[0].id)}
          appointments={mockAppointments.filter(a => a.customerId === mockCustomers[0].id)}
          onLogout={() => setCurrentPage('landing')}
          onViewInvoice={(id) => {
             setSelectedInvoiceId(id);
             setActiveTab('sales');
             setCurrentPage('app');
          }}
        />
      ) : currentPage === 'supplier-portal' ? (
        <SupplierPortal 
          supplier={mockSuppliers[0]}
          parts={mockSupplierParts.filter(p => p.supplierId === mockSuppliers[0].id)}
          orders={mockPurchaseOrders.filter(o => o.supplierId === mockSuppliers[0].id)}
          onLogout={() => setCurrentPage('landing')}
        />
      ) : (
        <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
          {/* Sidebar */}
          <motion.aside 
            initial={false}
            animate={{ width: sidebarOpen ? 260 : 80 }}
            className="bg-slate-900 text-white flex flex-col relative z-20 border-l border-slate-700"
          >
            <div 
              className="p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
              onClick={() => setCurrentPage('landing')}
            >
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-xl italic shrink-0 shadow-lg shadow-blue-600/20">
                W
              </div>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-xl tracking-tight"
                >
                  ورشة برو
                </motion.span>
              )}
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
          {sidebarOpen && <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 px-2">القائمة الرئيسية</div>}
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
            { id: 'workshop', icon: Wrench, label: 'أوامر الإصلاح' },
            { id: 'appointments', icon: CalendarIcon, label: 'المواعيد' },
            { id: 'inventory', icon: Package, label: 'قطع الغيار' },
            { id: 'sales', icon: FileText, label: 'الفواتير' },
            { id: 'customers', icon: Users, label: 'العملاء' },
            { id: 'landing-builder', icon: Globe, label: 'صفحة الهبوط' },
            { id: 'suppliers-discovery', icon: Truck, label: 'الموردين' },
            { id: 'settings', icon: Settings, label: 'الإعدادات' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-r-4 ${
                activeTab === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border-blue-600 shadow-inner' 
                  : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -left-3 top-20 bg-slate-800 border border-slate-700 text-white p-1 rounded-full hover:bg-blue-600 transition-colors shadow-md"
        >
          {sidebarOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {sidebarOpen && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/user/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">بدر المهنا</div>
              <div className="opacity-70">مدير النظام</div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 text-slate-600">
            <div className="relative w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="بحث عن رقم لوحة، هاتف، أو رقم قطعة..." 
                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase">الحالة التشغيلية</span>
              <span className="text-xs font-semibold text-emerald-600">نشط - 8 فنيين</span>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">لوحة التحكم</h1>
                  <p className="text-slate-500 mt-2 text-sm">أهلاً بك في نظام الإدارة الموحد.</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 leading-none">
                    <Plus size={16} />
                    <span>أمر صيانة جديد</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-95 leading-none">
                    <FileText size={16} />
                    <span>فاتورة جديدة</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'سيارات قيد الصيانة', value: '12', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'بانتظار قطع الغيار', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'أوامر مكتملة (اليوم)', value: '7', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'نقص في المخزون', value: '18', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                  <StatCard 
                    key={i}
                    index={i}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    bg={stat.bg}
                  />
                ))}
              </div>

              {/* Charts & AI */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">تحليل الإنتاجية الأسبوعي</h2>
                    <select className="bg-slate-50 border border-slate-200 rounded text-[11px] font-bold px-2 py-1 focus:outline-none">
                      <option>آخر 7 أيام</option>
                    </select>
                  </div>
                  <div className="p-6 h-[380px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                          dx={-10}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Assistant Card - Styled as a specialist tool */}
                <div className="flex flex-col gap-6">
                  <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden border border-slate-800 shadow-xl flex-1">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-blue-400" />
                        <h2 className="font-bold text-sm tracking-widest uppercase">المستشار الذكي (AI)</h2>
                      </div>
                      <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                        استخدم الذكاء الاصطناعي لتشخيص وتحليل أعطال المحركات وأنظمة التعليق بناءً على الأعراض.
                      </p>
                      
                      <button 
                        onClick={handleAiAdvice}
                        disabled={loadingAi}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                      >
                        {loadingAi ? 'جاري التحليل...' : 'تشغيل التشخيص الذكي'}
                      </button>
                      
                      {aiAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 p-4 bg-slate-800/80 rounded-lg text-[11px] leading-relaxed border border-slate-700 max-h-[180px] overflow-y-auto scrollbar-hide text-slate-300"
                        >
                          {aiAnalysis}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white shadow-blue-600/20">
                    <h3 className="font-bold mb-1 text-sm tracking-tight">🚨 تنبيهات النظام</h3>
                    <p className="text-blue-100 text-[11px] mb-4">هناك 4 طلبات لقطع غيار بانتظار الموافقة المالية.</p>
                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold transition-colors">مراجعة الطلبات</button>
                  </div>
                </div>
              </div>

              {/* Secondary Content - Workflow Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <LayoutDashboard size={18} className="text-slate-400" />
                      ورشة العمل الحالية
                    </h2>
                    <button className="text-[11px] text-blue-600 font-bold uppercase tracking-wider hover:underline">عرض الكل</button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100 uppercase tracking-widest font-bold">
                        <tr>
                          <th className="p-4">رقم اللوحة</th>
                          <th className="p-4">المركبة</th>
                          <th className="p-4">الخدمة</th>
                          <th className="p-4">الفني</th>
                          <th className="p-4">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockJobCards.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4 font-mono font-bold text-slate-900">أ ب ج 1234</td>
                            <td className="p-4 text-slate-600">تويوتا كامري 2022</td>
                            <td className="p-4 text-slate-600">{job.description}</td>
                            <td className="p-4 text-slate-600">بدر المهنا</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-tight">جاري العمل</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                   <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <AlertTriangle size={18} className="text-amber-500" />
                    تنبيهات المخزون
                  </h3>
                  <div className="space-y-3 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {mockParts.filter(p => p.stock < p.minStock || p.stock < 10).map((part) => (
                      <div key={part.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between group hover:border-red-100 hover:bg-red-50/30 transition-all">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{part.name}</div>
                          <div className="text-[10px] text-red-600 font-bold mt-1">المتبقي: {part.stock} قطع</div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 underline cursor-pointer hover:text-blue-800">طلب الآن</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'workshop' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">ورشة العمل وأوامر الإصلاح</h2>
                <div className="flex gap-2">
                   <button onClick={() => setShowTemplateModal(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition-all">
                    <History size={16} />
                    <span>نماذج الخدمات</span>
                  </button>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all">
                    <Plus size={16} />
                    <span>أمر إصلاح جديد</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
                  <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">أوامر الإصلاح النشطة</div>
                  <div className="overflow-auto max-h-[400px]">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100 font-bold">
                        <tr>
                          <th className="p-4">رقم اللوحة</th>
                          <th className="p-4">المركبة</th>
                          <th className="p-4">الخدمة</th>
                          <th className="p-4">الفني</th>
                          <th className="p-4">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockJobCards.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-900">أ ب ج 1234</td>
                            <td className="p-4 text-slate-600">تويوتا كامري 2022</td>
                            <td className="p-4 text-slate-600">{job.description}</td>
                            <td className="p-4 text-slate-600">بدر المهنا</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">جاري العمل</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 text-sm">
                      <Zap size={18} className="text-blue-600" />
                      النماذج الجاهزة
                    </h3>
                    <div className="space-y-2">
                       {jobTemplates.map((template) => (
                         <div key={template.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-blue-400 transition-all cursor-pointer">
                            <div className="font-bold text-slate-900 text-xs">{template.title}</div>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{template.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                               <span className="text-[10px] font-bold text-blue-600">{template.estimatedLaborCost} ر.س أجور</span>
                               <button className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded font-bold hover:bg-blue-600 hover:text-white transition-colors">استخدام</button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">المواعيد المجدولة</h2>
                  <p className="text-slate-500 mt-2 text-sm">إدارة مواعيد العملاء والخدمات المطلوبة.</p>
                </div>
                <button onClick={() => setShowAppointmentModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all">
                  <CalendarIcon size={16} />
                  <span>موعد جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">عرض المواعيد</h3>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">الأسبوع الحالي</button>
                       <button className="px-3 py-1 text-slate-400 rounded text-[10px] font-bold">اليوم</button>
                    </div>
                  </div>
                  <div className="p-0 overflow-auto">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100 font-bold">
                        <tr>
                          <th className="p-4">الوقت</th>
                          <th className="p-4">العميل</th>
                          <th className="p-4">نوع الخدمة</th>
                          <th className="p-4">الفني</th>
                          <th className="p-4">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockAppointments.map((apt) => {
                          const customer = mockCustomers.find(c => c.id === apt.customerId);
                          return (
                            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-bold text-slate-900">{new Date(apt.scheduledAt).toLocaleString('ar-SA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</td>
                              <td className="p-4 text-slate-600">{customer?.name}</td>
                              <td className="p-4 text-slate-600 font-bold">{apt.serviceType}</td>
                              <td className="p-4 text-slate-600">فني محرك</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {apt.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-xl self-start">
                   <h3 className="font-bold flex items-center gap-2 mb-4">
                    <Bell size={18} className="text-amber-500" />
                    تذكيرات المواعيد
                  </h3>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                    يتم إرسال رسائل تذكير تلقائية للعملاء قبل موعدهم بـ 24 ساعة لتقليل التغيب.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-[11px] text-slate-200">أحمد محمود - غداً 10 ص</span>
                      <span className="text-[10px] text-emerald-500 font-bold">تم الإرسال</span>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between opacity-50">
                      <span className="text-[11px] text-slate-200">سارة العتيبي - بعد غد</span>
                      <span className="text-[10px] text-slate-400 font-bold">قيد الانتظار</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">إدارة المستودع وقطع الغيار</h2>
                  <p className="text-slate-500 mt-2 text-sm">تتبع كميات المخزون، الطلبات، ومستويات المواد.</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="ابحث حسب الطراز (تويوتا، كامري...)" 
                      className="pr-10 pl-4 py-2 bg-slate-100 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <button onClick={() => setShowAddPart(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-tight flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Plus size={16} />
                    إضافة قطعة جديدة
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">اسم القطعة</th>
                        <th className="px-6 py-4">الباركود</th>
                        <th className="px-6 py-4">الفئة</th>
                        <th className="px-6 py-4">السعر</th>
                        <th className="px-6 py-4">المخزون</th>
                        <th className="px-6 py-4">الحد الأدنى</th>
                        <th className="px-6 py-4 text-left">خيارات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockParts.map((part) => (
                        <tr key={part.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{part.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {part.compatibility ? (
                                part.compatibility.map(c => `${c.make} ${c.model}`).join('، ')
                              ) : part.compatibleVehicles.join('، ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-400">{part.sku}</td>
                          <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{part.category}</span></td>
                          <td className="px-6 py-4 font-bold">{part.price} ر.س</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${part.stock < part.minStock ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                              {part.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-bold">{part.minStock}</td>
                          <td className="px-6 py-4 text-left">
                            <button className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">تعديل</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 text-sm">
                      <AlertTriangle size={18} className="text-amber-500" />
                      مقترحات إعادة الطلب
                    </h3>
                    <div className="space-y-3 flex-1 overflow-auto scrollbar-hide">
                      {mockParts.filter(p => p.stock < p.minStock).map((part) => (
                        <div key={part.id} className="p-4 bg-red-50 border border-red-100 rounded-lg flex flex-col gap-2 group transition-all">
                          <div>
                            <div className="font-bold text-slate-900 text-[11px]">{part.name}</div>
                            <div className="text-[10px] text-red-600 font-bold mt-1">المخزون حرج: {part.stock}</div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                             <span className="text-[9px] text-slate-500">الكمية المقترحة: {part.minStock * 2}</span>
                             <button className="text-[9px] font-bold text-blue-600 underline">إنشاء طلب</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">قاعدة بيانات العملاء (CRM)</h2>
                  <p className="text-slate-500 mt-2 text-sm">إدارة علاقات العملاء وسجلات صيانة مركباتهم.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-blue-700 transition-all">إضافة عميل</button>
              </div>

              {selectedCustomerId ? (
                <div className="animate-in fade-in duration-300">
                  <button onClick={() => { setSelectedCustomerId(null); setMaintenancePrediction(null); setSuggestedParts(null); setSelectedVehicleForParts(null); }} className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-4 hover:underline">
                    <ChevronRight size={14} /> العودة للقائمة
                  </button>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 border-2 border-blue-100">
                          <Users size={40} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{mockCustomers.find(c => c.id === selectedCustomerId)?.name}</h3>
                        <p className="text-slate-500 text-xs mt-1">مشترك منذ: {mockCustomers.find(c => c.id === selectedCustomerId)?.joinedAt}</p>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Phone size={16} className="text-slate-400" />
                          <span className="font-mono">{mockCustomers.find(c => c.id === selectedCustomerId)?.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Mail size={16} className="text-slate-400" />
                          <span className="text-slate-600 text-xs truncate">{mockCustomers.find(c => c.id === selectedCustomerId)?.email || 'لا يوجد بريد'}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <MapPin size={16} className="text-slate-400" />
                          <span className="text-slate-600 text-xs">{mockCustomers.find(c => c.id === selectedCustomerId)?.address || 'غير محدد'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-sm tracking-tight flex items-center gap-2">
                          <Car size={18} className="text-blue-600" />
                          المركبات المسجلة
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {mockVehicles.filter(v => v.ownerId === selectedCustomerId).map(vehicle => (
                             <div key={vehicle.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <div className="font-bold text-slate-900 text-xs">{vehicle.make} {vehicle.model} - {vehicle.year}</div>
                                   <div className="text-[10px] text-slate-400 font-mono mt-1">لوحة: {vehicle.plateNumber}</div>
                                 </div>
                                 <button 
                                   onClick={() => handleSuggestParts(vehicle)}
                                   className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 leading-none shadow-sm shadow-blue-600/20"
                                 >
                                   <Sparkles size={10} />
                                   اقتراح قطع
                                 </button>
                               </div>

                               {selectedVehicleForParts === vehicle.id && (
                                 <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100 text-[10px] leading-relaxed animate-in fade-in slide-in-from-top-1 shadow-sm">
                                   {loadingParts ? (
                                     <div className="flex items-center gap-2 text-blue-500 font-bold p-1">
                                       <Sparkles size={12} className="animate-pulse" />
                                       جاري جلب اقتراحات الذكاء الاصطناعي...
                                     </div>
                                   ) : (
                                     <div className="space-y-2">
                                       <div className="font-bold text-blue-600 mb-1 border-b border-blue-50 pb-1 flex items-center gap-1">
                                          <Bot size={12} /> قطع غيار مقترحة لعام {vehicle.year}
                                       </div>
                                       <div className="whitespace-pre-line text-slate-700">
                                         {suggestedParts}
                                       </div>
                                       <button 
                                         onClick={() => setSelectedVehicleForParts(null)}
                                         className="w-full mt-2 py-1.5 bg-slate-50 text-slate-400 rounded border border-slate-100 hover:text-slate-600 transition-colors font-bold"
                                       >
                                         إغلاق التوصيات
                                       </button>
                                     </div>
                                   )}
                                 </div>
                               )}
                             </div>
                           ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-sm tracking-tight flex items-center gap-2">
                          <History size={18} className="text-blue-600" />
                          سجل الصيانة والخدمات
                        </div>
                        <div className="divide-y divide-slate-100">
                           {mockMaintenanceRecords.length > 0 ? mockMaintenanceRecords.map(record => (
                             <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-[10px] font-bold text-slate-400">{new Date(record.date).toLocaleDateString('ar-SA')}</span>
                                 <div className="flex items-center gap-2">
                                    {record.invoiceId && (
                                       <button 
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             setActiveTab('sales');
                                             setSelectedInvoiceId(record.invoiceId!);
                                          }}
                                          className="text-[9px] font-bold text-blue-600 border border-blue-100 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-all"
                                       >
                                          عرض الفاتورة
                                       </button>
                                    )}
                                    <span className="text-[10px] font-bold text-slate-900">{record.cost} ر.س</span>
                                 </div>
                               </div>
                               <div className="font-bold text-xs text-slate-900">{record.serviceDescription}</div>
                               <div className="text-[10px] text-slate-500 mt-2">
                                 قطع الغيار: {record.partsReplaced.join('، ')}
                               </div>
                             </div>
                           )) : (
                             <div className="p-8 text-center text-slate-400 text-xs">لا يوجد سجل صيانة حالي</div>
                           )}
                        </div>
                      </div>

                      <div className="bg-slate-900 text-white rounded-xl border border-slate-700 shadow-xl overflow-hidden p-6 relative">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                 <Sparkles size={20} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-sm tracking-tight text-white">التنبؤ الذكي بالصيانة (AI)</h3>
                                 <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">تحليل المواعيد والدعاية</p>
                              </div>
                           </div>
                           <button 
                            disabled={predicting}
                            onClick={() => handlePredictMaintenance(selectedCustomerId!)}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
                           >
                              {predicting ? 'جاري التحليل...' : 'توقع الصيانة القادمة'}
                           </button>
                        </div>

                        {maintenancePrediction ? (
                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-xs leading-relaxed text-slate-300">
                                {maintenancePrediction}
                             </div>
                             <div className="flex gap-3">
                                <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-xl">
                                   <Mail size={16} />
                                   إرسال عرض دعائي للعميل
                                </button>
                                <button className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-[11px] font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-xl">
                                   <Phone size={16} />
                                   متابعة عبر الواتساب
                                </button>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                             <Info size={32} className="mx-auto mb-2 opacity-20" />
                             <p className="text-xs font-medium">اضغط على الزر لتحليل سجل العميل وتقديم توصيات مخصصة</p>
                          </div>
                        )}
                        
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] pointer-events-none rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col group cursor-pointer hover:border-blue-200" onClick={() => setSelectedCustomerId(customer.id)}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <Users size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{customer.name}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customer.joinedAt}</p>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1 text-xs">
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-500 font-medium">الجوال</span>
                          <span className="font-mono text-slate-800">{customer.phone}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-500 font-medium">الموقع</span>
                          <span className="text-slate-800 font-bold">{customer.address || '—'}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button className="flex-1 py-2 border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50">عرض الملف الكامل</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'landing-builder' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">منشئ صفحة الهبوط</h2>
                  <p className="text-slate-500 text-sm mt-1">صمم واطلق صفحة تسويقية لورشتك خلال دقائق.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                   <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${subscriptionLevel === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                      {subscriptionLevel === 'premium' ? 'الباقة الاحترافية' : 'الباقة المجانية'}
                   </div>
                   {subscriptionLevel === 'free' && (
                     <button 
                       onClick={() => setSubscriptionLevel('premium')}
                       className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-all flex items-center gap-2"
                     >
                       <Zap size={14} /> ترقية الباقة
                     </button>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Editor Surface */}
                <div className="space-y-6">
                  <WorkshopSettings 
                    config={workshopLandingConfig}
                    onChange={setWorkshopLandingConfig}
                    subscriptionLevel={subscriptionLevel}
                  />

                  {/* Subscription Info Card */}
                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                     <div className="relative z-10 space-y-6">
                        <div>
                           <h4 className="text-xl font-bold italic tracking-tight">باقات الاشتراك</h4>
                           <p className="text-slate-400 text-xs mt-1">اختر الباقة التي تناسب تطلعات ورشتك.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className={`p-4 rounded-2xl border-2 transition-all group cursor-pointer ${subscriptionLevel === 'free' ? 'bg-blue-600/10 border-blue-600' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`} onClick={() => setSubscriptionLevel('free')}>
                              <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">مجانية</div>
                              <div className="font-bold text-lg leading-none mb-4">0 ر.س <span className="text-[10px] opacity-40">/شهرياً</span></div>
                              <ul className="text-[9px] text-slate-500 space-y-2">
                                 <li className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> صفحة هبوط عامة</li>
                                 <li className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> معلومات التواصل</li>
                                 <li className="flex items-center gap-1 opacity-20"><Shield size={10} /> نطاق مخصص</li>
                              </ul>
                           </div>
                           <div className={`p-4 rounded-2xl border-2 transition-all group cursor-pointer relative ${subscriptionLevel === 'premium' ? 'bg-purple-600/10 border-purple-600' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`} onClick={() => setSubscriptionLevel('premium')}>
                              {subscriptionLevel === 'premium' && <div className="absolute -top-2 -left-2 bg-purple-600 text-[8px] px-2 py-1 rounded-full font-black uppercase">نشط</div>}
                              <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">احترافية</div>
                              <div className="font-bold text-lg leading-none mb-4">150 ر.س <span className="text-[10px] opacity-40">/شهرياً</span></div>
                              <ul className="text-[9px] text-slate-500 space-y-2">
                                 <li className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> نطاق مخصص (Domain)</li>
                                 <li className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> إزالة شعار المنصة</li>
                                 <li className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> بوابة عملاء كاملة</li>
                              </ul>
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full"></div>
                  </div>
                </div>

                {/* Mobile Preview Interface */}
                <div className="flex flex-col items-center gap-6">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <Monitor size={14} /> معاينة فورية (وضع الجوال)
                  </div>
                  
                  <div className="bg-slate-900 w-[320px] h-[640px] rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-800 rounded-full z-20"></div>
                    
                    {/* Status Badge Over Preview */}
                    <div className="absolute top-16 right-8 z-30">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg border ${workshopLandingConfig.isLive ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {workshopLandingConfig.isLive ? 'Live' : 'Draft'}
                       </span>
                    </div>

                    <div className="bg-white h-full rounded-[2.5rem] overflow-hidden flex flex-col relative">
                       {/* Mock Status Bar */}
                       <div className="h-10 bg-white flex items-center justify-between px-8 border-b border-slate-50">
                          <div className="text-[9px] font-bold">9:41</div>
                          <div className="flex gap-1">
                             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                             <div className="w-1 h-4 border border-slate-300 rounded-[1px]"></div>
                          </div>
                       </div>

                       {/* Preview Content Area */}
                       <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
                          {/* Navigation Mock */}
                          <div className="p-6 flex justify-between items-center">
                             <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: workshopLandingConfig.primaryColor }}>
                                W
                             </div>
                             <button className="text-[9px] font-black uppercase tracking-widest text-slate-400">بوابة العميل</button>
                          </div>

                          {/* Hero Mock */}
                          <div className="px-6 py-8 space-y-4">
                             <h5 className="text-2xl font-black leading-tight tracking-tighter" style={{ color: workshopLandingConfig.primaryColor }}>
                                {workshopLandingConfig.title || 'عنوان الورشة'}
                             </h5>
                             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                {workshopLandingConfig.tagline || 'شعار الورشة الترويجي يظهر هنا...'}
                             </p>
                             <button className="w-full py-4 text-white rounded-2xl font-black text-[10px] shadow-xl" style={{ backgroundColor: workshopLandingConfig.primaryColor }}>
                                اطلب صيانة الآن
                             </button>
                          </div>

                          {/* Services Mock */}
                          <div className="px-6 py-8 space-y-4">
                             <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 border-b border-slate-100 pb-2">خدماتنا المتميزة</div>
                             <div className="grid grid-cols-2 gap-3">
                                {workshopLandingConfig.services.split('،').slice(0, 4).map((s, idx) => (
                                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                     <div className="text-[10px] font-bold text-slate-800 leading-tight">{s.trim() || 'اسم الخدمة'}</div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Contact Mock */}
                          <div className="mt-auto px-6 py-8 bg-slate-900 text-white rounded-t-[2.5rem]">
                             <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">تواصل مباشر</div>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                   <Phone size={18} />
                                </div>
                                <div>
                                   <div className="font-bold text-xs leading-none mb-1">{workshopLandingConfig.contactPhone}</div>
                                   <div className="text-[9px] opacity-40 uppercase font-black">جاهزون لخدمتكم 24/7</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="text-center max-w-[320px]">
                     <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-4">
                        سيتم نشر هذه النسخة على رابط مخصص لورشتك (اسم-الورشة.warshapro.app) عند تفعيل النشر.
                     </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">إعدادات النظام</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 text-sm">
                    <Settings size={18} className="text-slate-400" />
                    تحديث بيانات الورشة
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">اسم المنشأة</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" defaultValue="أوتو-كنترول للصيانة" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">الرقم الضريبي</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" defaultValue="300012345600003" />
                    </div>
                    <button className="w-full py-2 bg-slate-900 text-white rounded font-bold text-xs hover:bg-slate-800 transition-all">حفظ التغييرات</button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 text-sm">
                    <History size={18} className="text-slate-400" />
                    النسخ الاحتياطي
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">يتم عمل نسخة احتياطية من جميع سجلاتك يومياً بشكل تلقائي. يمكنك تحميل نسخة فورية من بياناتك هنا.</p>
                  <button className="w-full py-2 border border-slate-200 text-slate-600 rounded font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Package size={16} /> تحميل قاعدة البيانات (CSV)
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'suppliers-discovery' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">شبكة موردين قطع الغيار</h2>
                    <p className="text-slate-500 mt-2 text-sm">البحث عن القطع وطلبها مباشرة من الموردين المعتمدين.</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                       <History size={16} /> سجل الطلبات
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {mockSuppliers.map(sup => (
                    <div key={sup.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:border-blue-300 transition-colors cursor-pointer group">
                       <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                             {sup.name[0]}
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                             <TrendingUp size={14} /> {sup.rating}
                          </div>
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{sup.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{sup.category.join(' • ')}</p>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <MapPin size={12} /> {sup.address}
                       </div>
                       <button className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                          تصفح المنتجات
                       </button>
                    </div>
                 ))}
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                 <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                       <h3 className="text-3xl font-black italic tracking-tighter mb-4 leading-tight">اطلب قطع الغيار بذكاء <br/> وسرعة فائقة</h3>
                       <p className="text-slate-400 text-sm leading-relaxed mb-8">نظام الموردين يربط ورشتك بآلاف القطع المتوفرة لحظياً. قارن الأسعار، اطلب القطعة، وتابع شحنها حتى باب ورشتك.</p>
                       <div className="flex gap-4">
                          <div className="flex flex-col">
                             <span className="text-2xl font-black text-blue-400">+500</span>
                             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">مورد معتمد</span>
                          </div>
                          <div className="w-px h-10 bg-slate-800"></div>
                          <div className="flex flex-col">
                             <span className="text-2xl font-black text-emerald-400">100%</span>
                             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">قطع أصلية</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm space-y-4">
                       <h4 className="font-bold text-sm flex items-center gap-2">
                          <Search size={18} className="text-blue-400" />
                          بحث سريع في كافة المستودعات
                       </h4>
                       <div className="relative">
                          <input type="text" placeholder="ابحث برقم القطعة أو اسم الموديل..." className="w-full py-4 px-6 bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white font-bold" />
                          <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                             <ChevronLeft size={20} />
                          </button>
                       </div>
                       <p className="text-[10px] text-slate-500 text-center">خدمة مقدمة حصرياً لمشتركي الباقة الاحترافية في ورشة برو</p>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
              </div>
            </div>
          )}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">الفواتير والمتحصلات المالية</h2>
                  <p className="text-slate-500 mt-2 text-sm">إدارة مبيعات الخدمات وقطع الغيار وإصدار الفواتير الضريبية.</p>
                </div>
                <button 
                  onClick={() => setShowMaintenanceModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                   <Plus size={16} />
                   إصدار فاتورة جديدة
                </button>
              </div>

              {selectedInvoiceId ? (
                <div className="animate-in fade-in duration-300">
                  <button onClick={() => setSelectedInvoiceId(null)} className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-4 hover:underline">
                    <ChevronRight size={14} /> العودة لقائمة الفواتير
                  </button>
                  
                  {(() => {
                    const invoice = mockInvoices.find(i => i.id === selectedInvoiceId);
                    const customer = mockCustomers.find(c => c.id === invoice?.customerId);
                    if (!invoice) return null;
                    
                    const zatcaData = generateZatcaTlv({
                      sellerName: "أوتو-كنترول للصيانة",
                      vatNumber: "300012345600003",
                      timestamp: invoice.createdAt,
                      totalWithVat: invoice.grandTotal,
                      vatAmount: invoice.tax
                    });

                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto mb-12 relative">
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-start">
                           <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-blue-400">فاتورة ضريبية مبسطة</div>
                              <h3 className="text-2xl font-black italic tracking-tighter">أوتو-كنترول</h3>
                              <div className="mt-4 space-y-1 opacity-60 text-[10px]">
                                 <div>الرقم الضريبي: 300012345600003</div>
                                 <div>حي العليا، الرياض، المملكة العربية السعودية</div>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3 text-left">
                              <div>
                                <div className="text-[10px] font-bold text-slate-400">رقم الفاتورة</div>
                                <div className="text-sm font-bold font-mono text-right">{invoice.id}</div>
                              </div>
                              <div className="bg-white p-1 rounded-lg">
                                <QRCodeSVG value={zatcaData} size={64} level="M" />
                              </div>
                              <div className="text-right">
                                 <div className="text-[10px] font-bold text-slate-400">التاريخ</div>
                                 <div className="text-sm font-bold">{new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</div>
                              </div>
                           </div>
                        </div>

                        <div className="p-8 border-b border-slate-100 flex justify-between">
                           <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">فاتورة إلى</div>
                              <div className="font-bold text-slate-900">{customer?.name}</div>
                              <div className="text-xs text-slate-500">{customer?.phone}</div>
                           </div>
                           <div className="text-left">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">حالة الدفع</div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {invoice.status === 'paid' ? 'مدفوعة' : 'بانتظار الدفع'}
                              </span>
                           </div>
                        </div>

                        <table className="w-full text-right">
                           <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                              <tr>
                                 <th className="px-8 py-4 text-right">البيان</th>
                                 <th className="px-8 py-4 text-center">الكمية</th>
                                 <th className="px-8 py-4 text-center">سعر الوحدة</th>
                                 <th className="px-8 py-4 text-left">الإجمالي</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 text-xs">
                              {invoice.items.map((item, idx) => (
                                <tr key={idx}>
                                   <td className="px-8 py-4 font-bold text-slate-800">{item.description}</td>
                                   <td className="px-8 py-4 text-center font-mono">{item.quantity}</td>
                                   <td className="px-8 py-4 text-center">{item.unitPrice} ر.س</td>
                                   <td className="px-8 py-4 text-left font-bold">{item.total} ر.س</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>

                        <div className="p-8 bg-slate-50 flex justify-end">
                           <div className="w-64 space-y-3">
                              <div className="flex justify-between text-xs text-slate-500">
                                 <span>المجموع الفرعي</span>
                                 <span>{invoice.grandTotal - invoice.tax} ر.س</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500">
                                 <span>ضريبة القيمة المضافة (15%)</span>
                                 <span>{invoice.tax} ر.س</span>
                              </div>
                              <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                                 <span>الإجمالي</span>
                                 <span>{invoice.grandTotal} ر.س</span>
                              </div>
                           </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex gap-4 bg-white">
                           <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                              <Info size={16} /> طباعة الفاتورة
                           </button>
                           <button className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">إرسال عبر الواتساب</button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4 text-right">رقم الفاتورة</th>
                        <th className="px-6 py-4 text-right">العميل</th>
                        <th className="px-6 py-4 text-center">التاريخ</th>
                        <th className="px-6 py-4 text-center">القيمة الإجمالية</th>
                        <th className="px-6 py-4 text-center">الحالة</th>
                        <th className="px-6 py-4 text-left">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600">{inv.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-800">{mockCustomers.find(c => c.id === inv.customerId)?.name}</td>
                          <td className="px-6 py-4 text-center text-slate-400">{new Date(inv.createdAt).toLocaleDateString('ar-SA')}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-900">{inv.grandTotal} ر.س</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {inv.status === 'paid' ? 'مدفوعة' : 'مستحقة'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-left font-bold text-blue-600">
                             <button onClick={() => setSelectedInvoiceId(inv.id)} className="hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                عرض <ChevronLeft size={14} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(showAddPart || showAppointmentModal || showTemplateModal || showMaintenanceModal) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 mt-auto mb-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  {showAddPart ? 'إضافة قطعة غيار جديدة' : 
                   showAppointmentModal ? 'جدولة موعد جديد' : 
                   showMaintenanceModal ? 'تسجيل صيانة وفاتورة' :
                   'إنشاء نموذج خدمة جديد'}
                </h3>
                <button 
                  onClick={() => { 
                    setShowAddPart(false); 
                    setShowAppointmentModal(false); 
                    setShowTemplateModal(false); 
                    setShowMaintenanceModal(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="space-y-1">
                   <label className="text-[10px] text-slate-500 font-bold uppercase">العنوان / المسمى</label>
                   <input type="text" className="w-full p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={showAddPart ? "اسم القطعة..." : showAppointmentModal ? "اسم العميل..." : "مثلاً: صيانة 50 ألف كم..."} />
                 </div>
                 
                 {showTemplateModal && (
                   <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">الوصف التفصيلي</label>
                      <textarea className="w-full p-2 border border-slate-200 rounded text-sm outline-none h-20 resize-none" placeholder="اكتب تفاصيل الخدمة التي سيتم حفظها..."></textarea>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">أجور اليد المقدرة</label>
                      <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" placeholder="0" />
                    </div>
                   </>
                 )}

                 {showMaintenanceModal && (
                   <>
                    <div className="space-y-1">
                       <label className="text-[10px] text-slate-500 font-bold uppercase">العميل</label>
                       <select className="w-full p-2 border border-slate-200 rounded text-sm outline-none">
                         {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] text-slate-500 font-bold uppercase">المركبة</label>
                       <select className="w-full p-2 border border-slate-200 rounded text-sm outline-none">
                         {mockVehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.plateNumber})</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] text-slate-500 font-bold uppercase">الممشى (كم)</label>
                         <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" placeholder="0" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] text-slate-500 font-bold uppercase">قيمة العمل</label>
                         <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" placeholder="0" />
                      </div>
                    </div>
                   </>
                 )}

                 {showAddPart && (
                   <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">الكمية</label>
                        <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">الحد الأدنى</label>
                        <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" placeholder="5" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                       <label className="text-[10px] text-slate-500 font-bold uppercase block">التوافق مع المركبات</label>
                       
                       {newPartCompatibility.length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-2">
                            {newPartCompatibility.map((c, i) => (
                              <div key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                                {c.make} {c.model} ({c.yearStart}-{c.yearEnd})
                                <button onClick={() => setNewPartCompatibility(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-600">×</button>
                              </div>
                            ))}
                         </div>
                       )}

                       <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder="الماركة (Toyota...)" 
                            className="p-2 border border-slate-200 rounded text-xs outline-none"
                            value={compatInputs.make}
                            onChange={(e) => setCompatInputs({...compatInputs, make: e.target.value})}
                          />
                          <input 
                            type="text" 
                            placeholder="الموديل (Camry...)" 
                            className="p-2 border border-slate-200 rounded text-xs outline-none"
                            value={compatInputs.model}
                            onChange={(e) => setCompatInputs({...compatInputs, model: e.target.value})}
                          />
                          <input 
                            type="number" 
                            placeholder="من سنة" 
                            className="p-2 border border-slate-200 rounded text-xs outline-none"
                            value={compatInputs.yearStart}
                            onChange={(e) => setCompatInputs({...compatInputs, yearStart: parseInt(e.target.value)})}
                          />
                          <input 
                            type="number" 
                            placeholder="إلى سنة" 
                            className="p-2 border border-slate-200 rounded text-xs outline-none"
                            value={compatInputs.yearEnd}
                            onChange={(e) => setCompatInputs({...compatInputs, yearEnd: parseInt(e.target.value)})}
                          />
                       </div>
                       <button 
                        type="button"
                        onClick={() => {
                          if (compatInputs.make && compatInputs.model) {
                            setNewPartCompatibility([...newPartCompatibility, compatInputs]);
                            setCompatInputs({ make: '', model: '', yearStart: 2010, yearEnd: 2024 });
                          }
                        }}
                        className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] hover:bg-slate-200 transition-all"
                       >
                          + إضافة توافق طراز محدد
                       </button>
                    </div>
                   </>
                 )}
                 {showAppointmentModal && (
                   <div className="space-y-4">
                     <div className="space-y-1">
                       <label className="text-[10px] text-slate-500 font-bold uppercase">نوع الخدمة</label>
                       <select className="w-full p-2 border border-slate-200 rounded text-sm outline-none">
                         <option>صيانة دورية</option>
                         <option>إصلاح عطل</option>
                         <option>فحص شامل</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] text-slate-500 font-bold uppercase">الموعد</label>
                       <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" />
                     </div>
                   </div>
                 )}
                 <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4">
                    حفظ البيانات
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      )}

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4" dir="rtl">
        <AnimatePresence>
          {showAiAssistant && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4"
            >
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-blue-400" />
                  <span className="font-bold text-sm">مساعد الأمان الذكي (AI)</span>
                </div>
                <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50 flex flex-col scrollbar-thin">
                {assistantChat.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-50">
                    <Bot size={40} className="text-slate-400" />
                    <p className="text-xs text-slate-600 font-medium">مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في تحليل بيانات العملاء، توقع الصيانة، أو كتابة رسائل ترويجية.</p>
                  </div>
                )}
                {assistantChat.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {assistantLoading && (
                  <div className="flex justify-end">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssistantSendMessage()}
                    placeholder="اسألني عن الصيانة أو الرسائل..."
                    className="w-full pr-4 pl-10 py-2.5 bg-slate-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                  <button 
                    onClick={handleAssistantSendMessage}
                    disabled={assistantLoading || !assistantInput.trim()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-md"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowAiAssistant(!showAiAssistant)}
          className={`w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative ${showAiAssistant ? 'bg-blue-600' : ''}`}
        >
          {showAiAssistant ? <X size={24} /> : <Sparkles size={24} className="group-hover:animate-pulse" />}
          {!showAiAssistant && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
