import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn('text-slate-600 dark:text-slate-300', className)}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};
