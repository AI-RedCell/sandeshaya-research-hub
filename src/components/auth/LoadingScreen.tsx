import React from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/common';
import type { LoadingScreenProps } from '@/types';

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-6 max-w-sm p-4 text-center">
        {/* Logo or Placeholder */}
        <div className="relative">
          <div className="absolute inset-0 bg-maroon/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="relative z-10 drop-shadow-lg">
            <Logo type="acbu" size="xl" />
          </div>
        </div>

        {/* Loading Spinner & Text */}
        <div className="space-y-3 relative z-10">
          <Loader2 className="h-8 w-8 text-maroon animate-spin mx-auto" />
          <h2 className="text-lg font-semibold text-maroon tracking-wide">
            {message}
          </h2>
          <p className="text-sm text-gray-500 max-w-[250px]">
            Please wait while we verify your details
          </p>
        </div>

        {/* Progress Bar Line */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-maroon via-secondary to-maroon w-full animate-progress origin-left" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
