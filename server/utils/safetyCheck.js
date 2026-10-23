/**
 * MediMate AI - Rule-based Emergency Safety Checker
 * Runs BEFORE any AI call, on both chat messages and symptom form inputs.
 * Covers English, Telugu, and Hindi keyword patterns.
 *
 * Emergency responses are hard-coded in all 3 languages, NEVER AI-generated.
 */

const EMERGENCY_NUMBERS = {
  general: process.env.EMERGENCY_NUMBER_DEFAULT || '112',
  ambulance: process.env.AMBULANCE_NUMBER_DEFAULT || '108',
  suicide: process.env.SUICIDE_HELPLINE_DEFAULT || '14416', // Tele-MANAS (India 24/7 free)
  suicideAlt: '1800-599-0019', // KIRAN Mental Health
  poison: '1800-116-117' // National Poison Information Centre
};

// Emergency categories with multilingual keyword dictionaries
const EMERGENCY_PATTERNS = {
  suicide: {
    category: 'suicide_crisis',
    keywords: [
      // English
      'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'cutting myself', 'self-harm', 'self harm', 'hang myself', 'take my own life',
      // Telugu
      'ఆత్మహత్య', 'చనిపోవాలని ఉంది', 'ప్రాణం తీసుకోవడం', 'నా ప్రాణం తీసుకుంటా', 'బ్రతకాలని లేదు',
      // Hindi
      'आत्महत्या', 'मरना चाहता हूं', 'मरना चाहती हूं', 'खुदकुशी', 'जान देना', 'खुद को मारना', 'खुद को नुकसान'
    ]
  },
  chest_pain: {
    category: 'cardiac_emergency',
    keywords: [
      // English
      'chest pain', 'chest pressure', 'crushing chest', 'heart attack', 'tightness in chest', 'pain radiating to left arm', 'chest tightness', 'crushing pain in chest',
      // Telugu
      'రొమ్ము నొప్పి', 'గుండె నొప్పి', 'ఛాతీలో నొప్పి', 'ఛాతీ బరువు', 'గుండెపోటు', 'గుండె ఆగిపోవడం',
      // Hindi
      'छाती में दर्द', 'सीने में दर्द', 'दिल का दौरा', 'हार्ट अटैक', 'सीने में भारीपन', 'सीने में जकड़न'
    ]
  },
  trouble_breathing: {
    category: 'respiratory_distress',
    keywords: [
      // English
      'trouble breathing', 'cannot breathe', "can't breathe", 'shortness of breath', 'struggling to breathe', 'gasping for air', 'suffocating', 'severe asthma attack', 'blue lips',
      // Telugu
      'శ్వాస ఆడకపోవడం', 'ఊపిరి ఆడట్లేదు', 'ఊపిరి తీసుకోవడం కష్టం', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'ఊపిరాడక',
      // Hindi
      'सांस लेने में तकलीफ', 'सांस नहीं आ रही', 'दम घुट रहा है', 'सांस फूलना', 'सांस रुकना', 'होठ नीले पड़ना'
    ]
  },
  stroke: {
    category: 'stroke_signs',
    keywords: [
      // English
      'stroke', 'face droop', 'face drooping', 'slurred speech', 'arm weakness', 'sudden numbness', 'loss of speech', 'cannot speak clearly', 'one side weak',
      // Telugu
      'పక్షవాతం', 'మూతి వంకర', 'మాట తడబడటం', 'చేయి పనిచేయకపోవడం', 'ఒకవైపు తిమ్మిరి',
      // Hindi
      'स्ट्रोक', 'लकवा', 'मुंह टेढ़ा होना', 'आवाज लड़खड़ाना', 'हाथ सुन्न होना', 'बोलने में असमर्थ', 'एक तरफ कमजोरी'
    ]
  },
  severe_bleeding: {
    category: 'severe_hemorrhage',
    keywords: [
      // English
      'severe bleeding', 'bleeding heavily', 'blood pouring', 'uncontrolled bleeding', 'spurting blood', 'coughing up lots of blood', 'vomiting blood',
      // Telugu
      'తీవ్ర రక్తస్రావం', 'రక్తం ఆగడం లేదు', 'రక్తం కక్కుకోవడం', 'భారీగా రక్తం',
      // Hindi
      'भारी रक्तस्राव', 'बहुत खून बह रहा है', 'खून की उल्टी', 'खून रुक नहीं रहा', 'गंभीर खून बहना'
    ]
  },
  unconsciousness_seizure: {
    category: 'unconscious_or_seizure',
    keywords: [
      // English
      'unconscious', 'passed out', 'fainted and not waking', 'loss of consciousness', 'seizure', 'having a seizure', 'convulsions', 'epileptic fit',
      // Telugu
      'స్పృహ కోల్పోవడం', 'మూర్ఛ', 'ఫిట్స్', 'సృహ తప్పడం', 'కళ్ళు తిరిగి పడిపోవడం',
      // Hindi
      'बेहोश हो गया', 'बेहोशी', 'दौरा पड़ा', 'मिर्गी का दौरा', 'होश खो देना', 'झटके आना'
    ]
  },
  anaphylaxis: {
    category: 'severe_allergic_reaction',
    keywords: [
      // English
      'throat swelling', 'tongue swelling', 'swollen airway', 'anaphylaxis', 'severe allergic reaction', 'throat closing',
      // Telugu
      'గొంతు వాపు', 'నాలుక వాపు', 'తీవ్రమైన అలర్జీ', 'శ్వాసనాళం మూసుకుపోవడం',
      // Hindi
      'गले में सूजन', 'जीभ में सूजन', 'गला बंद होना', 'गंभीर एलर्जी', 'एनाफिलेक्सिस'
    ]
  },
  poisoning_overdose: {
    category: 'poisoning_or_overdose',
    keywords: [
      // English
      'poisoning', 'drank poison', 'swallowed pills', 'overdose', 'swallowed bleach', 'chemical ingestion', 'snake bite', 'scorpion sting',
      // Telugu
      'విషం తాగడం', 'పురుగుల మందు', 'ఓవర్‌డోస్', 'పాము కాటు', 'తేలు కుట్టడం', 'విషపూరితమైనది',
      // Hindi
      'जहर खा लिया', 'जहर पी लिया', 'ओवरडोज', 'कीटनाशक पी लिया', 'सांप का काटना', 'बिच्छू का काटना'
    ]
  },
  thunderclap_headache: {
    category: 'thunderclap_headache',
    keywords: [
      // English
      'worst headache of my life', 'sudden severe headache', 'thunderclap headache', 'head exploded', 'instant excruciating headache',
      // Telugu
      'జీవితంలో చూడని తీవ్రమైన తలనొప్పి', 'అకస్మాత్తుగా తీవ్రమైన తలనొప్పి',
      // Hindi
      'जिंदगी का सबसे भयानक सिरदर्द', 'अचानक तेज सिरदर्द', 'बिजली जैसा सिरदर्द'
    ]
  },
  infant_emergency: {
    category: 'infant_danger_signs',
    keywords: [
      // English
      'baby not waking', 'infant high fever', 'newborn fever', 'sunken fontanelle', 'baby blue', 'no wet diapers baby dehydrated', 'baby stopped breathing',
      // Telugu
      'శిశువుకు తీవ్ర జ్వరం', 'పసిపిల్లల జ్వరం', 'శిశువు స్పందించకపోవడం',
      // Hindi
      'नवजात शिशु में तेज बुखार', 'बच्चा सांस नहीं ले रहा', 'बच्चा बेहोश है', 'शिशु में निर्जलीकरण'
    ]
  }
};

