import { useEffect, useRef } from "react";
import * as THREE from "three";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Logitech C270-style wireframe webcam.
 * - Rounded pill body (CapsuleGeometry, horizontal)
 * - Large lens on the LEFT side of front face
 * - Speaker/mic dot-grid on the RIGHT
 * - Servo pan-tilt bracket as stand (static)
 * - Only the HEAD pans (CCTV surveillance motion)
 */
export default function WebcamScene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── CSS primary colour ────────────────────────────────────────────
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary").trim();           // "174 100% 50%"
    const [hRaw, sRaw, lRaw] = raw.split(/\s+/);
    const hh = parseFloat(hRaw) / 360;
    const ss = parseFloat(sRaw) / 100;
    const ll = parseFloat(lRaw) / 100;
    const primaryColor = new THREE.Color().setHSL(hh, ss, ll);
    const dimColor     = new THREE.Color().setHSL(hh, ss * 0.5, ll * 0.5);

    const mat  = (op) => new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: op });
    const dmat = (op) => new THREE.LineBasicMaterial({ color: dimColor,     transparent: true, opacity: op });
    const edgesOf = (geo, m) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), m);

    // ── Renderer & scene ──────────────────────────────────────────────
    const w0 = el.clientWidth, h0 = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(36, w0 / h0, 0.1, 100);
    cam.position.set(0, 0.55, 5.2);
    cam.lookAt(0, 0.2, 0);

    const root = new THREE.Group();
    scene.add(root);

    // =================================================================
    //  STAND — servo pan-tilt bracket style (never rotates)
    // =================================================================
    const stand = new THREE.Group();
    root.add(stand);

    // Thin vertical bracket arm
    const armGeo = new THREE.BoxGeometry(0.12, 0.60, 0.09);
    const arm = edgesOf(armGeo, mat(0.72));
    arm.position.y = -0.52;
    stand.add(arm);

    // Top horizontal crossbar (connects bracket to camera base)
    const topBarGeo = new THREE.BoxGeometry(0.42, 0.065, 0.09);
    const topBar = edgesOf(topBarGeo, mat(0.68));
    topBar.position.y = -0.225;
    stand.add(topBar);

    // Bottom horizontal crossbar
    const botBarGeo = new THREE.BoxGeometry(0.42, 0.065, 0.09);
    const botBar = edgesOf(botBarGeo, mat(0.65));
    botBar.position.y = -0.82;
    stand.add(botBar);

    // Bracket screw holes (tiny circles on sides of arm)
    for (const [x, y] of [[-0.22, -0.38], [0.22, -0.38], [-0.22, -0.66], [0.22, -0.66]]) {
      const sh = edgesOf(new THREE.CircleGeometry(0.028, 8), dmat(0.32));
      sh.position.set(x, y, 0.05);
      stand.add(sh);
    }

    // =================================================================
    //  HEAD — Logitech pill body (rotates Y on surveillance pan)
    // =================================================================
    const head = new THREE.Group();
    head.position.y = 0.30;
    root.add(head);

    // ── 1. Pill / capsule body ────────────────────────────────────────
    // CapsuleGeometry(radius, length, capSegments, radialSegments)
    // Low segment counts keep the wireframe clean / sketch-like
    const bodyGeo = new THREE.CapsuleGeometry(0.265, 0.90, 5, 14);
    const bodyMesh = edgesOf(bodyGeo, mat(0.48));
    bodyMesh.rotation.z = Math.PI / 2;  // lay it horizontal
    head.add(bodyMesh);

    // Front face of pill (the Z-forward face of the body)
    // Approximated as a stadium-shaped line (ellipse is close enough)
    const FACE_Z = 0.266;   // front face of body
    const facePoints = [];
    const W = 0.71, H = 0.265;   // half-width, half-height of front face
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      // Stadium shape: box + semicircles
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const x = W * cosA;
      const y = H * sinA;
      facePoints.push(new THREE.Vector3(x, y, 0));
    }
    const faceLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(facePoints),
      mat(0.30)
    );
    faceLine.position.z = FACE_Z;
    head.add(faceLine);

    // ── 2. Lens assembly — LEFT of centre ────────────────────────────
    const LX = -0.25;   // horizontal offset (left)
    const LZ = FACE_Z;

    // Outer bezel ring (thick ring around lens housing)
    const bezelGeo = new THREE.TorusGeometry(0.190, 0.040, 10, 44);
    const bezel = edgesOf(bezelGeo, mat(0.90));
    bezel.position.set(LX, 0, LZ);
    head.add(bezel);

    // Second ring (inner focusing groove)
    const groove = edgesOf(new THREE.TorusGeometry(0.122, 0.026, 8, 32), mat(0.85));
    groove.position.set(LX, 0, LZ + 0.015);
    head.add(groove);

    // Glass dome (convex lens element)
    const dome = edgesOf(new THREE.SphereGeometry(0.098, 16, 12), dmat(0.45));
    dome.position.set(LX, 0, LZ + 0.068);
    head.add(dome);

    // Iris (dark circle in centre of lens)
    const iris = edgesOf(new THREE.CircleGeometry(0.042, 20), mat(1.0));
    iris.position.set(LX, 0, LZ + 0.145);
    head.add(iris);

    // ── 3. Mic / speaker grille — RIGHT side ─────────────────────────
    // 3 × 4 dot grid (like the Logitech grille holes)
    const GX = 0.275, GZ = FACE_Z + 0.005;
    const COLS = 4, ROWS = 3, SPACING = 0.044;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dot = edgesOf(new THREE.CircleGeometry(0.013, 7), dmat(0.42));
        dot.position.set(
          GX + (c - (COLS - 1) / 2) * SPACING,
          (r - (ROWS - 1) / 2) * SPACING,
          GZ
        );
        head.add(dot);
      }
    }
    // Grille outline rectangle
    const gOutline = edgesOf(
      new THREE.PlaneGeometry(COLS * SPACING + 0.03, ROWS * SPACING + 0.03),
      dmat(0.30)
    );
    gOutline.position.set(GX, 0, GZ - 0.001);
    head.add(gOutline);

    // ── 4. LED indicator (between lens and grille) ────────────────────
    const led = edgesOf(new THREE.SphereGeometry(0.022, 6, 4), mat(0.95));
    led.position.set(0.04, 0.005, LZ + 0.005);
    head.add(led);

    // ── 5. Top ridge / grip bump ──────────────────────────────────────
    const ridge = edgesOf(
      new THREE.BoxGeometry(0.80, 0.055, 0.05),
      dmat(0.22)
    );
    ridge.position.set(0, 0.268, 0.12);
    head.add(ridge);

    // ── 6. Bottom pin (connects head to bracket) ──────────────────────
    const pin = edgesOf(new THREE.CylinderGeometry(0.055, 0.055, 0.11, 10), mat(0.65));
    pin.position.y = -0.275;
    head.add(pin);

    // =================================================================
    //  SURVEILLANCE PAN ANIMATION
    //  0=sweep L→R  1=hold R  2=sweep R→L  3=hold L
    // =================================================================
    const MAX_ANGLE = 0.75;
    const SWEEP_DUR = 3.2;
    const HOLD_DUR  = 2.0;

    let state  = 1;           // start holding right
    let stateT = 0;
    let prevT  = 0;
    head.rotation.y = MAX_ANGLE;

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const dt = t - prevT;
      prevT = t;
      stateT += dt;

      switch (state) {
        case 0: {
          const p = Math.min(stateT / SWEEP_DUR, 1);
          head.rotation.y = THREE.MathUtils.lerp(-MAX_ANGLE, MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 1; stateT = 0; }
          break;
        }
        case 1: {
          head.rotation.y = MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 2; stateT = 0; }
          break;
        }
        case 2: {
          const p = Math.min(stateT / SWEEP_DUR, 1);
          head.rotation.y = THREE.MathUtils.lerp(MAX_ANGLE, -MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 3; stateT = 0; }
          break;
        }
        case 3: {
          head.rotation.y = -MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 0; stateT = 0; }
          break;
        }
      }

      // LED pulse — simulates "recording" indicator
      led.material.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 4.0));

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
