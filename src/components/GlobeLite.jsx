// CSS/SVG stand-in for the WebGL globe: same composition (dotted sphere, routes fanning
// out of Wheeling, IL), a few KB instead of three.js. Used on phones, tablets and
// low-power machines, and as the placeholder while the WebGL globe loads on desktop.

const HUB = [42.14, -87.93];
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
];
const TILT = 0.5; // matches the WebGL globe's x-rotation
const R = 49.5;

// Orthographic projection of lat/lon onto the 100×100 viewBox.
function project([lat, lon]) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  const yt = y * Math.cos(TILT) - z * Math.sin(TILT);
  return [50 + R * x, 50 - R * yt];
}

const hub = project(HUB);
const ROUTES = CITIES.map((city) => {
  const [x, y] = project(city);
  const mx = (hub[0] + x) / 2;
  const my = (hub[1] + y) / 2;
  const span = Math.hypot(x - hub[0], y - hub[1]);
  const vx = mx - 50;
  const vy = my - 50;
  const len = Math.hypot(vx, vy) || 1;
  // Bow each arc outward, away from the sphere's centre, like a great-circle flight path.
  const cx = mx + (vx / len) * span * 0.35;
  const cy = my + (vy / len) * span * 0.35 - span * 0.12;
  const f = (n) => n.toFixed(2);
  return { x, y, d: `M${f(hub[0])} ${f(hub[1])} Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}` };
});

// Pulses sit on the hub and a few destinations. They're HTML (not SVG) so their
// transform/opacity animation runs on the compositor; the SVG itself never repaints.
const PULSES = [hub, ...[1, 3, 4].map((i) => [ROUTES[i].x, ROUTES[i].y])];

export default function GlobeLite({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <div className="globe-lite absolute inset-[0.5%] rounded-full" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible text-brand dark:text-brand-400">
        {ROUTES.map((r, i) => (
          <g key={i}>
            <path d={r.d} fill="none" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" opacity="0.55" />
            <circle cx={r.x} cy={r.y} r="0.7" fill="currentColor" />
          </g>
        ))}
        <circle cx={hub[0]} cy={hub[1]} r="1.2" fill="currentColor" />
      </svg>
      {PULSES.map(([x, y], i) => (
        <span
          key={i}
          className="absolute -translate-1/2"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <span
            className={`animate-ping-slow block rounded-full border border-brand dark:border-brand-400 ${i === 0 ? "size-4" : "size-2.5"}`}
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        </span>
      ))}
    </div>
  );
}
