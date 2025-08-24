"use client";

// A simple, elegant background component with soft, floating hearts.
export function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hearts"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M60 20 L75 5 L90 20 L60 50 L30 20 L45 5 Z"
              fill="rgba(236, 72, 153, 0.04)"
            />
            <path
              d="M10 70 L25 55 L40 70 L10 100 L-20 70 L-5 55 Z"
              fill="rgba(236, 72, 153, 0.03)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hearts)" />
      </svg>
    </div>
  );
}
