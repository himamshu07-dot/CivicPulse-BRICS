export interface CitizenRequest {
  id: string;
  timestamp: string;
  relativeTime?: string;
  languageCode?: string;
  language?: string;
  languageName: string;
  originalText: string;
  translatedText: string;
  category: string;
  countryCode: string;
  countryName?: string;
  country?: string;
  urgency: string;
  urgencyScore?: number;
  duplicateCount?: number;
  region: string;
  channel?: string;
  coordinates?: [number, number];
}

export const MOCK_CITIZEN_REQUESTS: CitizenRequest[] = [
  {
    id: "req-001",
    timestamp: "17:34:12",
    relativeTime: "Just now",
    languageCode: "hi",
    languageName: "Hindi (हिन्दी)",
    originalText: "हमारे गांव के प्राथमिक स्वास्थ्य केंद्र में 3 दिनों से एंटीवेनम और डॉक्टर उपलब्ध नहीं हैं।",
    translatedText: "No antivenom or doctor available at our village primary health sub-center for 3 consecutive days.",
    category: "Healthcare",
    countryCode: "IN",
    countryName: "India",
    urgency: "critical",
    region: "Bihar, India",
  },
  {
    id: "req-002",
    timestamp: "17:33:45",
    relativeTime: "1m ago",
    languageCode: "pt",
    languageName: "Portuguese (Português)",
    originalText: "A adutora principal rompeu no bairro Alto Bonito, deixando mais de 4.000 famílias sem água potável.",
    translatedText: "Main feeder water pipe burst in Alto Bonito district, leaving over 4,000 families without clean drinking water.",
    category: "Water",
    countryCode: "BR",
    countryName: "Brazil",
    urgency: "critical",
    region: "Bahia, Brazil",
  },
  {
    id: "req-003",
    timestamp: "17:32:50",
    relativeTime: "2m ago",
    languageCode: "zu",
    languageName: "isiZulu",
    originalText: "Ugesi ucimile ehlane laseMthatha kusukela izolo ebusuku, imishini yokwelapha esibhedlela isebenza ngegenerator.",
    translatedText: "Power grid failure in Mthatha periphery since last night; rural hospital running solely on backup diesel generator.",
    category: "Power",
    countryCode: "ZA",
    countryName: "South Africa",
    urgency: "critical",
    region: "Eastern Cape, South Africa",
  },
  {
    id: "req-004",
    timestamp: "17:31:18",
    relativeTime: "4m ago",
    languageCode: "zh",
    languageName: "Mandarin (中文)",
    originalText: "通往高山小学的乡村硬化道路因降雨发生局部滑坡，校车无法通行，需要抢修排险。",
    translatedText: "Rural access road to mountain primary school partially blocked by rainfall landslide; school buses halted, urgent clearway needed.",
    category: "Infrastructure",
    countryCode: "CN",
    countryName: "China",
    urgency: "high",
    region: "Yunnan, China",
  },
  {
    id: "req-005",
    timestamp: "17:30:05",
    relativeTime: "5m ago",
    languageCode: "ru",
    languageName: "Russian (Русский)",
    originalText: "В поселке Заречный перемерз распределительный водовод отопления, температура в школе упала до +8°C.",
    translatedText: "District heating pipeline frozen in Zarechny settlement; school classroom temperatures dropped to +8°C.",
    category: "Power",
    countryCode: "RU",
    countryName: "Russia",
    urgency: "critical",
    region: "Sverdlovsk, Russia",
  },
  {
    id: "req-006",
    timestamp: "17:28:40",
    relativeTime: "7m ago",
    languageCode: "ar",
    languageName: "Arabic (العربية)",
    originalText: "انسداد في شبكة الصرف الصحي يغمر الشارع الرئيسي أمام المركز الصحي الريفي في أسيوط.",
    translatedText: "Sewage drainage block causing overflow in front of the rural health center in Asyut province.",
    category: "Sanitation",
    countryCode: "EG",
    countryName: "Egypt",
    urgency: "high",
    region: "Asyut, Egypt",
  },
  {
    id: "req-007",
    timestamp: "17:26:15",
    relativeTime: "9m ago",
    languageCode: "am",
    languageName: "Amharic (አማርኛ)",
    originalText: "የክትባት ማቀዝቀዣ የፀሐይ ኃይል ባትሪ ባለመሥራቱ የሕፃናት ክትባት አቅርቦት አደጋ ላይ ወድቋል።",
    translatedText: "Solar cold-chain battery for child immunizations failed at Woreda clinic; vaccine stock at immediate risk.",
    category: "Healthcare",
    countryCode: "ET",
    countryName: "Ethiopia",
    urgency: "critical",
    region: "Oromia, Ethiopia",
  },
  {
    id: "req-008",
    timestamp: "17:24:50",
    relativeTime: "11m ago",
    languageCode: "fa",
    languageName: "Persian (فارسی)",
    originalText: "افت شدید فشار آب شرب در بخش‌های روستایی شرق اصفهان و نیاز فوری به تانکرهای آبرسانی اضطراری.",
    translatedText: "Severe water pressure drop in rural eastern Isfahan villages; urgent need for mobile emergency water tankers.",
    category: "Water",
    countryCode: "IR",
    countryName: "Iran",
    urgency: "high",
    region: "Isfahan, Iran",
  },
  {
    id: "req-009",
    timestamp: "17:22:10",
    relativeTime: "13m ago",
    languageCode: "ta",
    languageName: "Tamil (தமிழ்)",
    originalText: "கிராமப்புற அரசு தொடக்கப் பள்ளியில் டிஜிட்டல் இணைப்பு தளம் கடந்த ஒரு வாரமாக செயல்படவில்லை.",
    translatedText: "Digital connectivity kiosk at rural primary school disconnected for past week, halting interactive lessons.",
    category: "Education",
    countryCode: "IN",
    countryName: "India",
    urgency: "normal",
    region: "Tamil Nadu, India",
  },
];
