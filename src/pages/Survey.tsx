import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
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
type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'select';

interface Question {
  id: string;
  type: QuestionType;
  translationKey: string;
  options?: string[]; // Translation keys for options
  required: boolean;
  allowComment?: boolean; // New optional field
}

interface Section {
  id: string;
  titleKey: string;
  title: string; // English title - not translated
  questions: Question[];
}

// Survey structure with all 33 questions across 8 sections
const surveyStructure: Section[] = [
  {
    id: 'a',
    titleKey: 'section.a',
    title: 'Section A',
    questions: [
      { id: 'grade', type: 'radio', translationKey: 'q.grade', options: ['q.grade.opt1', 'q.grade.opt2', 'q.grade.opt3', 'q.grade.opt4'], required: true },
      { id: 'district', type: 'select', translationKey: 'q.district', options: ['q.district.ampara', 'q.district.anuradhapura', 'q.district.badulla', 'q.district.batticaloa', 'q.district.colombo', 'q.district.galle', 'q.district.gampaha', 'q.district.hambantota', 'q.district.jaffna', 'q.district.kalutara', 'q.district.kandy', 'q.district.kegalle', 'q.district.northern_province', 'q.district.kurunegala', 'q.district.matale', 'q.district.matara', 'q.district.monaragala', 'q.district.nuwaraeliya', 'q.district.polonnaruwa', 'q.district.puttalam', 'q.district.ratnapura', 'q.district.trincomalee'], required: true },
      { id: 'school_type', type: 'radio', translationKey: 'q.school_type', options: ['q.school_type.opt1', 'q.school_type.opt2', 'q.school_type.opt3'], required: true },
    ]
  },
  {
    id: 'b',
    titleKey: 'section.b',
    title: 'Section B',
    questions: [
      { id: 'primary_device', type: 'radio', translationKey: 'q.primary_device', options: ['q.primary_device.opt1', 'q.primary_device.opt2', 'q.primary_device.opt3', 'q.primary_device.opt4', 'q.primary_device.opt5'], required: true },
      { id: 'internet_access', type: 'radio', translationKey: 'q.internet_access', options: ['q.internet_access.opt1', 'q.internet_access.opt2', 'q.internet_access.opt3', 'q.internet_access.opt4', 'q.internet_access.opt5'], required: true },
      { id: 'media_hours', type: 'radio', translationKey: 'q.media_hours', options: ['q.media_hours.opt1', 'q.media_hours.opt2', 'q.media_hours.opt3', 'q.media_hours.opt4'], required: true },
      { id: 'own_device', type: 'radio', translationKey: 'q.own_device', options: ['q.own_device.opt1', 'q.own_device.opt2', 'q.own_device.opt3'], required: true },
    ]
  },
  {
    id: 'c',
    titleKey: 'section.c',
    title: 'Section C',
    questions: [
      { id: 'heard_ethics', type: 'radio', translationKey: 'q.heard_ethics', options: ['q.heard_ethics.opt1', 'q.heard_ethics.opt2', 'q.heard_ethics.opt3'], required: true },
      { id: 'ethics_meaning', type: 'checkbox', translationKey: 'q.ethics_meaning', options: ['q.ethics_meaning.opt1', 'q.ethics_meaning.opt2', 'q.ethics_meaning.opt3', 'q.ethics_meaning.opt4', 'q.ethics_meaning.opt5'], required: true },
      { id: 'ethics_level', type: 'radio', translationKey: 'q.ethics_level', options: ['q.ethics_level.opt1', 'q.ethics_level.opt2', 'q.ethics_level.opt3', 'q.ethics_level.opt4'], required: true },
    ]
  },
  {
    id: 'd',
    titleKey: 'section.d',
    title: 'Section D',
    questions: [
      { id: 'misleading_content', type: 'radio', translationKey: 'q.misleading_content', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'unfair_content', type: 'radio', translationKey: 'q.unfair_content', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'problematic_platform', type: 'radio', translationKey: 'q.problematic_platform', options: ['q.problematic_platform.opt1', 'q.problematic_platform.opt2', 'q.problematic_platform.opt3', 'q.problematic_platform.opt4', 'q.problematic_platform.opt5'], required: true },
      { id: 'ignored_ethics', type: 'radio', translationKey: 'q.ignored_ethics', options: ['q.yes', 'q.no', 'q.not_sure'], required: true },
    ]
  },
  {
    id: 'e',
    titleKey: 'section.e',
    title: 'Section E',
    questions: [
      { id: 'trust_level', type: 'radio', translationKey: 'q.trust_level', options: ['q.trust_level.opt1', 'q.trust_level.opt2', 'q.trust_level.opt3', 'q.trust_level.opt4'], required: true },
      { id: 'unethical_trust', type: 'radio', translationKey: 'q.unethical_trust', options: ['q.yes', 'q.no', 'q.not_sure'], required: true },
      { id: 'unethical_impact_youth', type: 'radio', translationKey: 'q.unethical_impact_youth', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'question_authenticity', type: 'radio', translationKey: 'q.question_authenticity', options: ['q.question_authenticity.opt1', 'q.question_authenticity.opt2', 'q.question_authenticity.opt3', 'q.question_authenticity.opt4'], required: true, allowComment: true },
    ]
  },
  {
    id: 'f',
    titleKey: 'section.f',
    title: 'Section F',
    questions: [
      { id: 'know_laws', type: 'radio', translationKey: 'q.know_laws', options: ['q.yes', 'q.no', 'q.not_sure'], required: true },
      { id: 'laws_adequate', type: 'radio', translationKey: 'q.laws_adequate', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'best_solution', type: 'radio', translationKey: 'q.best_solution', options: ['q.best_solution.opt1', 'q.best_solution.opt2', 'q.best_solution.opt3', 'q.best_solution.opt4'], required: true },
      { id: 'responsibility_who', type: 'radio', translationKey: 'q.responsibility_who', options: ['q.responsibility_who.opt1', 'q.responsibility_who.opt2', 'q.responsibility_who.opt3', 'q.responsibility_who.opt4', 'q.responsibility_who.opt5'], required: true },
      { id: 'new_laws_suggestions', type: 'textarea', translationKey: 'q.new_laws_suggestions', required: true },
    ]
  },
  {
    id: 'g',
    titleKey: 'section.g',
    title: 'Section G',
    questions: [
      { id: 'tv_ethics', type: 'radio', translationKey: 'q.tv_ethics', options: ['q.tv_ethics.opt1', 'q.tv_ethics.opt2', 'q.tv_ethics.opt3', 'q.tv_ethics.opt4', 'q.tv_ethics.opt5'], required: true },
      { id: 'radio_ethics', type: 'radio', translationKey: 'q.radio_ethics', options: ['q.tv_ethics.opt1', 'q.tv_ethics.opt2', 'q.tv_ethics.opt3', 'q.tv_ethics.opt4', 'q.tv_ethics.opt5'], required: true },
      { id: 'newspaper_ethics', type: 'radio', translationKey: 'q.newspaper_ethics', options: ['q.tv_ethics.opt1', 'q.tv_ethics.opt2', 'q.tv_ethics.opt3', 'q.tv_ethics.opt4', 'q.tv_ethics.opt5'], required: true },
      { id: 'social_web_ethics', type: 'radio', translationKey: 'q.social_web_ethics', options: ['q.tv_ethics.opt1', 'q.tv_ethics.opt2', 'q.tv_ethics.opt3', 'q.tv_ethics.opt4', 'q.tv_ethics.opt5'], required: true },
    ]
  },
  {
    id: 'h',
    titleKey: 'section.h',
    title: 'Section H',
    questions: [
      { id: 'student_voice', type: 'radio', translationKey: 'q.student_voice', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'school_curriculum', type: 'radio', translationKey: 'q.school_curriculum', options: ['q.yes', 'q.no', 'q.not_sure'], required: true, allowComment: true },
      { id: 'biggest_ethical_problem', type: 'textarea', translationKey: 'q.biggest_ethical_problem', required: true },
      { id: 'current_state', type: 'radio', translationKey: 'q.current_state', options: ['q.current_state.opt1', 'q.current_state.opt2', 'q.current_state.opt3', 'q.current_state.opt4'], required: true },
      { id: 'desired_change', type: 'textarea', translationKey: 'q.desired_change', required: true },
      { id: 'other_thoughts', type: 'textarea', translationKey: 'q.other_thoughts', required: false },
    ]
  },
];

