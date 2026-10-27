import {createContext,useContext} from 'react';
import type {Equipment} from '../data';
export type Account = { id: string; name: string; email: string; role: 'CUSTOMER' | 'OWNER' | 'ADMIN' };
export type RentalRequest = { id: string; title: string; service: string; location: string; start: string; days: number; name: string; email: string; notes: string; estimate: number | null; equipmentId: number | null; status: 'SUBMITTED' | 'QUOTED' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'; quotedAmount: number | null; quoteNotes: string | null };
export type RequestInput = { title: string; service?: string; location: string; start: string; days: number; name: string; email: string; notes: string; equipmentId?: number };
export type Marketplace = {
  catalog: Equipment[]; saved: number[]; savedEquipment: Equipment[]; requests: RentalRequest[]; ownEquipment: Equipment[];
  user: Account | null; sessionLoading: boolean; catalogLoading: boolean; catalogError: string; workspaceLoading: boolean; workspaceError: string;
  signIn: (email: string, password: string) => Promise<void>; register: (values: { name: string; email: string; password: string; role: 'CUSTOMER' | 'OWNER' }) => Promise<void>; signOut: () => Promise<void>;
  toggleSave: (id: number) => void; addRequest: (input: RequestInput) => Promise<string>;
  updateRequest: (id: string, patch: { status: RentalRequest['status']; quotedAmount?: number; quoteNotes?: string }) => Promise<void>;
  removeRequest: (id: string) => Promise<void>; addEquipment: (item: Omit<Equipment, 'id' | 'status'>) => Promise<number>;
  removeEquipment: (id: number) => Promise<void>; notify: (message: string) => void;
  reloadCatalog: () => Promise<void>; reloadWorkspace: () => Promise<void>;
};
export const MarketplaceContext = createContext<Marketplace | null>(null);

export function useMarketplace(){const context=useContext(MarketplaceContext);if(!context)throw new Error('MarketplaceProvider is required.');return context;}
