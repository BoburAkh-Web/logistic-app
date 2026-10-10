const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ArrowUpRight = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowRight = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

export const ArrowUp = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 20V4m-6 6 6-6 6 6" />
  </svg>
);

export const Check = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.25}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const Sun = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
  </svg>
);

export const Truck = ({ className = "size-6" }) => (
  <svg viewBox="0 0 48 28" className={className} aria-hidden>
    <rect x="1" y="3" width="28" height="17" rx="2.5" fill="currentColor" />
    <path d="M30 8h8.5a3 3 0 0 1 2.5 1.4l4.4 6.6c.4.6.6 1.2.6 1.9V20a1 1 0 0 1-1 1H30Z" fill="currentColor" />
    <path d="M33 10.5h5.2l3 4.5H33Z" fill="var(--bg)" opacity=".85" />
    <circle cx="9" cy="22" r="4" fill="var(--bg)" stroke="currentColor" strokeWidth="2.4" />
    <circle cx="38" cy="22" r="4" fill="var(--bg)" stroke="currentColor" strokeWidth="2.4" />
  </svg>
);

export const Spark = ({ className = "size-6" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 0c.5 6.4 5.6 11.5 12 12-6.4.5-11.5 5.6-12 12-.5-6.4-5.6-11.5-12-12C6.4 11.5 11.5 6.4 12 0Z" />
  </svg>
);
