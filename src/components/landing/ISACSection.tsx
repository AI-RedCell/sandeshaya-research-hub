import { useLanguage } from "@/contexts/LanguageContext";
import { Award } from "lucide-react";

const ISACSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="isac" className="section-spacing section-white scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-3 sm:mb-4 font-bold text-xl sm:text-2xl md:text-3xl">{t('isac.title')}</h2>
        <div className="gold-divider mb-8 sm:mb-12" />
        
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="icon-container w-10 h-10 sm:w-12 sm:h-12">
              <Award strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">{t('isac.text')}</p>
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default ISACSection;
