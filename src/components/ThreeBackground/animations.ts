import type { Mesh } from "three";

import { BACKGROUND_CONFIG } from "./constants";

interface IAnimationState {
  elapsed: number;
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
}

// Update pyramid and cube transformations on every animation frame.
export const animateObjects = (
  pyramid: Mesh,
  cube: Mesh,
  state: IAnimationState,
) => {
  const { elapsed, pointerX, pointerY, scrollProgress } = state;

  // Pyramid rotation: continuous movement + mouse + scroll.
  pyramid.rotation.x = 0.25 + elapsed * 0.12 + pointerY * 0.2;

  pyramid.rotation.y =
    elapsed * BACKGROUND_CONFIG.rotationSpeed.pyramid +
    pointerX * BACKGROUND_CONFIG.pointerInfluence +
    scrollProgress * BACKGROUND_CONFIG.scrollInfluence;

  pyramid.rotation.z = Math.sin(elapsed * 0.3) * 0.08;

  // Pyramid floating: sine creates smooth periodic movement.
  pyramid.position.y =
    Math.sin(elapsed * 0.45) * BACKGROUND_CONFIG.floatingAmplitude.pyramid -
    pointerY * 14 -
    scrollProgress * 25;

  // Cube rotation.
  cube.rotation.x = elapsed * 0.14 + pointerY * 0.25 + scrollProgress * 0.5;

  cube.rotation.y =
    elapsed * BACKGROUND_CONFIG.rotationSpeed.cube -
    pointerX * BACKGROUND_CONFIG.pointerInfluence;

  cube.rotation.z = Math.sin(elapsed * 0.35) * 0.06;

  // Cube floating in the opposite direction to the pyramid.
  cube.position.y =
    Math.cos(elapsed * 0.4) * BACKGROUND_CONFIG.floatingAmplitude.cube +
    pointerY * 14 +
    scrollProgress * 25;
};
