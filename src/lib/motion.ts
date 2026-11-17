export const motionTiming = {
  entrance: {
    duration: 0.4,
    ease: [0.16, 1, 0.3, 1],
  },
  hero: {
    duration: 0.54,
    ease: [0.16, 1, 0.3, 1],
  },
  menu: {
    type: "tween",
    duration: 0.24,
    ease: [0.2, 0.8, 0.2, 1],
  },
  interaction: {
    type: "tween",
    duration: 0.18,
    ease: [0.2, 0.8, 0.2, 1],
  },
} as const;
