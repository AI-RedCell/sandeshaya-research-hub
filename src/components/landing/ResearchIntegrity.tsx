import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const ResearchIntegrity = () => {
  const { t } = useLanguage();
  
  return (
    <section id="integrity" className="section-spacing section-cream scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-4 font-bold">{t('integrity.title')}</h2>
        <div className="gold-divider mb-12" />
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-secondary/30 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="icon-container mb-6">
              <Shield strokeWidth={1.5} />
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{t('integrity.text')}</p>
          </div>
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default ResearchIntegrity;
