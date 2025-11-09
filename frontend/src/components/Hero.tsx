import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden gradient-bg py-20 md:py-32">
      {/* Floating decorative elements */}
      <div className="floating-blob absolute top-10 left-10 h-64 w-64 bg-primary/30" />
      <div className="floating-blob absolute bottom-10 right-10 h-96 w-96 bg-purple-500/20" style={{ animationDelay: '5s' }} />
      <div className="floating-blob absolute top-1/2 left-1/3 h-72 w-72 bg-blue-500/20" style={{ animationDelay: '10s' }} />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Discover Your Next Adventure</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Explore the World with
            <br />
            <span className="text-yellow-300">Amazing Travel Packages</span>
          </h1>
          
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Discover handcrafted travel experiences to destinations around the globe.
            From tropical beaches to mountain adventures, find your perfect getaway.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/packages')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Explore Packages
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/signup')}
              className="border-white bg-white/10 text-white hover:bg-white/20"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
