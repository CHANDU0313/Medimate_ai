/**
 * MediMate AI - Demo Service
 * Provides pre-written, medically reviewed-style educational responses
 * when GEMINI_API_KEY is not configured or during API outages.
 *
 * Always clearly labeled with isDemo: true and demoNotice.
 */

const DEMO_NOTICE = 'Demo mode — AI not connected. Responses are pre-written samples, not real AI output.';

const DEMO_CHAT_RESPONSES = {
  en: {
    headache: {
      reply: `Headaches can happen for several common, everyday reasons. Often, tension headaches or mild dehydration are the most frequent culprits, especially if you have been looking at screens for a long time or have missed a meal.

A headache that starts gradually and feels like a dull band across the forehead is commonly linked to fatigue, stress, or eye strain. 

For comfort, resting in a quiet, dimly lit room, sipping water slowly, and placing a cool or warm cloth across your forehead can be soothing. If you need pain medicine, a local pharmacist or healthcare provider can advise you on safe options.`,
      urgency: 'routine',
      suggestedFollowUps: [
        'How much water should I drink during the day?',
        'When does a headache need medical attention?',
        'Can eye strain cause neck pain too?'
      ]
    },
    general: {
      reply: `Thank you for sharing your question with MediMate AI. As a friendly reminder, I provide general health education to help you understand your body and have better conversations with your doctor.

Many mild daily health discomforts are our body's way of telling us to rest, hydrate, or adjust our routine. Keeping track of when symptoms start and what makes them feel better or worse is very helpful when you visit your doctor.`,
      urgency: 'routine',
      suggestedFollowUps: [
        'What should I bring to my doctor appointment?',
        'How can I track my daily symptoms?',
        'What are simple ways to improve my sleep?'
      ]
    }
  },
  te: {
    headache: {
      reply: `తలనొప్పి రావడానికి రోజువారీ జీవితంలో అనేక సాధారణ కారణాలు ఉండవచ్చు. తగినంత నీరు తాగకపోవడం (డీహైడ్రేషన్), కంప్యూటర్ లేదా ఫోన్ స్క్రీన్లను ఎక్కువసేపు చూడటం, మానసిక ఒత్తిడి లేదా నిద్ర సరిపోకపోవడం వల్ల సాధారణ తలనొప్పి వస్తుంది.

సాధారణంగా నుదిటి చుట్టూ బరువుగా అనిపించే తలనొప్పి విశ్రాంతి తీసుకుంటే తగ్గుతుంది.

ఉపశమనం కోసం: కాసేపు నిశ్శబ్దంగా, కాంతి తక్కువగా ఉన్న గదిలో విశ్రాంతి తీసుకోండి, నెమ్మదిగా మంచినీరు తాగండి. తలపై చల్లటి లేదా గోరువెచ్చని గుడ్డ వేసుకోవడం సాంత్వన చేకూరుస్తుంది. ఏదైనా మందులు వేసుకునే ముందు తప్పకుండా డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.`,
      urgency: 'routine',
      suggestedFollowUps: [
        'రోజుకు ఎన్ని గ్లాసుల నీరు తాగాలి?',
        'తలనొప్పి ఎప్పుడు తీవ్రమైనదిగా పరిగణించాలి?',
        'కంటి ఒత్తిడిని ఎలా తగ్గించుకోవాలి?'
      ]
    },
    general: {
      reply: `మీ ప్రశ్నను మెడిమేట్ AI తో పంచుకున్నందుకు ధన్యవాదాలు. ఇది సాధారణ ఆరోగ్య సమాచారం అందించే వేదిక మాత్రమే, డాక్టర్ చికిత్సకు ప్రత్యామ్నాయం కాదు.

శరీరంలో కనిపించే చిన్నపాటి లక్షణాలు సరిపడా విశ్రాంతి లేదా సమతుల్య ఆహారం అవసరమని సూచించవచ్చు. మీ లక్షణాలను ఎప్పటికప్పుడు గమనించి రాసుకోవడం వల్ల డాక్టర్ వద్దకు వెళ్ళినప్పుడు సమస్యను సులభంగా వివరించవచ్చు.`,
      urgency: 'routine',
      suggestedFollowUps: [
        'డాక్టర్ దగ్గరకు వెళ్ళేటప్పుడు ఏ సమాచారం సిద్ధం చేసుకోవాలి?',
        'ఆరోగ్యకరమైన ఆహారపు అలవాట్లు ఏమిటి?',
        'నిద్రలేమి సమస్యను ఎలా తగ్గించాలి?'
      ]
    }
  },
  hi: {
    headache: {
      reply: `सिरदर्द होने के कई आम और रोजमर्रा के कारण हो सकते हैं। दिनभर पानी कम पीना (डिहाइड्रेशन), ज्यादा समय तक मोबाइल या कंप्यूटर स्क्रीन देखना, थकान या नींद की कमी अक्सर तनाव वाले सिरदर्द का कारण बनती है।

अगर सिरदर्द धीरे-धीरे शुरू हुआ है और माथे पर हल्का दबाव महसूस हो रहा है, तो यह अक्सर थकान या तनाव से संबंधित होता है।

आराम के लिए: किसी शांत और मंद रोशनी वाले कमरे में थोड़ी देर आराम करें, धीरे-धीरे पानी पिएं, और माथे पर हल्का ठंडा या गुनगुना कपड़ा रखें। किसी भी दर्द निवारक दवा के लिए नजदीकी डॉक्टर या फार्मासिस्ट से परामर्श अवश्य लें।`,
      urgency: 'routine',
      suggestedFollowUps: [
        'दिनभर में कितना पानी पीना चाहिए?',
        'सिरदर्द में डॉक्टर को कब दिखाना जरूरी है?',
        'आंखों के तनाव को कैसे कम करें?'
      ]
    },
    general: {
      reply: `मेडीमेट एआई से स्वास्थ्य प्रश्न पूछने के लिए धन्यवाद। कृपया ध्यान दें कि यह केवल सामान्य स्वास्थ्य शिक्षा और जानकारी के लिए है, किसी डॉक्टर की जांच या इलाज का विकल्प नहीं।

शरीर में छोटे-मोटे लक्षण अक्सर यह संकेत देते हैं कि हमें आराम, सही पोषण या पानी की आवश्यकता है। अपने लक्षणों को नोट करके रखना डॉक्टर से मिलने पर बहुत मददगार साबित होता है।`,
      urgency: 'routine',
      suggestedFollowUps: [
        'डॉक्टर से मिलने से पहले क्या तैयारी करनी चाहिए?',
        'रोजाना के लक्षणों को कैसे ट्रैक करें?',
        'अच्छी नींद के लिए क्या उपाय करें?'
      ]
    }
  }
};

