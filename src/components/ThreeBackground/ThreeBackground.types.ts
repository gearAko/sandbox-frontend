import * as THREE from "three";

export interface IThreeScene {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  pyramid: THREE.Mesh;
  cube: THREE.Mesh;
  updateTheme: () => void;
  resize: () => void;
  dispose: () => void;
}

export interface IPointer {
  x: number;
  y: number;
}
