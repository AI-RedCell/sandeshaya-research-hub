import { useLanguage } from "@/contexts/LanguageContext";
import { Award } from "lucide-react";

const ISACSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="isac" className="section-spacing section-white scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-4 font-bold">{t('isac.title')}</h2>
        <div className="gold-divider mb-12" />
        
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="icon-container">
              <Award strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{t('isac.text')}</p>
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default ISACSection;
