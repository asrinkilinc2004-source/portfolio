import { useEffect, useRef } from "react";
import * as THREE from "three";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * 3D wireframe eye — blueprint/sketch style.
 * Eyelids are static; the EYEBALL rotates on Y (pupil tracks left/right).
 * CCTV surveillance timing: 1.8s sweep, 0.7s hold.
 */
export default function WebcamScene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Theme-aware colour system ─────────────────────────────────────
    // All created materials are tracked so they can be updated live
    // when the user switches between dark and light mode.
    const allMaterials = []; // { m: LineBasicMaterial, baseOp, isPrimary }

    const readThemeColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const boost  = isDark ? 1.0 : 1.55;
      const raw    = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary").trim();
      const [hRaw, sRaw, lRaw] = raw.split(/\s+/);
      const h = parseFloat(hRaw) / 360;
      const s = parseFloat(sRaw) / 100;
      const l = parseFloat(lRaw) / 100;
      return {
        primary: new THREE.Color().setHSL(h, s, l),
        dim:     new THREE.Color().setHSL(h, s * 0.50, l * 0.52),
        boost,
      };
    };

    const applyTheme = () => {
      const { primary, dim, boost } = readThemeColors();
      for (const { m, baseOp, isPrimary } of allMaterials) {
        m.color.copy(isPrimary ? primary : dim);
        m.opacity    = Math.min(baseOp * boost, 1.0);
        m.needsUpdate = true;
      }
    };

    // Factory functions — register every material for live updates
    const mat = (op) => {
      const m = new THREE.LineBasicMaterial({ transparent: true, opacity: op });
      allMaterials.push({ m, baseOp: op, isPrimary: true });
      return m;
    };
    const dmat = (op) => {
      const m = new THREE.LineBasicMaterial({ transparent: true, opacity: op });
      allMaterials.push({ m, baseOp: op, isPrimary: false });
      return m;
    };

    // Watch <html class="..."> for dark/light switches
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true, attributeFilter: ["class"],
    });
    const edgesOf = (geo, m) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), m);
    const line = (pts, m) => new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts), m
    );

    // ── Renderer ──────────────────────────────────────────────────────
    const w0 = el.clientWidth, h0 = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(34, w0 / h0, 0.1, 100);
    cam.position.set(0, 0.08, 4.8);
    cam.lookAt(0, 0, 0);

    const root = new THREE.Group();
    scene.add(root);

    // =================================================================
    //  EYEBALL  (rotates on Y — iris/pupil track left & right)
    // =================================================================
    const eyeball = new THREE.Group();
    root.add(eyeball);

    // ── Sclera (the full white sphere) ────────────────────────────────
    eyeball.add(edgesOf(
      new THREE.SphereGeometry(0.52, 22, 16),
      mat(0.28)
    ));

    // ── Iris outer ring ───────────────────────────────────────────────
    const irisOuter = edgesOf(
      new THREE.TorusGeometry(0.230, 0.048, 10, 44),
      mat(0.95)
    );
    irisOuter.position.z = 0.42;
    eyeball.add(irisOuter);

    // ── Iris middle ring ──────────────────────────────────────────────
    const irisMid = edgesOf(
      new THREE.TorusGeometry(0.148, 0.030, 8, 32),
      mat(0.88)
    );
    irisMid.position.z = 0.43;
    eyeball.add(irisMid);

    // ── Iris radial texture lines (10 spokes) ─────────────────────────
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      eyeball.add(line([
        new THREE.Vector3(Math.cos(a) * 0.10, Math.sin(a) * 0.10, 0.44),
        new THREE.Vector3(Math.cos(a) * 0.21, Math.sin(a) * 0.21, 0.43),
      ], dmat(0.28)));
    }

    // ── Pupil ─────────────────────────────────────────────────────────
    const pupil = edgesOf(new THREE.CircleGeometry(0.092, 22), mat(1.0));
    pupil.position.z = 0.455;
    eyeball.add(pupil);

    // ── Specular highlight (tiny circle offset from centre) ───────────
    const spec = edgesOf(new THREE.CircleGeometry(0.026, 10), mat(0.55));
    spec.position.set(0.055, 0.058, 0.46);
    eyeball.add(spec);

    // ── Cornea dome (subtle convex bulge over iris) ───────────────────
    const cornea = edgesOf(
      new THREE.SphereGeometry(0.185, 14, 10),
      dmat(0.20)
    );
    cornea.position.z = 0.38;
    eyeball.add(cornea);

    // =================================================================
    //  EYELIDS  (completely static — never move)
    // =================================================================
    const eyelids = new THREE.Group();
    root.add(eyelids);

    // Upper eyelid — primary bold curve
    const upperCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.58,  0.00, 0.28),
      new THREE.Vector3(-0.30,  0.26, 0.34),
      new THREE.Vector3( 0.00,  0.36, 0.35),
      new THREE.Vector3( 0.28,  0.28, 0.34),
      new THREE.Vector3( 0.58,  0.00, 0.28),
    ]);
    eyelids.add(line(upperCurve.getPoints(54), mat(0.94)));

    // Upper eyelid — inner shadow line (slightly inside)
    const upperCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.54,  0.00, 0.28),
      new THREE.Vector3(-0.27,  0.21, 0.33),
      new THREE.Vector3( 0.00,  0.30, 0.34),
      new THREE.Vector3( 0.27,  0.22, 0.33),
      new THREE.Vector3( 0.54,  0.00, 0.28),
    ]);
    eyelids.add(line(upperCurve2.getPoints(48), mat(0.50)));

    // Lower eyelid curve (less arched than upper — asymmetric like real eye)
    const lowerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.58,  0.00, 0.28),
      new THREE.Vector3(-0.22, -0.17, 0.32),
      new THREE.Vector3( 0.08, -0.24, 0.33),
      new THREE.Vector3( 0.34, -0.15, 0.32),
      new THREE.Vector3( 0.58,  0.00, 0.28),
    ]);
    eyelids.add(line(lowerCurve.getPoints(48), mat(0.82)));

    // ── Eyelashes (8 short lines radiating from upper lid) ────────────
    const lashT    = [0.10, 0.20, 0.30, 0.42, 0.53, 0.65, 0.75, 0.85];
    const lashLen  = [0.075, 0.095, 0.10, 0.105, 0.10, 0.095, 0.085, 0.070];
    for (let i = 0; i < lashT.length; i++) {
      const pt   = upperCurve.getPointAt(lashT[i]);
      const tang = upperCurve.getTangentAt(lashT[i]);
      // outward normal (perpendicular to tangent, pointing upward)
      const normal = new THREE.Vector3(-tang.y, tang.x, 0).normalize();
      const end = pt.clone().addScaledVector(normal, lashLen[i]);
      eyelids.add(line([pt, end], dmat(0.38)));
    }

    // ── Eye corners (tiny dots where lids meet) ───────────────────────
    for (const cx of [-0.58, 0.58]) {
      const dot = edgesOf(new THREE.SphereGeometry(0.018, 5, 4), mat(0.65));
      dot.position.set(cx, 0, 0.28);
      eyelids.add(dot);
    }

    // ── Brow (subtle arc above the eye) ──────────────────────────────
    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.52,  0.50, 0.22),
      new THREE.Vector3(-0.15,  0.60, 0.24),
      new THREE.Vector3( 0.18,  0.58, 0.24),
      new THREE.Vector3( 0.50,  0.46, 0.22),
    ]);
    eyelids.add(line(browCurve.getPoints(36), dmat(0.30)));

    // Apply initial colours — must run AFTER all mat()/dmat() calls above
    applyTheme();

    // =================================================================
    //  SURVEILLANCE EYE — state machine (eyeball only rotates)
    //  0=sweep L→R  1=hold R  2=sweep R→L  3=hold L
    // =================================================================
    const MAX_ANGLE = 0.62;   // max Y rotation — keeps iris within visible area
    const SWEEP_DUR = 1.8;
    const HOLD_DUR  = 0.7;

    let state  = 1;
    let stateT = 0;
    let prevT  = 0;
    eyeball.rotation.y = MAX_ANGLE;

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
          eyeball.rotation.y = THREE.MathUtils.lerp(-MAX_ANGLE, MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 1; stateT = 0; }
          break;
        }
        case 1: {
          eyeball.rotation.y = MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 2; stateT = 0; }
          break;
        }
        case 2: {
          const p = Math.min(stateT / SWEEP_DUR, 1);
          eyeball.rotation.y = THREE.MathUtils.lerp(MAX_ANGLE, -MAX_ANGLE, easeInOutCubic(p));
          if (p >= 1) { state = 3; stateT = 0; }
          break;
        }
        case 3: {
          eyeball.rotation.y = -MAX_ANGLE;
          if (stateT >= HOLD_DUR) { state = 0; stateT = 0; }
          break;
        }
      }

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
      themeObserver.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
