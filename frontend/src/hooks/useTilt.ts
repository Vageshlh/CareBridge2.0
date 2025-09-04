import { useRef, useEffect, useCallback } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  glarePrerender?: boolean;
}

interface TiltState {
  tiltX: number;
  tiltY: number;
  glareAngle: number;
  glareOpacity: number;
}

const defaultOptions: Required<TiltOptions> = {
  maxTilt: 7,
  perspective: 1000,
  scale: 1.02,
  speed: 300,
  glare: true,
  maxGlare: 0.15,
  glarePrerender: false,
};

export const useTilt = (options: TiltOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const isHovering = useRef(false);
  const currentState = useRef<TiltState>({
    tiltX: 0,
    tiltY: 0,
    glareAngle: 0,
    glareOpacity: 0,
  });

  const settings = { ...defaultOptions, ...options };

  const updateTransform = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const { tiltX, tiltY } = currentState.current;
    const { perspective, scale } = settings;

    element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    
    if (glareRef.current && settings.glare) {
      const { glareAngle, glareOpacity } = currentState.current;
      glareRef.current.style.background = `linear-gradient(${glareAngle}deg, rgba(255,255,255,${glareOpacity}) 0%, rgba(255,255,255,0) 80%)`;
    }
  }, [settings]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current || !isHovering.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -settings.maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * settings.maxTilt;

    // Calculate glare effect
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
    const glareOpacity = Math.min(distance / maxDistance, 1) * settings.maxGlare;

    currentState.current = {
      tiltX: Math.max(-settings.maxTilt, Math.min(settings.maxTilt, rotateX)),
      tiltY: Math.max(-settings.maxTilt, Math.min(settings.maxTilt, rotateY)),
      glareAngle: angle + 90,
      glareOpacity,
    };

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(updateTransform);
  }, [settings, updateTransform]);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    if (elementRef.current) {
      elementRef.current.style.willChange = 'transform';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    
    // Reset to neutral position
    currentState.current = {
      tiltX: 0,
      tiltY: 0,
      glareAngle: 0,
      glareOpacity: 0,
    };

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(updateTransform);

    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, [updateTransform]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return { elementRef, glareRef };
};