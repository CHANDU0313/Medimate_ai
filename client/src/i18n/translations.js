/**
 * MediMate AI - Multilingual UI Dictionary (i18n)
 * Supports: English, Telugu (తెలుగు), Hindi (हिन्दी)
 * Lightweight, zero-dependency translation dictionary.
 */

export const translations = {
  en: {
    app: {
      name: 'MediMate AI',
      tagline: 'Your health questions, explained simply.',
      theme: 'Reimagine Everyday Life — Make the Complex Simple.',
      badgeDemo: 'Demo Mode — AI not connected. Pre-written samples.',
      badgeLive: 'Gemini AI Connected',
      disclaimer: 'MediMate AI provides general health information only. It is not a doctor and cannot diagnose or treat medical conditions.',
      clearData: 'Clear my data',
      clearDataConfirm: 'Are you sure you want to clear your current session data? All messages will be deleted from your browser.',
      privacyNotice: 'Privacy & Consent',
      dataClearedToast: 'All session data has been cleared securely.',
      copiedToast: 'Doctor summary copied to clipboard!',
      copyFailedToast: 'Failed to copy summary. Please select and copy manually.'
    },
    nav: {
      chatTab: 'Health Chat',
      symptomTab: 'Symptom Checker',
      summaryTab: 'Doctor Summary',
      historyTab: 'Recent Sessions',
      newCheckup: '+ New Conversation'
    },
    chat: {
      title: 'AI Health Chat',
      subtitle: 'Ask any general health question in plain, everyday language.',
      placeholder: 'Type your health question (e.g., Why do I get a headache after working on my laptop?)...',
      send: 'Send',
      thinking: 'MediMate is thinking...',
      suggestedStartersTitle: 'Suggested starter questions:',
      starters: [
        "I've had a headache since this morning after working on screens.",
        "How can I tell the difference between a cold and seasonal allergies?",
        "What are simple, safe ways to soothe a sore throat at home?",
        "Why do my knees feel stiff in the morning when I wake up?"
      ],
      sampleBadge: 'Sample conversation',
      errorNetwork: 'Unable to reach the server. Please check your connection and retry.',
      retry: 'Retry message',
      emptyTitle: 'Welcome to MediMate AI',
      emptyDesc: 'Choose a starter question above or type any general health topic you would like explained simply.'
    },
    form: {
      title: 'Symptom Information Form',
      subtitle: 'Share your symptoms to receive an educational explanation and a doctor-visit summary.',
      mainSymptomLabel: 'Main Symptom(s)',
      mainSymptomPlaceholder: 'e.g., Dull throbbing headache on forehead, mild sore throat',
      mainSymptomError: 'Please enter your main symptom (at least 3 characters).',
      durationLabel: 'How long have you felt this?',
      durationPlaceholder: 'e.g., Since this morning, 3 days, 2 weeks',
      durationError: 'Please describe how long this symptom has been present.',
      severityLabel: 'Severity Level',
      severityScaleHelp: '1 = Barely noticeable, 10 = Most severe pain imaginable',
      ageRangeLabel: 'Age Range',
      ageRangeOptions: {
        infant: 'Infant / Toddler (0 - 2 years)',
        child: 'Child (3 - 12 years)',
        teen: 'Adolescent (13 - 17 years)',
        youngAdult: 'Young Adult (18 - 35 years)',
        middleAdult: 'Adult (36 - 64 years)',
        senior: 'Older Adult (65+ years)'
      },
      contextLabel: 'Relevant Context (Optional)',
      contextPlaceholder: 'e.g., Worked late, stared at screens, high blood pressure, changed diet...',
      otherDetailsLabel: 'Other Details (Optional)',
      otherDetailsPlaceholder: 'e.g., Happens more often after meals, relieved by resting...',
      submitBtn: 'Analyze Symptoms & Prepare Summary',
      submittingBtn: 'Analyzing symptoms carefully...',
      resetBtn: 'Reset Form'
    },
    results: {
      title: 'Educational Symptom Explanation',
      disclaimerNotice: 'Framed as common, possible explanations — NOT a medical diagnosis.',
      explanationsHeader: 'Possible, Common Explanations',
      selfCareHeader: 'Safe Self-Care Information',
      warningSignsHeader: 'Warning Signs to Watch For',
      whenToSeeDoctorHeader: 'When to See a Doctor',
      questionsHeader: 'Questions to Ask Your Clinician',
      emptyState: 'Fill out the symptom form on the left to view educational insights and advice here.'
    },
    urgency: {
      emergency: 'EMERGENCY: Seek Immediate Medical Care',
      urgent: 'See a Doctor Soon (Within 24–48 Hours)',
      routine: 'Self-Care & Monitor at Home'
    },
    summaryCard: {
      title: 'Doctor-Visit Summary',
      subtitle: 'Take this structured note with you or copy it to discuss with your healthcare clinician.',
      patientInfo: 'Reported Details',
      symptoms: 'Main Symptoms',
      duration: 'Duration',
      severity: 'Reported Severity',
      ageRange: 'Age Range',
      context: 'Context / History',
      questionsToAsk: 'Suggested Questions to Ask Your Doctor',
      copyBtn: 'Copy to Clipboard',
      copiedBtn: 'Copied!',
      emptyDesc: 'Your organized summary will appear here after asking questions or submitting symptoms.'
    },
    history: {
      title: 'Recent Conversations',
      empty: 'No saved conversations yet.',
      sampleTag: 'Sample',
      activeTag: 'Active'
    },
    privacyModal: {
      title: 'Your Privacy & Health Consent',
      desc1: 'Welcome to MediMate AI. Before you begin, please review how we handle your information:',
      point1: 'No Server Storage: None of your personal health data is saved to a server database or tracked.',
      point2: 'Local Session Only: Your chat history is stored temporarily in your browser sessionStorage and cleared when you close the tab or click "Clear my data".',
      point3: 'Educational Scope: MediMate AI provides plain-language health information. It is NOT a doctor and cannot provide clinical diagnoses or prescriptions.',
      point4: 'Immediate Emergencies: For severe chest pain, trouble breathing, or self-harm thoughts, call 112 / 108 / 988 immediately.',
      acceptBtn: 'I Understand & Agree',
      closeBtn: 'Close'
    }
  },

  te: {
    app: {
      name: 'మెడిమేట్ AI (MediMate AI)',
      tagline: 'మీ ఆరోగ్య సందేహాలు, సరళమైన వివరణ.',
      theme: 'రోజువారీ జీవితాన్ని సులభతరం చేయడం — సంక్లిష్టతను సులభం చేయండి.',
      badgeDemo: 'డెమో మోడ్ — AI కనెక్ట్ కాలేదు. నమూనా సమాధానాలు.',
      badgeLive: 'జెమిని AI కనెక్ట్ చేయబడింది',
      disclaimer: 'మెడిమేట్ AI కేవలం సాధారణ ఆరోగ్య అవగాహన కొరకు మాత్రమే. ఇది డాక్టర్ కాదు మరియు వ్యాధి నిర్ధారణ లేదా చికిత్స చేయలేదు.',
      clearData: 'నా డేటా తొలగించు',
      clearDataConfirm: 'మీరు ప్రస్తుత సెషన్ డేటాను తొలగించాలనుకుంటున్నారా? మీ బ్రౌజర్ నుండి అన్ని సందేశాలు తొలగించబడతాయి.',
      privacyNotice: 'గోప్యత & సమ్మతి',
      dataClearedToast: 'సెషన్ డేటా విజయవంతంగా తొలగించబడింది.',
      copiedToast: 'డాక్టర్ సారాంశం క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
      copyFailedToast: 'కాపీ చేయడం విఫలమైంది. దయచేసి మాన్యువల్‌గా కాపీ చేయండి.'
    },
    nav: {
      chatTab: 'ఆరోగ్య చాట్',
      symptomTab: 'లక్షణాల పరిశీలన',
      summaryTab: 'డాక్టర్ సారాంశం',
      historyTab: 'గత సంభాషణలు',
      newCheckup: '+ కొత్త సంభాషణ'
    },
    chat: {
      title: 'AI ఆరోగ్య చాట్',
      subtitle: 'ఏదైనా సాధారణ ఆరోగ్య ప్రశ్నను సరళమైన తెలుగులో అడగండి.',
      placeholder: 'మీ ఆరోగ్య ప్రశ్నను టైప్ చేయండి (ఉదా: కంప్యూటర్ చూసినప్పుడు తలనొప్పి ఎందుకు వస్తుంది?)...',
      send: 'పంపు',
      thinking: 'మెడిమేట్ ఆలోచిస్తోంది...',
      suggestedStartersTitle: 'ప్రారంభ ప్రశ్నల సూచనలు:',
      starters: [
        "ఉదయం నుండి నాకు తలనొప్పిగా ఉంది, సాధారణ కారణాలు ఏమిటి?",
        "జలుబు మరియు అలర్జీల మధ్య తేడాను ఎలా గుర్తించాలి?",
        "గొంతు నొప్పికి ఇంట్లోనే సురక్షితమైన ఉపశమనం ఎలా పొందాలి?",
        "ఉదయం నిద్రలేవగానే మోకాళ్ల కీళ్ళు ఎందుకు బిగుసుకుపోతాయి?"
      ],
      sampleBadge: 'నమూనా సంభాషణ',
      errorNetwork: 'సర్వర్‌ను సంప్రదించలేకపోయాము. దయచేసి ఇంటర్నెట్ సరిచూసుకొని మళ్ళీ ప్రయత్నించండి.',
      retry: 'మళ్ళీ ప్రయత్నించు',
      emptyTitle: 'మెడిమేట్ AI కి స్వాగతం',
      emptyDesc: 'పైన ఉన్న ప్రశ్నలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ఆరోగ్య సందేహాన్ని ఇక్కడ రాయండి.'
    },
    form: {
      title: 'లక్షణాల సమాచార ఫారమ్',
      subtitle: 'మీ లక్షణాలను నమోదు చేసి సులభమైన వివరణ మరియు డాక్టర్ కోసం సారాంశాన్ని పొందండి.',
      mainSymptomLabel: 'ప్రధాన లక్షణం(లు)',
      mainSymptomPlaceholder: 'ఉదా: నుదిటిపై మోస్తరు తలనొప్పి, గొంతు గరగర',
      mainSymptomError: 'దయచేసి మీ ప్రధాన లక్షణాన్ని నమోదు చేయండి (కనీసం 3 అక్షరాలు).',
      durationLabel: 'ఇది ఎంతకాలం నుండి ఉంది?',
      durationPlaceholder: 'ఉదా: ఈ రోజు ఉదయం నుండి, 2 రోజులు, వారం రోజులు',
      durationError: 'ఈ లక్షణం ఎంత సమయం నుండి ఉందో వివరించండి.',
      severityLabel: 'తీవ్రత స్థాయి',
      severityScaleHelp: '1 = చాలా స్వల్పం, 10 = భరించలేనంత తీవ్రమైన నొప్పి',
      ageRangeLabel: 'వయస్సు వర్గం',
      ageRangeOptions: {
        infant: 'శిశువు / చిన్న పిల్లలు (0 - 2 సం.)',
        child: 'పిల్లలు (3 - 12 సం.)',
        teen: 'కౌమార దశ (13 - 17 సం.)',
        youngAdult: 'యువకులు (18 - 35 సం.)',
        middleAdult: 'మధ్య వయస్కులు (36 - 64 సం.)',
        senior: 'వృద్ధులు (65+ సం.)'
      },
      contextLabel: 'అనుబంధ పరిస్థితులు (ఐచ్ఛికం)',
      contextPlaceholder: 'ఉదా: రాత్రి ఆలస్యంగా నిద్రపోయాను, స్క్రీన్ సమయం ఎక్కువ, రక్తపోటు...',
      otherDetailsLabel: 'ఇతర వివరాలు (ఐచ్ఛికం)',
      otherDetailsPlaceholder: 'ఉదా: భోజనం తర్వాత ఎక్కువవుతుంది, విశ్రాంతి తీసుకుంటే తగ్గుతుంది...',
      submitBtn: 'లక్షణాలను విశ్లేషించు & సారాంశం చూపు',
      submittingBtn: 'పరిశీలిస్తోంది...',
      resetBtn: 'ఫారమ్ రీసెట్ చేయి'
    },
    results: {
      title: 'లక్షణాల విద్యా వివరణ',
      disclaimerNotice: 'ఇవి కేవలం సాధ్యమైన సాధారణ వివరణలు మాత్రమే — డాక్టర్ రోగనిర్ధారణ కాదు.',
      explanationsHeader: 'సాధ్యమైన సాధారణ వివరణలు',
      selfCareHeader: 'సురక్షిత స్వీయ-సంరక్షణ సమాచారం',
      warningSignsHeader: 'గమనించవలసిన హెచ్చరిక సంకేతాలు',
      whenToSeeDoctorHeader: 'డాక్టర్‌ను ఎప్పుడు సంప్రదించాలి',
      questionsHeader: 'డాక్టర్‌ను అడగవలసిన ముఖ్యమైన ప్రశ్నలు',
      emptyState: 'వివరాలను తెలుసుకోవడానికి ఎడమవైపు ఉన్న ఫారమ్‌ను పూరించండి.'
    },
    urgency: {
      emergency: 'అత్యవసరం: తక్షణమే ఆసుపత్రి ఎమర్జెన్సీకి వెళ్ళండి',
      urgent: 'త్వరలో డాక్టర్‌ను సంప్రదించండి (24-48 గంటల్లో)',
      routine: 'ఇంట్లోనే స్వీయ-సంరక్షణ మరియు పర్యవేక్షణ'
    },
    summaryCard: {
      title: 'డాక్టర్ సందర్శన సారాంశం',
      subtitle: 'మీ వైద్యునితో చర్చించడానికి ఈ సారాంశాన్ని ఉపయోగించండి లేదా కాపీ చేయండి.',
      patientInfo: 'నమోదైన వివరాలు',
      symptoms: 'ప్రధాన లక్షణాలు',
      duration: 'వ్యవధి',
      severity: 'తీవ్రత',
      ageRange: 'వయస్సు',
      context: 'పరిస్థితులు',
      questionsToAsk: 'డాక్టర్‌ను అడగవలసిన ప్రశ్నలు',
      copyBtn: 'క్లిప్‌బోర్డ్‌కు కాపీ చేయి',
      copiedBtn: 'కాపీ అయ్యింది!',
      emptyDesc: 'లక్షణాల ఫారమ్ సమర్పించిన తర్వాత మీ సారాంశం ఇక్కడ సిద్ధంగా ఉంటుంది.'
    },
    history: {
      title: 'గత సంభాషణలు',
      empty: 'ఇంకా సంభాషణలు లేవు.',
      sampleTag: 'నమూనా',
      activeTag: 'ప్రస్తుత'
    },
    privacyModal: {
      title: 'మీ గోప్యత & ఆరోగ్య సమ్మతి',
      desc1: 'మెడిమేట్ AI కి స్వాగతం. మేము సమాచారాన్ని ఎలా భద్రపరుస్తామో తెలుసుకోండి:',
      point1: 'సర్వర్ నిల్వ లేదు: మీ వ్యక్తిగత ఆరోగ్య డేటా ఏ సర్వర్‌లోనూ నిల్వ చేయబడదు.',
      point2: 'బ్రౌజర్ సెషన్ మాత్రమే: మీ సంభాషణ కేవలం మీ బ్రౌజర్ sessionStorage లో మాత్రమే తాత్కాలికంగా ఉంటుంది.',
      point3: 'విద్యా ప్రయోజనాలే: ఇది కేవలం అవగాహన కొరకు మాత్రమే. డాక్టర్ చికిత్సకు ప్రత్యామ్నాయం కాదు.',
      point4: 'అత్యవసర పరిస్థితులు: గుండె నొప్పి లేదా శ్వాస ఇబ్బంది ఉంటే వెంటనే 112 లేదా 108 కు కాల్ చేయండి.',
      acceptBtn: 'నేను అర్థం చేసుకున్నాను & అంగీకరిస్తున్నాను',
      closeBtn: 'మూసివేయి'
    }
  },

  hi: {
    app: {
      name: 'मेडीमेट एआई (MediMate AI)',
      tagline: 'आपके स्वास्थ्य प्रश्न, आसान शब्दों में।',
      theme: 'रोजमर्रा की जिंदगी को आसान बनाएं — जटिल को सरल बनाएं।',
      badgeDemo: 'डेमो मोड — AI कनेक्ट नहीं है। पूर्व-लिखित उत्तर।',
      badgeLive: 'जेमिनी AI कनेक्टेड',
      disclaimer: 'MediMate AI केवल सामान्य स्वास्थ्य शिक्षा प्रदान करता है। यह डॉक्टर नहीं है और किसी बीमारी का निदान या इलाज नहीं कर सकता।',
      clearData: 'मेरा डेटा हटाएं',
      clearDataConfirm: 'क्या आप वर्तमान सत्र का डेटा हटाना चाहते हैं? सभी संदेश आपके ब्राउज़र से हटा दिए जाएंगे।',
      privacyNotice: 'गोपनीयता और सहमति',
      dataClearedToast: 'सत्र का डेटा सुरक्षित रूप से हटा दिया गया है।',
      copiedToast: 'डॉक्टर सारांश क्लिपबोर्ड पर कॉपी हो गया!',
      copyFailedToast: 'कॉपी करने में विफल। कृपया स्वयं कॉपी करें।'
    },
    nav: {
      chatTab: 'स्वास्थ्य चैट',
      symptomTab: 'लक्षण जांच',
      summaryTab: 'डॉक्टर सारांश',
      historyTab: 'पिछली बातचीत',
      newCheckup: '+ नई बातचीत'
    },
    chat: {
      title: 'AI स्वास्थ्य चैट',
      subtitle: 'कोई भी सामान्य स्वास्थ्य प्रश्न सरल हिंदी में पूछें।',
      placeholder: 'अपना स्वास्थ्य प्रश्न लिखें (जैसे: कंप्यूटर पर काम करने के बाद सिरदर्द क्यों होता है?)...',
      send: 'भेजें',
      thinking: 'मेडीमेट विचार कर रहा है...',
      suggestedStartersTitle: 'सुझाए गए शुरुआती प्रश्न:',
      starters: [
        "आज सुबह से स्क्रीन पर काम करने के बाद मुझे सिरदर्द हो रहा है।",
        "सर्दी-जुकाम और मौसमी एलर्जी के बीच क्या अंतर है?",
        "घर पर गले की खराश को दूर करने के सुरक्षित उपाय क्या हैं?",
        "सुबह उठने पर घुटने और जोड़ों में अकड़न क्यों होती है?"
      ],
      sampleBadge: 'नमूना बातचीत',
      errorNetwork: 'सर्वर से संपर्क नहीं हो सका। कृपया इंटरनेट जांचें और पुनः प्रयास करें।',
      retry: 'पुनः प्रयास करें',
      emptyTitle: 'MediMate AI में आपका स्वागत है',
      emptyDesc: 'ऊपर दिए गए सुझावों में से चुनें या अपना कोई भी प्रश्न यहां टाइप करें।'
    },
    form: {
      title: 'लक्षण जानकारी फॉर्म',
      subtitle: 'अपने लक्षण दर्ज करें और सरल व्याख्या व डॉक्टर के लिए सारांश प्राप्त करें।',
      mainSymptomLabel: 'मुख्य लक्षण',
      mainSymptomPlaceholder: 'उदा: माथे पर हल्का सिरदर्द, गले में खराश',
      mainSymptomError: 'कृपया अपना मुख्य लक्षण दर्ज करें (कम से कम 3 अक्षर)।',
      durationLabel: 'यह कब से महसूस हो रहा है?',
      durationPlaceholder: 'उदा: आज सुबह से, 2 दिनों से, एक हफ्ते से',
      durationError: 'कृपया बताएं कि यह लक्षण कब से है।',
      severityLabel: 'गंभीरता का स्तर',
      severityScaleHelp: '1 = बहुत हल्का, 10 = असहनीय तेज दर्द',
      ageRangeLabel: 'आयु वर्ग',
      ageRangeOptions: {
        infant: 'शिशु / छोटा बच्चा (0 - 2 वर्ष)',
        child: 'बच्चा (3 - 12 वर्ष)',
        teen: 'किशोर (13 - 17 वर्ष)',
        youngAdult: 'युवा (18 - 35 वर्ष)',
        middleAdult: 'प्रौढ़ (36 - 64 वर्ष)',
        senior: 'वरिष्ठ नागरिक (65+ वर्ष)'
      },
      contextLabel: 'प्रासंगिक संदर्भ (वैकल्पिक)',
      contextPlaceholder: 'उदा: देर रात तक काम किया, अधिक स्क्रीन समय, ब्लड प्रेशर...',
      otherDetailsLabel: 'अन्य विवरण (वैकल्पिक)',
      otherDetailsPlaceholder: 'उदा: भोजन के बाद बढ़ जाता है, आराम करने पर राहत मिलती है...',
      submitBtn: 'लक्षणों का विश्लेषण करें व सारांश बनाएं',
      submittingBtn: 'जांच जारी है...',
      resetBtn: 'फॉर्म रीसेट करें'
    },
    results: {
      title: 'शैक्षिक लक्षण व्याख्या',
      disclaimerNotice: 'यह सामान्य संभावित कारणों की जानकारी है — चिकित्सकीय निदान (डायग्नोसिस) नहीं।',
      explanationsHeader: 'संभावित, आम कारण',
      selfCareHeader: 'सुरक्षित स्व-देखभाल जानकारी',
      warningSignsHeader: 'सावधानी के संकेत (चेतावनी)',
      whenToSeeDoctorHeader: 'डॉक्टर को कब दिखाना चाहिए',
      questionsHeader: 'डॉक्टर से पूछने योग्य प्रश्न',
      emptyState: 'जानकारी देखने के लिए बाईं ओर दिया गया फॉर्म भरें।'
    },
    urgency: {
      emergency: 'आपातकाल: तत्काल अस्पताल के आपातकालीन वार्ड में जाएं',
      urgent: 'जल्द डॉक्टर से मिलें (24–48 घंटों के भीतर)',
      routine: 'घर पर स्व-देखभाल एवं निगरानी'
    },
    summaryCard: {
      title: 'डॉक्टर परामर्श सारांश',
      subtitle: 'अपने डॉक्टर से मिलने जाते समय इस संरचित नोट का उपयोग करें।',
      patientInfo: 'दर्ज विवरण',
      symptoms: 'मुख्य लक्षण',
      duration: 'अवधि',
      severity: 'गंभीरता',
      ageRange: 'आयु',
      context: 'संदर्भ',
      questionsToAsk: 'डॉक्टर से पूछने योग्य प्रश्न',
      copyBtn: 'क्लिपबोर्ड पर कॉपी करें',
      copiedBtn: 'कॉपी हो गया!',
      emptyDesc: 'सवालों के जवाब या फॉर्म भरने के बाद आपका व्यवस्थित सारांश यहां तैयार होगा।'
    },
    history: {
      title: 'हालिया बातचीत',
      empty: 'अभी कोई बातचीत सहेजी नहीं गई है।',
      sampleTag: 'नमूना',
      activeTag: 'सक्रिय'
    },
    privacyModal: {
      title: 'आपकी गोपनीयता एवं स्वास्थ्य सहमति',
      desc1: 'MediMate AI में आपका स्वागत है। उपयोग करने से पहले कृपया समझें:',
      point1: 'कोई सर्वर स्टोरेज नहीं: आपकी कोई भी व्यक्तिगत स्वास्थ्य जानकारी किसी सर्वर पर सहेजी नहीं जाती।',
      point2: 'केवल स्थानीय सत्र: आपकी बातचीत केवल आपके ब्राउज़र के sessionStorage में अस्थायी रूप से रहती है।',
      point3: 'केवल शैक्षिक जानकारी: यह डॉक्टर नहीं है और किसी बीमारी की जांच या दवा की सलाह नहीं देता।',
      point4: 'आपात स्थिति: सीने में तेज दर्द या सांस की तकलीफ में तुरंत 112 या 108 पर कॉल करें।',
      acceptBtn: 'मैं समझता/समझती हूँ और सहमत हूँ',
      closeBtn: 'बंद करें'
    }
  }
};

export default translations;
