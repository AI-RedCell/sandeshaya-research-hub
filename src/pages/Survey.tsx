import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Import ACBU logo safely
let acbuLogoSrc: string | null = null;
try {
  acbuLogoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  acbuLogoSrc = null;
}

// Question types
type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea';

interface Question {
  id: string;
  type: QuestionType;
  translationKey: string;
  options?: string[]; // Translation keys for options
  required: boolean;
}

interface Section {
  id: string;
  titleKey: string;
  title: string; // English title - not translated
  questions: Question[];
}

// Survey structure with all 30 questions across 7 sections
const surveyStructure: Section[] = [
  {
    id: 'a',
    titleKey: 'section.a',
    title: 'Demographics',
    questions: [
      { id: 'age_group', type: 'radio', translationKey: 'q.age_group', options: ['q.age_group.opt1', 'q.age_group.opt2', 'q.age_group.opt3', 'q.age_group.opt4'], required: true },
      { id: 'grade', type: 'radio', translationKey: 'q.grade', options: ['q.grade.opt1', 'q.grade.opt2', 'q.grade.opt3', 'q.grade.opt4'], required: true },
      { id: 'province', type: 'radio', translationKey: 'q.province', options: ['q.province.opt1', 'q.province.opt2', 'q.province.opt3', 'q.province.opt4', 'q.province.opt5', 'q.province.opt6', 'q.province.opt7', 'q.province.opt8', 'q.province.opt9'], required: true },
      { id: 'district', type: 'text', translationKey: 'q.district', required: true },
      { id: 'school_type', type: 'radio', translationKey: 'q.school_type', options: ['q.school_type.opt1', 'q.school_type.opt2', 'q.school_type.opt3'], required: true },
    ]
  },
  {
    id: 'b',
    titleKey: 'section.b',
    title: 'Media Consumption Habits',
    questions: [
      { id: 'primary_device', type: 'radio', translationKey: 'q.primary_device', options: ['q.primary_device.opt1', 'q.primary_device.opt2', 'q.primary_device.opt3', 'q.primary_device.opt4', 'q.primary_device.opt5'], required: true },
      { id: 'media_hours', type: 'radio', translationKey: 'q.media_hours', options: ['q.media_hours.opt1', 'q.media_hours.opt2', 'q.media_hours.opt3', 'q.media_hours.opt4'], required: true },
      { id: 'media_sources', type: 'checkbox', translationKey: 'q.media_sources', options: ['q.media_sources.opt1', 'q.media_sources.opt2', 'q.media_sources.opt3', 'q.media_sources.opt4', 'q.media_sources.opt5', 'q.media_sources.opt6'], required: true },
      { id: 'social_platforms', type: 'checkbox', translationKey: 'q.social_platforms', options: ['q.social_platforms.opt1', 'q.social_platforms.opt2', 'q.social_platforms.opt3', 'q.social_platforms.opt4', 'q.social_platforms.opt5', 'q.social_platforms.opt6'], required: true },
    ]
  },
  {
    id: 'c',
    titleKey: 'section.c',
    title: 'Understanding Media Ethics',
    questions: [
      { id: 'heard_ethics', type: 'radio', translationKey: 'q.heard_ethics', options: ['q.heard_ethics.opt1', 'q.heard_ethics.opt2', 'q.heard_ethics.opt3'], required: true },
      { id: 'ethics_meaning', type: 'checkbox', translationKey: 'q.ethics_meaning', options: ['q.ethics_meaning.opt1', 'q.ethics_meaning.opt2', 'q.ethics_meaning.opt3', 'q.ethics_meaning.opt4', 'q.ethics_meaning.opt5'], required: true },
      { id: 'learned_ethics', type: 'radio', translationKey: 'q.learned_ethics', options: ['q.learned_ethics.opt1', 'q.learned_ethics.opt2', 'q.learned_ethics.opt3', 'q.learned_ethics.opt4', 'q.learned_ethics.opt5'], required: true },
      { id: 'ethics_important', type: 'radio', translationKey: 'q.ethics_important', options: ['q.ethics_important.opt1', 'q.ethics_important.opt2', 'q.ethics_important.opt3', 'q.ethics_important.opt4'], required: true },
    ]
  },
  {
    id: 'd',
    titleKey: 'section.d',
    title: 'Perception of Ethical Issues',
    questions: [
      { id: 'biggest_problem', type: 'radio', translationKey: 'q.biggest_problem', options: ['q.biggest_problem.opt1', 'q.biggest_problem.opt2', 'q.biggest_problem.opt3', 'q.biggest_problem.opt4', 'q.biggest_problem.opt5'], required: true },
      { id: 'seen_unethical', type: 'radio', translationKey: 'q.seen_unethical', options: ['q.seen_unethical.opt1', 'q.seen_unethical.opt2', 'q.seen_unethical.opt3', 'q.seen_unethical.opt4'], required: true },
      { id: 'affected_by_fake', type: 'radio', translationKey: 'q.affected_by_fake', options: ['q.affected_by_fake.opt1', 'q.affected_by_fake.opt2', 'q.affected_by_fake.opt3'], required: true },
      { id: 'verify_news', type: 'radio', translationKey: 'q.verify_news', options: ['q.verify_news.opt1', 'q.verify_news.opt2', 'q.verify_news.opt3', 'q.verify_news.opt4'], required: true },
    ]
  },
  {
    id: 'e',
    titleKey: 'section.e',
    title: 'Trust in Media',
    questions: [
      { id: 'trust_media', type: 'radio', translationKey: 'q.trust_media', options: ['q.trust_media.opt1', 'q.trust_media.opt2', 'q.trust_media.opt3', 'q.trust_media.opt4', 'q.trust_media.opt5'], required: true },
      { id: 'trust_social', type: 'radio', translationKey: 'q.trust_social', options: ['q.trust_social.opt1', 'q.trust_social.opt2', 'q.trust_social.opt3'], required: true },
      { id: 'media_influence', type: 'radio', translationKey: 'q.media_influence', options: ['q.media_influence.opt1', 'q.media_influence.opt2', 'q.media_influence.opt3', 'q.media_influence.opt4'], required: true },
      { id: 'responsible_media', type: 'radio', translationKey: 'q.responsible_media', options: ['q.responsible_media.opt1', 'q.responsible_media.opt2', 'q.responsible_media.opt3', 'q.responsible_media.opt4'], required: true },
    ]
  },
  {
    id: 'f',
    titleKey: 'section.f',
    title: 'Regulation and Governance',
    questions: [
      { id: 'know_regulations', type: 'radio', translationKey: 'q.know_regulations', options: ['q.know_regulations.opt1', 'q.know_regulations.opt2', 'q.know_regulations.opt3'], required: true },
      { id: 'need_regulation', type: 'radio', translationKey: 'q.need_regulation', options: ['q.need_regulation.opt1', 'q.need_regulation.opt2', 'q.need_regulation.opt3', 'q.need_regulation.opt4'], required: true },
      { id: 'who_regulate', type: 'radio', translationKey: 'q.who_regulate', options: ['q.who_regulate.opt1', 'q.who_regulate.opt2', 'q.who_regulate.opt3', 'q.who_regulate.opt4'], required: true },
    ]
  },
  {
    id: 'g',
    titleKey: 'section.g',
    title: 'Future Vision and Recommendations',
    questions: [
      { id: 'media_better', type: 'checkbox', translationKey: 'q.media_better', options: ['q.media_better.opt1', 'q.media_better.opt2', 'q.media_better.opt3', 'q.media_better.opt4', 'q.media_better.opt5'], required: true },
      { id: 'youth_role', type: 'radio', translationKey: 'q.youth_role', options: ['q.youth_role.opt1', 'q.youth_role.opt2', 'q.youth_role.opt3', 'q.youth_role.opt4'], required: true },
      { id: 'would_report', type: 'radio', translationKey: 'q.would_report', options: ['q.would_report.opt1', 'q.would_report.opt2', 'q.would_report.opt3'], required: true },
      { id: 'future_media', type: 'radio', translationKey: 'q.future_media', options: ['q.future_media.opt1', 'q.future_media.opt2', 'q.future_media.opt3', 'q.future_media.opt4'], required: true },
      { id: 'additional_thoughts', type: 'textarea', translationKey: 'q.additional_thoughts', required: false },
    ]
  },
];

