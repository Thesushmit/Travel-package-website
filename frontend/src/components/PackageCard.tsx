import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, Users, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/hooks/use-toast';

interface PackageCardProps {
  id: string;
  slug: string;
  title: string;
  summary: string;
  price: number;
  currency: string;
  images: string[];
  duration: number;
  location_city: string;
  location_country: string;
  rating: number;
  seats_available: number;
  tags: string[];
}

export const PackageCard = ({
  id,
  slug,
  title,
  summary,
  price,
  currency,
  images,
  duration,
  location_city,
  location_country,
  rating,
  seats_available,
  tags
}: PackageCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const imageUrl = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1';
  const inWishlist = isInWishlist(id);

  const handleQuickAdd = (e: React.MouseEvent, action: 'cart' | 'wishlist') => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    if (action === 'cart') {
      addToCart(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
            {currency === 'INR' ? '₹' : currency} {price.toLocaleString('en-IN')}
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={(e) => handleQuickAdd(e, 'wishlist')}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={(e) => handleQuickAdd(e, 'cart')}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location_city}, {location_country}</span>
        </div>
        
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{summary}</p>
        
        <div className="mb-3 flex flex-wrap gap-2">
          {tags && tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{duration} days</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{seats_available} seats</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gradient-bg"
          onClick={() => navigate(`/packages/${slug}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
