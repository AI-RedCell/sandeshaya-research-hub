import { useLanguage } from "@/contexts/LanguageContext";
import { Megaphone } from "lucide-react";

const AboutSandeshaya = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="section-spacing section-cream scroll-mt-20">
      <div className="container-narrow">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="icon-container w-10 h-10 sm:w-12 sm:h-12">
            <Megaphone strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-maroon text-center mb-3 sm:mb-4 font-bold text-xl sm:text-2xl md:text-3xl">{t('about.title')}</h2>
        <div className="gold-divider mb-8 sm:mb-12" />
        
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
          <p>{t('about.para1')}</p>
          <p>{t('about.para2')}</p>
          <p>{t('about.para3')}</p>
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default AboutSandeshaya;
