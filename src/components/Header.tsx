import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = "en" | "si" | "ta";

interface HeaderProps {
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  showLanguageSwitcher?: boolean;
}

// Import logo - using try/catch pattern for safety
let logoSrc: string | null = null;
try {
  logoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  logoSrc = null;
}

const Header = ({ 
  currentLanguage, 
  onLanguageChange,
  showLanguageSwitcher = true 
}: HeaderProps) => {
  const { language: contextLanguage, setLanguage } = useLanguage();
  
  // Use props if provided, otherwise use context
  const activeLanguage = currentLanguage ?? contextLanguage;
  const handleLanguageChange = onLanguageChange ?? setLanguage;
  
  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "si", label: "සිං" },
    { code: "ta", label: "த" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-maroon/10 shadow-sm">
      {/* Full width container - logo left, buttons right */}
      <div className="w-full px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo and Brand - Far Left */}
        <Link to="/" className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt="ACBU Logo" className="h-12 w-auto" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-maroon flex items-center justify-center">
              <span className="text-white text-xs font-bold">AC</span>
            </div>
          )}
          <span className="text-xl font-bold text-maroon tracking-tight">ACBU</span>
        </Link>

        {/* Right side - Far Right */}
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          {showLanguageSwitcher && (
            <nav className="flex items-center gap-1 text-sm" aria-label="Language selection">
              {languages.map((lang, index) => (
                <span key={lang.code} className="flex items-center">
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1 rounded transition-colors ${
                      activeLanguage === lang.code
                        ? "text-maroon font-semibold bg-secondary/30"
                        : "text-gray-500 hover:text-maroon"
                    }`}
                    aria-current={activeLanguage === lang.code ? "true" : undefined}
                  >
                    {lang.label}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="text-gray-300 mx-1">|</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* CTA Button - Hidden on mobile, shown on md+ */}
          <Button 
            variant="default" 
            size="sm" 
            asChild 
            className="!hidden md:!inline-flex bg-maroon hover:bg-maroon/90 text-white font-medium rounded-full px-6"
          >
            <Link to="/login">Proceed to Survey</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
