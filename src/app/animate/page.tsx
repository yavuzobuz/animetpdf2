// This file is being moved to src/app/[lang]/animate/page.tsx
// This file can be deleted.
// For now, leaving a placeholder.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnimatePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default language version
    router.replace('/tr/animate');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Yönlendiriliyor...</p>
      </div>
    </div>
  );
}
