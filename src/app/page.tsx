// This file is no longer used directly.
// The content has been moved to src/app/[lang]/page.tsx
// Next.js will automatically route to src/app/[lang]/page.tsx via middleware.
// This file can be deleted or kept empty. For safety, let's keep it empty.

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to default language
  redirect('/tr');
}
