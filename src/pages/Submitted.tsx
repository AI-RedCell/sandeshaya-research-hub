import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = "en" | "si" | "ta";

const Submitted = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "si", label: "සිං" },
    { code: "ta", label: "த" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background">
        <div className="container-narrow h-16 flex items-center justify-between">
          <span className="text-xl font-semibold text-primary">
            {t('common.sandeshaya')}
          </span>
          
          {/* Language Switcher */}
          <nav className="flex items-center gap-1 text-sm" aria-label="Language selection">
            {languages.map((lang, index) => (
              <span key={lang.code} className="flex items-center">
                <button
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded transition-colors ${
                    language === lang.code
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
                {index < languages.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-accent/10">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-primary mb-4">
            {t('submitted.title')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('submitted.message')}
          </p>
          <Button variant="outline" asChild>
            <Link to="/">{t('submitted.return')}</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border">
        <div className="container-narrow text-center">
          <p className="text-xs text-muted-foreground">
            {t('footer.text')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Submitted;
