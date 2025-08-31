import { Question, CreativeProfile } from '../types/test';

export const questions: Question[] = [
  {
    id: 1,
    text: "Your :) ideal Saturday morning starts with...",
    options: [
      {
        id: 1,
        text: "Organizing & planning work",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Lounging at home",
        scores: { ILLUMA: 2 }
      },
      {
        id: 3,
        text: "Heading outdoors",
        scores: { NOMAD: 2 }
      }
    ]
  },
  {
    id: 2,
    text: "Your laptop starts (=д=) overheating and running super slow...",
    options: [
      {
        id: 1,
        text: "Open it up",
        scores: { MAKER: 2 }
      },
      {
        id: 2,
        text: "Research first",
        scores: { REFORM: 1, MAKER: 1 }
      },
      {
        id: 3,
        text: "Quick restart",
        scores: { ILLUMA: 2 }
      }
    ]
  },
  {
    id: 3,
    text: "Your phone's photo library is mostly filled with...",
    options: [
      {
        id: 1,
        text: "Organized work pics",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Sunsets & nature beauty",
        scores: { ILLUMA: 2 }
      },
      {
        id: 3,
        text: "Random life moments",
        scores: { NOMAD: 2 }
      }
    ]
  },
  {
    id: 4,
    text: "You see a cool DIY project online...",
    options: [
      {
        id: 1,
        text: "Save it with detailed plans",
        scores: { MAKER: 2 }
      },
      {
        id: 2,
        text: "Imagine your own version",
        scores: { REFORM: 2 }
      },
      {
        id: 3,
        text: "Try it now",
        scores: { VISUAL: 2 }
      }
    ]
  },
  {
    id: 5,
    text: "You're (ಠ.ಠ)ง assembling IKEA furniture...",
    options: [
      {
        id: 1,
        text: "Follow instructions exactly",
        scores: { MAKER: 1, TIDY: 1 }
      },
      {
        id: 2,
        text: "Add personal modifications",
        scores: { REFORM: 2 }
      },
      {
        id: 3,
        text: "Make it Instagram-worthy",
        scores: { VISUAL: 2 }
      }
    ]
  },
  {
    id: 6,
    text: "If you were a vlogger, you'd most want to share...",
    options: [
      {
        id: 1,
        text: "Step-by-step tutorials",
        scores: { TIDY: 2 }
      },
      {
        id: 2,
        text: "Creation process",
        scores: { MAKER: 1, REFORM: 1 }
      },
      {
        id: 3,
        text: "Perfectly styled moments",
        scores: { VISUAL: 1, ILLUMA: 1 }
      }
    ]
  },
  {
    id: 7,
    text: "Your (^▽^) shopping style is...",
    options: [
      {
        id: 1,
        text: "Research & plan first",
        scores: { MAKER: 1, TIDY: 1 }
      },
      {
        id: 2,
        text: "Buy what sparks joy",
        scores: { NOMAD: 2 }
      },
      {
        id: 3,
        text: "Get the trendy stuff",
        scores: { ILLUMA: 1, VISUAL: 1 }
      }
    ]
  },
  {
    id: 8,
    text: "You're stuck in an elevator for 30 minutes... (^_^)",
    options: [
      {
        id: 1,
        text: "Try to fix it yourself",
        scores: { REFORM: 2 }
      },
      {
        id: 2,
        text: "Chat with strangers inside",
        scores: { NOMAD: 2 }
      },
      {
        id: 3,
        text: "Think & plan stuff",
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