/**
 * Hard-coded emergency messages in English, Telugu, and Hindi
 * Never AI-generated!
 */
const EMERGENCY_RESPONSES = {
  suicide_crisis: {
    en: {
      urgency: 'emergency',
      title: '🚨 IMMEDIATE CRISIS SUPPORT NEEDED',
      message: 'You are not alone. Please reach out for confidential, free help right now from trained counselors who care and want to support you.',
      actionSteps: [
        `Call the Free 24/7 Mental Health Helpline: ${EMERGENCY_NUMBERS.suicide} (Tele-MANAS) or ${EMERGENCY_NUMBERS.suicideAlt} (KIRAN)`,
        'If in the US or Canada: Call or text 988',
        'If you are in immediate danger of hurting yourself, call 112 / 911 or go to the nearest hospital emergency room.',
        'Stay with a family member, trusted friend, or neighbor right now. Do not stay alone.'
      ],
      disclaimer: 'MediMate AI is an informational tool and cannot provide emergency or psychiatric intervention.'
    },
    te: {
      urgency: 'emergency',
      title: '🚨 తక్షణ సహాయం అవసరం (సహాయ హెల్ప్‌లైన్)',
      message: 'మీరు ఒంటరిగా లేరు. దయచేసి ఇప్పుడే ఉచిత మరియు గోప్యమైన సహాయం కోసం కౌన్సిలర్లను సంప్రదించండి. మీ ప్రాణం చాలా విలువైంది.',
      actionSteps: [
        `ఉచిత 24/7 టెలి-మానస్ మానసిక ఆరోగ్య హెల్ప్‌లైన్‌కు కాల్ చేయండి: ${EMERGENCY_NUMBERS.suicide} లేదా ${EMERGENCY_NUMBERS.suicideAlt}`,
        'మీ ప్రాణానికి ప్రమాదం ఉన్నట్లయితే తక్షణమే 112 లేదా 108 కు కాల్ చేయండి.',
        'వెంటనే సమీపంలోని ఆసుపత్రి అత్యవసర విభాగానికి (Emergency Room) వెళ్ళండి.',
        'దయచేసి ఒంటరిగా ఉండకండి, కుటుంబ సభ్యులు లేదా మిత్రులకు వెంటనే తెలియజేయండి.'
      ],
      disclaimer: 'మెడిమేట్ AI సాధారణ సమాచార సాధనం మాత్రమే. ఇది అత్యవసర లేదా మానసిక వైద్య సేవలను అందించలేదు.'
    },
    hi: {
      urgency: 'emergency',
      title: '🚨 तत्काल मानसिक स्वास्थ्य सहायता',
      message: 'आप अकेले नहीं हैं। कृपया अभी मुफ्त और गोपनीय सहायता के लिए प्रशिक्षित काउंसलरों से संपर्क करें। आपका जीवन बेहद कीमती है।',
      actionSteps: [
        `मुफ्त 24/7 मानसिक स्वास्थ्य हेल्पलाइन पर कॉल करें: ${EMERGENCY_NUMBERS.suicide} (Tele-MANAS) या ${EMERGENCY_NUMBERS.suicideAlt} (KIRAN)`,
        'यदि आप तुरंत खतरे में हैं, तो तत्काल 112 या 108 पर कॉल करें या नजदीकी अस्पताल के इमरजेंसी वार्ड में जाएं।',
        'कृपया अकेले न रहें, तुरंत अपने किसी परिवार के सदस्य या विश्वसनीय मित्र के साथ रहें।'
      ],
      disclaimer: 'MediMate AI केवल सामान्य स्वास्थ्य जानकारी देता है और यह आपातकालीन सेवा का विकल्प नहीं है।'
    }
  },
  medical_emergency: {
    en: {
      urgency: 'emergency',
      title: '🚨 CRITICAL MEDICAL EMERGENCY — SEEK IMMEDIATE CARE',
      message: 'The symptoms described may indicate a life-threatening medical emergency. Do not wait and do not try to treat this at home.',
      actionSteps: [
        `Call emergency services immediately: Ambulance ${EMERGENCY_NUMBERS.ambulance} or National Emergency ${EMERGENCY_NUMBERS.general}`,
        'Go to the nearest Hospital Emergency Room (A&E / Casualty) right away.',
        'DO NOT DRIVE YOURSELF — have someone drive you or wait for the ambulance.',
        'Sit or lie down in a safe, comfortable position while emergency help is on the way.',
        'If chest pain is suspected, loosen tight clothing around your neck and chest.'
      ],
      disclaimer: 'MediMate AI is an informational educational tool, NOT a doctor, and cannot diagnose or treat emergencies.'
    },
    te: {
      urgency: 'emergency',
      title: '🚨 తక్షణ అత్యవసర వైద్య పరిస్థితి — వెంటనే ఆసుపత్రికి వెళ్ళండి',
      message: 'మీరు పేర్కొన్న లక్షణాలు ప్రాణాంతక వైద్య అత్యవసర పరిస్థితిని సూచించవచ్చు. ఇంట్లో వేచి ఉండకండి లేదా సొంత చికిత్స చేయకండి.',
      actionSteps: [
        `వెంటనే అత్యవసర సేవలకు కాల్ చేయండి: అంబులెన్స్ ${EMERGENCY_NUMBERS.ambulance} లేదా అత్యవసర నంబర్ ${EMERGENCY_NUMBERS.general}`,
        'తక్షణమే సమీపంలోని ఆసుపత్రి ఎమర్జెన్సీ (కాజువాలిటీ) విభాగానికి వెళ్ళండి.',
        'మీరు స్వయంగా వాహనం నడపవద్దు — ఎవరినైనా సహాయం తీసుకోండి లేదా అంబులెన్స్ వచ్చే వరకు వేచి ఉండండి.',
        'శ్వాస సరిగ్గా ఆడేలా బిగుతైన బట్టలను వదులు చేయండి మరియు ప్రశాంతంగా కూర్చోండి.'
      ],
      disclaimer: 'మెడిమేట్ AI కేవలం సాధారణ ఆరోగ్య అవగాహన కొరకు మాత్రమే. ఇది డాక్టర్ కాదు మరియు చికిత్స అందించలేదు.'
    },
    hi: {
      urgency: 'emergency',
      title: '🚨 गंभीर आपातकालीन चिकित्सा स्थिति — तुरंत अस्पताल जाएं',
      message: 'ये लक्षण जानलेवा आपातकालीन स्थिति का संकेत हो सकते हैं। घर पर इंतजार न करें और स्वयं इलाज करने की कोशिश न करें।',
      actionSteps: [
        `तुरंत आपातकालीन नंबर पर कॉल करें: एम्बुलेंस ${EMERGENCY_NUMBERS.ambulance} या आपातकालीन सेवा ${EMERGENCY_NUMBERS.general}`,
        'नजदीकी अस्पताल के आपातकालीन विभाग (Emergency / Casualty) में तुरंत जाएं।',
        'स्वयं गाड़ी न चलाएं — किसी अन्य व्यक्ति से कहें या एम्बुलेंस का इंतजार करें।',
        'तंग कपड़े ढीले करें और शांत होकर बैठें या लेटें।'
      ],
      disclaimer: 'MediMate AI केवल सामान्य स्वास्थ्य जानकारी देता है। यह डॉक्टर नहीं है और आपातकालीन चिकित्सा का विकल्प नहीं है।'
    }
  }
};

