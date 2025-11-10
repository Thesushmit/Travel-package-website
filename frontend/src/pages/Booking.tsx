import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageApi, bookingApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const bookingSchema = z.object({
  booking_date: z.string().min(1, 'Booking date is required'),
  number_of_guests: z.number().min(1, 'At least 1 guest is required').max(20, 'Maximum 20 guests'),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: pkg, isLoading: packageLoading } = useQuery({
    queryKey: ['package', packageId],
    queryFn: async () => {
      if (!packageId) throw new Error('Package not found');
      const { package: packageData } = await packageApi.getById(packageId);
      return packageData;
    },
    enabled: !!packageId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      number_of_guests: 1,
      special_requests: '',
    },
  });

  const numberOfGuests = watch('number_of_guests') || 1;
  const totalPrice = pkg ? pkg.price * numberOfGuests : 0;

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (!user || !pkg) throw new Error('User or package not found');

      const payload = {
        package_id: pkg.id,
        booking_date: data.booking_date,
        number_of_guests: data.number_of_guests,
        total_price: totalPrice,
        special_requests: data.special_requests || null
      };

      const { booking } = await bookingApi.create(payload);
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
      toast({
        title: 'Booking Successful!',
        description: 'Your booking has been created successfully. We will confirm it shortly.',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!pkg) {
      toast({
        title: 'Error',
        description: 'Package not found',
        variant: 'destructive',
      });
      return;
    }

    if (numberOfGuests > pkg.seats_available) {
      toast({
        title: 'Not Enough Seats',
        description: `Only ${pkg.seats_available} seats available`,
        variant: 'destructive',
      });
      return;
    }

    await createBookingMutation.mutateAsync(data);
  };

  if (packageLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Complete Your Booking</h1>
            <p className="text-muted-foreground mt-2">Fill in the details to confirm your travel package</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Enter your travel preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="booking_date">Booking Date *</Label>
                      <Input
                        id="booking_date"
                        type="date"
                        min={minDate}
                        {...register('booking_date')}
                        className={errors.booking_date ? 'border-destructive' : ''}
                      />
                      {errors.booking_date && (
                        <p className="text-sm text-destructive">{errors.booking_date.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number_of_guests">Number of Guests *</Label>
                      <Input
                        id="number_of_guests"
                        type="number"
                        min={1}
                        max={pkg.seats_available}
                        {...register('number_of_guests', { valueAsNumber: true })}
                        className={errors.number_of_guests ? 'border-destructive' : ''}
                      />
                      {errors.number_of_guests && (
                        <p className="text-sm text-destructive">{errors.number_of_guests.message}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {pkg.seats_available} seats available
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                      <Textarea
                        id="special_requests"
                        placeholder="Any special requests or requirements..."
                        {...register('special_requests')}
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-bg"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Package Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.summary}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{pkg.location_city}, {pkg.location_country}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{pkg.duration} days</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{numberOfGuests} guest{numberOfGuests > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <span>{pkg.currency === 'INR' ? '₹' : pkg.currency} {pkg.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of guests</span>
                      <span>{numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary font-bold">
                        {pkg.currency === 'INR' ? '₹' : pkg.currency} {totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

