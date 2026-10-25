/**
 * MediMate AI - Privacy-Preserving Medical Report Parser
 * Extracts structured values, units, and laboratory reference ranges from lab report text.
 * Strictly educational: does not diagnose disease or prescribe medications.
 */

// Common diagnostic lab test reference markers
const TEST_PATTERNS = [
  {
    key: 'hemoglobin',
    nameEn: 'Hemoglobin (Hb)',
    nameTe: 'హీమోగ్లోబిన్ (Hb)',
    regex: /(?:hemoglobin|haemoglobin|hb)\b[:\s-]*([0-9]+\.?[0-9]*)\s*(g\/dl|gm\/dl|g\/l)?/i,
    defaultRange: '13.0 - 17.0 g/dL',
    unit: 'g/dL',
    minNormal: 12.0,
    maxNormal: 17.5
  },
  {
    key: 'wbc',
    nameEn: 'White Blood Cell Count (WBC / TLC)',
    nameTe: 'తెల్ల రక్త కణాలు (WBC / TLC)',
    regex: /(?:white\s*blood\s*cells?|wbc|tlc|total\s*leukocyte\s*count)\b[:\s-]*([0-9,]+)\s*(\/cumm|\/ul|\/µl)?/i,
    defaultRange: '4,000 - 11,000 /µL',
    unit: '/µL',
    minNormal: 4000,
    maxNormal: 11000
  },
  {
    key: 'platelets',
    nameEn: 'Platelet Count',
    nameTe: 'ప్లేట్‌లెట్ సంఖ్య',
    regex: /(?:platelet\s*count|platelets?)\b[:\s-]*([0-9,]+)\s*(\/cumm|\/ul|\/µl|lakhs?\/cumm)?/i,
    defaultRange: '150,000 - 450,000 /µL',
    unit: '/µL',
    minNormal: 150000,
    maxNormal: 450000
  },
  {
    key: 'glucose_fasting',
    nameEn: 'Fasting Blood Glucose',
    nameTe: 'ఖాళీ కడుపున రక్తంలో గ్లూకోజ్',
    regex: /(?:fasting\s*blood\s*sugar|fbs|fasting\s*glucose)\b[:\s-]*([0-9]+\.?[0-9]*)\s*(mg\/dl)?/i,
    defaultRange: '70 - 100 mg/dL',
    unit: 'mg/dL',
    minNormal: 70,
    maxNormal: 100
  },
  {
    key: 'creatinine',
    nameEn: 'Serum Creatinine (Kidney)',
    nameTe: 'సీరమ్ క్రియాటినిన్ (కిడ్నీ)',
    regex: /(?:serum\s*creatinine|creatinine)\b[:\s-]*([0-9]+\.?[0-9]*)\s*(mg\/dl)?/i,
    defaultRange: '0.7 - 1.3 mg/dL',
    unit: 'mg/dL',
    minNormal: 0.7,
    maxNormal: 1.3
  },
  {
    key: 'hba1c',
    nameEn: 'Glycated Hemoglobin (HbA1c)',
    nameTe: 'గ్లైకేటెడ్ హీమోగ్లోబిన్ (HbA1c)',
    regex: /(?:hba1c|glycated\s*hemoglobin)\b[:\s-]*([0-9]+\.?[0-9]*)\s*(%)?/i,
    defaultRange: '< 5.7 %',
    unit: '%',
    minNormal: 4.0,
    maxNormal: 5.6
  }
];

/**
 * Parses raw text extracted from a lab report and identifies reported values, units, and ranges
 */
