import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RADIUS = 1;
const HUB = [42.14, -87.93]; // Wheeling, IL
const CITIES = [
  [34.05, -118.24], // Los Angeles
  [40.71, -74.0], // New York
  [43.65, -79.38], // Toronto
  [49.28, -123.12], // Vancouver
  [19.43, -99.13], // Mexico City
  [25.76, -80.19], // Miami
  [32.78, -96.8], // Dallas
  [47.6, -122.33], // Seattle
  [45.5, -73.57], // Montreal
  [25.68, -100.31], // Monterrey
  [39.74, -104.99], // Denver
  [33.75, -84.39], // Atlanta
  [51.05, -114.07], // Calgary
  [29.76, -95.37], // Houston
];

function latLonToVec(lat, lon, r = RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function DotSphere({ color, count }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      positions.set([Math.cos(th) * rad, y, Math.sin(th) * rad], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  return (
    <>
      {/* depth-only occluder hides the far hemisphere's dots */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[RADIUS * 0.985, 32, 32]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>
      <points geometry={geometry}>
        <pointsMaterial
          color={color}
          size={0.011}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
    </>
  );
}

const atmosphereShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uStrength;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float rim = 1.0 - max(dot(vNormal, vView), 0.0);
      float a = pow(rim, 2.6) * uStrength;
      gl_FragColor = vec4(uColor, a);
    }
  `,
};

function Atmosphere({ color, strength }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uStrength.value = strength;
  }, [color, strength, uniforms]);

  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[RADIUS, 48, 48]} />
      <shaderMaterial
        {...atmosphereShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

const SEGMENTS = 48;
const RADIAL = 4;

/** A route that draws itself from the hub, then retracts, with a glowing head. */
function Route({ to, color, offset, speed }) {
  const { curve, trail, base } = useMemo(() => {
    const a = latLonToVec(...HUB).normalize();
    const b = latLonToVec(...to).normalize();
    const angle = a.angleTo(b);
    const lift = 0.06 + angle * 0.45;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const p = new THREE.Vector3()
        .copy(a)
        .multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle))
        .add(b.clone().multiplyScalar(Math.sin(t * angle) / Math.sin(angle)))
        .multiplyScalar(RADIUS * (1 + lift * Math.sin(Math.PI * t)));
      pts.push(p);
    }
    const c = new THREE.CatmullRomCurve3(pts);
    return {
      curve: c,
      trail: new THREE.TubeGeometry(c, SEGMENTS, 0.0045, RADIAL, false),
      base: new THREE.TubeGeometry(c, SEGMENTS, 0.0018, RADIAL, false),
    };
  }, [to]);

  const trailRef = useRef();
  const headRef = useRef();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const cycle = 4.2;
    const t = (((clock.elapsedTime * speed + offset) % cycle) + cycle) % cycle / cycle;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    let start = 0;
    let end = 0;
    if (t < 0.5) end = ease(t / 0.5);
    else if (t < 0.8) {
      start = ease((t - 0.5) / 0.3);
      end = 1;
    } else {
      start = 1;
      end = 1;
    }
    const per = RADIAL * 6;
    const s = Math.floor(start * SEGMENTS) * per;
    const e = Math.ceil(end * SEGMENTS) * per;
    trailRef.current.geometry.setDrawRange(s, Math.max(0, e - s));

    const head = headRef.current;
    head.visible = t < 0.5;
    if (head.visible) {
      curve.getPointAt(Math.min(end, 0.999), tmp);
      head.position.copy(tmp);
    }
  });

  return (
    <group>
      <mesh geometry={base}>
        <meshBasicMaterial color={color} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh ref={trailRef} geometry={trail}>
        <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.014, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Marker({ lat, lon, color, size = 1, phase = 0 }) {
  const ring = useRef();
  const position = useMemo(() => latLonToVec(lat, lon, RADIUS * 1.002), [lat, lon]);
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize()
      ),
    [position]
  );

  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime + phase) % 2.2) / 2.2;
    ring.current.scale.setScalar(1 + t * 3.2);
    ring.current.material.opacity = (1 - t) * 0.8;
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[0.012 * size, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.014 * size, 0.019 * size, 20]} />
        <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene({ dark, pointer, lowPower }) {
  const group = useRef();
  const cities = lowPower ? CITIES.slice(0, 6) : CITIES.slice(0, 10);
  const dotColor = dark ? "#F8F7F4" : "#0A0C11";
  const routeColor = dark ? "#3D7BFF" : "#0057FF";

  useFrame(({ clock }, delta) => {
    const g = group.current;
    const t = clock.elapsedTime;
    // Keep North America facing the camera; sway gently and follow the pointer.
    const targetY = Math.sin(t * 0.18) * 0.28 + pointer.current.x * 0.35;
    const targetX = 0.5 + pointer.current.y * 0.18;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.2, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.2, delta);
  });

  return (
    <group ref={group} rotation={[0.5, 0, 0]}>
      <DotSphere color={dotColor} count={lowPower ? 1600 : 2800} />
      <Atmosphere color={routeColor} strength={dark ? 0.9 : 0.55} />
      {cities.map((c, i) => (
        <Route key={i} to={c} color={routeColor} offset={i * 0.61} speed={0.85 + (i % 3) * 0.12} />
      ))}
      <Marker lat={HUB[0]} lon={HUB[1]} color={routeColor} size={1.8} />
      {cities.map((c, i) => (
        <Marker key={i} lat={c[0]} lon={c[1]} color={routeColor} phase={i * 0.37} />
      ))}
    </group>
  );
}

class GlobeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const isLowPower = () =>
  window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches ||
  (navigator.hardwareConcurrency ?? 8) <= 4 ||
  (navigator.deviceMemory ?? 8) <= 4;

export default function Globe({ dark, className = "", onReady }) {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [lowPower] = useState(isLowPower);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrap.current);
    // Pause rendering in background tabs.
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <GlobeBoundary>
        <Canvas
          camera={{ position: [0, 0, 3.1], fov: 38 }}
          // The canvas is huge; capping DPR is the single biggest GPU saving.
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 1.25)}
          gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
          frameloop={visible ? "always" : "never"}
          onCreated={() => onReady?.()}
          // Don't re-measure on scroll: the wrapper moves with parallax, which made R3F
          // call setSize (reallocating the WebGL buffer) on every scroll frame.
          resize={{ scroll: false, debounce: { scroll: 0, resize: 200 } }}
          style={{ pointerEvents: "none" }}
        >
          <Scene dark={dark} pointer={pointer} lowPower={lowPower} />
        </Canvas>
      </GlobeBoundary>
    </div>
  );
}
