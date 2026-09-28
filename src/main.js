import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from './vendor/mindar-image-three.prod.js';
import './styles.css';

const container = document.querySelector('#ar-container');

let mindarThree;
let animationGroup;
let rotatingLayers = [];
let isRunning = false;
const clock = new THREE.Clock();
let rotationElapsed = 0;
const LAYER_ROTATION_SPEED = 0.42;
const POSITION_SMOOTHING_RATE = 9;
const ROTATION_SMOOTHING_RATE = 7;
const trackedPosition = new THREE.Vector3();
const trackedQuaternion = new THREE.Quaternion();
const trackedScale = new THREE.Vector3();
let trackingPoseInitialized = false;

function readTrackedPose(anchorGroup, snap = false) {
  anchorGroup.matrix.decompose(trackedPosition, trackedQuaternion, trackedScale);

  if (snap || !trackingPoseInitialized) {
    animationGroup.position.copy(trackedPosition);
    animationGroup.quaternion.copy(trackedQuaternion);
    animationGroup.scale.copy(trackedScale);
    trackingPoseInitialized = true;
  }
}

function prepareArtwork(model, targetFootprint = 0.68) {
  const layers = [...model.children]
    .filter((child) => child.getObjectByProperty('isMesh', true))
    .sort((a, b) => a.position.y - b.position.y);

  rotatingLayers = layers.map((layer, index) => {
    const originalPosition = layer.position.clone();
    const pivot = new THREE.Group();
    pivot.position.y = originalPosition.y;

    model.remove(layer);
    layer.position.set(originalPosition.x, 0, originalPosition.z);
    pivot.add(layer);
    model.add(pivot);

    return {
      pivot,
      direction: index % 2 === 0 ? -1 : 1,
    };
  });

  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = targetFootprint / Math.max(size.x, size.z);

  model.position.set(-center.x, -bounds.min.y, -center.z);

  const normalized = new THREE.Group();
  normalized.scale.setScalar(scale);
  normalized.add(model);

  const standingArtwork = new THREE.Group();
  standingArtwork.rotation.x = Math.PI / 2;
  standingArtwork.position.z = 0.015;
  standingArtwork.add(normalized);

  return standingArtwork;
}

async function loadArtwork() {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('/assets/gesturetouch.glb');
  const artwork = gltf.scene;

  artwork.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.material = child.material.clone();
    child.material.roughness = 0.58;
    child.material.metalness = 0.05;
  });

  return prepareArtwork(artwork);
}

function makeFallbackObject() {
  const geometry = new THREE.IcosahedronGeometry(0.26, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffdf74,
    roughness: 0.28,
    metalness: 0.32,
    flatShading: true,
  });
  const fallback = new THREE.Mesh(geometry, material);
  fallback.position.z = 0.3;
  rotatingLayers = [{ pivot: fallback, direction: 1 }];
  return fallback;
}

function addLighting(group) {
  const ambient = new THREE.HemisphereLight(0xfff4da, 0x25170f, 2.4);
  group.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-1.5, 2.2, 3);
  group.add(key);
}

async function createExperience() {
  mindarThree = new MindARThree({
    container,
    imageTargetSrc: '/assets/target.mind',
    filterMinCF: 0.05,
    filterBeta: 5,
    warmupTolerance: 4,
    missTolerance: 8,
    uiLoading: 'no',
    uiScanning: 'no',
    uiError: 'no',
  });

  const { renderer, scene, camera } = mindarThree;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const anchor = mindarThree.addAnchor(0);
  animationGroup = new THREE.Group();
  animationGroup.visible = false;
  rotationElapsed = 0;
  trackingPoseInitialized = false;
  scene.add(animationGroup);
  addLighting(animationGroup);

  try {
    animationGroup.add(await loadArtwork());
  } catch (error) {
    console.warn('GLB model failed to load; using fallback geometry.', error);
    animationGroup.add(makeFallbackObject());
  }

  anchor.onTargetFound = () => {
    readTrackedPose(anchor.group, true);
    animationGroup.visible = true;
    navigator.vibrate?.(35);
  };

  anchor.onTargetLost = () => {
    animationGroup.visible = false;
    trackingPoseInitialized = false;
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.1);
    if (animationGroup.visible) {
      anchor.group.matrix.decompose(trackedPosition, trackedQuaternion, trackedScale);
      const positionAlpha = 1 - Math.exp(-POSITION_SMOOTHING_RATE * delta);
      const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING_RATE * delta);
      animationGroup.position.lerp(trackedPosition, positionAlpha);
      animationGroup.quaternion.slerp(trackedQuaternion, rotationAlpha);
      animationGroup.scale.lerp(trackedScale, positionAlpha);

      rotationElapsed += delta;
      rotatingLayers.forEach(({ pivot, direction }) => {
        pivot.rotation.y = direction * rotationElapsed * LAYER_ROTATION_SPEED;
      });
    }
    renderer.render(scene, camera);
  });
}

async function startAR() {
  if (isRunning) return;
  isRunning = true;

  try {
    await createExperience();
  } catch (error) {
    console.error(error);
    if (mindarThree) {
      mindarThree.stop();
      mindarThree.renderer?.setAnimationLoop(null);
      mindarThree.renderer?.dispose();
      mindarThree = undefined;
    }
    container.replaceChildren();
    isRunning = false;
  }
}

startAR();
