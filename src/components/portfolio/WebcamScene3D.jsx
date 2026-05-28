import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Procedural wireframe webcam — sketch / blueprint style.
 * Pans left/right slowly as if tracking someone in the room.
 * Color is read from --primary CSS variable at mount time.
 */
export default function WebcamScene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Read primary colour from CSS ──────────────────────────────────
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim(); // e.g. "174 100% 50%"
    const parts = raw.split(/\s+/);
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const primaryColor = new THREE.Color().setHSL(h, s, l);
    const dimColor     = new THREE.Color().setHSL(h, s * 0.7, l * 0.6);

    const mat  = (op) => new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: op });
    const dmat = (op) => new THREE.LineBasicMaterial({ color: dimColor,     transparent: true, opacity: op });

    // ── Scene ─────────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const w0 = el.clientWidth, h0 = el.clientHeight;
    const camera   = new THREE.PerspectiveCamera(38, w0 / h0, 0.1, 100);
    camera.position.set(0, 0.25, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Helper: edges from geo ────────────────────────────────────────
    const edges = (geo, m) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), m);

    // ── Root group ────────────────────────────────────────────────────
    const root  = new THREE.Group();           // pans for tracking
    const model = new THREE.Group();           // the camera body
    root.add(model);
    scene.add(root);
    root.rotation.x = 0.12;

    // ── 1. Main cylinder body (horizontal) ────────────────────────────
    const bodyGeo = new THREE.CylinderGeometry(0.54, 0.54, 1.9, 32, 4);
    const body = edges(bodyGeo, mat(0.45));
    body.rotation.z = Math.PI / 2;
    model.add(body);

    // ── 2. Front face circle ──────────────────────────────────────────
    const frontFaceGeo = new THREE.CircleGeometry(0.54, 32);
    const frontFace = edges(frontFaceGeo, mat(0.7));
    frontFace.position.x = 0.95;
    frontFace.rotation.y = Math.PI / 2;
    model.add(frontFace);

    // ── 3. Outer lens ring (torus) ────────────────────────────────────
    const outerRingGeo = new THREE.TorusGeometry(0.37, 0.048, 10, 40);
    const outerRing = edges(outerRingGeo, mat(0.95));
    outerRing.position.x = 0.95;
    outerRing.rotation.y = Math.PI / 2;
    model.add(outerRing);

    // ── 4. Middle lens ring ───────────────────────────────────────────
    const midRingGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 32);
    const midRing = edges(midRingGeo, mat(0.85));
    midRing.position.x = 0.97;
    midRing.rotation.y = Math.PI / 2;
    model.add(midRing);

    // ── 5. Lens dome (small sphere) ───────────────────────────────────
    const lensGeo = new THREE.SphereGeometry(0.17, 18, 12);
    const lensMesh = edges(lensGeo, dmat(0.55));
    lensMesh.position.x = 1.06;
    model.add(lensMesh);

    // ── 6. Inner lens iris (tiny circle) ─────────────────────────────
    const irisGeo = new THREE.CircleGeometry(0.09, 20);
    const irisMesh = edges(irisGeo, mat(1.0));
    irisMesh.position.x = 1.14;
    irisMesh.rotation.y = Math.PI / 2;
    model.add(irisMesh);

    // ── 7. Back cap ───────────────────────────────────────────────────
    const backGeo = new THREE.CircleGeometry(0.54, 32);
    const backFace = edges(backGeo, dmat(0.28));
    backFace.position.x = -0.95;
    backFace.rotation.y = Math.PI / 2;
    model.add(backFace);

    // ── 8. Back detail ring ───────────────────────────────────────────
    const backRingGeo = new THREE.TorusGeometry(0.3, 0.025, 6, 28);
    const backRing = edges(backRingGeo, dmat(0.25));
    backRing.position.x = -0.92;
    backRing.rotation.y = Math.PI / 2;
    model.add(backRing);

    // ── 9. Indicator LED bump ─────────────────────────────────────────
    const ledGeo = new THREE.SphereGeometry(0.06, 8, 6);
    const led = edges(ledGeo, mat(0.9));
    led.position.set(0.58, 0.56, 0);
    model.add(led);

    // ── 10. Vertical mounting bracket (below body) ────────────────────
    const bracketGeo = new THREE.BoxGeometry(0.12, 0.75, 0.12);
    const bracket = edges(bracketGeo, mat(0.55));
    bracket.position.set(0, -0.92, 0);
    model.add(bracket);

    // ── 11. Horizontal clip base ──────────────────────────────────────
    const baseGeo = new THREE.BoxGeometry(0.85, 0.09, 0.38);
    const base = edges(baseGeo, mat(0.6));
    base.position.set(0, -1.28, 0);
    model.add(base);

    // ── 12. Clip teeth (front and back of base) ───────────────────────
    for (const [zPos, yOff] of [[-0.24, -0.1], [0.24, -0.1]]) {
      const toothGeo = new THREE.BoxGeometry(0.07, 0.22, 0.07);
      const tooth = edges(toothGeo, mat(0.55));
      tooth.position.set(0, -1.28 + yOff, zPos);
      model.add(tooth);
    }

    // ── 13. USB cable suggestion (tiny cylinder at back) ──────────────
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 8);
    const cable = edges(cableGeo, dmat(0.35));
    cable.rotation.z = Math.PI / 2;
    cable.position.x = -1.07;
    model.add(cable);

    // ── 14. Scan target (floating ring in front of lens) ──────────────
    const scanGeo  = new THREE.TorusGeometry(0.28, 0.015, 6, 48);
    const scanRing = edges(scanGeo, mat(0.35));
    scanRing.position.x = 2.1;
    scanRing.rotation.y = Math.PI / 2;
    root.add(scanRing);   // add to root so it doesn't tilt with model

    // Crosshair lines
    const mkLine = (pts, m) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      return new THREE.Line(g, m);
    };
    const chMat = dmat(0.25);
    root.add(mkLine([[2.1, -0.36, 0], [2.1, 0.36, 0]],   chMat));
    root.add(mkLine([[2.1, 0, -0.36], [2.1, 0, 0.36]],   chMat));

    // ── Animation ─────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Tracking pan: slow, deliberate left/right sweep
      root.rotation.y = Math.sin(t * 0.38) * 0.80;
      // Tiny tilt up/down while panning (realism)
      root.rotation.x = 0.12 + Math.sin(t * 0.21) * 0.055;

      // Pulse the scan ring opacity
      scanRing.material.opacity = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.6));

      // LED flicker
      led.material.opacity = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 3.5));

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
