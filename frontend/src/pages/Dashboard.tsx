import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Heart, ShoppingCart, Package, Loader2, Trash2, Eye, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'INR') => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'bookings';
  const { cartItems, removeFromCart, isLoading: cartLoading, cartTotal } = useCart();
  const { wishlistItems, removeFromWishlist, isLoading: wishlistLoading } = useWishlist();

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Prepare chart data
  const bookingsByStatus = bookings?.reduce((acc: any, booking: any) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const bookingsByMonth = bookings?.reduce((acc: any, booking: any) => {
    const month = format(new Date(booking.created_at), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) || {};

  const spendingByMonth = bookings?.reduce((acc: any, booking: any) => {
    const month = format(new Date(booking.created_at), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + Number(booking.total_price || 0);
    return acc;
  }, {}) || {};

  const statusChartData = {
    labels: Object.keys(bookingsByStatus),
    datasets: [{
      label: 'Bookings by Status',
      data: Object.values(bookingsByStatus),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)', // green for confirmed
        'rgba(234, 179, 8, 0.8)', // yellow for pending
        'rgba(239, 68, 68, 0.8)', // red for cancelled
        'rgba(59, 130, 246, 0.8)', // blue for completed
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const bookingsChartData = {
    labels: Object.keys(bookingsByMonth),
    datasets: [{
      label: 'Bookings',
      data: Object.values(bookingsByMonth),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const spendingChartData = {
    labels: Object.keys(spendingByMonth),
    datasets: [{
      label: 'Spending (₹)',
      data: Object.values(spendingByMonth),
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
    }],
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
  };

  const handleRemoveFromWishlist = async (wishlistItemId: string) => {
    await removeFromWishlist(wishlistItemId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalSpent = bookings?.reduce((sum: number, booking: any) => sum + Number(booking.total_price || 0), 0) || 0;
  const averageBooking = bookings && bookings.length > 0 ? totalSpent / bookings.length : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your bookings, wishlist, and cart</p>
          </div>

          {/* Statistics Cards */}
          {bookings && bookings.length > 0 && (
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">All time spending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Booking</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(averageBooking)}</div>
                  <p className="text-xs text-muted-foreground">Per booking</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cart Total</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(cartTotal)}</div>
                  <p className="text-xs text-muted-foreground">{cartItems.length} items</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Section */}
          {bookings && bookings.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Status</CardTitle>
                  <CardDescription>Distribution of your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Doughnut data={statusChartData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Over Time</CardTitle>
                  <CardDescription>Monthly booking trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={bookingsChartData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }} />
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Over Time</CardTitle>
                  <CardDescription>Monthly spending trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar data={spendingChartData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value: any) {
                              return '₹' + value.toLocaleString('en-IN');
                            },
                          },
                        },
                      },
                    }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full" onValueChange={(value) => {
            navigate(`/dashboard?tab=${value}`, { replace: true });
          }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">
                <Package className="mr-2 h-4 w-4" />
                Bookings ({bookings?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="wishlist">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist ({wishlistItems.length})
              </TabsTrigger>
              <TabsTrigger value="cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cartItems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-6">
              {bookingsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking: any) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {booking.travel_packages?.title || 'Package'}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Booking ID: {booking.id.slice(0, 8)}...
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Total: {formatCurrency(booking.total_price, booking.travel_packages?.currency)}</span>
                          </div>
                          {booking.travel_packages?.location_city && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.travel_packages.location_city}, {booking.travel_packages.location_country}</span>
                            </div>
                          )}
                        </div>
                        {booking.special_requests && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Special Requests:</strong> {booking.special_requests}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/packages/${booking.travel_packages?.slug}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Package
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No bookings yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/packages')}
                    >
                      Browse Packages
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              {wishlistLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : wishlistItems.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id}>
                      {item.travel_packages?.images && item.travel_packages.images.length > 0 && (
                        <img
                          src={item.travel_packages.images[0]}
                          alt={item.travel_packages.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {item.travel_packages?.title || 'Package'}
                        </CardTitle>
                        <CardDescription>
                          {formatCurrency(item.travel_packages?.price || 0, item.travel_packages?.currency)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/packages/${item.travel_packages?.slug}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/packages')}
                    >
                      Browse Packages
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cart" className="mt-6">
              {cartLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cartItems.map((item) => (
                      <Card key={item.id}>
                        {item.travel_packages?.images && item.travel_packages.images.length > 0 && (
                          <img
                            src={item.travel_packages.images[0]}
                            alt={item.travel_packages.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {item.travel_packages?.title || 'Package'}
                          </CardTitle>
                          <CardDescription>
                            {formatCurrency(item.travel_packages?.price || 0, item.travel_packages?.currency)} × {item.number_of_guests} = {formatCurrency((item.travel_packages?.price || 0) * item.number_of_guests, item.travel_packages?.currency)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/booking/${item.package_id}`)}
                            >
                              Book Now
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cart Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Items:</span>
                          <span>{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span>{formatCurrency(cartTotal)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/packages')}
                    >
                      Browse Packages
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
