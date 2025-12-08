import { cn } from "@/lib/utils";

interface EdgeLogoProps {
  className?: string;
  size?: number;
}

export function EdgeLogo({ className, size = 32 }: EdgeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M10 10H22M10 16H18M10 22H22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
