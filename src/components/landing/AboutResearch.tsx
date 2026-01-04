import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Users, HelpCircle, BarChart3 } from "lucide-react";

const AboutResearch = () => {
  const { t } = useLanguage();
  
  const cards = [
    { icon: Target, titleKey: 'research.objective_title', textKey: 'research.objective_text' },
    { icon: Users, titleKey: 'research.who_title', textKey: 'research.who_text' },
    { icon: HelpCircle, titleKey: 'research.why_title', textKey: 'research.why_text' },
    { icon: BarChart3, titleKey: 'research.how_title', textKey: 'research.how_text' },
  ];
  
  return (
    <section id="research" className="section-spacing section-white scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-4 font-bold">{t('research.title')}</h2>
        <div className="gold-divider mb-12" />
        
        <div className="max-w-3xl mx-auto grid gap-6 sm:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="card-accent flex flex-col sm:flex-row items-start gap-4">
                <div className="icon-container shrink-0">
                  <Icon strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-maroon mb-2">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">{t(card.textKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>
    </section>
  );
};

export default AboutResearch;
