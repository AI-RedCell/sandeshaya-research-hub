import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Users, HelpCircle, BarChart3, LucideIcon } from "lucide-react";

interface CardItem {
  icon: LucideIcon;
  titleKey: string;
  textKey: string;
}

const AboutResearch = () => {
  const { t } = useLanguage();
  
  const cards: CardItem[] = [
    { icon: Target, titleKey: 'research.objective_title', textKey: 'research.objective_text' },
    { icon: Users, titleKey: 'research.who_title', textKey: 'research.who_text' },
    { icon: HelpCircle, titleKey: 'research.why_title', textKey: 'research.why_text' },
    { icon: BarChart3, titleKey: 'research.how_title', textKey: 'research.how_text' },
  ];
  
  return (
    <section id="research" className="section-spacing section-white scroll-mt-20">
      <div className="container-narrow">
        <h2 className="text-maroon text-center mb-3 sm:mb-4 font-bold text-xl sm:text-2xl md:text-3xl">{t('research.title')}</h2>
        <div className="gold-divider mb-8 sm:mb-12" />
        
        <div className="max-w-3xl mx-auto grid gap-4 sm:gap-6 md:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="card-accent flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="icon-container w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                  <Icon strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-maroon mb-1.5 sm:mb-2">
                    {t(card.titleKey as never)}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">{t(card.textKey as never)}</p>
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
