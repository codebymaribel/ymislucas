export function GridPattern() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="dotGrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#dotGrid)" />

        <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </svg>
    </div>
  );
}
