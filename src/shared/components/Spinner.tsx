import { cn } from '../utils/cn';

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = 'h-4 w-4' }: SpinnerProps) => (
  <span
    aria-hidden
    className={cn(className, 'inline-block animate-spin rounded-full border-2 border-current border-r-transparent')}
  />
);
