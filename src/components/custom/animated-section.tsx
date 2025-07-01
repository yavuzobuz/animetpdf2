"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  sectionId?: string;
  tag?: keyof JSX.IntrinsicElements;
  delay?: string; // e.g., 'delay-100', 'delay-200'
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = React.memo(({
  children,
  className,
  sectionId,
  tag = 'section',
  delay = '',
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !isVisible) {
      setIsVisible(true);
      // Animasyon başladıktan sonra observer'ı temizle
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }
  }, [isVisible]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || isVisible) return;

    // Observer'ı oluştur
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        root: null,
        rootMargin: '50px',
        threshold: threshold,
      }
    );

    observerRef.current.observe(currentRef);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, isVisible]);

  const Component = tag as React.ElementType;

  return (
    <Component
      ref={ref}
      id={sectionId}
      className={cn(
        'transition-all duration-700 ease-out transform will-change-transform',
        isVisible 
          ? `opacity-100 translate-y-0 scale-100 ${delay}` 
          : 'opacity-0 translate-y-8 scale-98',
        className
      )}
      style={{
        transitionProperty: 'opacity, transform',
      }}
    >
      {children}
    </Component>
  );
});

AnimatedSection.displayName = 'AnimatedSection';

export default AnimatedSection;