// English canonical values for storing in Firestore
const englishValues: Record<string, Record<string, string>> = {
  'q.age_group.opt1': { value: 'Below 13' },
  'q.age_group.opt2': { value: '13-15' },
  'q.age_group.opt3': { value: '16-18' },
  'q.age_group.opt4': { value: 'Above 18' },
  'q.grade.opt1': { value: 'Grade 6-8' },
  'q.grade.opt2': { value: 'Grade 9-10' },
  'q.grade.opt3': { value: 'Grade 11' },
  'q.grade.opt4': { value: 'Grade 12-13' },
  'q.province.opt1': { value: 'Western' },
  'q.province.opt2': { value: 'Central' },
  'q.province.opt3': { value: 'Southern' },
  'q.province.opt4': { value: 'Northern' },
  'q.province.opt5': { value: 'Eastern' },
  'q.province.opt6': { value: 'North Western' },
  'q.province.opt7': { value: 'North Central' },
  'q.province.opt8': { value: 'Uva' },
  'q.province.opt9': { value: 'Sabaragamuwa' },
  'q.school_type.opt1': { value: 'National School' },
  'q.school_type.opt2': { value: 'Provincial Government School' },
  'q.school_type.opt3': { value: 'Private/International School' },
  'q.primary_device.opt1': { value: 'Smartphone' },
  'q.primary_device.opt2': { value: 'Tablet' },
  'q.primary_device.opt3': { value: 'Computer/Laptop' },
  'q.primary_device.opt4': { value: 'Television' },
  'q.primary_device.opt5': { value: 'Radio' },
  'q.media_hours.opt1': { value: 'Less than 1 hour' },
  'q.media_hours.opt2': { value: '1-2 hours' },
  'q.media_hours.opt3': { value: '3-5 hours' },
  'q.media_hours.opt4': { value: 'More than 5 hours' },
  'q.media_sources.opt1': { value: 'TV News' },
  'q.media_sources.opt2': { value: 'Newspapers' },
  'q.media_sources.opt3': { value: 'Social Media' },
  'q.media_sources.opt4': { value: 'News Websites' },
  'q.media_sources.opt5': { value: 'Radio' },
  'q.media_sources.opt6': { value: 'Family/Friends' },
  'q.social_platforms.opt1': { value: 'Facebook' },
  'q.social_platforms.opt2': { value: 'Instagram' },
  'q.social_platforms.opt3': { value: 'TikTok' },
  'q.social_platforms.opt4': { value: 'YouTube' },
  'q.social_platforms.opt5': { value: 'WhatsApp' },
  'q.social_platforms.opt6': { value: 'Twitter/X' },
  'q.heard_ethics.opt1': { value: 'Yes' },
  'q.heard_ethics.opt2': { value: 'No' },
  'q.heard_ethics.opt3': { value: 'Not sure' },
  'q.ethics_meaning.opt1': { value: 'Reporting truthfully' },
  'q.ethics_meaning.opt2': { value: 'Being fair and balanced' },
  'q.ethics_meaning.opt3': { value: 'Respecting privacy' },
  'q.ethics_meaning.opt4': { value: 'Not spreading rumors' },
  'q.ethics_meaning.opt5': { value: 'Protecting sources' },
  'q.learned_ethics.opt1': { value: 'School' },
  'q.learned_ethics.opt2': { value: 'Parents/Family' },
  'q.learned_ethics.opt3': { value: 'Internet' },
  'q.learned_ethics.opt4': { value: 'Media itself' },
  'q.learned_ethics.opt5': { value: 'Never learned' },
  'q.ethics_important.opt1': { value: 'Very important' },
  'q.ethics_important.opt2': { value: 'Somewhat important' },
  'q.ethics_important.opt3': { value: 'Not important' },
  'q.ethics_important.opt4': { value: 'No opinion' },
  'q.biggest_problem.opt1': { value: 'Misinformation/Fake news' },
  'q.biggest_problem.opt2': { value: 'Biased reporting' },
  'q.biggest_problem.opt3': { value: 'Invasion of privacy' },
  'q.biggest_problem.opt4': { value: 'Sensationalism' },
  'q.biggest_problem.opt5': { value: 'Political influence' },
  'q.seen_unethical.opt1': { value: 'Yes, often' },
  'q.seen_unethical.opt2': { value: 'Yes, sometimes' },
  'q.seen_unethical.opt3': { value: 'Rarely' },
  'q.seen_unethical.opt4': { value: 'Never' },
  'q.affected_by_fake.opt1': { value: 'Yes' },
  'q.affected_by_fake.opt2': { value: 'No' },
  'q.affected_by_fake.opt3': { value: 'Not sure' },
  'q.verify_news.opt1': { value: 'Always' },
  'q.verify_news.opt2': { value: 'Sometimes' },
  'q.verify_news.opt3': { value: 'Rarely' },
  'q.verify_news.opt4': { value: 'Never' },
  'q.trust_media.opt1': { value: 'Fully trust' },
  'q.trust_media.opt2': { value: 'Somewhat trust' },
  'q.trust_media.opt3': { value: 'Neutral' },
  'q.trust_media.opt4': { value: 'Somewhat distrust' },
  'q.trust_media.opt5': { value: 'Fully distrust' },
  'q.trust_social.opt1': { value: 'Yes' },
  'q.trust_social.opt2': { value: 'No' },
  'q.trust_social.opt3': { value: 'About the same' },
  'q.media_influence.opt1': { value: 'Yes, significantly' },
  'q.media_influence.opt2': { value: 'Yes, somewhat' },
  'q.media_influence.opt3': { value: 'Not really' },
  'q.media_influence.opt4': { value: 'Not at all' },
  'q.responsible_media.opt1': { value: 'Yes, definitely' },
  'q.responsible_media.opt2': { value: 'Yes, somewhat' },
  'q.responsible_media.opt3': { value: 'No, they are fine' },
  'q.responsible_media.opt4': { value: 'No opinion' },
  'q.know_regulations.opt1': { value: 'Yes' },
  'q.know_regulations.opt2': { value: 'No' },
  'q.know_regulations.opt3': { value: 'Heard but dont know details' },
  'q.need_regulation.opt1': { value: 'Yes, definitely' },
  'q.need_regulation.opt2': { value: 'Yes, somewhat' },
  'q.need_regulation.opt3': { value: 'No, current is enough' },
  'q.need_regulation.opt4': { value: 'No, less regulation is better' },
  'q.who_regulate.opt1': { value: 'Government' },
  'q.who_regulate.opt2': { value: 'Independent body' },
  'q.who_regulate.opt3': { value: 'Media themselves' },
  'q.who_regulate.opt4': { value: 'Combination of all' },
  'q.media_better.opt1': { value: 'More truthful reporting' },
  'q.media_better.opt2': { value: 'Less political bias' },
  'q.media_better.opt3': { value: 'Better fact-checking' },
  'q.media_better.opt4': { value: 'More youth content' },
  'q.media_better.opt5': { value: 'Stricter regulations' },
  'q.youth_role.opt1': { value: 'Yes, definitely' },
  'q.youth_role.opt2': { value: 'Yes, somewhat' },
  'q.youth_role.opt3': { value: 'No' },
  'q.youth_role.opt4': { value: 'No opinion' },
  'q.would_report.opt1': { value: 'Yes' },
  'q.would_report.opt2': { value: 'Maybe' },
  'q.would_report.opt3': { value: 'No' },
  'q.future_media.opt1': { value: 'Independent journalist' },
  'q.future_media.opt2': { value: 'Government journalist' },
  'q.future_media.opt3': { value: 'Social media influencer' },
  'q.future_media.opt4': { value: 'Traditional news anchor' },
};

