export interface Lesson {
  id: string;
  prompt: string;
  phrase: string;
  wordBank: string[];
  correctAnswer: string[];
  type?: "lesson" | "audio" | "checkpoint" | "practice";
  completed?: boolean;
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
  status: "completed" | "in-progress" | "locked";
  progress: number;
  totalLessons: number;
  sectionId: number;
  languageId: string;
}

export interface Section {
  id: number;
  title: string;
  level: string;
  status: "completed" | "in-progress" | "locked";
  progress: number;
  totalUnit: number;
  phrase: string;
  locked: boolean;
  units: Unit[];
}

export interface LanguageInfo {
  name: string;
  flag: string;
  country: string;
  level: string;
  progress: number;
  lessons: number;
  learned: number;
  description: string;
}

export interface Language {
  name: string;
  info: LanguageInfo;
  sections: Section[];
}

export interface Languages {
  [key: string]: Language;
}

export const languages: Languages = {
  yoruba: {
    name: "Yoruba",
    info: {
      name: "Yoruba",
      flag: "ng",
      country: "Nigeria",
      level: "Beginner",
      progress: 15,
      lessons: 7,
      learned: 1,
      description: "Discover the rich language of the Yoruba people",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "in-progress",
        progress: 2,
        totalUnit: 6,
        phrase: "Mo fẹ́ kọ́ ẹ̀dá Yorùbá.",
        locked: false,
        units: [
          {
            id: "basic-greetings",
            title: "Basic Greetings",
            status: "completed",
            progress: 2,
            totalLessons: 3,
            sectionId: 1,
            languageId: "yoruba",
            lessons: [
              {
                id: "greeting-1",
                prompt: "Translate this sentence",
                phrase: "Bawo ni",
                wordBank: ["Bawo", "ni", "o", "se", "wa"],
                correctAnswer: ["Bawo", "ni"],
                type: "lesson",
                completed: true,
              },
              {
                id: "greeting-2",
                prompt: "Translate this sentence",
                phrase: "E kaaro",
                wordBank: ["E", "kaaro", "o", "se", "wa"],
                correctAnswer: ["E", "kaaro"],
                type: "lesson",
                completed: true,
              },
              {
                id: "greeting-3",
                prompt: "How do you say 'Good evening'?",
                phrase: "E kaale",
                wordBank: ["E", "kaale", "o", "se", "wa"],
                correctAnswer: ["E", "kaale"],
                type: "lesson",
                completed: false,
              },
            ],
          },
          {
            id: "polite-phrases",
            title: "Polite Phrases",
            status: "locked",
            progress: 0,
            totalLessons: 4,
            sectionId: 1,
            languageId: "yoruba",
            lessons: [
              {
                id: "polite-1",
                prompt: "How do you say 'Please'?",
                phrase: "Je ka",
                wordBank: ["Je", "ka", "o", "se", "wa"],
                correctAnswer: ["Je", "ka"],
                type: "lesson",
                completed: false,
              },
              {
                id: "polite-2",
                prompt: "How do you say 'Thank you'?",
                phrase: "E se",
                wordBank: ["E", "se", "o", "ka", "wa"],
                correctAnswer: ["E", "se"],
                type: "lesson",
                completed: false,
              },
              {
                id: "polite-3",
                prompt: "How do you say 'Excuse me'?",
                phrase: "E ma binu",
                wordBank: ["E", "ma", "binu", "se", "o"],
                correctAnswer: ["E", "ma", "binu"],
                type: "lesson",
                completed: false,
              },
              {
                id: "polite-4",
                prompt: "Practice conversation",
                phrase: "Mo dupe pupo",
                wordBank: ["Mo", "dupe", "pupo", "se", "o"],
                correctAnswer: ["Mo", "dupe", "pupo"],
                type: "practice",
                completed: false,
              },
            ],
          },
          {
            id: "checkpoint-1",
            title: "Checkpoint",
            status: "locked",
            progress: 0,
            totalLessons: 3,
            sectionId: 1,
            languageId: "yoruba",
            lessons: [
              {
                id: "checkpoint-test-1",
                prompt: "Review: Basic greetings",
                phrase: "Bawo ni o se wa",
                wordBank: ["Bawo", "ni", "o", "se", "wa"],
                correctAnswer: ["Bawo", "ni", "o", "se", "wa"],
                type: "checkpoint",
                completed: false,
              },
              {
                id: "checkpoint-test-2",
                prompt: "Review: Polite phrases",
                phrase: "E se pupo",
                wordBank: ["E", "se", "pupo", "o", "wa"],
                correctAnswer: ["E", "se", "pupo"],
                type: "checkpoint",
                completed: false,
              },
              {
                id: "checkpoint-test-3",
                prompt: "Listen and repeat",
                phrase: "E kaaro o",
                wordBank: ["E", "kaaro", "o", "se", "wa"],
                correctAnswer: ["E", "kaaro", "o"],
                type: "audio",
                completed: false,
              },
            ],
          },
          {
            id: "at-the-market",
            title: "At the Market",
            status: "locked",
            progress: 0,
            totalLessons: 5,
            sectionId: 1,
            languageId: "yoruba",
            lessons: [
              {
                id: "market-1",
                prompt: "How do you ask for the price?",
                phrase: "Elo ni",
                wordBank: ["Elo", "ni", "o", "se", "wa"],
                correctAnswer: ["Elo", "ni"],
                type: "lesson",
                completed: false,
              },
              {
                id: "market-2",
                prompt: "How do you say 'I want to buy'?",
                phrase: "Mo fe ra",
                wordBank: ["Mo", "fe", "ra", "o", "se"],
                correctAnswer: ["Mo", "fe", "ra"],
                type: "lesson",
                completed: false,
              },
              {
                id: "market-3",
                prompt: "How do you say 'Too expensive'?",
                phrase: "O gbowo ju",
                wordBank: ["O", "gbowo", "ju", "se", "wa"],
                correctAnswer: ["O", "gbowo", "ju"],
                type: "lesson",
                completed: false,
              },
              {
                id: "market-4",
                prompt: "Practice: Bargaining",
                phrase: "Din owo re ku",
                wordBank: ["Din", "owo", "re", "ku", "o"],
                correctAnswer: ["Din", "owo", "re", "ku"],
                type: "practice",
                completed: false,
              },
              {
                id: "market-5",
                prompt: "Audio: Market conversation",
                phrase: "Elo ni epo yi",
                wordBank: ["Elo", "ni", "epo", "yi", "o"],
                correctAnswer: ["Elo", "ni", "epo", "yi"],
                type: "audio",
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Elementary",
        level: "A2",
        status: "locked",
        progress: 0,
        totalUnit: 8,
        phrase: "Mo mọ̀ díẹ̀ nínú àwọn ọ̀rọ̀.",
        locked: true,
        units: [],
      },
      {
        id: 3,
        title: "Intermediate",
        level: "B1",
        status: "locked",
        progress: 0,
        totalUnit: 10,
        phrase: "Mo mọ̀ díẹ̀ nínú àwọn ọ̀rọ̀.",
        locked: true,
        units: [],
      },
    ],
  },
  swahili: {
    name: "Swahili",
    info: {
      name: "Swahili",
      flag: "tz",
      country: "Tanzania",
      level: "Beginner",
      progress: 12,
      lessons: 24,
      learned: 12,
      description: "Learn the most widely spoken language in East Africa",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "in-progress",
        progress: 12,
        totalUnit: 6,
        phrase: "Nataka kujifunza Kiswahili.",
        locked: false,
        units: [],
      },
      {
        id: 2,
        title: "Elementary",
        level: "A2",
        status: "locked",
        progress: 0,
        totalUnit: 8,
        phrase: "Ninajua maneno machache.",
        locked: true,
        units: [],
      },
    ],
  },
  amharic: {
    name: "Amharic",
    info: {
      name: "Amharic",
      flag: "et",
      country: "Ethiopia",
      level: "Beginner",
      progress: 12,
      lessons: 28,
      learned: 28,
      description: "Learn the official language of Ethiopia",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "completed",
        progress: 28,
        totalUnit: 6,
        phrase: "አማርኛ መማር እፈልጋለሁ።",
        locked: false,
        units: [],
      },
    ],
  },
  hausa: {
    name: "Hausa",
    info: {
      name: "Hausa",
      flag: "ng",
      country: "Nigeria",
      level: "Beginner",
      progress: 0,
      lessons: 26,
      learned: 0,
      description: "Master the lingua franca of West Africa",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "locked",
        progress: 0,
        totalUnit: 6,
        phrase: "Ina son koyon Hausa.",
        locked: true,
        units: [],
      },
    ],
  },
  igbo: {
    name: "Igbo",
    info: {
      name: "Igbo",
      flag: "ng",
      country: "Nigeria",
      level: "Beginner",
      progress: 0,
      lessons: 30,
      learned: 0,
      description: "Learn the language of the Igbo people",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "locked",
        progress: 0,
        totalUnit: 6,
        phrase: "Achọrọ m ịmụ Igbo.",
        locked: true,
        units: [],
      },
    ],
  },
  zulu: {
    name: "Zulu",
    info: {
      name: "Zulu",
      flag: "za",
      country: "South-Africa",
      level: "Beginner",
      progress: 0,
      lessons: 25,
      learned: 0,
      description: "Discover South Africa's most spoken language",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "locked",
        progress: 0,
        totalUnit: 6,
        phrase: "Ngifuna ukufunda isiZulu.",
        locked: true,
        units: [],
      },
    ],
  },
  french: {
    name: "French",
    info: {
      name: "French",
      flag: "fr",
      country: "France",
      level: "Beginner",
      progress: 8,
      lessons: 15,
      learned: 3,
      description: "Learn the language of love and diplomacy",
    },
    sections: [
      {
        id: 1,
        title: "Beginner",
        level: "A1",
        status: "in-progress",
        progress: 8,
        totalUnit: 6,
        phrase: "Je veux apprendre le français.",
        locked: false,
        units: [
          {
            id: "basic-greetings-fr",
            title: "Basic Greetings",
            status: "completed",
            progress: 3,
            totalLessons: 3,
            sectionId: 1,
            languageId: "french",
            lessons: [
              {
                id: "greeting-fr-1",
                prompt: "How do you say 'Hello'?",
                phrase: "Bonjour",
                wordBank: ["Bonjour", "Bonsoir", "Salut", "Au revoir"],
                correctAnswer: ["Bonjour"],
                type: "lesson",
                completed: true,
              },
              {
                id: "greeting-fr-2",
                prompt: "How do you say 'Good evening'?",
                phrase: "Bonsoir",
                wordBank: ["Bonjour", "Bonsoir", "Salut", "Au revoir"],
                correctAnswer: ["Bonsoir"],
                type: "lesson",
                completed: true,
              },
              {
                id: "greeting-fr-3",
                prompt: "How do you say 'Goodbye'?",
                phrase: "Au revoir",
                wordBank: ["Bonjour", "Bonsoir", "Salut", "Au revoir"],
                correctAnswer: ["Au", "revoir"],
                type: "lesson",
                completed: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

// Helper function to get language info for the main learn page
export const getLanguagesList = () => {
  return Object.values(languages).map(lang => lang.info);
};

// Helper function to get language sections data
export const getLanguageSections = (languageKey: string) => {
  return languages[languageKey]?.sections || [];
};

// Helper function to get units by section
export const getUnitsBySection = (languageKey: string, sectionId: number) => {
  const language = languages[languageKey];
  if (!language) return [];
  
  const section = language.sections.find(s => s.id === sectionId);
  return section?.units || [];
};

// Helper function to get a specific language
export const getLanguage = (languageKey: string) => {
  return languages[languageKey];
};

// Helper function to get a specific unit
export const getUnit = (languageKey: string, sectionTitle: string, unitTitle: string) => {
  const language = languages[languageKey];
  if (!language) return null;
  
  const section = language.sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase());
  if (!section) return null;
  
  const unit = section.units.find(u => u.title.toLowerCase() === unitTitle.toLowerCase());
  return unit || null;
};
