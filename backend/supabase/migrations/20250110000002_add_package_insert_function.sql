-- Create a function to insert packages that bypasses RLS
-- This allows scripts to insert packages without authentication

CREATE OR REPLACE FUNCTION public.insert_travel_package(
  p_slug TEXT,
  p_title TEXT,
  p_summary TEXT,
  p_description TEXT,
  p_price NUMERIC,
  p_duration INTEGER,
  p_location_city TEXT,
  p_location_country TEXT,
  p_seats_available INTEGER,
  p_currency TEXT DEFAULT 'INR',
  p_images TEXT[] DEFAULT '{}',
  p_tags TEXT[] DEFAULT '{}',
  p_rating NUMERIC DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.travel_packages (
    slug,
    title,
    summary,
    description,
    price,
    duration,
    location_city,
    location_country,
    seats_available,
    currency,
    images,
    tags,
    rating
  ) VALUES (
    p_slug,
    p_title,
    p_summary,
    p_description,
    p_price,
    p_duration,
    p_location_city,
    p_location_country,
    p_seats_available,
    p_currency,
    p_images,
    p_tags,
    p_rating
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION public.insert_travel_package TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_travel_package TO anon;