/**
 * Normalizes input text for keyword matching:
 * Lowercases, strips extra whitespace, handles punctuation.
 */
function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[\r\n\t]+/g, ' ').trim();
}

/**
 * Runs the safety check against string or structured input.
 * @param {string | object} input - Text message or symptom form data
 * @param {string} [language='en'] - 'en', 'te', or 'hi'
 * @returns {object} { isEmergency: boolean, reason: string|null, category: string|null, emergencyPayload: object|null }
 */
export function checkSafety(input, language = 'en') {
  const lang = ['en', 'te', 'hi'].includes(language) ? language : 'en';

  // Build combined searchable text from input
  let combinedText = '';
  if (typeof input === 'string') {
    combinedText = input;
  } else if (typeof input === 'object' && input !== null) {
    const fields = [
      input.symptoms,
      input.mainSymptom,
      input.duration,
      input.context,
      input.otherDetails,
      input.details,
      input.message,
      ...(Array.isArray(input.messages) ? input.messages.map(m => m.content || m.text || '') : [])
    ];
    combinedText = fields.filter(Boolean).join(' ');
  }

  const normalized = normalizeText(combinedText);
  if (!normalized) {
    return { isEmergency: false, reason: null, category: null, emergencyPayload: null };
  }

  // Check each emergency category
  for (const [key, config] of Object.entries(EMERGENCY_PATTERNS)) {
    for (const pattern of config.keywords) {
      const normalizedPattern = pattern.toLowerCase().trim();
      // Test either exact substring or word boundary
      if (normalized.includes(normalizedPattern)) {
        const isSuicide = config.category === 'suicide_crisis';
        const templateGroup = isSuicide ? EMERGENCY_RESPONSES.suicide_crisis : EMERGENCY_RESPONSES.medical_emergency;
        const localizedPayload = templateGroup[lang] || templateGroup.en;

        return {
          isEmergency: true,
          triggeredKeyword: pattern,
          category: config.category,
          emergencyPayload: {
            ...localizedPayload,
            category: config.category,
            triggeredPattern: pattern,
            phoneNumbers: EMERGENCY_NUMBERS
          }
        };
      }
    }
  }

  return { isEmergency: false, reason: null, category: null, emergencyPayload: null };
}

export default {
  checkSafety,
  EMERGENCY_NUMBERS,
  EMERGENCY_RESPONSES
};
