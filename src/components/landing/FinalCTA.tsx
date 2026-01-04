import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="section-spacing bg-white relative overflow-hidden">
      {/* Decorative gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
      
      <div className="container-narrow text-center relative z-10">
        {/* English Only - No Translation */}
        <h2 className="text-maroon mb-3 sm:mb-4 font-bold text-xl sm:text-2xl lg:text-3xl">Ready to Participate?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-10 text-sm sm:text-base lg:text-lg px-4">
          Your voice matters. Help shape the future of media ethics in Sri Lanka by sharing your perspective.
        </p>
        
        {/* Button - Maroon button on white background */}
        <Button 
          variant="default" 
          size="lg" 
          asChild 
          className="bg-maroon hover:bg-maroon/90 text-white font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 text-base sm:text-lg md:text-xl rounded-full transition-all duration-300 border-b-4 border-maroon-dark hover:border-maroon/70 hover:translate-y-[-2px] active:translate-y-[1px] active:border-b-2 gap-2 w-full max-w-xs sm:w-auto"
          style={{ 
            boxShadow: "0 10px 30px rgba(107,15,26,0.3), 0 5px 15px rgba(107,15,26,0.2)" 
          }}
        >
          <Link to="/login">
            Proceed to Survey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
