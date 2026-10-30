import React from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

/** Compact STL preview for the admin drawer (drag to rotate). */
export function StlPreview({ src }: { src: string | null }) {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || !src) return;

    let disposed = false;
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    host.replaceChildren(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    camera.position.set(0, 0, 2.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.65);
    key.position.set(2, 3, 4);
    scene.add(key);

    const model = new THREE.Group();
    scene.add(model);

    const material = new THREE.MeshStandardMaterial({
      color: 0x9aa8bc,
      metalness: 0.05,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });

    const loader = new STLLoader();
    let mesh: THREE.Mesh | null = null;
    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let rotY = 0;
    let rotX = 0;

    const fit = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
      const scale = 1.5 / maxDim;
      object.scale.setScalar(scale);
      object.position.sub(center.multiplyScalar(scale));
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const render = () => {
      if (disposed) return;
      if (!dragging) rotY += 0.004;
      model.rotation.y = rotY;
      model.rotation.x = rotX;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rotY += dx * 0.012;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    const ro = new ResizeObserver(() => resize());
    ro.observe(host);
    resize();

    void loader.loadAsync(src).then((geometry) => {
      if (disposed) {
        geometry.dispose();
        return;
      }
      geometry.computeVertexNormals();
      mesh = new THREE.Mesh(geometry, material);
      model.add(mesh);
      fit(mesh);
      render();
    }).catch(() => {
      if (!disposed) host.dataset.error = '1';
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      if (mesh) {
        mesh.geometry.dispose();
        material.dispose();
      }
      renderer.dispose();
      host.replaceChildren();
    };
  }, [src]);

  if (!src) return null;
  return <div ref={hostRef} className="stl-preview-host" aria-hidden />;
}