const getEnglishValue = (optionKey: string): string => {
  return englishValues[optionKey]?.value || optionKey;
};

const Survey = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "si", label: "සිං" },
    { code: "ta", label: "த" },
  ];

  const currentSectionData = surveyStructure[currentSection];
  const progress = ((currentSection + 1) / surveyStructure.length) * 100;

  const handleRadioChange = (questionId: string, optionKey: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: getEnglishValue(optionKey)
    }));
  };

  const handleCheckboxChange = (questionId: string, optionKey: string, checked: boolean) => {
    setResponses(prev => {
      const current = (prev[questionId] as string[]) || [];
      const englishVal = getEnglishValue(optionKey);
      
      if (checked) {
        return { ...prev, [questionId]: [...current, englishVal] };
      } else {
        return { ...prev, [questionId]: current.filter(v => v !== englishVal) };
      }
    });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateSection = (): boolean => {
    for (const question of currentSectionData.questions) {
      if (!question.required) continue;
      
      const response = responses[question.id];
      if (!response) return false;
      if (Array.isArray(response) && response.length === 0) return false;
      if (typeof response === 'string' && response.trim() === '') return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateSection()) {
      toast({
        title: t('survey.required'),
        description: "Please answer all required questions before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentSection < surveyStructure.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection()) {
      toast({
        title: t('survey.required'),
        description: "Please answer all required questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to submit your response.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save response to Firestore (NO PII - just answers)
      await setDoc(doc(db, 'responses', user.uid), {
        ...responses,
        submittedAt: serverTimestamp(),
      });

      // Mark user as submitted
      await updateDoc(doc(db, 'users', user.uid), {
        submitted: true,
        submittedAt: serverTimestamp(),
      });

      toast({
        title: "Success!",
        description: "Your survey response has been submitted.",
      });

      navigate('/submitted');
    } catch (error: unknown) {
      console.error("Error submitting survey:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit survey. Please try again.";
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner */}
      <header className="bg-maroon text-white z-50">
        <div className="w-full px-6 md:px-12 flex items-center justify-between h-14">
          {/* Empty left spacer for balance */}
          <div className="w-24"></div>

          {/* Center - Title */}
          <h1 className="text-lg sm:text-xl font-semibold text-white">
            Sandeshaya Survey
          </h1>
          
          {/* Right - Language Switcher & Logout */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 text-sm" aria-label="Language selection">
              {languages.map((lang, index) => (
                <span key={lang.code} className="flex items-center">
                  <button
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === lang.code
                        ? "text-white font-semibold bg-white/20"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {lang.label}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="text-white/30 mx-1">|</span>
                  )}
                </span>
              ))}
            </nav>

            <Button 
                variant="ghost" 
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
              >
                Log Out
            </Button>
          </div>
        </div>
        {/* Gold accent line */}
        <div className="h-1 bg-secondary" />
      </header>

      {/* Progress Section Card */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2 w-full">
        <div className="survey-card p-4 sm:p-5 border-t-8 border-t-maroon">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-maroon">
              Section {currentSection + 1} of {surveyStructure.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            {currentSectionData.title}
          </h2>
          {/* Custom Progress Bar */}
          <div className="survey-progress">
            <div 
              className="survey-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Individual Question Cards */}
      <main className="flex-1 py-4">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {currentSectionData.questions.map((question, qIndex) => (
            <div key={question.id} className="question-card transition-shadow duration-200">
              <Label className="text-base font-medium text-gray-800 mb-4 block">
                {qIndex + 1}. {t(question.translationKey as any)}
                {question.required ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : (
                  <span className="text-gray-400 text-sm ml-2">({t('survey.optional')})</span>
                )}
              </Label>
              
              {question.type === 'radio' && question.options && (
                <RadioGroup 
                  value={Object.keys(englishValues).find(k => englishValues[k].value === responses[question.id]) || ''}
                  onValueChange={(value) => handleRadioChange(question.id, value)}
                  className="space-y-1"
                >
                  {question.options.map((optKey, optIndex) => (
                    <label 
                      key={optIndex} 
                      htmlFor={`${question.id}-opt${optIndex}`}
                      className="option-item"
                    >
                      <RadioGroupItem 
                        value={optKey} 
                        id={`${question.id}-opt${optIndex}`}
                        className="border-2 border-gray-300 text-maroon w-5 h-5"
                      />
                      <span className="text-gray-700 flex-1">
                        {t(optKey as any)}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'checkbox' && question.options && (
                <div className="space-y-1">
                  {question.options.map((optKey, optIndex) => {
                    const englishVal = getEnglishValue(optKey);
                    const isChecked = ((responses[question.id] as string[]) || []).includes(englishVal);
                    
                    return (
                      <label 
                        key={optIndex} 
                        htmlFor={`${question.id}-opt${optIndex}`}
                        className="option-item"
                      >
                        <Checkbox 
                          id={`${question.id}-opt${optIndex}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(question.id, optKey, checked as boolean)
                          }
                          className="border-2 border-gray-300 w-5 h-5"
                        />
                        <span className="text-gray-700 flex-1">
                          {t(optKey as any)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {question.type === 'text' && (
                <Input 
                  value={(responses[question.id] as string) || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  maxLength={100}
                  className="max-w-md border-0 border-b-2 border-gray-300 rounded-none focus:border-maroon focus:ring-0 px-0"
                />
              )}

              {question.type === 'textarea' && (
                <Textarea 
                  value={(responses[question.id] as string) || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  maxLength={1000}
                  className="border-gray-300 focus:border-maroon"
                />
              )}
            </div>
          ))}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 pb-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="survey-nav-btn survey-nav-btn-secondary gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentSection < surveyStructure.length - 1 ? (
              <Button 
                onClick={handleNext} 
                className="survey-nav-btn survey-nav-btn-primary gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="survey-nav-btn survey-nav-btn-primary gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Your responses are saved automatically
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Sandeshaya – Ananda College Broadcasting Unit
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Survey;
