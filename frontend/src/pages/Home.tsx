import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { PackageCard } from '@/components/PackageCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { packageApi, bookingApi, cartApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { user } = useAuth();
  const [highlightedPackages, setHighlightedPackages] = useState<any[]>([]);

  useEffect(() => {
    packageApi
      .list({ limit: 3, sortBy: 'rating' })
      .then(({ data }) => setHighlightedPackages(data))
      .catch((error) => console.error('Failed to load highlighted packages', error));
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['home-stats', user?.id],
    queryFn: async () => {
      if (!user) {
        const { data } = await packageApi.list({ limit: 6 });
        return {
          packages: data,
          wishlistCount: 0,
          cartCount: 0,
          bookingCount: 0
        };
      }

      const [packagesResponse, bookingsResponse, cartResponse] = await Promise.all([
        packageApi.list({ limit: 6 }),
        bookingApi.list(),
        cartApi.list()
      ]);

      return {
        packages: packagesResponse.data,
        bookingCount: bookingsResponse.bookings.length,
        cartCount: cartResponse.cart.length,
        wishlistCount: 0 // wishlist count fetched separately via context when needed
      };
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Popular Packages</h2>
            <p className="text-muted-foreground">Discover trending adventures curated for you</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedPackages.map((pkg) => (
              <PackageCard key={pkg.id} {...pkg} />
            ))}
          </div>
        </section>

        <section className="bg-muted/40 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Recently Added</h2>
              <p className="text-muted-foreground">Explore the latest additions to our catalog</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats?.packages?.map((pkg: any) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </div>
        </section>

        {user && (
          <section className="container mx-auto px-4 py-12">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.bookingCount || 0}</p>
                  <p className="text-muted-foreground">Track and manage your upcoming trips</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.cartCount || 0}</p>
                  <p className="text-muted-foreground">Complete your bookings in just a few clicks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Exclusive Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{highlightedPackages.length}</p>
                  <p className="text-muted-foreground">Handpicked experiences just for you</p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
