import { useEffect, useRef } from "react";
import * as THREE from "three";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function WebcamScene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── CSS primary colour ────────────────────────────────────────────
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary").trim();
    const [hRaw, sRaw, lRaw] = raw.split(/\s+/);
    const primaryColor = new THREE.Color().setHSL(
      parseFloat(hRaw) / 360,
      parseFloat(sRaw) / 100,
      parseFloat(lRaw) / 100
    );
    const dimColor = new THREE.Color().setHSL(
      parseFloat(hRaw) / 360,
      parseFloat(sRaw) / 100 * 0.45,
      parseFloat(lRaw) / 100 * 0.50
    );

    const mat    = (op) => new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: op });
    const dmat   = (op) => new THREE.LineBasicMaterial({ color: dimColor,     transparent: true, opacity: op });
    const edgesOf = (geo, m) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), m);

    // ── Renderer ──────────────────────────────────────────────────────
    const w0 = el.clientWidth, h0 = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(34, w0 / h0, 0.1, 100);
    cam.position.set(0, 0.50, 5.5);
    cam.lookAt(0, 0.15, 0);

    const root = new THREE.Group();
    scene.add(root);

    // =================================================================
    //  STAND  —  servo U-bracket + pan-servo base  (never rotates)
    // =================================================================
    const stand = new THREE.Group();
    root.add(stand);

    // Left arm of U-bracket
    const leftArm = edgesOf(new THREE.BoxGeometry(0.065, 0.52, 0.11), mat(0.72));
    leftArm.position.set(-0.24, -0.42, 0);
    stand.add(leftArm);

    // Right arm of U-bracket
    const rightArm = edgesOf(new THREE.BoxGeometry(0.065, 0.52, 0.11), mat(0.72));
    rightArm.position.set( 0.24, -0.42, 0);
    stand.add(rightArm);

    // Bottom bar of U (connects both arms)
    const uBar = edgesOf(new THREE.BoxGeometry(0.57, 0.065, 0.11), mat(0.68));
    uBar.position.set(0, -0.685, 0);
    stand.add(uBar);

    // Pan servo body (flat box below the U-bracket)
    const servo = edgesOf(new THREE.BoxGeometry(0.68, 0.13, 0.36), mat(0.62));
    servo.position.set(0, -0.82, 0);
    stand.add(servo);

    // Servo horn (circle on top of servo)
    const hornRing = edgesOf(new THREE.TorusGeometry(0.072, 0.018, 6, 20), dmat(0.40));
    hornRing.position.set(0, -0.755, 0);
    hornRing.rotation.x = Math.PI / 2;
    stand.add(hornRing);

    // Screw holes in U-bracket arms (where camera tilt-axle goes)
    for (const x of [-0.24, 0.24]) {
      const hole = edgesOf(new THREE.CircleGeometry(0.028, 10), dmat(0.38));
      hole.position.set(x, -0.40, 0.058);
      stand.add(hole);
    }

    // Servo mounting screws (corners of servo body)
    for (const [sx, sz] of [[-0.26, 0.14], [0.26, 0.14], [-0.26, -0.14], [0.26, -0.14]]) {
      const sc = edgesOf(new THREE.CircleGeometry(0.018, 8), dmat(0.28));
      sc.position.set(sx, -0.755, sz);
      sc.rotation.x = Math.PI / 2;
      stand.add(sc);
    }

    // =================================================================
    //  HEAD  —  Logitech C270 body  (pans on Y)
    // =================================================================
    const head = new THREE.Group();
    head.position.y = 0.28;
    root.add(head);

    // ── 1. Pill body (CapsuleGeometry horizontal) ─────────────────────
    //  Real C270: ~95 mm wide × 40 mm tall  →  ratio ≈ 2.4 : 1
    //  CapsuleGeometry(radius, length, capSegs, radialSegs)
    //  radius=0.25, length=0.94  →  total width=1.44, height=0.50
    const bodyGeo  = new THREE.CapsuleGeometry(0.25, 0.94, 5, 14);
    const bodyMesh = edgesOf(bodyGeo, mat(0.46));
    bodyMesh.rotation.z = Math.PI / 2;
    head.add(bodyMesh);

    // ── 2. Lens (left-of-centre, front face at z ≈ 0.25) ─────────────
    const LX = -0.20;
    const LZ =  0.250;

    // Outer lens ring / bezel
    const outerRing = edgesOf(new THREE.TorusGeometry(0.175, 0.038, 10, 40), mat(0.92));
    outerRing.position.set(LX, 0, LZ);
    head.add(outerRing);

    // Inner focus ring
    const innerRing = edgesOf(new THREE.TorusGeometry(0.108, 0.024, 8, 30), mat(0.88));
    innerRing.position.set(LX, 0, LZ + 0.012);
    head.add(innerRing);

    // Glass dome (convex element)
    const dome = edgesOf(new THREE.SphereGeometry(0.093, 16, 12), dmat(0.44));
    dome.position.set(LX, 0, LZ + 0.062);
    head.add(dome);

    // Iris / pupil
    const iris = edgesOf(new THREE.CircleGeometry(0.040, 18), mat(1.0));
    iris.position.set(LX, 0, LZ + 0.140);
    head.add(iris);

    // ── 3. Mic / speaker grille (right of centre) ─────────────────────
    //  C270 has a rectangular grid of holes on the right side
    const GX = 0.285, GZ = LZ + 0.003;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const dot = edgesOf(new THREE.CircleGeometry(0.013, 7), dmat(0.44));
        dot.position.set(GX + (c - 1.5) * 0.046, (r - 1) * 0.046, GZ);
        head.add(dot);
      }
    }
    // Grille border rect
    const gBorder = edgesOf(new THREE.PlaneGeometry(0.22, 0.14), dmat(0.28));
    gBorder.position.set(GX, 0, GZ - 0.001);
    head.add(gBorder);

    // ── 4. LED indicator (between lens and grille) ────────────────────
    const led = edgesOf(new THREE.SphereGeometry(0.020, 6, 4), mat(0.95));
    led.position.set(0.055, 0, LZ + 0.002);
    head.add(led);

    // ── 5. Tilt-axle pins on left + right sides of body ───────────────
    //  (the small cylindrical axle that connects into the U-bracket)
    for (const x of [-0.73, 0.73]) {
      const axle = edgesOf(new THREE.CylinderGeometry(0.032, 0.032, 0.08, 8), mat(0.65));
      axle.rotation.z = Math.PI / 2;
      axle.position.set(x, 0, 0);
      head.add(axle);
    }

    // =================================================================
    //  SURVEILLANCE PAN — faster sweep, shorter pause
    //  0=sweep L→R  1=hold R  2=sweep R→L  3=hold L
    // =================================================================
    const MAX_ANGLE = 0.82;   // ~47°
    const SWEEP_DUR = 1.8;    // seconds per sweep  (was 3.2)
    const HOLD_DUR  = 0.7;    // seconds to hold    (was 2.0)

    let state  = 1;
    let stateT = 0;
    let prevT  = 0;
    head.rotation.y = MAX_ANGLE;

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const dt = t - prevT;
      prevT    = t;
      stateT  += dt;

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

      // LED recording blink
      led.material.opacity = 0.30 + 0.70 * (0.5 + 0.5 * Math.sin(t * 3.8));

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
