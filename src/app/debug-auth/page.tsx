'use client';

import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'undefined',
      nodeEnv: process.env.NODE_ENV,
      nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      href: typeof window !== 'undefined' ? window.location.href : 'undefined',
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>
      <div className="space-y-2">
        <p><strong>Window Origin:</strong> {debugInfo.windowOrigin}</p>
        <p><strong>NODE_ENV:</strong> {debugInfo.nodeEnv}</p>
        <p><strong>NEXT_PUBLIC_SITE_URL:</strong> {debugInfo.nextPublicSiteUrl}</p>
        <p><strong>Current URL:</strong> {debugInfo.href}</p>
        <p><strong>Redirect URL would be:</strong> {debugInfo.windowOrigin}/auth/callback?next=/profil</p>
      </div>
    </div>
  );
}