export function getDemoChatReply(messages, language = 'en') {
  const lang = ['en', 'te', 'hi'].includes(language) ? language : 'en';
  const lastUserMsg = Array.isArray(messages) && messages.length > 0 
    ? (messages[messages.length - 1].content || '').toLowerCase()
    : '';

  const isHeadache = lastUserMsg.includes('headache') || lastUserMsg.includes('head') || lastUserMsg.includes('తలనొప్పి') || lastUserMsg.includes('सिरदर्द');
  const template = isHeadache 
    ? (DEMO_CHAT_RESPONSES[lang]?.headache || DEMO_CHAT_RESPONSES.en.headache)
    : (DEMO_CHAT_RESPONSES[lang]?.general || DEMO_CHAT_RESPONSES.en.general);

  return {
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    reply: template.reply,
    urgency: template.urgency,
    suggestedFollowUps: template.suggestedFollowUps
  };
}

export function getDemoSymptomAnalysis(formData, language = 'en') {
  const lang = ['en', 'te', 'hi'].includes(language) ? language : 'en';
  const mainSym = (formData.mainSymptom || '').toLowerCase();
  const severity = parseInt(formData.severity, 10) || 5;

  let urgency = 'routine';
  let urgencyLabel = 'Self-Care & Monitor';

  if (severity >= 8) {
    urgency = 'urgent';
    urgencyLabel = 'See a Doctor Soon';
  }

  // Multilingual template responses
  if (lang === 'te') {
    return {
      isDemo: true,
      demoNotice: DEMO_NOTICE,
      urgency: urgency,
      urgencyLabel: urgency === 'urgent' ? 'త్వరలో డాక్టర్‌ను సంప్రదించండి' : 'స్వీయ సంరక్షణ & పర్యవేక్షణ',
      possibleExplanations: [
        {
          title: 'సాధారణ ఒత్తిడి లేదా అలసట (Tension / Fatigue)',
          description: 'రోజూవారీ పని ఒత్తిడి, నిద్రలేమి లేదా కంప్యూటర్ స్క్రీన్లను ఎక్కువగా చూడటం వల్ల ఇలాంటి అసౌకర్యం కలగవచ్చు. ఇది వ్యాధి నిర్ధారణ కాదు.'
        },
        {
          title: 'శరీరంలో నీటి శాతం తగ్గడం (Mild Dehydration)',
          description: 'సరిపడా ద్రవాహారం లేదా నీరు తీసుకోకపోవడం వల్ల కండరాలు మరియు తలలో నీరసం రావచ్చు.'
        },
        {
          title: 'కంటి లేదా భంగిమ ఒత్తిడి (Postural Strain)',
          description: 'ఎక్కువసేపు ఒకే భంగిమలో కూర్చోవడం లేదా మెడ కండరాలపై ఒత్తిడి పడటం వల్ల కలగవచ్చు.'
        }
      ],
      selfCareInfo: [
        'ప్రశాంతమైన మరియు చల్లని ప్రదేశంలో కనీసం 20-30 నిమిషాలు విశ్రాంతి తీసుకోండి.',
        'రోజు మొత్తం కొద్దికొద్దిగా మంచి నీరు లేదా కొబ్బరి నీళ్ళు తాగండి.',
        'స్మార్ట్‌ఫోన్లు మరియు టీవీ స్క్రీన్ల నుంచి కళ్ళకు తగిన విరామం ఇవ్వండి.'
      ],
      warningSigns: [
        'సమస్య అకస్మాత్తుగా లేదా భరించలేనంత తీవ్రంగా మారడం.',
        'లక్షణాలతో పాటు అధిక జ్వరం లేదా మెడ పట్టేయడం.',
        'దృష్టి మసకబారడం లేదా తలతిరగడం.'
      ],
      whenToSeeDoctor: [
        'లక్షణాలు 48 గంటలు దాటినా తగ్గకపోతే లేదా రోజువారీ పనులకు ఆటంకం కలిగిస్తే.',
        'సాధారణ విశ్రాంతి తీసుకున్నప్పటికీ నొప్పి క్రమంగా పెరుగుతుంటే.',
        'మీరు ఇంతకుముందు ఎన్నడూ అనుభవించని సరికొత్త లక్షణాలు కనిపిస్తే.'
      ],
      questionsForClinician: [
        'ఈ లక్షణాలు రావడానికి ప్రధాన జీవనశైలి కారణం ఏమిటి?',
        'లక్షణాల తీవ్రతను గమనించడానికి నేను ఏ ప్రత్యేక పరీక్షలు చేయించుకోవాలి?',
        'భవిష్యత్తులో ఈ సమస్య పునరావృతం కాకుండా ఉండటానికి ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?'
      ],
      doctorSummaryText: `పేషెంట్ నివేదిక: ${formData.mainSymptom || 'లక్షణాలు'}, వ్యవధి: ${formData.duration || 'తెలియదు'}, తీవ్రత: ${formData.severity || '5'}/10. అనుబంధ సమాచారం: ${formData.context || 'ఏమీ పేర్కొనలేదు'}. ప్రాథమిక విద్య మరియు స్వీయ-పర్యవేక్షణ కొరకు అందించబడింది.`
    };
  }

  if (lang === 'hi') {
    return {
      isDemo: true,
      demoNotice: DEMO_NOTICE,
      urgency: urgency,
      urgencyLabel: urgency === 'urgent' ? 'जल्द डॉक्टर से परामर्श लें' : 'स्व-देखभाल एवं निगरानी',
      possibleExplanations: [
        {
          title: 'तनाव या शारीरिक थकान (Tension / Fatigue)',
          description: 'दैनिक कामकाज का तनाव, अपर्याप्त नींद या स्क्रीन का अत्यधिक उपयोग आम तौर पर इस प्रकार के हल्के लक्षणों का कारण बनता है। यह कोई अंतिम निदान नहीं है।'
        },
        {
          title: 'हल्का डिहाइड्रेशन (Mild Dehydration)',
          description: 'दिनभर में कम पानी पीने से शरीर में पानी की कमी हो सकती है जिससे सिर या शरीर में भारीपन आ सकता है।'
        },
        {
          title: 'मुद्रा या गर्दन में खिंचाव (Postural Strain)',
          description: 'लंबे समय तक गलत मुद्रा में बैठने से मांसपेशियों में हल्का तनाव हो सकता है।'
        }
      ],
      selfCareInfo: [
        'शांत और मंद रोशनी वाले कमरे में 20-30 मिनट विश्राम करें।',
        'दिनभर पर्याप्त मात्रा में गुनगुना या सामान्य पानी पिएं।',
        'स्क्रीन टाइम कम करें और आंखों को 20-20-20 नियम से आराम दें।'
      ],
      warningSigns: [
        'लक्षणों का अचानक बहुत तेज या असहनीय हो जाना।',
        'साथ में तेज बुखार या उल्टी होना।',
        'चक्कर आना या दृष्टि धुंधली होना।'
      ],
      whenToSeeDoctor: [
        'यदि लक्षण 2-3 दिनों में ठीक न हों या स्थिति बिगड़ने लगे।',
        'यदि आराम करने के बाद भी परेशानी बढ़ती रहे।',
        'यदि आपको दैनिक कार्य करने में गंभीर कठिनाई हो रही हो।'
      ],
      questionsForClinician: [
        'क्या इन लक्षणों के पीछे कोई अन्य कारण या पोषण की कमी हो सकती है?',
        'मुझे किन लक्षणों पर विशेष ध्यान रखने की सलाह देंगे?',
        'दैनिक जीवन में क्या बदलाव करने से मुझे राहत मिल सकती है?'
      ],
      doctorSummaryText: `मरीज़ रिपोर्ट: ${formData.mainSymptom || 'लक्षण'}, अवधि: ${formData.duration || 'अज्ञात'}, गंभीरता: ${formData.severity || '5'}/10. संदर्भ: ${formData.context || 'कोई नहीं'}. यह डॉक्टर से परामर्श के लिए तैयारी सारांश है।`
    };
  }

  // English default
  return {
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    urgency: urgency,
    urgencyLabel: urgency === 'urgent' ? 'See a Doctor Soon' : 'Self-Care & Monitor',
    possibleExplanations: [
      {
        title: 'Tension, Stress, or Muscle Fatigue',
        description: 'Everyday emotional stress, prolonged computer or phone screen usage, or poor sleep can often trigger this type of mild discomfort. This is an educational observation, not a clinical diagnosis.'
      },
      {
        title: 'Mild Dehydration or Missed Meals',
        description: 'Not drinking enough fluids throughout the day or waiting too long between meals can cause fatigue and mild body aches.'
      },
      {
        title: 'Postural or Environmental Strain',
        description: 'Sitting in an unsupportive chair, bright lighting, or sudden weather/temperature changes can contribute.'
      }
    ],
    selfCareInfo: [
      'Rest in a quiet, dimly lit, cool room for 20 to 30 minutes.',
      'Sip room-temperature water or an electrolyte solution slowly throughout the day.',
      'Apply a gentle warm or cool compress to the affected area to promote muscle relaxation.',
      'Take regular 5-minute movement breaks if working at a desk or looking at screens.'
    ],
    warningSigns: [
      'Sudden onset of severe, excruciating pain that feels like a "thunderclap".',
      'High persistent fever accompanied by stiff neck or confusion.',
      'Difficulty speaking, facial numbness, or weakness in any limb.',
      'Shortness of breath or persistent chest discomfort.'
    ],
    whenToSeeDoctor: [
      'If your symptoms persist for more than 48 to 72 hours without gradual improvement.',
      'If the discomfort steadily worsens despite adequate rest and hydration.',
      'If your symptoms interfere with your ability to sleep, eat, or work.'
    ],
    questionsForClinician: [
      'Could my daily posture, screen habits, or hydration be contributing to this?',
      'Are there any diagnostic tests or labs you recommend checking?',
      'What specific warning signs should prompt me to follow up sooner?'
    ],
    doctorSummaryText: `Patient-reported symptoms: ${formData.mainSymptom || 'Unspecified'}, Duration: ${formData.duration || 'Not specified'}, Severity: ${formData.severity || '5'}/10, Age Range: ${formData.ageRange || 'Adult'}. Context: ${formData.context || 'None provided'}. Prepared for clinician evaluation.`
  };
}

export default {
  getDemoChatReply,
  getDemoSymptomAnalysis,
  DEMO_NOTICE
};
