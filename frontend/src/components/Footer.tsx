import { Plane } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">Travel Package Website</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Travel Package Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
