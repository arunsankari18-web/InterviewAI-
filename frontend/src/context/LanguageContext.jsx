import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Brand
    brandName: 'Interview AI',
    tagline: 'Practice like the interview is real.',
    proBadge: 'PRO',

    // Nav
    commandCenter: 'Command Center',
    companyIntelligence: 'Company Intelligence',
    interviewStudio: 'Interview Studio',
    resumeDefense: 'Resume Defense',
    technicalArena: 'Technical Arena',
    interviewAutopsy: 'Interview Autopsy',
    placementReadiness: 'Placement Readiness',
    challengeHub: 'Challenge Hub',
    profileCalibration: 'Profile Calibration',
    adminDashboard: 'Admin Dashboard',
    adminPortal: 'Admin Portal',
    recentlyAccessed: 'Recently Accessed',

    // Common Buttons & Labels
    signIn: 'Sign In',
    signOut: 'Sign Out',
    register: 'Create Account',
    adminSignIn: 'Admin Portal',
    candidateSignIn: 'Candidate Login',
    quickDemoLogins: 'Quick Demo Logins (5 Candidates + 1 Admin)',
    startSession: 'Start Session',
    launchStudio: 'Launch Interview Studio',
    readinessScore: 'Placement Readiness',
    targetRole: 'Target Role',
    targetCompany: 'Target Company',
    score: 'Score',
    status: 'Status',
    actions: 'Actions',
    clear: 'Clear',
    viewAutopsy: 'View Autopsy',
    refresh: 'Refresh',

    // Chatbot
    chatTitle: 'AI Placement Coach',
    chatSubtitle: 'Ask anything about Zoho, TCS, Amazon & HR rounds',
    chatPlaceholder: 'Ask a question in English or தமிழ்...',
    chatSend: 'Send',

    // Interview Studio
    liveStudio: 'Live Studio',
    questionWord: 'Question',
    ofWord: 'of',
    scratchpad: 'Live Code Scratchpad',
    hideScratchpad: 'Hide Scratchpad',
    finishAutopsy: 'Finish & Generate Autopsy',
    tamilTranslation: 'Tamil Subtitle & Guide',
    hideTamilSubtitle: 'Hide Tamil Guide',
    listenInTamil: 'Listen in Tamil',
    candidateFloor: 'Candidate Floor Active · Speak Now',
    interviewerSpeaking: 'Interviewer speaking question aloud...',
    spokenTranscript: 'Your Live Spoken Transcript',
    micActive: 'Microphone Active (Listening...)',
    micPaused: 'Microphone Muted',
    micActiveButton: 'Mic ON (Listening)',
    micMutedButton: 'Mic MUTED (Click to Speak)',
    clickToMuteHint: 'Click to Mute',
    clickToUnmuteHint: 'Click to Speak',
    restartMic: 'Restart Mic',
    clearText: 'Clear Text',
    submitAnswer: 'Submit Answer & Next Turn',
    evaluating: 'Evaluating response depth...',
    quickVoiceSample: '⚡ Quick Demo Voice Answer',
    langEnglish: 'English (en-IN)',
    langTamil: 'தமிழ் (ta-IN)'
  },
  ta: {
    // Brand
    brandName: 'Interview AI',
    tagline: 'உண்மையான நேர்காணல் போன்ற தீவிரப் பயிற்சி.',
    proBadge: 'ப்ரோ',

    // Nav
    commandCenter: 'கட்டளை மையம்',
    companyIntelligence: 'நிறுவன நுண்ணறிவு',
    interviewStudio: 'நேர்காணல் அரங்கம்',
    resumeDefense: 'ரெஸ்யூம் டிஃபென்ஸ்',
    technicalArena: 'தொழில்நுட்ப களம்',
    interviewAutopsy: 'தடயவியல் ஆய்வு (Autopsy)',
    placementReadiness: 'வேலைவாய்ப்பு தயார்நிலை',
    challengeHub: 'சவால் மையம்',
    profileCalibration: 'சுயவிவர அமைப்புகள்',
    adminDashboard: 'நிர்வாக கண்ட்ரோல் மையம்',
    adminPortal: 'அட்மின் போர்டல்',
    recentlyAccessed: 'சமீபத்தில் பார்த்தவை',

    // Common Buttons & Labels
    signIn: 'உள்நுழைக',
    signOut: 'வெளியேறு',
    register: 'புதிய கணக்கு',
    adminSignIn: 'அட்மின் போர்டல்',
    candidateSignIn: 'மாணவர் உள்நுழைவு',
    quickDemoLogins: 'உடனடி டெமோ உள்நுழைவு (5 மாணவர்கள் + 1 அட்மின்)',
    startSession: 'பயிற்சியைத் தொடங்கு',
    launchStudio: 'நேர்காணல் அறைக்கு செல்',
    readinessScore: 'தயார்நிலை மதிப்பெண்',
    targetRole: 'இலக்கு பதவி',
    targetCompany: 'இலக்கு நிறுவனம்',
    score: 'மதிப்பெண்',
    status: 'நிலை',
    actions: 'செயல்கள்',
    clear: 'அழி',
    viewAutopsy: 'ஆய்வை காண்க',
    refresh: 'புதுப்பி',

    // Chatbot
    chatTitle: 'ஏஐ வேலைவாய்ப்பு வழிகாட்டி',
    chatSubtitle: 'Zoho, TCS, Amazon மற்றும் HR சுற்றுகள் பற்றி கேளுங்கள்',
    chatPlaceholder: 'தமிழ் அல்லது ஆங்கிலத்தில் கேள்விகளை கேளுங்கள்...',
    chatSend: 'அனுப்பு',

    // Interview Studio
    liveStudio: 'நேரடி அரங்கம்',
    questionWord: 'கேள்வி',
    ofWord: 'இல்',
    scratchpad: 'நேரடி குறியீட்டு பலகை',
    hideScratchpad: 'பலகையை மறை',
    finishAutopsy: 'நேர்காணல் முடி & ஆய்வு செய்',
    tamilTranslation: 'தமிழ் வழிகாட்டுதல்',
    hideTamilSubtitle: 'வழிகாட்டலை மறை',
    listenInTamil: 'தமிழில் கேட்க',
    candidateFloor: 'உங்கள் முறை · இப்போது பேசுங்கள்',
    interviewerSpeaking: 'நேர்காணல் செய்பவர் கேள்வி கேட்கிறார்...',
    spokenTranscript: 'உங்கள் நேரடி குரல் உரை (Spoken Transcript)',
    micActive: 'மைக் இயங்குகிறது (கேட்கிறது...)',
    micPaused: 'மைக் முடக்கப்பட்டது',
    micActiveButton: 'மைக் ON (கேட்கிறது)',
    micMutedButton: 'மைக் MUTED (பேச கிளிக் செய்யவும்)',
    clickToMuteHint: 'நிறுத்த கிளிக் செய்யவும்',
    clickToUnmuteHint: 'பேச கிளிக் செய்யவும்',
    restartMic: 'மைக்கை புதுப்பி',
    clearText: 'உரையை அழி',
    submitAnswer: 'பதிலை சமர்ப்பித்து அடுத்த சுற்றுக்கு செல்',
    evaluating: 'பதிலை ஆய்வு செய்கிறது...',
    quickVoiceSample: '⚡ உடனடி மாதிரி குரல் பதில் (டெமோ)',
    langEnglish: 'English (en-IN)',
    langTamil: 'தமிழ் (ta-IN)'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('interview_ai_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('interview_ai_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
