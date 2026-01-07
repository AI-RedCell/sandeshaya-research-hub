import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatisticsSection from "@/components/landing/StatisticsSection";
import AboutSandeshaya from "@/components/landing/AboutSandeshaya";
import AboutResearch from "@/components/landing/AboutResearch";
import ResearchIntegrity from "@/components/landing/ResearchIntegrity";
import ISACSection from "@/components/landing/ISACSection";
import FinalCTA from "@/components/landing/FinalCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingScreen from "@/components/auth/LoadingScreen";

const Index = () => {
  const { language, setLanguage } = useLanguage();
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Enforce minimum 3 second loading time
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = !isHeroLoaded || !minTimeElapsed;

  return (
    <div className={`min-h-screen flex flex-col bg-background relative ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
      {/* Global Preloader - Covers everything until Hero image is ready AND 3s minimum */}
      {isLoading && (
        <LoadingScreen 
          message="Welcome to Sandeshaya" 
          subtitle="Preparing research experience..." 
        />
      )}

      <Header 
        currentLanguage={language} 
        onLanguageChange={setLanguage}
        showLanguageSwitcher={true}
      />
      
      <main className="flex-1">
        <HeroSection onImageLoad={() => setIsHeroLoaded(true)} />
        <StatisticsSection />
        <AboutSandeshaya />
        <AboutResearch />
        <ResearchIntegrity />
        <ISACSection />
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
