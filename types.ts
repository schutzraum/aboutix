export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TicketProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: number;
  salesEnd?: string | null;
  discountType?: 'percent' | 'fixed' | null;
  discountValue?: number | null;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string; // ISO String for the day
  doorsOpen: string; // HH:mm
  startTime: string; // HH:mm
  location: string;
  category: string[]; // Changed to array for multi-select
  coverImage: string | null; // Base64 (Teaser-Bild)
  tickets: TicketProduct[];
  organizerId: string;
  createdAt: number;
  status?: 'draft' | 'published';
}

export enum ViewState {
  HOME = 'HOME',
  CREATE = 'CREATE',
  EVENT_DETAIL = 'EVENT_DETAIL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN',
  IMPRESSUM = 'IMPRESSUM',
  AGB = 'AGB',
  MY_EVENTS = 'MY_EVENTS',
  ACCOUNT = 'ACCOUNT',
  EDIT_EVENT = 'EDIT_EVENT'
}

export type EventGroup = {
  month: string;
  events: EventData[];
};