import { useLanguage } from "@/contexts/LanguageContext";
import { Mic2 } from "lucide-react";

const ACBUHistory = () => {
    const { t } = useLanguage();

    return (
        <section id="acbu-history" className="section-spacing bg-white scroll-mt-20">
            <div className="container-narrow">
                <div className="flex justify-center mb-6">
                    <div className="icon-container bg-maroon/5 text-maroon">
                        <Mic2 strokeWidth={1.5} />
                    </div>
                </div>
                <h2 className="text-maroon text-center mb-4 font-bold">{t('unit.title')}</h2>
                <div className="gold-divider mb-12" />

                <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed text-justify hyphens-auto">
                    <p>{t('unit.para1')}</p>
                    <p>{t('unit.para2')}</p>
                    <p>{t('unit.para3')}</p>
                    <p>{t('unit.para4')}</p>
                    <p>{t('unit.para5')}</p>
                </div>

                {/* Decorative gold elements */}
                <div className="grid grid-cols-3 gap-4 mt-16 max-w-xs mx-auto">
                    <div className="h-1 bg-secondary/30 rounded-full" />
                    <div className="h-1 bg-secondary rounded-full" />
                    <div className="h-1 bg-secondary/30 rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default ACBUHistory;
