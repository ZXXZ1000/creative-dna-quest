export interface QuestionImageSet {
  left?: string;
  right?: string;
}

// Per-question decorative image mapping.
// Path should point to files under `public/` so they can be referenced directly.
export const questionImages: Record<number, QuestionImageSet> = {
  // Q2: page 2.2 – mapped to two assets copied from the design folder
  2: {
    left: "/assets/q2-left.png",
    right: "/assets/q2-right.png",
  },
  // Q3: page 2.3 – using images 127 (left) and 128 (right)
  3: {
    left: "/assets/q3-left.png",
    right: "/assets/q3-right.png",
  },
  // Q4: page 2.4 – using images 125 (left) and 51 (right)
  4: {
    left: "/assets/q4-left.png",
    right: "/assets/q4-right.png",
  },
  // Q5: page 2.5 – using images 66 (left) and 67 (right)
  5: {
    left: "/assets/q5-left.png",
    right: "/assets/q5-right.png",
  },
  // Q6: page 2.6 – using image 71 (left), right falls back to default if not specified
  6: {
    left: "/assets/q6-left.png",
  },
  // Q7: page 2.7 – using images 70 (left) and 129 (right)
  7: {
    left: "/assets/q7-left.png",
    right: "/assets/q7-right.png",
  },
  // Q8: page 2.8 – using images 63 (left) and 79 (right)
  8: {
    left: "/assets/q8-left.png",
    right: "/assets/q8-right.png",
  },
};