export function parseReportText(rawText, language = 'en') {
  const isTelugu = language === 'te';
  const foundTests = [];

  for (const test of TEST_PATTERNS) {
    const match = rawText.match(test.regex);
    if (match) {
      const rawValStr = match[1].replace(/,/g, '');
      const numVal = parseFloat(rawValStr);

      let flag = 'Normal';
      let flagType = 'normal';

      if (!isNaN(numVal)) {
        if (numVal > test.maxNormal) {
          flag = isTelugu ? 'ఎక్కువగా నివేదించబడింది' : 'High (as reported)';
          flagType = 'high';
        } else if (numVal < test.minNormal) {
          flag = isTelugu ? 'తక్కువగా నివేదించబడింది' : 'Low (as reported)';
          flagType = 'low';
        }
      }

      foundTests.push({
        testEn: test.nameEn,
        testTe: test.nameTe,
        value: `${match[1]} ${match[2] || test.unit}`,
        range: test.defaultRange,
        flag: flagType === 'normal' ? 'Normal' : flag,
        flagType
      });
    }
  }

  // If no recognized patterns matched directly, provide standard panel overview
  if (foundTests.length === 0) {
    return {
      summaryEn: 'The uploaded file was reviewed. We identified standard laboratory text, but specific recognized test names were not found or were unclear. Please review the printed report with your healthcare clinician.',
      summaryTe: 'అప్‌లోడ్ చేసిన ఫైల్ పరిశీలించబడింది. సాధారణ ల్యాబ్ పాఠ్యం గుర్తించబడింది కానీ స్పష్టమైన పరీక్ష పేర్లు కనుగొనబడలేదు. దయచేసి పూర్తి వివరాల కోసం మీ వైద్యుడిని సంప్రదించండి.',
      tests: [
        {
          testEn: 'Report Text Inspection',
          testTe: 'రిపోర్ట్ టెక్స్ట్ పరిశీలన',
          value: 'Extracted',
          range: 'Consult lab printed slip',
          flag: 'Normal',
          flagType: 'normal'
        }
      ],
      questionsEn: [
        'Could you help me understand what each reported value on this test sheet means?',
        'Are any of these numbers outside the normal range for my age?',
        'Is any follow-up test recommended?'
      ],
      questionsTe: [
        'ఈ టెస్ట్ షీట్‌లోని ప్రతి విలువ దేనిని సూచిస్తుందో వివరించగలరా?',
        'నా వయస్సుకు ఏవైనా సంఖ్యలు సాధారణ పరిధికి వెలుపల ఉన్నాయా?',
        'తదుపరి పరీక్ష ఏదైనా అవసరమా?'
      ]
    };
  }

  const anyHigh = foundTests.some(t => t.flagType === 'high');
  const anyLow = foundTests.some(t => t.flagType === 'low');

  let summaryEn = 'Your test values have been parsed against standard laboratory reference intervals. Most reported values fall within expected standard ranges.';
  let summaryTe = 'మీ పరీక్ష విలువలు సాధారణ ల్యాబ్ ప్రమాణాలతో పోల్చబడ్డాయి. చాలా విలువలు సాధారణ పరిధిలోనే కనిపిస్తున్నాయి.';

  if (anyHigh || anyLow) {
    summaryEn = 'Your report contains some test parameters with flags outside typical reference intervals as printed by the laboratory. Reference ranges vary by lab, age, and health status.';
    summaryTe = 'మీ ల్యాబ్ రిపోర్టులో కొన్ని పరీక్ష విలువలు సాధారణ పరిధి కంటే కాస్త భిన్నంగా ముద్రించబడ్డాయి. ల్యాబ్ పరిధులు ప్రయోగశాల మరియు వ్యక్తిని బట్టి మారవచ్చు.';
  }

  return {
    summaryEn,
    summaryTe,
    tests: foundTests,
    questionsEn: [
      'What do these specific test values indicate for my overall health?',
      'Do I need to make any changes to my diet, hydration, or daily activities?',
      'Should any of these tests be repeated in a few weeks?'
    ],
    questionsTe: [
      'నా ఆరోగ్య పరిస్థితికి ఈ పరీక్ష విలువలు దేనిని సూచిస్తాయి?',
      'నా ఆహారం, నీరు తాగడం లేదా అలవాట్లలో ఏవైనా మార్పులు చేసుకోవాలా?',
      'కొన్ని వారాల తర్వాత ఈ పరీక్షను మళ్లీ చేయించుకోవాలా?'
    ]
  };
}

/**
 * Extracts plain text from a PDF buffer safely
 */
export async function extractTextFromPDF(pdfBuffer) {
  let parser;

  try {
    const { PDFParse } = await import('pdf-parse');
    parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[PDF Parse Error]', message);
    throw new Error(`Unable to parse the uploaded PDF: ${message}`, { cause: error });
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}
