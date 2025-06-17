
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  sectionId?: string;
  tag?: keyof JSX.IntrinsicElements;
  delay?: string; // e.g., 'delay-100', 'delay-200'
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  sectionId,
  tag = 'section',
  delay = '',
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const Tag = tag;

  return (
    <Tag
      id={sectionId}
      ref={ref as any}
      className={cn(
        "opacity-0 translate-y-8 transform transition-all duration-1000 ease-out",
        delay,
        isVisible && "opacity-100 translate-y-0",
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
