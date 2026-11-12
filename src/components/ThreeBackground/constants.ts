export const CONTENT_WIDTH = 1400;
export const OBJECT_SIZE = 260;

// Place objects just outside the centered content container.
export const OBJECT_OFFSET = CONTENT_WIDTH / 2 + OBJECT_SIZE / 2;

export const BACKGROUND_CONFIG = {
  opacity: 0.19,
  edgeOpacity: 0.25,

  roughness: 0.4,
  metalness: 0.08,

  rotationSpeed: {
    pyramid: 0.18,
    cube: 0.2,
  },

  floatingAmplitude: {
    pyramid: 12,
    cube: 10,
  },

  pointerInfluence: 0.3,
  scrollInfluence: 0.7,
};
