import { Question, CreativeProfile } from '../types/test';

export const questions: Question[] = [
  {
    id: 1,
    text: "When starting a new project, what's your first instinct?",
    options: [
      {
        id: 1,
        text: "Plan every detail and organize resources",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Set the perfect mood and ambiance",
        scores: { ILLUMA: 2 }
      },
      {
        id: 3,
        text: "Dive in and explore possibilities",
        scores: { NOMAD: 2 }
      }
    ]
  },
  {
    id: 2,
    text: "Your ideal weekend workshop involves:",
    options: [
      {
        id: 1,
        text: "Building something functional from scratch",
        scores: { MAKER: 2 }
      },
      {
        id: 2,
        text: "Improving existing tools and methods",
        scores: { REFORM: 1, MAKER: 1 }
      },
      {
        id: 3,
        text: "Creating something beautiful and atmospheric",
        scores: { ILLUMA: 2 }
      }
    ]
  },
  {
    id: 3,
    text: "When choosing tools, you prioritize:",
    options: [
      {
        id: 1,
        text: "Reliability and proven track record",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Versatility and atmospheric quality",
        scores: { ILLUMA: 2 }
      },
      {
        id: 3,
        text: "Portability and adventure-readiness",
        scores: { NOMAD: 2 }
      }
    ]
  },
  {
    id: 4,
    text: "Your approach to problem-solving is:",
    options: [
      {
        id: 1,
        text: "Systematic and methodical",
        scores: { MAKER: 2 }
      },
      {
        id: 2,
        text: "Innovative and experimental",
        scores: { REFORM: 2 }
      },
      {
        id: 3,
        text: "Aesthetic and visually-driven",
        scores: { VISUAL: 2 }
      }
    ]
  },
  {
    id: 5,
    text: "In a team setting, you naturally:",
    options: [
      {
        id: 1,
        text: "Organize tasks and ensure quality",
        scores: { MAKER: 1, TIDY: 1 }
      },
      {
        id: 2,
        text: "Push boundaries and suggest improvements",
        scores: { REFORM: 2 }
      },
      {
        id: 3,
        text: "Focus on presentation and user experience",
        scores: { VISUAL: 2 }
      }
    ]
  },
  {
    id: 6,
    text: "Your workspace style reflects:",
    options: [
      {
        id: 1,
        text: "Clean organization and efficiency",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Functional tools within easy reach",
        scores: { MAKER: 1, REFORM: 1 }
      },
      {
        id: 3,
        text: "Inspiring aesthetics and mood lighting",
        scores: { VISUAL: 1, ILLUMA: 1 }
      }
    ]
  },
  {
    id: 7,
    text: "When learning something new, you prefer:",
    options: [
      {
        id: 1,
        text: "Step-by-step instructions and practice",
        scores: { MAKER: 1, TIDY: 1 }
      },
      {
        id: 2,
        text: "Exploring and discovering your own way",
        scores: { NOMAD: 2 }
      },
      {
        id: 3,
        text: "Understanding the artistry and vision behind it",
        scores: { ILLUMA: 1, VISUAL: 1 }
      }
    ]
  },
  {
    id: 8,
    text: "Your motivation comes from:",
    options: [
      {
        id: 1,
        text: "Perfecting and optimizing systems",
        scores: { REFORM: 2 }
      },
      {
        id: 2,
        text: "Freedom and new experiences",
        scores: { NOMAD: 2 }
      },
      {
        id: 3,
        text: "Creating beautiful, impactful designs",
        scores: { VISUAL: 2 }
      }
    ]
  }
];

export const creativeProfiles: { [key: string]: CreativeProfile } = {
  MAKER: {
    type: 'MAKER',
    title: 'The Assembler',
    description: 'You have a natural gift for building and creating. Your logical, systematic approach turns ideas into reality with precision and craftsmanship.',
    traits: ['Logical', 'Systematic', 'Detail-oriented', 'Reliable'],
    product: 'SNAPBLOCK - Perfect for your building mindset',
    color: 'from-blue-500 to-cyan-500'
  },
  TIDY: {
    type: 'TIDY',
    title: 'The Guardian',
    description: 'Organization is your superpower. You create order from chaos and ensure everything runs smoothly with your meticulous attention to detail.',
    traits: ['Organized', 'Efficient', 'Quality-focused', 'Dependable'],
    product: 'Electric Spray - For your perfect cleaning standards',
    color: 'from-green-500 to-emerald-500'
  },
  ILLUMA: {
    type: 'ILLUMA',
    title: 'The Light Seeker',
    description: 'You have an intuitive sense for atmosphere and mood. Your sensitivity to environment creates spaces that inspire and comfort.',
    traits: ['Atmospheric', 'Intuitive', 'Mood-conscious', 'Inspiring'],
    product: 'Camplight - To set the perfect ambiance',
    color: 'from-yellow-500 to-orange-500'
  },
  REFORM: {
    type: 'REFORM',
    title: 'The Innovator',
    description: 'You see potential for improvement everywhere. Your hands-on approach and innovative thinking constantly push boundaries.',
    traits: ['Innovative', 'Hands-on', 'Progressive', 'Solution-focused'],
    product: '12V Brush Tool Set - For your endless improvements',
    color: 'from-purple-500 to-pink-500'
  },
  NOMAD: {
    type: 'NOMAD',
    title: 'The Explorer',
    description: 'Freedom and adventure fuel your creativity. Your spontaneous, adaptable nature thrives on new experiences and challenges.',
    traits: ['Free-spirited', 'Adaptable', 'Adventure-seeking', 'Spontaneous'],
    product: 'Air Pump Pro - Ready for any adventure',
    color: 'from-red-500 to-orange-500'
  },
  VISUAL: {
    type: 'VISUAL',
    title: 'The Visionary',
    description: 'Aesthetics and visual perfection drive your decisions. Your keen eye for design creates experiences that captivate and inspire.',
    traits: ['Aesthetic', 'Perfectionist', 'Trend-conscious', 'Visually-driven'],
    product: 'Laser Measure - Precision for perfect results',
    color: 'from-indigo-500 to-purple-500'
  }
};