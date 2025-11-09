-- Fix RLS policies to allow service role inserts and improve security

-- Drop existing travel_packages policies
DROP POLICY IF EXISTS "Admins can insert packages" ON public.travel_packages;
DROP POLICY IF EXISTS "Admins can update packages" ON public.travel_packages;
DROP POLICY IF EXISTS "Admins can delete packages" ON public.travel_packages;

-- Recreate with better policies
-- Allow authenticated admins to insert
CREATE POLICY "Admins can insert packages"
  ON public.travel_packages FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

-- Allow authenticated admins to update
CREATE POLICY "Admins can update packages"
  ON public.travel_packages FOR UPDATE
  USING (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete packages"
  ON public.travel_packages FOR DELETE
  USING (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

-- Improve bookings policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Admins can delete all bookings"
  ON public.bookings FOR DELETE
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

-- Improve wishlist policies (already good, but ensure service role access)
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can delete from own wishlist" ON public.wishlist;

CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Users can add to own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlist FOR DELETE
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

-- Improve cart policies
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can add to own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can update own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can delete from own cart" ON public.cart;

CREATE POLICY "Users can view own cart"
  ON public.cart FOR SELECT
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Users can add to own cart"
  ON public.cart FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

CREATE POLICY "Users can update own cart"
  ON public.cart FOR UPDATE
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Users can delete from own cart"
  ON public.cart FOR DELETE
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
  );

