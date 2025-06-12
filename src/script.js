import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
// parameters.count = 1000;
parameters.count = 10000;
// parameters.size = 0.02;
parameters.size = 0.01;

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  // console.log('Generating galaxy...')

  // we need to destroy the old galaxy becuase when we change the value using lol-gui it will create new galaxy with the old one too, it won't remove the old one automatically, so we need to remove it manually using dispose() method

  // we need to remove the const from the geometry, material and points variables, so we can reassign them with new values when we generate a new galaxy, otherwise it will throw an error saying that the variable is already declared

  /**
   * Destroy old galaxy
   */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    positions[i3 + 0] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  /**
   * Material
   */

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

// gui.add(parameters, 'count').min(100).max(100000).step(100)
// this won't change anything in the scene, so we need to call the galaxy generation function when the value changes, so we can see the changes in the scene and there is onChange property in lil-gui, to call the function after we change the value in the panel.

// gui.add(parameters, 'count').min(100).max(100000).step(100).onChange(generateGalaxy)
// there is onChange property in lil-gui, but when we drag the slider, it changes and it may change many times before we release the mouse button and it can create performance issues, so we use onFinishChange instead befause it will only call the function when we release the mouse button i.e. instead of changing the value many times, it will change only once

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
