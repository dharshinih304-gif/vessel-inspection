import axios from 'axios';
import { supabase } from '@/lib/supabase';

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';

const smoothInstance = axios.create({
  baseURL: EDGE_FUNCTION_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4',
  },
});

const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload && typeof payload.exp === 'number') {
      // Return true if expired or within 10 seconds of expiring
      return Date.now() / 1000 > payload.exp - 10;
    }
    return false;
  } catch (e) {
    return true;
  }
};

smoothInstance.interceptors.request.use(async (config) => {
  let token = null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.access_token && !isTokenExpired(session.access_token)) {
      token = session.access_token;
    }
  } catch (e) {
    console.error('Error fetching Supabase session in interceptor:', e);
  }

  if (!token && typeof window !== 'undefined') {
    const storedToken = sessionStorage.getItem('supabase-token') || localStorage.getItem('supabase-token');
    if (storedToken && !isTokenExpired(storedToken)) {
      token = storedToken;
    }

    if (!token) {
      // Robust scanning for Supabase local storage key in both sessionStorage and localStorage
      const storageSources = [sessionStorage, localStorage];
      for (const storage of storageSources) {
        try {
          const keys = Object.keys(storage);
          const authKey = keys.find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
          if (authKey) {
            const sessionStr = storage.getItem(authKey);
            if (sessionStr) {
              const session = JSON.parse(sessionStr);
              const foundToken = session?.access_token || session?.token;
              if (foundToken && !isTokenExpired(foundToken)) {
                token = foundToken;
                break;
              }
            }
          }
        } catch (e) {
          console.error('Error parsing auth session token from storage:', e);
        }
      }
    }
  }
  
  if (!token) {
    token = anonKey;
  }
  
  if (config.headers) {
    config.headers['apikey'] = anonKey;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  console.log(`[API Interceptor] URL: ${config.url}, TokenPrefix: ${token ? token.substring(0, 15) : 'none'}`);
  return config;
});

// Generic CRUD factory
const createCrud = (resource: string) => ({
  getAll: (params?: any) => smoothInstance.get(`${resource}`, { params }).then(res => res.data),
  getOne: (id: string) => smoothInstance.get(`${resource}`, { params: { id } }).then(res => res.data),
  create: (data: any) => smoothInstance.post(`${resource}`, data).then(res => res.data),
  update: (id: string, data: any) => smoothInstance.put(`${resource}`, { ...data }, { params: { id } }).then(res => res.data),
  delete: (id: string) => smoothInstance.delete(`${resource}`, { params: { id } }).then(res => res.data),
});

export const authApi = {
  login: (data: any) => smoothInstance.post('login', data).then(res => res.data),
};

export const categoriesApi = createCrud('categories');
export const reportItemsApi = createCrud('report-items');
export const vesselsApi = {
  ...createCrud('vessels'),
  getStats: () => smoothInstance.get('vessels?stats=true').then(res => res.data),
};
export const reportsApi = createCrud('reports');
export const usersApi = createCrud('users');

// Support for 51 tables
export const getTableData = (tableName: string, params?: any) => smoothInstance.get(`${tableName}`, { params }).then(res => res.data);
export const updateTableRow = (tableName: string, id: string | null, data: any, params?: any) => smoothInstance.put(`${tableName}`, data, { params: { id, ...params } }).then(res => res.data);
export const insertTableRow = (tableName: string, data: any) => smoothInstance.post(`${tableName}`, data).then(res => res.data);
export const deleteTableRow = (tableName: string, id?: string | null, params?: any) => smoothInstance.delete(`${tableName}`, { params: { id, ...params } }).then(res => res.data);

export default smoothInstance;
