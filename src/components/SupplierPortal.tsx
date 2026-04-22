import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { generateZatcaTlv } from '../lib/zatca';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Globe, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  TrendingUp, 
  Users, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Palette, 
  Monitor, 
  Rocket, 
  Shield 
} from 'lucide-react';
import { Supplier, SupplierPart, PurchaseOrder, SupplierStoreConfig, CompatibleVehicle } from '../types';

interface SupplierPortalProps {
  supplier: Supplier;
  parts: SupplierPart[];
  orders: PurchaseOrder[];
  onLogout: () => void;
}

export default function SupplierPortal({ supplier, parts, orders, onLogout }: SupplierPortalProps) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartCompatibility, setNewPartCompatibility] = useState<CompatibleVehicle[]>([]);
  const [compatInputs, setCompatInputs] = useState<CompatibleVehicle>({ make: '', model: '', yearStart: 2010, yearEnd: 2024 });
  const [storeConfig, setStoreConfig] = useState<SupplierStoreConfig>({
    supplierId: supplier.id,
    storeName: supplier.name,
    primaryColor: '#2563eb',
    isPublished: false,
    featuredCategories: supplier.category
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 shadow-xl flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-xl italic text-white shadow-lg shadow-blue-600/20">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-white">بوابة الموردين</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 text-slate-400">
          {[
            { id: 'inventory', icon: Package, label: 'إدارة المخزون' },
            { id: 'orders', icon: ShoppingCart, label: 'طلبـات الورش' },
            { id: 'store-builder', icon: Globe, label: 'متجري الإلكتروني' },
            { id: 'analytics', icon: TrendingUp, label: 'التقارير' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' 
                : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-bold text-sm hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="text-xl font-black text-slate-900">{supplier.name}</div>
             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest">مورد معتمد</span>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-3">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="بحث في النظام..." className="bg-transparent border-none outline-none text-xs w-48" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
           <AnimatePresence mode="wait">
              {activeTab === 'inventory' && (
                <motion.div 
                  key="inventory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">إدارة المخزون والتسعير</h2>
                      <div className="flex gap-4 items-center">
                         <div className="relative">
                            <input 
                              type="text" 
                              placeholder="ابحث حسب الطراز (تويوتا...)" 
                              className="pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500 w-64 font-bold"
                            />
                            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         </div>
                         <button 
                           onClick={() => setShowAddPart(true)}
                           className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                         >
                            <Plus size={16} /> إضافة قطعة غيار
                         </button>
                      </div>
                   </div>

                   <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                      <table className="w-full text-right text-xs">
                         <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-widest">
                            <tr>
                               <th className="px-8 py-5">البيان</th>
                               <th className="px-8 py-5">رقم القطعة (SKU)</th>
                               <th className="px-8 py-5">التصنيف</th>
                               <th className="px-8 py-5 text-center">المخزون الحالي</th>
                               <th className="px-8 py-5 text-center">سعر البيع</th>
                               <th className="px-8 py-5 text-left">الإجراءات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {parts.map(part => (
                               <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-8 py-5">
                                     <div className="font-bold text-slate-900">{part.name}</div>
                                     <div className="text-[10px] text-slate-400 mt-1">{part.compatibleVehicles.join(', ')}</div>
                                  </td>
                                  <td className="px-8 py-5 font-mono text-blue-600 font-bold">{part.sku} {part.originalPartNumber && <span className="text-slate-300"> | {part.originalPartNumber}</span>}</td>
                                  <td className="px-8 py-5"><span className="bg-slate-100 px-2 py-1 rounded font-bold">{part.category}</span></td>
                                  <td className="px-8 py-5 text-center">
                                     <span className={`font-bold ${part.stock < part.minStock ? 'text-red-500' : 'text-slate-800'}`}>{part.stock} وحدة</span>
                                  </td>
                                  <td className="px-8 py-5 text-center font-black">{part.price} ر.س</td>
                                  <td className="px-8 py-5 text-left">
                                     <button className="text-blue-600 font-bold hover:underline">تعديل</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">طلبات الشراء من الورش</h2>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {orders.map(order => {
                          const vatAmount = order.totalAmount * 0.15;
                          const zatcaData = generateZatcaTlv({
                            sellerName: supplier.name,
                            vatNumber: "300098765400003", // Mock VAT for supplier
                            timestamp: order.createdAt,
                            totalWithVat: order.totalAmount + vatAmount,
                            vatAmount: vatAmount
                          });

                          return (
                            <div key={order.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                <div className="flex justify-between items-start mb-6">
                                   <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">طلب شراء #{order.id}</div>
                                      <h4 className="font-black text-slate-900 leading-tight">ورشة الأمان لخدمات السيارات</h4>
                                      <div className="text-[9px] text-slate-400 mt-1 font-bold">الرقم الضريبي للمشتري: 310055443300003</div>
                                   </div>
                                   <div className="flex flex-col items-end gap-2">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                         {order.status === 'pending' ? 'رغبة في الشراء' : 'تم الشحن'}
                                      </span>
                                      <div className="bg-slate-50 p-1 rounded-lg border border-slate-100">
                                        <QRCodeSVG value={zatcaData} size={48} level="M" />
                                      </div>
                                   </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                   {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-dashed border-slate-100">
                                         <span className="text-slate-600 font-bold">{parts.find(p => p.id === item.partId)?.name}</span>
                                         <div className="flex gap-4 items-center">
                                            <span className="text-xs text-slate-400">× {item.quantity}</span>
                                            <span className="font-black">{item.total} ر.س</span>
                                         </div>
                                      </div>
                                   ))}
                                   <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2">
                                      <span>ضريبة القيمة المضافة (15%)</span>
                                      <span>{vatAmount.toFixed(2)} ر.س</span>
                                   </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                   <div className="text-xl font-black">{(order.totalAmount + vatAmount).toFixed(2)} ر.س</div>
                                   <div className="flex gap-2">
                                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                                         <Truck size={16} /> تعميد وشحن
                                      </button>
                                   </div>
                                </div>
                            </div>
                          );
                       })}
                   </div>
                </motion.div>
              )}

              {activeTab === 'store-builder' && (
                <motion.div 
                  key="store-builder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-600/30 underline-offset-8">منشئ المتجر الإلكتروني للقطع</h2>
                        <p className="text-slate-500 mt-2 text-sm">اجعل مخزونك متاحاً للبيع المباشر للعملاء والورش عبر متجرك المخصص.</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            <Rocket size={12} /> باقة التجارة المتقدمة
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Store settings form */}
                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                           <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
                              <Palette size={20} className="text-blue-600" /> هوية المتجر
                           </h3>
                           
                           <div className="space-y-4">
                              <div className="space-y-1.5">
                                 <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">اسم المتجر</label>
                                 <input 
                                    type="text" 
                                    value={storeConfig.storeName}
                                    onChange={(e) => setStoreConfig({...storeConfig, storeName: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                 />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">اللون الرئيسي</label>
                                    <input 
                                       type="color" 
                                       value={storeConfig.primaryColor}
                                       onChange={(e) => setStoreConfig({...storeConfig, primaryColor: e.target.value})}
                                       className="w-full h-11 p-1 border border-slate-100 rounded-xl bg-white cursor-pointer"
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">حالة المتجر</label>
                                    <button 
                                      onClick={() => setStoreConfig({...storeConfig, isPublished: !storeConfig.isPublished})}
                                      className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                         storeConfig.isPublished ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                                      }`}
                                    >
                                       {storeConfig.isPublished ? 'منشور أونلاين' : 'مسودة (Draft)'}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-6">
                              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                 <Monitor size={18} /> معاينة المتجر الكاملة
                              </button>
                           </div>
                        </div>

                        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                           <div className="relative z-10">
                              <h4 className="text-lg font-black italic tracking-tight mb-2">أطلق متجرك المخصص</h4>
                              <p className="text-blue-100 text-xs mb-6 opacity-80">سيتمكن العملاء من البحث عن القطع برقم الهيكل أو الموديل والشراء مباشرة.</p>
                              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                                 <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-blue-200 text-left">Store URL</div>
                                 <div className="font-mono text-sm tracking-tight text-left">shop.warshapro.app/{supplier.id}</div>
                              </div>
                           </div>
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform"></div>
                        </div>
                      </div>

                      {/* Previewer Mock */}
                      <div className="flex flex-col items-center gap-6">
                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                           <Monitor size={14} /> معاينة صفحة المتجر (Desktop)
                         </div>
                         <div className="bg-white w-full aspect-video rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative group">
                            {/* Browser UI */}
                            <div className="h-8 bg-slate-100 flex items-center px-4 gap-1.5 border-b border-slate-200">
                               <div className="w-2 h-2 rounded-full bg-red-400"></div>
                               <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                               <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                               <div className="flex-1 mx-4 bg-white h-5 rounded flex items-center px-3 gap-2">
                                  <Globe size={10} className="text-slate-300" />
                                  <div className="text-[8px] text-slate-400 font-mono">shop.warshapro.app/{supplier.id}</div>
                               </div>
                            </div>
                            
                            {/* Mock Store Content */}
                            <div className="bg-slate-50 h-full overflow-y-auto scrollbar-hide">
                               <nav className="h-12 bg-white px-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
                                  <div className="font-black text-xs" style={{ color: storeConfig.primaryColor }}>{storeConfig.storeName}</div>
                                  <div className="flex gap-4">
                                     <div className="h-2 w-12 bg-slate-100 rounded"></div>
                                     <div className="h-2 w-12 bg-slate-100 rounded"></div>
                                     <ShoppingCart size={14} className="text-slate-300" />
                                  </div>
                               </nav>

                               <div className="p-6">
                                  <div className="h-32 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-between mb-6">
                                     <div>
                                        <div className="text-lg font-black text-slate-900">{storeConfig.storeName}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">قطع غيار أصلية وضمان على كل المشتريات</div>
                                        <div className="flex gap-2 mt-4">
                                           <div className="px-2 py-1 bg-slate-100 rounded text-[8px] font-bold">تويوتا</div>
                                           <div className="px-2 py-1 bg-slate-100 rounded text-[8px] font-bold">نيسان</div>
                                        </div>
                                     </div>
                                     <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                        Logo
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                     {parts.concat(parts).concat(parts).slice(0, 6).map((p, i) => (
                                       <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                                          <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center text-[10px] text-slate-300">Part Image</div>
                                          <div className="text-[10px] font-bold text-slate-900 leading-tight">{p.name}</div>
                                          <div className="flex justify-between items-center mt-2">
                                             <div className="text-[10px] font-black" style={{ color: storeConfig.primaryColor }}>{p.price} ر.س</div>
                                             <ShoppingCart size={10} className="text-slate-400" />
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>

      {/* Add Part Modal */}
      <AnimatePresence>
        {showAddPart && (
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
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 mt-auto mb-auto text-right"
              dir="rtl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black italic tracking-tight text-slate-800">إضافة قطعة غيار جديدة</h3>
                <button 
                  onClick={() => setShowAddPart(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="space-y-1">
                   <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">اسم القطعة</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="مثلاً: فحمات فرامل أمامية" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">السعر (ر.س)</label>
                      <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">الكمية</label>
                      <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold" placeholder="0" />
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-slate-100">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">التوافق مع الموديلات (Make, Model, Year)</label>
                    
                    {newPartCompatibility.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                         {newPartCompatibility.map((c, i) => (
                           <div key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-blue-100">
                             {c.make} {c.model} ({c.yearStart}-{c.yearEnd})
                             <button onClick={() => setNewPartCompatibility(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-600 transition-colors">×</button>
                           </div>
                         ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                       <input 
                         type="text" 
                         placeholder="الماركة" 
                         className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none font-bold placeholder:font-normal"
                         value={compatInputs.make}
                         onChange={(e) => setCompatInputs({...compatInputs, make: e.target.value})}
                       />
                       <input 
                         type="text" 
                         placeholder="الموديل" 
                         className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none font-bold placeholder:font-normal"
                         value={compatInputs.model}
                         onChange={(e) => setCompatInputs({...compatInputs, model: e.target.value})}
                       />
                       <input 
                         type="number" 
                         placeholder="من سنة" 
                         className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none font-bold placeholder:font-normal"
                         value={compatInputs.yearStart}
                         onChange={(e) => setCompatInputs({...compatInputs, yearStart: parseInt(e.target.value)})}
                       />
                       <input 
                         type="number" 
                         placeholder="إلى سنة" 
                         className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none font-bold placeholder:font-normal"
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
                      className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] hover:bg-blue-100 transition-all border border-blue-100 uppercase tracking-widest"
                    >
                       + إضافة طراز متوافق
                    </button>
                 </div>

                 <button 
                  onClick={() => setShowAddPart(false)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all mt-4 uppercase tracking-widest"
                 >
                    حفظ البيانات
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
