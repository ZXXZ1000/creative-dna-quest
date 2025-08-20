export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
  scores: { [key in CreativeType]?: number };
}

export type CreativeType = 'MAKER' | 'TIDY' | 'ILLUMA' | 'REFORM' | 'NOMAD' | 'VISUAL';

export interface CreativeProfile {
  type: CreativeType;
  title: string;
  description: string;
  traits: string[];
  product: string;
  color: string;
}

export interface TestState {
  currentPage: number;
  answers: { [questionId: number]: number };
  scores: { [key in CreativeType]: number };
  userInfo: {
    name: string;
    email: string;
    region: string;
    emailSubscription: boolean;
  };
  result?: CreativeProfile;
}

export interface SwipeState {
  isDragging: boolean;
  startY: number;
  currentY: number;
  threshold: number;
}