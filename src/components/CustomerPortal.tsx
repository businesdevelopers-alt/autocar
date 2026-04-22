import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { generateZatcaTlv } from '../lib/zatca';
import { 
  History, 
  FileText, 
  Calendar, 
  Car, 
  LogOut, 
  LayoutDashboard, 
  ChevronLeft,
  Bell,
  Clock,
  Wrench,
  CheckCircle2,
  CalendarDays,
  Plus
} from 'lucide-react';
import { 
  Customer, 
  Vehicle, 
  MaintenanceRecord, 
  Invoice, 
  Appointment 
} from '../types';

interface CustomerPortalProps {
  customer: Customer;
  vehicles: Vehicle[];
  records: MaintenanceRecord[];
  invoices: Invoice[];
  appointments: Appointment[];
  onLogout: () => void;
  onViewInvoice: (id: string) => void;
}

export default function CustomerPortal({ 
  customer, 
  vehicles, 
  records, 
  invoices, 
  appointments, 
  onLogout,
  onViewInvoice 
}: CustomerPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-xl italic text-white shadow-lg shadow-blue-600/20">
            W
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">بوابة العميل</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
            { id: 'vehicles', icon: Car, label: 'مركباتي' },
            { id: 'records', icon: History, label: 'سجلات الصيانة' },
            { id: 'invoices', icon: FileText, label: 'فواتيري' },
            { id: 'appointments', icon: Calendar, label: 'المواعيد' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">أهلاً بك، {customer.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-blue-50 rounded-full border border-blue-100 overflow-hidden">
                <img src={`https://picsum.photos/seed/${customer.id}/100`} alt="profile" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Car size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">المركبات المسجلة</div>
                      <div className="text-2xl font-black text-slate-900 leading-none mt-1">{vehicles.length}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">عمليات صيانة مكتملة</div>
                      <div className="text-2xl font-black text-slate-900 leading-none mt-1">{records.length}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <CalendarDays size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">مواعيد قادمة</div>
                      <div className="text-2xl font-black text-slate-900 leading-none mt-1">
                        {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Latest Appointments */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm tracking-tight">المواعيد القادمة</h3>
                      <button 
                        onClick={() => setShowBookingModal(true)}
                        className="text-[10px] px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                      >
                         حجز موعد جديد
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[300px]">
                       {appointments.length > 0 ? appointments.map(app => (
                        <div key={app.id} className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs flex-col leading-none">
                                 <span>{new Date(app.scheduledAt).getDate()}</span>
                                 <span className="text-[8px] uppercase">{new Date(app.scheduledAt).toLocaleDateString('ar-SA', { month: 'short' })}</span>
                              </div>
                              <div>
                                 <div className="text-xs font-bold text-slate-900">{app.serviceType}</div>
                                 <div className="text-[10px] text-slate-400">{new Date(app.scheduledAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                           </div>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.status === 'confirmed' ? 'مؤكد' : 'بانتظار التأكيد'}
                           </span>
                        </div>
                       )) : (
                        <div className="p-8 text-center text-slate-400 text-xs">لا توجد مواعيد مجدولة</div>
                       )}
                    </div>
                  </div>

                  {/* Latest Records Summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm tracking-tight">آخر عمليات الصيانة</h3>
                      <button 
                        onClick={() => setActiveTab('records')}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                         عرض الكل
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[300px]">
                       {records.slice(0, 3).map(record => (
                         <div key={record.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setActiveTab('records')}>
                            <div className="flex justify-between items-start mb-1">
                               <div className="text-xs font-bold text-slate-900">{record.serviceDescription}</div>
                               <span className="text-[10px] font-bold text-slate-400">{new Date(record.date).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">{record.partsReplaced.join('، ')}</div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div 
                key="vehicles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:w-3 transition-all"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Car size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{vehicle.make} {vehicle.model}</h4>
                        <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em]">{vehicle.year} — {vehicle.plateNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs py-2 border-b border-slate-50">
                          <span className="text-slate-400">رقم اللوحة</span>
                          <span className="font-mono font-bold text-slate-800">{vehicle.plateNumber}</span>
                       </div>
                       <div className="flex justify-between text-xs py-2">
                          <span className="text-slate-400">تاريخ آخر صيانة</span>
                          <span className="font-bold text-slate-800">2024-04-20</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('records')}
                      className="w-full mt-4 py-2 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      عرض تاريخ الصيانة
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'records' && (
              <motion.div 
                key="records"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">الخدمة المنفذة</th>
                      <th className="p-4">قطع الغيار</th>
                      <th className="p-4">التكلفة</th>
                      <th className="p-4 text-left">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {records.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-400">{new Date(record.date).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4 font-bold text-slate-800">{record.serviceDescription}</td>
                        <td className="p-4 text-slate-500">{record.partsReplaced.join('، ')}</td>
                        <td className="p-4 font-black">{record.cost} ر.س</td>
                        <td className="p-4 text-left">
                           {record.invoiceId && (
                             <button 
                               onClick={() => onViewInvoice(record.invoiceId!)}
                               className="text-blue-600 font-bold hover:underline"
                             >
                               عرض الفاتورة
                             </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'invoices' && (
               <motion.div 
                key="invoices"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">رقم الفاتورة</th>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">القيمة الإجمالية</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4 font-mono font-bold text-blue-600">{invoice.id}</td>
                        <td className="p-4 text-slate-500">{new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4 font-black text-slate-900">{invoice.grandTotal} ر.س</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {invoice.status === 'paid' ? 'مدفوعة' : 'مستحقة'}
                          </span>
                        </td>
                        <td className="p-4 text-left font-bold text-blue-600">
                           <button onClick={() => onViewInvoice(invoice.id)} className="hover:underline opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                              عرض <ChevronLeft size={14} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div 
                key="appointments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold tracking-tight text-slate-900">إدارة المواعيد</h3>
                   <button 
                      onClick={() => setShowBookingModal(true)}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                   >
                     <Plus size={18} />
                     حجز موعد صيانة جديد
                   </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map(app => (
                       <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                          <div className={`absolute top-0 left-0 w-2 h-full ${app.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <div className="flex items-center justify-between mb-4">
                             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{new Date(app.scheduledAt).toLocaleDateString('ar-SA')}</div>
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {app.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                             </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mb-2">{app.serviceType}</h4>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                             <div className="flex items-center gap-1">
                                <Clock size={14} className="text-blue-500" />
                                {new Date(app.scheduledAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                             </div>
                             <div className="flex items-center gap-1">
                                <Wrench size={14} className="text-blue-500" />
                                مركز الخدمة الرئيسي
                             </div>
                          </div>
                          <div className="mt-6 flex gap-2">
                             <button className="flex-1 py-2 text-[10px] font-bold text-slate-400 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">إلغاء الموعد</button>
                             {app.status !== 'confirmed' && (
                               <button className="flex-1 py-2 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">طلب تعديل</button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">حجز موعد صيانة جديد</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                 <div className="space-y-1">
                    <label>اختر المركبة</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                       {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} - {v.plateNumber}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label>نوع الخدمة المطلوبة</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                       <option>صيانة دورية</option>
                       <option>إصلاح عطل كهربائي</option>
                       <option>فحص شامل</option>
                       <option>تغيير زيت وسيفون</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label>التاريخ والوقت المفضل</label>
                    <input type="datetime-local" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                 </div>
                 <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4">
                    إرسال طلب الحجز
                 </button>
                 <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                    * سيقوم موظف الاستقبال بتأكيد موعدكم خلال ساعة عمل واحدة عبر رسالة نصية.
                 </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
