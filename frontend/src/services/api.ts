const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => {
  return localStorage.getItem('authToken');
};

const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (!options.skipAuth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  setToken,
  getToken,
  async register(payload: { name: string; email: string; password: string }) {
    const data = await apiFetch<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true
    });
    setToken(data.token);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const data = await apiFetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true
    });
    setToken(data.token);
    return data;
  },
  async logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setToken(null);
  },
  async getMe() {
    return apiFetch<{ user: any }>('/api/auth/me');
  },
  async updateProfile(payload: { name?: string; avatar_url?: string | null }) {
    return apiFetch<{ user: any }>('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }
};

export const packageApi = {
  async list(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return apiFetch<{ data: any[]; count: number; page: number; totalPages: number }>(`/api/packages${qs ? `?${qs}` : ''}`);
  },
  async getTags() {
    return apiFetch<{ tags: string[] }>('/api/packages/tags');
  },
  async getBySlug(slug: string) {
    return apiFetch<{ package: any }>(`/api/packages/slug/${slug}`);
  },
  async getById(id: string) {
    return apiFetch<{ package: any }>(`/api/packages/${id}`);
  },
  async create(payload: any) {
    return apiFetch<{ package: any }>('/api/packages', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export const bookingApi = {
  async list() {
    return apiFetch<{ bookings: any[] }>('/api/bookings');
  },
  async create(payload: any) {
    return apiFetch<{ booking: any }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export const wishlistApi = {
  async list() {
    return apiFetch<{ wishlist: any[] }>('/api/wishlist');
  },
  async add(payload: { package_id: string }) {
    return apiFetch<{ item: any }>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async remove(id: string) {
    return apiFetch<{ message: string }>(`/api/wishlist/${id}`, {
      method: 'DELETE'
    });
  }
};

export const cartApi = {
  async list() {
    return apiFetch<{ cart: any[] }>('/api/cart');
  },
  async upsert(payload: { package_id: string; number_of_guests?: number; booking_date?: string | null }) {
    return apiFetch<{ item: any }>('/api/cart', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async update(id: string, payload: { number_of_guests?: number; booking_date?: string | null }) {
    return apiFetch<{ item: any }>(`/api/cart/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },
  async remove(id: string) {
    return apiFetch<{ message: string }>(`/api/cart/${id}`, {
      method: 'DELETE'
    });
  },
  async clear() {
    return apiFetch<{ message: string }>('/api/cart', {
      method: 'DELETE'
    });
  }
};

export default apiFetch;
