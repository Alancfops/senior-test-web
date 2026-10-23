import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function IconGraduationCap({ className = 'size-4', ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10 12 5 2 10l10 5 10-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  );
}

export function IconCode({ className = 'size-4', ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

export function IconPalette({ className = 'size-4', ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22z"
      />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}
