import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { packageApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { MapPin, Calendar, Star, Users, ArrowLeft, Heart, ShoppingCart } from 'lucide-react';

export default function PackageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();

  const { data: pkg, isLoading } = useQuery({
    queryKey: ['package', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Package not found');
      const { package: packageData } = await packageApi.getBySlug(slug);
      return packageData;
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Package not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={mainImage}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/packages')}
                className="mb-4 text-white hover:text-white/80"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Packages
              </Button>
              <h1 className="text-4xl font-bold text-white md:text-5xl">{pkg.title}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{pkg.location_city}, {pkg.location_country}</span>
              </div>

              <p className="mb-6 text-xl font-medium">{pkg.summary}</p>

              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line">{pkg.description}</p>
              </div>

              {pkg.tags && pkg.tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {pkg.images && pkg.images.length > 1 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">Gallery</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {pkg.images.slice(1).map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${pkg.title} ${index + 2}`}
                        className="h-64 w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 glass-card rounded-lg p-6">
                <div className="mb-6 text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    {pkg.currency === 'INR' ? '₹' : pkg.currency} {pkg.price.toLocaleString('en-IN')}
                  </div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{pkg.duration} days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span>Rating</span>
                    </div>
                    <span className="font-medium">{pkg.rating || 0}/5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-5 w-5" />
                      <span>Seats Available</span>
                    </div>
                    <span className="font-medium">{pkg.seats_available}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full gradient-bg" 
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      navigate(`/booking/${pkg.id}`);
                    }}
                  >
                    Book Now
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        if (isInWishlist(pkg.id)) {
                          const wishlistItem = wishlistItems.find(item => item.package_id === pkg.id);
                          if (wishlistItem) {
                            removeFromWishlist(wishlistItem.id);
                          }
                        } else {
                          addToWishlist(pkg.id);
                        }
                      }}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${isInWishlist(pkg.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {isInWishlist(pkg.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        addToCart(pkg.id);
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Free cancellation up to 24 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
