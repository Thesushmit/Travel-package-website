import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authApi.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then(({ user }) => {
        setUser(user);
      })
      .catch(() => {
        authApi.setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    toast({
      title: 'Success',
      description: `Welcome back, ${user.name}!`
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user } = await authApi.register({ email, password, name });
      handleAuthSuccess(user);
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await authApi.login({ email, password });
      handleAuthSuccess(user);
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      authApi.setToken(null);
      setUser(null);
      toast({
        title: 'Success',
        description: 'Logged out successfully!'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
