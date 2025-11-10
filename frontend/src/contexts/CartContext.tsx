import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/api';

interface CartItem {
  id: string;
  package_id: string;
  booking_date: string | null;
  number_of_guests: number;
  created_at: string;
  updated_at: string;
  travel_packages?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[] | null;
    slug: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (packageId: string, numberOfGuests?: number, bookingDate?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, numberOfGuests: number, bookingDate?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { cart } = await cartApi.list();
      return cart as CartItem[];
    },
    enabled: !!user,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ packageId, numberOfGuests = 1, bookingDate }: { packageId: string; numberOfGuests?: number; bookingDate?: string }) => {
      if (!user) throw new Error('You must be logged in to add items to cart');
      const payload = {
        package_id: packageId,
        number_of_guests: numberOfGuests,
        booking_date: bookingDate || null
      };
      const { item } = await cartApi.upsert(payload);
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: 'Success',
        description: 'Item added to cart',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        variant: 'destructive',
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      if (!user) throw new Error('You must be logged in');
      await cartApi.remove(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: 'Success',
        description: 'Item removed from cart',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item from cart',
        variant: 'destructive',
      });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ cartItemId, numberOfGuests, bookingDate }: { cartItemId: string; numberOfGuests: number; bookingDate?: string }) => {
      if (!user) throw new Error('You must be logged in');
      await cartApi.update(cartItemId, {
        number_of_guests: numberOfGuests,
        booking_date: bookingDate || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: 'Success',
        description: 'Cart updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update cart',
        variant: 'destructive',
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in');
      await cartApi.clear();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: 'Success',
        description: 'Cart cleared',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clear cart',
        variant: 'destructive',
      });
    },
  });

  const addToCart = async (packageId: string, numberOfGuests = 1, bookingDate?: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      return;
    }
    await addToCartMutation.mutateAsync({ packageId, numberOfGuests, bookingDate });
  };

  const removeFromCart = async (cartItemId: string) => {
    await removeFromCartMutation.mutateAsync(cartItemId);
  };

  const updateCartItem = async (cartItemId: string, numberOfGuests: number, bookingDate?: string) => {
    await updateCartItemMutation.mutateAsync({ cartItemId, numberOfGuests, bookingDate });
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.travel_packages?.price || 0;
    const guests = item.number_of_guests || 1;
    return total + price * guests;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

