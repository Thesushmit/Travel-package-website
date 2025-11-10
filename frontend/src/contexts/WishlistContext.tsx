import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/api';

interface WishlistItem {
  id: string;
  user_id: string;
  package_id: string;
  created_at: string;
  travel_packages?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    slug: string;
    images: string[] | null;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (packageId: string) => Promise<void>;
  removeFromWishlist: (wishlistItemId: string) => Promise<void>;
  isInWishlist: (packageId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { wishlist } = await wishlistApi.list();
      return wishlist as WishlistItem[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (packageId: string) => {
      if (!user) throw new Error('You must be logged in');
      await wishlistApi.add({ package_id: packageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Success',
        description: 'Added to wishlist',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update wishlist',
        variant: 'destructive',
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (wishlistItemId: string) => {
      if (!user) throw new Error('You must be logged in');
      await wishlistApi.remove(wishlistItemId);
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
        description: error.message || 'Failed to update wishlist',
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
    await addMutation.mutateAsync(packageId);
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    await removeMutation.mutateAsync(wishlistItemId);
  };

  const isInWishlist = (packageId: string) => {
    return wishlistItems.some((item) => item.package_id === packageId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isLoading, addToWishlist, removeFromWishlist, isInWishlist }}>
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

