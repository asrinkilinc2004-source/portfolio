import { useEffect, useRef } from "react";
import * as THREE from "three";

// Cubic ease-in-out for the surveillance sweep
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Logitech-style wireframe webcam.
 * Only the camera HEAD pans (surveillance CCTV motion).
 * The mount/clip stays completely static.
 */
export default function WebcamScene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Read --primary CSS variable at runtime ────────────────────────
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary").trim();           // "174 100% 50%"
    const parts = raw.split(/\s+/);
    const hh = parseFloat(parts[0]) / 360;
    const ss = parseFloat(parts[1]) / 100;
    const ll = parseFloat(parts[2]) / 100;
    const primaryColor = new THREE.Color().setHSL(hh, ss, ll);
    const dimColor     = new THREE.Color().setHSL(hh, ss * 0.55, ll * 0.55);

    const mat  = (op) => new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: op });
    const dmat = (op) => new THREE.LineBasicMaterial({ color: dimColor,     transparent: true, opacity: op });

    // ── Renderer ──────────────────────────────────────────────────────
    const w0 = el.clientWidth, h0 = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & camera ────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const cam      = new THREE.PerspectiveCamera(36, w0 / h0, 0.1, 100);
    cam.position.set(0, 0.55, 4.8);
    cam.lookAt(0, 0.25, 0);

    // ── Helper ────────────────────────────────────────────────────────
    const edgesOf = (geo, m) =>
      new THREE.LineSegments(new THREE.EdgesGeometry(geo), m);

    // ── ROOT ──────────────────────────────────────────────────────────
    const root = new THREE.Group();
    scene.add(root);

    // =================================================================
    // STAND  (never rotates)
    // =================================================================
    const stand = new THREE.Group();
    root.add(stand);

    // Hinge ball joint at origin (connection point between head & stand)
    stand.add(edgesOf(new THREE.SphereGeometry(0.09, 12, 8),           mat(0.80)));

    // Short neck piece going down
    const neck = edgesOf(new THREE.CylinderGeometry(0.052, 0.052, 0.24, 8), mat(0.60));
    neck.position.y = -0.20;
    stand.add(neck);

    // Horizontal clip arm
    const clipArm = edgesOf(new THREE.BoxGeometry(1.15, 0.09, 0.38),   mat(0.65));
    clipArm.position.y = -0.37;
    stand.add(clipArm);

    // Front grip tooth (hooks over monitor)
    const fg = edgesOf(new THREE.BoxGeometry(0.16, 0.24, 0.07),        mat(0.60));
    fg.position.set(0, -0.52, 0.22);
    stand.add(fg);

    // Back grip tooth
    const bg = edgesOf(new THREE.BoxGeometry(0.16, 0.24, 0.07),        mat(0.60));
    bg.position.set(0, -0.52, -0.22);
    stand.add(bg);

    // =================================================================
    // HEAD  (pans on Y — surveillance motion)
    // =================================================================
    const head = new THREE.Group();
    head.position.y = 0.38;   // sits above the hinge
    root.add(head);

    // ── Main body — short squat box (Logitech proportions ~2.8:1) ────
    head.add(edgesOf(new THREE.BoxGeometry(1.48, 0.52, 0.44, 4, 2, 2), mat(0.48)));

    // Left & right end-cap circles (give the rounded-edge feel)
    for (const xSide of [-0.74, 0.74]) {
      const cap = edgesOf(new THREE.CircleGeometry(0.26, 20),           dmat(0.28));
      cap.position.x = xSide;
      cap.rotation.y = xSide > 0 ? Math.PI / 2 : -Math.PI / 2;
      head.add(cap);
    }

    // ── Lens assembly (all at z = 0.22, the front face) ──────────────
    const FZ = 0.22;

    // Outer ring (the big lens bezel)
    const outerRing = edgesOf(new THREE.TorusGeometry(0.205, 0.040, 10, 40), mat(0.90));
    outerRing.position.z = FZ;
    head.add(outerRing);

    // Middle ring (focus ring groove)
    const midRing = edgesOf(new THREE.TorusGeometry(0.135, 0.028, 8, 32),   mat(0.85));
    midRing.position.z = FZ + 0.01;
    head.add(midRing);

    // Lens dome (a convex sphere protruding from front)
    const lensMesh = edgesOf(new THREE.SphereGeometry(0.105, 18, 12),        dmat(0.50));
    lensMesh.position.z = FZ + 0.07;
    head.add(lensMesh);

    // Iris (tiny filled circle — the pupil)
    const iris = edgesOf(new THREE.CircleGeometry(0.048, 18),                mat(1.00));
    iris.position.z = FZ + 0.14;
    head.add(iris);

    // Front bezel circle (ring flush with body)
    const bezel = edgesOf(new THREE.CircleGeometry(0.225, 32),               mat(0.60));
    bezel.position.z = FZ - 0.01;
    head.add(bezel);

    // ── LED indicator (right of lens) ─────────────────────────────────
    const led = edgesOf(new THREE.SphereGeometry(0.027, 6, 4),              mat(0.95));
    led.position.set(0.30, 0.01, FZ + 0.01);
    head.add(led);

    // ── Mic grille (2 small circles, left of lens) ────────────────────
    for (const [mx, my] of [[-0.30, 0], [-0.40, 0]]) {
      const mic = edgesOf(new THREE.CircleGeometry(0.022, 10),              dmat(0.38));
      mic.position.set(mx, my, FZ);
      head.add(mic);
    }

    // ── Bottom connector (head → hinge) ──────────────────────────────
    const hc = edgesOf(new THREE.CylinderGeometry(0.068, 0.068, 0.10, 10), mat(0.65));
    hc.position.y = -0.31;
    head.add(hc);

    // =================================================================
    // SURVEILLANCE ANIMATION STATE MACHINE
    // =================================================================
    // States:  0 = sweep L→R   1 = hold at R
    //          2 = sweep R→L   3 = hold at L
    const MAX_ANGLE = 0.78;   // ≈ 45°
    const SWEEP_DUR = 3.4;    // seconds per sweep
    const HOLD_DUR  = 2.2;    // seconds to hold at extreme

    let state  = 1;           // start: holding at right
    let stateT = 0;
    let prevT  = 0;

    head.rotation.y = MAX_ANGLE;

    // =================================================================
    // ANIMATION LOOP
    // =================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const dt = t - prevT;
      prevT = t;
      stateT += dt;

      switch (state) {
        case 0: {   // Sweep L → R
          const p = Math.min(stateT / SWEEP_DUR, 1);
          head.rotation.y = THREE.MathUtils.lerp(-MAX_ANGLE, MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 1; stateT = 0; }
          break;
        }
        case 1: {   // Hold at R
          head.rotation.y = MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 2; stateT = 0; }
          break;
        }
        case 2: {   // Sweep R → L
          const p = Math.min(stateT / SWEEP_DUR, 1);
          head.rotation.y = THREE.MathUtils.lerp(MAX_ANGLE, -MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 3; stateT = 0; }
          break;
        }
        case 3: {   // Hold at L
          head.rotation.y = -MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 0; stateT = 0; }
          break;
        }
      }

      // LED pulse (simulates "recording" activity)
      led.material.opacity = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 4.2));

      renderer.render(scene, cam);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
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
