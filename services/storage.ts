import { EventData, User } from '../types';

const EVENTS_KEY = 'aboutix_events';
const USER_KEY = 'aboutix_user'; // Current logged in user
const USERS_DB_KEY = 'aboutix_users_db'; // All registered users

export const getEvents = (): EventData[] => {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    // Sort by date ascending
    return parsed.sort((a: EventData, b: EventData) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (e) {
    return [];
  }
};

export const getUserEvents = (userId: string): EventData[] => {
  const allEvents = getEvents();
  return allEvents.filter(e => e.organizerId === userId);
};

export const saveEvent = (event: EventData): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index >= 0) {
    events[index] = event; // Update existing
  } else {
    events.push(event); // Add new
  }
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const updateEvent = (event: EventData): void => {
  saveEvent(event);
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== eventId);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const loginUser = (email: string, name: string): User => {
  // 1. Create/Login current user
  const user: User = {
    id: 'user-' + email.replace(/[^a-zA-Z0-9]/g, ''), // Simple consistent ID based on email
    email,
    name
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // 2. Update global User DB (for Admin view)
  const allUsers = getUsers();
  const existingIndex = allUsers.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    allUsers[existingIndex] = user; // Update info
  } else {
    allUsers.push(user); // Add new
  }
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));

  return user;
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Seed some data if empty
export const seedData = () => {
  if (getEvents().length === 0) {
    const today = new Date();
    
    // Create a dummy admin user in the DB so the seed events have an owner
    const adminUser: User = { id: 'admin', name: 'System Admin', email: 'admin@aboutix.com' };
    const users = getUsers();
    if (!users.find(u => u.id === 'admin')) {
      users.push(adminUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    const mockEvents: EventData[] = [
      {
        id: '1',
        title: 'Neon Future Summit',
        description: 'Ein Treffen der klügsten Köpfe der Tech-Branche in einer futuristischen Atmosphäre.',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString(),
        doorsOpen: '09:00',
        startTime: '10:00',
        location: 'Berlin, Kraftwerk',
        category: ['Technologie'],
        coverImage: 'https://picsum.photos/800/400?random=1',
        tickets: [{ id: 't1', name: 'Standard', price: 99, currency: 'EUR', available: 100 }],
        organizerId: 'admin',
        createdAt: Date.now()
      },
      {
        id: '2',
        title: 'Midnight Bass Festival',
        description: 'Tiefste Bässe und dunkle Vibes bis zum Morgengrauen.',
        date: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString(),
        doorsOpen: '22:00',
        startTime: '23:00',
        location: 'Hamburg, Docks',
        category: ['Musik', 'Party'],
        coverImage: 'https://picsum.photos/800/400?random=2',
        tickets: [{ id: 't2', name: 'Early Bird', price: 25, currency: 'EUR', available: 500 }],
        organizerId: 'admin',
        createdAt: Date.now()
      }
    ];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(mockEvents));
  }
};