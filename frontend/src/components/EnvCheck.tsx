import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnvStatus {
  apiUrl: boolean;
}

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<EnvStatus>({
    apiUrl: false,
  });

  useEffect(() => {
    const apiUrl = !!import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error('VITE_API_URL:', apiUrl ? '✅ Set' : '❌ Missing');
    }

    setEnvStatus({ apiUrl });
  }, []);

  if (envStatus.apiUrl) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <Alert variant="destructive" className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Environment variables required</AlertTitle>
        <AlertDescription>
          Please create a <code>.env</code> file in the frontend directory and set the following variables:
          <pre className="mt-2 rounded bg-muted p-2 text-sm">
            <code>VITE_API_URL=http://localhost:5000</code>
          </pre>
        </AlertDescription>
      </Alert>
    </div>
  );
}