// English canonical values for storing in Firestore
const englishValues: Record<string, Record<string, string>> = {
  'q.grade.opt1': { value: 'Grade 10' },
  'q.grade.opt2': { value: 'Grade 11' },
  'q.grade.opt3': { value: 'Grade 12' },
  'q.grade.opt4': { value: 'Grade 13' },
  'q.school_type.opt1': { value: 'National School' },
  'q.school_type.opt2': { value: 'Provincial Council Government School' },
  'q.school_type.opt3': { value: 'Private / International School' },
  'q.primary_device.opt1': { value: 'Smartphone' },
  'q.primary_device.opt2': { value: 'Tablet' },
  'q.primary_device.opt3': { value: 'Laptop / Computer' },
  'q.primary_device.opt4': { value: 'Television' },
  'q.primary_device.opt5': { value: 'No device access' },
  'q.internet_access.opt1': { value: 'Home Wi-Fi' },
  'q.internet_access.opt2': { value: 'Mobile Data' },
  'q.internet_access.opt3': { value: 'School Internet' },
  'q.internet_access.opt4': { value: 'Internet Café' },
  'q.internet_access.opt5': { value: 'Rarely use' },
  'q.media_hours.opt1': { value: 'Less than 1 hour' },
  'q.media_hours.opt2': { value: '1-3 hours' },
  'q.media_hours.opt3': { value: '3-5 hours' },
  'q.media_hours.opt4': { value: 'More than 5 hours' },
  'q.own_device.opt1': { value: 'Yes' },
  'q.own_device.opt2': { value: 'No' },
  'q.own_device.opt3': { value: 'Shared with family' },
  'q.heard_ethics.opt1': { value: 'Yes' },
  'q.heard_ethics.opt2': { value: 'Slightly' },
  'q.heard_ethics.opt3': { value: 'No' },
  'q.ethics_meaning.opt1': { value: 'Honest' },
  'q.ethics_meaning.opt2': { value: 'Fair' },
  'q.ethics_meaning.opt3': { value: 'Responsible' },
  'q.ethics_meaning.opt4': { value: 'Not harming' },
  'q.ethics_meaning.opt5': { value: 'Dont know' },
  'q.ethics_level.opt1': { value: 'Very ethical' },
  'q.ethics_level.opt2': { value: 'Somewhat ethical' },
  'q.ethics_level.opt3': { value: 'Not very ethical' },
  'q.ethics_level.opt4': { value: 'Not at all ethical' },
  'q.yes': { value: 'Yes' },
  'q.no': { value: 'No' },
  'q.not_sure': { value: 'Not sure' },
  'q.problematic_platform.opt1': { value: 'Television' },
  'q.problematic_platform.opt2': { value: 'Social Media/Web' },
  'q.problematic_platform.opt3': { value: 'Radio' },
  'q.problematic_platform.opt4': { value: 'Newspapers' },
  'q.problematic_platform.opt5': { value: 'Not sure' },
  'q.trust_level.opt1': { value: 'Very high' },
  'q.trust_level.opt2': { value: 'Some extent' },
  'q.trust_level.opt3': { value: 'Very low' },
  'q.trust_level.opt4': { value: 'Not at all' },
  'q.question_authenticity.opt1': { value: 'Constantly' },
  'q.question_authenticity.opt2': { value: 'Sometimes' },
  'q.question_authenticity.opt3': { value: 'Very rarely' },
  'q.question_authenticity.opt4': { value: 'Never' },
  'q.best_solution.opt1': { value: 'New laws' },
  'q.best_solution.opt2': { value: 'Improve existing laws' },
  'q.best_solution.opt3': { value: 'Better implementation' },
  'q.best_solution.opt4': { value: 'Self-regulation' },
  'q.responsibility_who.opt1': { value: 'Government' },
  'q.responsibility_who.opt2': { value: 'Media Orgs' },
  'q.responsibility_who.opt3': { value: 'Journalists' },
  'q.responsibility_who.opt4': { value: 'Social Media' },
  'q.responsibility_who.opt5': { value: 'Public' },
  'q.tv_ethics.opt1': { value: 'Very Good' },
  'q.tv_ethics.opt2': { value: 'Good' },
  'q.tv_ethics.opt3': { value: 'Neutral' },
  'q.tv_ethics.opt4': { value: 'Poor' },
  'q.tv_ethics.opt5': { value: 'Very Poor' },
  'q.current_state.opt1': { value: 'Improving' },
  'q.current_state.opt2': { value: 'Getting worse' },
  'q.current_state.opt3': { value: 'No change' },
  'q.current_state.opt4': { value: 'Not sure' },
  'q.district.northern_province': { value: 'Mullaitivu / Kilinochchi / Mannar / Vavuniya' },
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

  // Calculate total questions and answered questions for progress
  const totalQuestions = surveyStructure.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).filter(key => {
    const response = responses[key];
    if (!response) return false;
    if (Array.isArray(response) && response.length === 0) return false;
    if (typeof response === 'string' && response.trim() === '') return false;
    return true;
  }).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  // Calculate global question number (1-30)
  const getGlobalQuestionNumber = (sectionIndex: number, questionIndex: number): number => {
    let questionNumber = 0;
    for (let i = 0; i < sectionIndex; i++) {
      questionNumber += surveyStructure[i].questions.length;
    }
    return questionNumber + questionIndex + 1;
  };

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

      // Special logic for Question 9 (ethics_meaning)
      // "I don't know" (opt5) should be mutually exclusive
      if (questionId === 'ethics_meaning') {
        const dontKnowVal = getEnglishValue('q.ethics_meaning.opt5'); // "Dont know"

        if (englishVal === dontKnowVal) {
          // User toggled "Dont know"
          if (checked) {
            // Turning ON "Dont know" -> Clear everything else
            return { ...prev, [questionId]: [dontKnowVal] };
          } else {
            // Turning OFF "Dont know" -> Just empty
            return { ...prev, [questionId]: [] };
          }
        } else {
          // User toggled a normal option (1-4)
          if (checked) {
            // Turning ON a normal option -> Remove "Dont know" and add this
            const newValue = [...current.filter(v => v !== dontKnowVal), englishVal];
            return { ...prev, [questionId]: newValue };
          } else {
            // Turning OFF a normal option
            return { ...prev, [questionId]: current.filter(v => v !== englishVal) };
          }
        }
      }

      // Default behavior for other questions
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
          <h1 className="text-lg sm:text-xl font-semibold text-white whitespace-nowrap">
            Sandeshaya Survey
          </h1>

          {/* Right - Language Switcher & Logout */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 text-sm" aria-label="Language selection">
              {languages.map((lang, index) => (
                <span key={lang.code} className="flex items-center">
                  <button
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded transition-colors ${language === lang.code
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
                {getGlobalQuestionNumber(currentSection, qIndex)}. {t(question.translationKey as any)}
                {question.required ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : (
                  <span className="text-gray-400 text-sm ml-2">({t('survey.optional')})</span>
                )}
              </Label>

              {question.type === 'radio' && question.options && (
                <RadioGroup
                  onValueChange={(value) => handleRadioChange(question.id, value)}
                  value={question.options?.find(key => getEnglishValue(key) === responses[question.id]) || responses[question.id] as string}
                  className="flex flex-col space-y-2"
                >
                  {question.options.map((optKey, optIndex) => {
                    const currentVal = question.options?.find(key => getEnglishValue(key) === responses[question.id]) || responses[question.id] as string;
                    const isSelected = currentVal === optKey;

                    return (
                      <label
                        key={optIndex}
                        htmlFor={`${question.id}-opt${optIndex}`}
                        className={`option-item transition-all duration-200 border rounded-lg p-4 cursor-pointer flex items-center gap-3 active:scale-[0.99] ${isSelected
                          ? 'bg-maroon/10 border-maroon shadow-md ring-1 ring-maroon/30 scale-[1.01]'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-maroon/50 hover:shadow-sm'
                          }`}
                      >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${isSelected ? 'border-maroon bg-white' : 'border-gray-300'
                          }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-maroon" />}
                        </div>

                        <RadioGroupItem
                          value={optKey}
                          id={`${question.id}-opt${optIndex}`}
                          className="sr-only" // Hide default radio to use custom custom UI
                        />
                        <span className={`flex-1 text-base ${isSelected ? 'text-maroon font-medium' : 'text-gray-700'}`}>
                          {t(optKey as any)}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              )}

              {/* Optional Comment Box */}
              {question.allowComment && responses[question.id] && (
                <div className="mt-4 animate-fade-in">
                  <Label htmlFor={`${question.id}-comment`} className="text-sm text-gray-500 mb-1 block">
                    {t('q.optional_comment' as any)}
                  </Label>
                  <Textarea
                    id={`${question.id}-comment`}
                    value={(responses[`${question.id}_comment`] as string) || ''}
                    onChange={(e) => handleTextChange(`${question.id}_comment`, e.target.value)}
                    placeholder={t('q.optional_comment' as any)}
                    className="border-gray-300 focus:border-maroon min-h-[80px]"
                    maxLength={500}
                  />
                </div>
              )}

              {question.type === 'checkbox' && question.options && (
                <div className="space-y-2">
                  {question.options.map((optKey, optIndex) => {
                    const englishVal = getEnglishValue(optKey);
                    const isChecked = ((responses[question.id] as string[]) || []).includes(englishVal);

                    return (
                      <label
                        key={optIndex}
                        htmlFor={`${question.id}-opt${optIndex}`}
                        className={`option-item transition-all duration-200 border rounded-lg p-4 cursor-pointer flex items-center gap-3 active:scale-[0.99] ${isChecked
                          ? 'bg-maroon/10 border-maroon shadow-md ring-1 ring-maroon/30 scale-[1.01]'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-maroon/50 hover:shadow-sm'
                          }`}
                      >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-colors ${isChecked ? 'border-maroon bg-maroon' : 'border-gray-300 bg-white'
                          }`}>
                          {isChecked && <Check className="w-4 h-4 text-white" />}
                        </div>

                        <Checkbox
                          id={`${question.id}-opt${optIndex}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(question.id, optKey, checked as boolean)
                          }
                          className="sr-only" // Hide default checkbox
                        />
                        <span className={`flex-1 text-base ${isChecked ? 'text-maroon font-medium' : 'text-gray-700'}`}>
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

              {question.type === 'select' && question.options && (
                <Select
                  value={question.options?.find(key => getEnglishValue(key) === responses[question.id]) || responses[question.id] as string}
                  onValueChange={(value) => handleRadioChange(question.id, value)}
                >
                  <SelectTrigger className="w-full max-w-md bg-white border-gray-300 focus:ring-maroon">
                    <SelectValue placeholder={t('q.select_placeholder' as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options.map((optKey, optIndex) => (
                      <SelectItem key={optIndex} value={optKey}>
                        {t(optKey as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
