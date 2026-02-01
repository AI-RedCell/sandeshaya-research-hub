import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FinalCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-white relative overflow-hidden">
      {/* Decorative gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />

      <div className="container-narrow text-center relative z-10">
        <h2 className="text-maroon mb-4 font-bold text-2xl sm:text-3xl">{t('cta.title')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-base sm:text-lg px-4">
          {t('cta.text')}
        </p>

        {/* Button - Maroon button on white background */}
        <Button
          variant="default"
          size="lg"
          asChild
          className="bg-maroon hover:bg-maroon/90 text-white font-bold px-8 sm:px-12 py-5 sm:py-7 text-lg sm:text-xl rounded-full transition-all duration-300 border-b-4 border-maroon-dark hover:border-maroon/70 hover:translate-y-[-2px] active:translate-y-[1px] active:border-b-2 gap-2"
          style={{
            boxShadow: "0 10px 30px rgba(107,15,26,0.3), 0 5px 15px rgba(107,15,26,0.2)"
          }}
        >
          <Link to="/login">
            {t('common.proceed_to_survey')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
