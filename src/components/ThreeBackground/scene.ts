import * as THREE from "three";

import { BACKGROUND_CONFIG, OBJECT_OFFSET, OBJECT_SIZE } from "./constants";
import { IThreeScene } from "./ThreeBackground.types";

// Read the primary color from the application's CSS variables.
const getThemeColor = () => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  return color || "#7895ff";
};

// Create an orthographic camera so object positions map predictably
// to viewport dimensions without perspective distortion.
const createCamera = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const camera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    1,
    2000,
  );

  camera.position.z = 1000;

  return camera;
};

// Create the WebGL renderer and connect it to the HTML canvas.
const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  return renderer;
};

// Add ambient and directional lighting to illuminate the objects.
const createLights = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);

  directionalLight.position.set(-300, 400, 700);

  scene.add(ambientLight, directionalLight);
};

// Create shared materials for the objects and their edges.
const createMaterials = () => {
  const color = getThemeColor();

  const material = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: BACKGROUND_CONFIG.opacity,
    roughness: BACKGROUND_CONFIG.roughness,
    metalness: BACKGROUND_CONFIG.metalness,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: BACKGROUND_CONFIG.edgeOpacity,
  });

  return { material, edgeMaterial };
};

// Create a four-sided pyramid and add visible geometric edges.
const createPyramid = (
  material: THREE.Material,
  edgeMaterial: THREE.Material,
) => {
  const geometry = new THREE.ConeGeometry(OBJECT_SIZE / 2, OBJECT_SIZE, 4);

  const pyramid = new THREE.Mesh(geometry, material);

  pyramid.position.set(-OBJECT_OFFSET, 0, 0);
  pyramid.rotation.set(0.25, Math.PI / 4, 0.15);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    edgeMaterial,
  );

  pyramid.add(edges);

  return pyramid;
};

// Create a cube and add visible geometric edges.
const createCube = (material: THREE.Material, edgeMaterial: THREE.Material) => {
  const size = OBJECT_SIZE * 0.85;
  const geometry = new THREE.BoxGeometry(size, size, size);

  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(OBJECT_OFFSET, 0, 0);
  cube.rotation.set(0.3, 0.4, 0.2);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    edgeMaterial,
  );

  cube.add(edges);

  return cube;
};

// Initialize the complete Three.js scene.
export const createThreeScene = (canvas: HTMLCanvasElement): IThreeScene => {
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = createRenderer(canvas);

  createLights(scene);

  const { material, edgeMaterial } = createMaterials();

  const pyramid = createPyramid(material, edgeMaterial);
  const cube = createCube(material, edgeMaterial);

  scene.add(pyramid, cube);

  // Update material colors when the application theme changes.
  const updateTheme = () => {
    const color = new THREE.Color(getThemeColor());

    material.color.copy(color);
    edgeMaterial.color.copy(color);
  };

  // Update the camera's visible area and renderer dimensions.
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  // Release geometries and materials to prevent GPU memory leaks.
  const dispose = () => {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();

    scene.traverse((object) => {
      if (
        !(object instanceof THREE.Mesh) &&
        !(object instanceof THREE.LineSegments)
      ) {
        return;
      }

      geometries.add(object.geometry);

      const objectMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      objectMaterials.forEach((item) => materials.add(item));
    });

    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((item) => item.dispose());

    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    pyramid,
    cube,
    updateTheme,
    resize,
    dispose,
  };
};
