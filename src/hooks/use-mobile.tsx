import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/**
 * Robust device detection for mobile vs desktop
 * Used to determine OAuth flow (popup vs redirect)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check 1: User Agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /mobile/i,
    /phone/i
  ];
  
  const isMobileUA = mobilePatterns.some(pattern => pattern.test(userAgent));
  
  // Check 2: Touch capability
  const hasTouchScreen = () => {
    return (
      !!(typeof window !== 'undefined' && 
         ('ontouchstart' in window ||
          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
          ((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0)))
    );
  };
  
  // Check 3: Screen size
  const isSmallScreen = 
    typeof window !== 'undefined' && window.innerWidth < 768;
  
  const isMobile = isMobileUA || hasTouchScreen() || isSmallScreen;
  
  console.log('[Mobile Detection]', {
    userAgent: isMobileUA,
    touchScreen: hasTouchScreen(),
    smallScreen: isSmallScreen,
    result: isMobile
  });
  
  return isMobile;
}

/**
 * Detect if we're in OAuth redirect callback
 */
export function isRedirectCallback(): boolean {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  
  return (
    params.has('code') ||
    hash.includes('authProvider') ||
    hash.includes('state')
  );
}
