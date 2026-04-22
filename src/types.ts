export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
  ownerId: string;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  joinedAt: string;
}

export interface CompatibleVehicle {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  compatibility?: CompatibleVehicle[];
  compatibleVehicles: string[]; // Keep for legacy/simple display
}

export type JobStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface JobCard {
  id: string;
  customerId: string;
  vehicleId: string;
  technicianId: string;
  description: string;
  status: JobStatus;
  partsUsed: { partId: string; quantity: number; price: number }[];
  laborCost: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  technicianId: string;
  serviceType: string;
  scheduledAt: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reminderSent: boolean;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage?: number;
  serviceDescription: string;
  partsReplaced: string[];
  cost: number;
  invoiceId?: string;
  jobCardId?: string;
}

export interface ServiceTemplate {
  id: string;
  title: string;
  description: string;
  estimatedLaborCost: number;
  suggestedPartIds: string[];
}

export interface Invoice {
  id: string;
  orderId: string;
  type: 'workshop' | 'parts-sale';
  customerId: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  tax: number;
  discount: number;
  grandTotal: number;
  status: 'paid' | 'unpaid' | 'overdue';
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string[]; // e.g., ['TOYOTA', 'FORD', 'BRAKES']
  address: string;
  rating: number;
}

export interface SupplierPart extends Part {
  supplierId: string;
  originalPartNumber?: string;
}

export type POStatus = 'draft' | 'pending' | 'shipped' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  workshopId: string;
  supplierId: string;
  items: { partId: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierStoreConfig {
  supplierId: string;
  storeName: string;
  primaryColor: string;
  bannerImage?: string;
  logoUrl?: string;
  isPublished: boolean;
  featuredCategories: string[];
}

export interface WorkshopLandingConfig {
  title: string;
  tagline: string;
  primaryColor: string;
  services: string;
  contactPhone: string;
  isLive: boolean;
}
