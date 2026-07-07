/**
 * Three.js による 3D モデルプレビュー（GLB/GLTF/OBJ/STL/FBX）
 * dialog 内では A-Frame embedded より素の WebGL の方が安定する
 */

import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { getModel3dPreviewFormat } from "./file-icons.js";

function createDefaultMaterial() {
  return new THREE.MeshBasicMaterial({
    color: 0xc8d0dc,
    side: THREE.DoubleSide,
  });
}

function prepareMeshGeometry(mesh) {
  const geometry = mesh.geometry;
  if (!geometry) return;
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
}

function finalizeModelObject(object) {
  let meshCount = 0;

  object.traverse((node) => {
    if (!node.isMesh) return;
    meshCount += 1;
    prepareMeshGeometry(node);
    node.material = createDefaultMaterial();
    node.frustumCulled = false;
  });

  if (meshCount === 0) {
    throw new Error("モデルに表示可能なメッシュがありません");
  }

  object.updateMatrixWorld(true);
  return object;
}

function applyDefaultMaterials(object) {
  finalizeModelObject(object);
}

/** MTL 参照を除去して blob URL からの OBJ 読み込み失敗を防ぐ */
function sanitizeObjSource(text) {
  return text
    .replace(/^\s*mtllib\s+.+$/gim, "")
    .replace(/^\s*usemtl\s+.+$/gim, "");
}

async function loadModelObject(format, src) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`モデル取得に失敗しました (${response.status})`);
  }

  switch (format) {
    case "gltf": {
      const buffer = await response.arrayBuffer();
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.parse(buffer, "", resolve, reject);
      });
      const object = gltf.scene ?? gltf.scenes?.[0];
      if (!object) throw new Error("GLTF に表示可能なシーンがありません");
      applyDefaultMaterials(object);
      return object;
    }
    case "obj": {
      const text = sanitizeObjSource(await response.text());
      const loader = new OBJLoader();
      const object = loader.parse(text);
      applyDefaultMaterials(object);
      return object;
    }
    case "stl": {
      const buffer = await response.arrayBuffer();
      const geometry = parseStlBuffer(buffer);
      const mesh = new THREE.Mesh(geometry, createDefaultMaterial());
      return finalizeModelObject(mesh);
    }
    case "fbx": {
      const buffer = await response.arrayBuffer();
      const loader = new FBXLoader();
      const object = loader.parse(buffer, "");
      applyDefaultMaterials(object);
      return object;
    }
    default:
      throw new Error(`未対応の形式です: ${format}`);
  }
}

/** STL（ASCII / バイナリ）を BufferGeometry に変換 */
function parseStlBuffer(buffer) {
  if (isLikelyBinaryStl(buffer)) {
    return parseBinaryStl(buffer);
  }

  const text = new TextDecoder("utf-8").decode(buffer);
  if (/vertex\s+/i.test(text)) {
    return parseAsciiStl(text);
  }

  return parseBinaryStl(buffer);
}

function isLikelyBinaryStl(buffer) {
  if (buffer.byteLength < 84) return false;
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  if (triangleCount === 0) return false;
  return 84 + triangleCount * 50 === buffer.byteLength;
}

