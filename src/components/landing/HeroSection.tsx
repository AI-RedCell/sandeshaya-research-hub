import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

interface HeroSectionProps {
  onImageLoad?: () => void;
}

const HeroSection = ({ onImageLoad }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onImageLoad) {
      // Add a small delay to ensure the fade-in transition has started visually
      // before lifting the heavy curtain
      setTimeout(onImageLoad, 100); 
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col supports-[min-height:100dvh]:min-h-[100dvh] overflow-hidden bg-maroon-dark">
      {/* Background Image - Right side (trophy) on mobile, centered on desktop */}
      <img 
        src={heroBg}
        alt=""
        onLoad={handleImageLoad}
        className={`absolute inset-0 w-full h-full object-cover object-[85%_top] sm:object-[center_top] transition-all duration-[2000ms] ease-out ${
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-xl"
        }`}
      />
      
      {/* Gradient Overlay - Maroon tint for school colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/60 via-maroon/50 to-maroon/70" />
      
      {/* Content Wrapper - Pushed down from top, pushes button to near bottom */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 pt-16 pb-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title - Sandeshaya with Gold Shimmer - BIGGER on mobile */}
          <h1 
            className="mb-2 sm:mb-4 drop-shadow-2xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide text-gold-shimmer"
            style={{ fontFamily: "'PT Serif', serif" }}
          >
            Sandeshaya
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-white/95 mb-4 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium drop-shadow-lg px-2 sm:px-4">
            National Student Research on Media Ethics
          </h2>
          
          {/* Description - Hidden on very small mobile, shown on sm+ */}
          <p className="hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto drop-shadow leading-relaxed mb-4 sm:mb-6 px-4">
            A formal research initiative exploring how Sri Lankan school students
            perceive media ethics, trust, and the need for improved media
            regulation in our nation.
          </p>
          
          {/* Short description for mobile */}
          <p className="sm:hidden text-sm text-white/80 max-w-xs mx-auto drop-shadow leading-relaxed mb-6 px-2">
            Researching student perspectives on media ethics in Sri Lanka.
          </p>
          
          {/* Survey Info Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-2 mb-4 sm:mb-6 border border-white/20">
            <span className="text-white/90 text-sm sm:text-sm">7 Sections</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-white/90 text-sm sm:text-sm">30 Questions</span>
          </div>
        </div>
      </div>
      
      {/* CTA Button - Anchored to bottom with MASSIVE padding protection for mobile usage */}
      <div className="relative z-10 pb-28 sm:pb-12 md:pb-16 text-center px-4 w-full">
        <Button 
          variant="default" 
          size="lg" 
          asChild 
          className="bg-secondary hover:bg-secondary/95 text-maroon font-bold w-full sm:w-auto max-w-xs sm:max-w-none px-6 sm:px-12 py-4 sm:py-6 md:py-7 text-lg sm:text-lg md:text-xl rounded-full transition-all duration-300 border-b-4 border-secondary/70 hover:border-secondary/50 hover:translate-y-[-2px] active:translate-y-[1px] active:border-b-2"
          style={{ 
            boxShadow: "0 10px 30px rgba(0,0,0,0.3), 0 5px 15px rgba(201,162,77,0.4), inset 0 2px 0 rgba(255,255,255,0.2)" 
          }}
        >
          <Link to="/login">Proceed to Survey</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
