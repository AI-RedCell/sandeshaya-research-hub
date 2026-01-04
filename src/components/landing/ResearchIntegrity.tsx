import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const ResearchIntegrity = () => {
  const { t } = useLanguage();
  
  return (
    <section id="integrity" className="section-spacing section-cream scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-3 sm:mb-4 font-bold text-xl sm:text-2xl md:text-3xl">{t('integrity.title')}</h2>
        <div className="gold-divider mb-8 sm:mb-12" />
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-secondary/30 p-5 sm:p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="icon-container w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6">
              <Shield strokeWidth={1.5} />
            </div>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">{t('integrity.text')}</p>
          </div>
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default ResearchIntegrity;