function parseBinaryStl(buffer) {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  const vertices = new Float32Array(triangleCount * 9);
  let offset = 84;

  for (let i = 0; i < triangleCount; i += 1) {
    offset += 12;
    for (let j = 0; j < 9; j += 1) {
      vertices[i * 9 + j] = view.getFloat32(offset, true);
      offset += 4;
    }
    offset += 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function parseAsciiStl(text) {
  const vertices = [];
  const vertexPattern =
    /vertex\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/gi;

  let match = vertexPattern.exec(text);
  while (match) {
    vertices.push(
      Number.parseFloat(match[1]),
      Number.parseFloat(match[2]),
      Number.parseFloat(match[3])
    );
    match = vertexPattern.exec(text);
  }

  if (vertices.length === 0) {
    throw new Error("STL の解析に失敗しました");
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** モデルを原点付近に収める */
function fitModelGroup(modelGroup, object) {
  while (modelGroup.children.length > 0) {
    modelGroup.remove(modelGroup.children[0]);
  }

  modelGroup.add(object);
  modelGroup.scale.set(1, 1, 1);
  modelGroup.position.set(0, 0, 0);
  object.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (!maxDim || !Number.isFinite(maxDim)) {
    return 0;
  }

  const scale = 1.6 / maxDim;
  modelGroup.scale.set(scale, scale, scale);
  modelGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  return maxDim * scale;
}

/** 左ドラッグ回転・右ドラッグパン・ホイールズーム */
function createOrbitControls(canvas, camera) {
  const target = new THREE.Vector3(0, 0, 0);
  const spherical = { radius: 2.4, theta: 0, phi: Math.PI / 3 };
  let dragMode = null;
  let activePointerId = null;
  let lastPointer = { x: 0, y: 0 };
  const panRight = new THREE.Vector3();
  const panUp = new THREE.Vector3();
  const viewDir = new THREE.Vector3();

  const updateCamera = () => {
    const { radius, theta, phi } = spherical;
    const sinPhi = Math.sin(phi);
    const x = radius * sinPhi * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * sinPhi * Math.cos(theta);
    camera.position.set(target.x + x, target.y + y, target.z + z);
    camera.lookAt(target);
  };

  const setRadiusFromFit = (fittedSize) => {
    spherical.radius = fittedSize && fittedSize > 0 ? Math.max(2.2, fittedSize * 1.4) : 2.4;
    updateCamera();
  };

  const onContextMenu = (event) => event.preventDefault();

  const onWheel = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    const factor = 1 + direction * 0.12;
    spherical.radius = Math.min(80, Math.max(0.15, spherical.radius * factor));
    updateCamera();
  };

  const onPointerMove = (event) => {
    if (dragMode == null || event.pointerId !== activePointerId) return;

    const dx = event.clientX - lastPointer.x;
    const dy = event.clientY - lastPointer.y;
    lastPointer.x = event.clientX;
    lastPointer.y = event.clientY;

    if (dragMode === "rotate") {
      spherical.theta -= dx * 0.005;
      spherical.phi -= dy * 0.005;
      const eps = 0.05;
      spherical.phi = Math.max(eps, Math.min(Math.PI - eps, spherical.phi));
    } else if (dragMode === "pan") {
      camera.getWorldDirection(viewDir);
      panRight.crossVectors(viewDir, camera.up).normalize();
      panUp.crossVectors(panRight, viewDir).normalize();
      const scale = spherical.radius * 0.0025;
      target.addScaledVector(panRight, -dx * scale);
      target.addScaledVector(panUp, dy * scale);
    }

    updateCamera();
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== activePointerId) return;
    dragMode = null;
    activePointerId = null;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
  };

  const onPointerDown = (event) => {
    if (event.button === 0) {
      dragMode = "rotate";
    } else if (event.button === 2) {
      dragMode = "pan";
    } else {
      return;
    }

    activePointerId = event.pointerId;
    lastPointer.x = event.clientX;
    lastPointer.y = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
  };

  canvas.addEventListener("contextmenu", onContextMenu);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", onPointerDown);
  updateCamera();

  return {
    updateCamera,
    setRadiusFromFit,
    dispose() {
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    },
  };
}

function disposeObject3D(object) {
  object?.traverse?.((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((material) => material.dispose?.());
      } else {
        node.material.dispose?.();
      }
    }
  });
}

/** Three.js ビューアを構築 */
function createThreeViewer(viewerEl) {
  const canvas = document.createElement("canvas");
  canvas.className = "cs-model3d-canvas";

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 2000);
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(2, 4, 3);
  scene.add(directional);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const loadingEl = viewerEl.querySelector(".cs-model3d-loading");
  viewerEl.insertBefore(canvas, loadingEl ?? viewerEl.firstChild);

  const controls = createOrbitControls(canvas, camera);
  let animationId = 0;
  let disposed = false;

  const renderFrame = () => {
    if (disposed) return;
    animationId = window.requestAnimationFrame(renderFrame);
    renderer.render(scene, camera);
  };

  const resize = (width, height) => {
    const w = Math.floor(width);
    const h = Math.floor(height);
    if (w < 2 || h < 2) return false;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    return true;
  };

  const start = () => {
    if (animationId || disposed) return;
    renderFrame();
  };

  const stop = () => {
    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = 0;
    }
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop();
    controls.dispose();
    disposeObject3D(modelGroup);
    renderer.dispose();
    canvas.remove();
  };

  start();

  return {
    canvas,
    renderer,
    scene,
    camera,
    modelGroup,
    controls,
    resize,
    start,
    stop,
    dispose,
  };
}

