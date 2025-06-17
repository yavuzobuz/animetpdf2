// This file is no longer used directly.
// The content has been moved to src/app/[lang]/page.tsx
// Next.js will automatically route to src/app/[lang]/page.tsx via middleware.
// This file can be deleted or kept empty. For safety, let's keep it empty.

export default function HomePage() {
  // This component should ideally not be rendered.
  // If it is, it means the middleware or routing is not set up correctly.
  // It might be better to redirect from here to /tr or /en in a client component,
  // but middleware should handle this.
  if (typeof window !== 'undefined') {
    // window.location.href = '/tr'; // Or your default language
  }
  return null; 
}
