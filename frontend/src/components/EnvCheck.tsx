import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const EnvCheck = () => {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
  } | null>(null);

  useEffect(() => {
    const supabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    setEnvStatus({
      supabaseUrl,
      supabaseKey,
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('Environment Variables Status:');
      console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
      console.error('VITE_SUPABASE_PUBLISHABLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    }
  }, []);

  if (!envStatus) return null;

  if (!envStatus.supabaseUrl || !envStatus.supabaseKey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Missing Environment Variables
            </CardTitle>
            <CardDescription>
              Please configure the following environment variables in Vercel:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {envStatus.supabaseUrl ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span>VITE_SUPABASE_URL</span>
            </div>
            <div className="flex items-center gap-2">
              {envStatus.supabaseKey ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span>VITE_SUPABASE_PUBLISHABLE_KEY</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>To fix this:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Go to Vercel Dashboard</li>
                <li>Select your project</li>
                <li>Go to Settings → Environment Variables</li>
                <li>Add both variables for Production environment</li>
                <li>Redeploy your application</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};


