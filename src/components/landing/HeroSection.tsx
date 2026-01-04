import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image - Full Screen with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay - Maroon tint for school colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/60 via-maroon/50 to-maroon/70" />
      
      {/* Content - Text centered in middle */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 pt-24 sm:pt-20">
        <div className="text-center w-full max-w-4xl mx-auto">
          {/* Main Title - Sandeshaya with Gold Shimmer */}
          <h1 
            className="mb-4 drop-shadow-2xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide text-gold-shimmer"
            style={{ fontFamily: "'PT Serif', serif" }}
          >
            Sandeshaya
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-white/95 mb-4 text-xl sm:text-2xl lg:text-3xl font-medium drop-shadow-lg px-2">
            National Student Research on Media Ethics
          </h2>
          
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto drop-shadow leading-relaxed mb-6 px-4 hidden sm:block">
            A formal research initiative exploring how Sri Lankan school students
            perceive media ethics, trust, and the need for improved media
            regulation in our nation.
          </p>
          <p className="text-base text-white/80 max-w-xs mx-auto drop-shadow leading-relaxed mb-8 px-2 sm:hidden">
            Researching student perspectives on media ethics and regulation in Sri Lanka.
          </p>
          
          {/* Survey Info Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/20">
            <span className="text-white/90 text-sm">7 Sections</span>
            <span className="w-1 h-1 rounded-full bg-secondary" />
            <span className="text-white/90 text-sm">30 Questions</span>
          </div>
        </div>
      </div>
      
      {/* CTA Button - Fixed at bottom */}
      <div className="relative z-10 pb-12 sm:pb-16 text-center px-4">
        <Button 
          variant="default" 
          size="lg" 
          asChild 
          className="bg-secondary hover:bg-secondary/95 text-maroon font-bold px-8 sm:px-12 py-6 sm:py-7 text-lg sm:text-xl rounded-full transition-all duration-300 border-b-4 border-secondary/70 hover:border-secondary/50 hover:translate-y-[-2px] active:translate-y-[1px] active:border-b-2 w-full max-w-xs sm:w-auto"
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