async function waitForViewerLayout(viewer) {
  for (let i = 0; i < 6; i += 1) {
    if (viewer.clientWidth >= 2 && viewer.clientHeight >= 2) return;
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }
}

function resizeThreeViewer(viewer, viewerState, options = {}) {
  if (!viewer || !viewerState || viewer._csUnmounting) return false;

  const width = Math.floor(viewer.clientWidth);
  const height = Math.floor(viewer.clientHeight);
  const lastW = viewer._csLastWidth ?? -1;
  const lastH = viewer._csLastHeight ?? -1;
  if (!options.force && width === lastW && height === lastH) {
    return false;
  }

  const changed = viewerState.resize(width, height);
  if (!changed) return false;

  viewer._csLastWidth = width;
  viewer._csLastHeight = height;
  return true;
}

function attachViewerResizeObserver(viewer, viewerState) {
  if (!viewer || viewer._csResizeObserver) return;

  let resizeRaf = 0;
  const observer = new ResizeObserver(() => {
    if (viewer._csUnmounting) return;
    if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
    resizeRaf = window.requestAnimationFrame(() => {
      resizeRaf = 0;
      resizeThreeViewer(viewer, viewerState);
    });
  });
  observer.observe(viewer);
  viewer._csResizeObserver = observer;
}

function detachViewerResizeObserver(viewer) {
  if (!viewer?._csResizeObserver) return;
  viewer._csResizeObserver.disconnect();
  viewer._csResizeObserver = null;
}

const MODEL_MIME_BY_EXT = {
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  stl: "model/stl",
  obj: "model/obj",
  fbx: "application/octet-stream",
};

/** ローダー向けに Blob の MIME を補正 */
export function ensureModelBlobType(blob, filename) {
  if (blob.type && blob.type !== "application/octet-stream") {
    return blob;
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = MODEL_MIME_BY_EXT[ext];
  if (!mimeType) return blob;
  return new Blob([blob], { type: mimeType });
}

/**
 * プレビューダイアログ内に 3D モデルを表示
 * @param {HTMLElement} container
 * @param {string} objectUrl
 * @param {string} filename
 * @param {{ loadToken?: number, isStale?: () => boolean }} [options]
 */
export async function mountModel3dPreview(container, objectUrl, filename, options = {}) {
  const format = getModel3dPreviewFormat(filename);
  if (!format) {
    throw new Error("この 3D 形式はプレビューに対応していません");
  }

  if (options.isStale?.()) return;

  const viewer = document.createElement("div");
  viewer.className = "cs-model3d-viewer";
  viewer.dataset.objectUrl = objectUrl;
  viewer.innerHTML = `
    <p class="cs-model3d-loading">3D モデルを読み込み中…</p>
    <p class="cs-model3d-hint">左ドラッグで回転 · 右ドラッグで移動 · ホイールでズーム</p>
  `;

  container.replaceChildren(viewer);

  await waitForViewerLayout(viewer);
  if (options.isStale?.()) return;

  const viewerState = createThreeViewer(viewer);
  viewer._csThree = viewerState;
  resizeThreeViewer(viewer, viewerState, { force: true });

  const object = await loadModelObject(format, objectUrl);
  if (options.isStale?.()) return;

  const fittedSize = fitModelGroup(viewerState.modelGroup, object);
  viewerState.controls.setRadiusFromFit(fittedSize);

  if (options.isStale?.()) return;

  const loadingEl = viewer.querySelector(".cs-model3d-loading");
  if (loadingEl) loadingEl.remove();

  attachViewerResizeObserver(viewer, viewerState);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  resizeThreeViewer(viewer, viewerState, { force: true });
}

/** 3D プレビューを破棄して WebGL リソースを解放 */
export function unmountModel3dPreview(container) {
  const viewer = container?.querySelector(".cs-model3d-viewer");
  if (!viewer) return;

  const objectUrl = viewer.dataset.objectUrl;
  viewer._csUnmounting = true;

  detachViewerResizeObserver(viewer);
  viewer._csThree?.dispose();
  viewer._csThree = null;
  viewer.remove();

  if (objectUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(objectUrl);
  }
}
