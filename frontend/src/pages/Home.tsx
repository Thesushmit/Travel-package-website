import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { PackageCard } from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const { data: featuredPackages, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const { data: newestPackages, isLoading: newestLoading } = useQuery({
    queryKey: ['newest-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['package-stats'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('travel_packages')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-1">
        {/* Stats Section */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold">{stats || 0}+</div>
                  <div className="text-sm text-muted-foreground">Travel Packages</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Happy Travelers</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">
                Featured Travel Packages
              </h2>
              <p className="text-lg text-muted-foreground">
                Our top-rated travel experiences
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/packages')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {featuredLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : featuredPackages && featuredPackages.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPackages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No packages available yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Newest Packages */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold md:text-4xl">
                  Newest Arrivals
                </h2>
                <p className="text-lg text-muted-foreground">
                  Check out our latest travel packages
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/packages')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {newestLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : newestPackages && newestPackages.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {newestPackages.map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Choose Travel Package Website?
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience travel like never before
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <Star className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Curated Experiences</h3>
                <p className="text-muted-foreground">
                  Handpicked travel packages designed to create unforgettable memories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Award className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Best Prices</h3>
                <p className="text-muted-foreground">
                  Competitive pricing with no hidden fees. Book with confidence
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Globe className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated team is always here to help you plan your perfect trip
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
