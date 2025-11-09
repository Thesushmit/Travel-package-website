/**
 * API Service
 * Supabase client instance and API utilities
 * This file provides a centralized API client for the application
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get Supabase client instance
 * @returns Supabase client
 */
export const getSupabaseClient = () => {
  return supabase;
};

/**
 * API utility functions
 */
export const api = {
  /**
   * Get travel packages
   * @param {Object} filters - Filter options
   * @returns Promise with packages data
   */
  getPackages: async (filters?: any) => {
    let query = supabase.from('travel_packages').select('*');
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,location_city.ilike.%${filters.search}%,location_country.ilike.%${filters.search}%`);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }
    
    if (filters?.priceRange) {
      if (filters.priceRange === 'low') {
        query = query.lte('price', 1000);
      } else if (filters.priceRange === 'medium') {
        query = query.gte('price', 1000).lte('price', 2000);
      } else if (filters.priceRange === 'high') {
        query = query.gte('price', 2000);
      }
    }
    
    if (filters?.sortBy) {
      if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (filters.sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      }
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Get package by slug
   * @param {string} slug - Package slug
   * @returns Promise with package data
   */
  getPackageBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get user bookings
   * @param {string} userId - User ID
   * @returns Promise with bookings data
   */
  getBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        travel_packages (
          id,
          title,
          slug,
          images,
          location_city,
          location_country,
          currency
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Create booking
   * @param {Object} bookingData - Booking data
   * @returns Promise with created booking
   */
  createBooking: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

export default api;

