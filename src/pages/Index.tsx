import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatisticsSection from "@/components/landing/StatisticsSection";
import AboutSandeshaya from "@/components/landing/AboutSandeshaya";
import ACBUHistory from "@/components/landing/ACBUHistory";
import AboutResearch from "@/components/landing/AboutResearch";
import ResearchIntegrity from "@/components/landing/ResearchIntegrity";
import ISACSection from "@/components/landing/ISACSection";
import FinalCTA from "@/components/landing/FinalCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/auth/LoadingScreen";

const Index = () => {
  const { language, setLanguage } = useLanguage();
  const { user, loading, hasSubmitted } = useAuth();
  const navigate = useNavigate();
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Handle OAuth redirect: only redirect users who JUST completed OAuth login
  useEffect(() => {
    if (!loading && user) {
      // Check if user just came from OAuth redirect
      const oauthComplete = sessionStorage.getItem('oauth_redirect_complete');
      if (oauthComplete === 'true') {
        // Clear the flag so it doesn't redirect again
        sessionStorage.removeItem('oauth_redirect_complete');
        console.log("🏠 Index: OAuth redirect detected, navigating...", { hasSubmitted });
        if (hasSubmitted) {
          navigate('/submitted', { replace: true });
        } else {
          navigate('/survey', { replace: true });
        }
      }
    }
  }, [user, loading, hasSubmitted, navigate]);

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
        <ACBUHistory />
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
