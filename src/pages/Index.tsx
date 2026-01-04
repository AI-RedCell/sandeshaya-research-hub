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

const Index = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        currentLanguage={language} 
        onLanguageChange={setLanguage}
        showLanguageSwitcher={true}
      />
      
      <main className="flex-1">
        <HeroSection />
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
