import type { SVGProps } from 'react';

export function ApexLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1.5em"
      height="1.5em"
      {...props}
    >
      <path
        fill="hsl(var(--primary))"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
      />
      <path
        fill="hsl(var(--primary))"
        d="m168.59 152.59l-35.1 35.09a12 12 0 0 1-17 0l-35.09-35.09a12 12 0 0 1 8.5-20.59H92V96a12 12 0 0 1 12-12h48a12 12 0 0 1 12 12v36h12.09a12 12 0 0 1 8.5 20.59Z"
        opacity="0.3"
      />
      <path
        fill="hsl(var(--primary))"
        d="M164 96a12 12 0 0 0-12 12v36h12.09a12 12 0 0 0 8.5-20.59l-8.5-8.5a12 12 0 0 0-10.09-4.91Z"
      />
    </svg>
  );
}
