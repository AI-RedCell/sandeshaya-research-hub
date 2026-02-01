import { useLanguage } from "@/contexts/LanguageContext";
import { Megaphone } from "lucide-react";

const AboutSandeshaya = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-spacing section-cream scroll-mt-20">
      <div className="container-narrow">
        <div className="flex justify-center mb-6">
          <div className="icon-container">
            <Megaphone strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-maroon text-center mb-4 font-bold">{t('about.title')}</h2>
        <div className="gold-divider mb-12" />

        <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
          <p>{t('about.para1')}</p>
          <p>{t('about.para2')}</p>
          <p>{t('about.para3')}</p>
          <p>{t('about.para4')}</p>
          <p>{t('about.para5')}</p>
          <p>{t('about.para6')}</p>
          <p>{t('about.para7')}</p>
        </div>

        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default AboutSandeshaya;
