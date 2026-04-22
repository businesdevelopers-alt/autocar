import { Customer, Vehicle, Part, JobCard, Invoice, Appointment, MaintenanceRecord, Supplier, SupplierPart, PurchaseOrder } from './types';

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'قطع الغيار الأصلية المحدودة',
    contactPerson: 'محمد العتيبي',
    phone: '0501234567',
    email: 'info@originalparts.com',
    category: ['تويوتا', 'هيونداي'],
    address: 'الصناعية القديمة، الرياض',
    rating: 4.8
  },
  {
    id: 'sup2',
    name: 'المركز الدولي للفلاتر والزيوت',
    contactPerson: 'خالد يوسف',
    phone: '0559876543',
    email: 'contact@intl-filters.com',
    category: ['زيوت', 'فلاتر'],
    address: 'حي السلي، الرياض',
    rating: 4.5
  }
];

export const mockSupplierParts: SupplierPart[] = [
  {
    id: 'sp1',
    supplierId: 'sup1',
    name: 'فحمات أمامية - لاندكروزر',
    sku: 'TY-LC-PAD-01',
    category: 'فرامل',
    price: 450,
    cost: 320,
    stock: 25,
    minStock: 5,
    compatibility: [
      { make: 'Toyota', model: 'Land Cruiser', yearStart: 2015, yearEnd: 2023 }
    ],
    compatibleVehicles: ['Toyota Land Cruiser (2015-2023)'],
    originalPartNumber: '04465-60330'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    workshopId: 'ws1',
    supplierId: 'sup1',
    items: [{ partId: 'sp1', quantity: 2, unitPrice: 450, total: 900 }],
    totalAmount: 900,
    status: 'pending',
    createdAt: '2024-04-20T08:00:00Z',
    updatedAt: '2024-04-20T08:00:00Z'
  }
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'm1',
    vehicleId: 'v1',
    date: '2024-01-10T10:00:00Z',
    mileage: 45000,
    serviceDescription: 'تغيير زيت وفلتر',
    partsReplaced: ['زيت محرك 5W30', 'فلتر زيت'],
    cost: 350,
    invoiceId: 'inv1'
  },
  {
    id: 'm2',
    vehicleId: 'v1',
    date: '2023-06-15T09:00:00Z',
    mileage: 38000,
    serviceDescription: 'فحص فرامل وتغيير أقمشة',
    partsReplaced: ['فحمات أمامية'],
    cost: 500,
    invoiceId: 'inv2'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    customerId: 'c1',
    vehicleId: 'v1',
    technicianId: 't1',
    serviceType: 'صيانة دورية',
    scheduledAt: '2026-04-22T10:00:00Z',
    status: 'confirmed',
    reminderSent: false
  },
  {
    id: 'a2',
    customerId: 'c2',
    vehicleId: 'v2',
    technicianId: 't2',
    serviceType: 'فحص مكيف',
    scheduledAt: '2026-04-23T14:30:00Z',
    status: 'pending',
    reminderSent: false
  }
];

export const mockServiceTemplates: any[] = [
  {
    id: 'st1',
    title: 'تغيير زيت وفلتر',
    description: 'تغيير زيت المحرك 5W30 مع الفلتر الأصلي وفحص السوائل.',
    estimatedLaborCost: 50,
    suggestedPartIds: ['p1']
  },
  {
    id: 'st2',
    title: 'تبديل فحمات فرامل',
    description: 'تبديل فحمات الفرامل الأمامية مع خرط الهوبات وتنظيف النظام.',
    estimatedLaborCost: 150,
    suggestedPartIds: ['p2']
  },
  {
    id: 'st3',
    title: 'صيانة مكيف شاملة',
    description: 'تنظيف بخاخات، تعبئة فريون، وتغيير فلتر المقصورة.',
    estimatedLaborCost: 200,
    suggestedPartIds: []
  }
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'أحمد محمود', phone: '0501234567', email: 'ahmed@example.com', address: 'الرياض، العليا', joinedAt: '2023-01-15' },
  { id: 'c2', name: 'سارة العتيبي', phone: '0559876543', joinedAt: '2023-05-20' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'v1', make: 'تويوتا', model: 'كامري', year: 2022, plateNumber: 'أ ب ج 1234', ownerId: 'c1' },
  { id: 'v2', make: 'هيونداي', model: 'إلنترا', year: 2020, plateNumber: 'س ص ع 5678', ownerId: 'c2' },
];

export const mockParts: Part[] = [
  { 
    id: 'p1', 
    name: 'زيت محرك 5W30', 
    sku: 'OIL-5W30-T', 
    category: 'زيوت', 
    price: 150, 
    cost: 90, 
    stock: 45, 
    minStock: 10, 
    compatibleVehicles: ['جميع الموديلات'] 
  },
  { 
    id: 'p2', 
    name: 'فحمات فرام أمامية', 
    sku: 'BRK-FRT-C22', 
    category: 'فرامل', 
    price: 280, 
    cost: 180, 
    stock: 12, 
    minStock: 5, 
    compatibility: [
      { make: 'Toyota', model: 'Camry', yearStart: 2018, yearEnd: 2023 }
    ],
    compatibleVehicles: ['Toyota Camry (2018-2023)'] 
  },
  { 
    id: 'p3', 
    name: 'فلتر هواء', 
    sku: 'AIR-FLTR-E20', 
    category: 'فلاتر', 
    price: 85, 
    cost: 40, 
    stock: 8, 
    minStock: 10, 
    compatibility: [
      { make: 'Hyundai', model: 'Elantra', yearStart: 2019, yearEnd: 2022 }
    ],
    compatibleVehicles: ['Hyundai Elantra (2019-2022)'] 
  },
];

export const mockJobCards: JobCard[] = [
  {
    id: 'jc1',
    customerId: 'c1',
    vehicleId: 'v1',
    technicianId: 't1',
    description: 'تغيير زيت وفلتر مع فحص الفرامل',
    status: 'in-progress',
    partsUsed: [{ partId: 'p1', quantity: 1, price: 150 }],
    laborCost: 100,
    totalCost: 250,
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-04-20T10:30:00Z',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    orderId: 'jc1',
    type: 'workshop',
    customerId: 'c1',
    items: [
      { description: 'زيت محرك 5W30', quantity: 1, unitPrice: 150, total: 150 },
      { description: 'فلتر زيت', quantity: 1, unitPrice: 40, total: 40 },
      { description: 'أجور اليد - صيانة دورية', quantity: 1, unitPrice: 160, total: 160 },
    ],
    tax: 52.5,
    discount: 0,
    grandTotal: 402.5,
    status: 'paid',
    createdAt: '2024-01-10T11:00:00Z',
  },
  {
    id: 'inv2',
    orderId: 'jc2',
    type: 'workshop',
    customerId: 'c1',
    items: [
      { description: 'فحمات أمامية', quantity: 1, unitPrice: 350, total: 350 },
      { description: 'أجور اليد - تبديل فحمات', quantity: 1, unitPrice: 150, total: 150 },
    ],
    tax: 75,
    discount: 0,
    grandTotal: 575,
    status: 'paid',
    createdAt: '2023-06-15T12:00:00Z',
  },
];
