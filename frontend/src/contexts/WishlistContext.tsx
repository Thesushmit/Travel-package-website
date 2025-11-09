import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface WishlistItem {
  id: string;
  package_id: string;
  created_at: string;
  travel_packages?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[] | null;
    slug: string;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (packageId: string) => Promise<void>;
  removeFromWishlist: (wishlistItemId: string) => Promise<void>;
  isInWishlist: (packageId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          travel_packages (
            id,
            title,
            price,
            currency,
            images,
            slug
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (packageId: string) => {
      if (!user) throw new Error('You must be logged in to add items to wishlist');
      
      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          package_id: packageId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Success',
        description: 'Added to wishlist',
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: 'Already in wishlist',
          description: 'This item is already in your wishlist',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add to wishlist',
          variant: 'destructive',
        });
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (wishlistItemId: string) => {
      if (!user) throw new Error('You must be logged in');
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistItemId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Success',
        description: 'Removed from wishlist',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove from wishlist',
        variant: 'destructive',
      });
    },
  });

  const addToWishlist = async (packageId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to wishlist',
        variant: 'destructive',
      });
      return;
    }
    await addToWishlistMutation.mutateAsync(packageId);
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    await removeFromWishlistMutation.mutateAsync(wishlistItemId);
  };

  const isInWishlist = (packageId: string) => {
    return wishlistItems.some(item => item.package_id === packageId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

