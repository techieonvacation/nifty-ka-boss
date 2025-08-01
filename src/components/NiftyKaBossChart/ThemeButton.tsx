import { Moon, Sun } from "lucide-react";

interface ThemeButtonProps {
  className?: string;
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeButton({ className, isDark, onToggle }: ThemeButtonProps) {
  return (
    <div
      className={`flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 ${
        isDark ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-zinc-200"
      } ${className}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        {/* Left Icon (Theme Switcher Knob) */}
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300 ${
            isDark ? "translate-x-0 bg-zinc-800" : "translate-x-8 bg-gray-200"
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          )}
        </div>

        {/* Right Icon (Decorative Side) */}
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300 ${
            isDark ? "bg-transparent" : "-translate-x-8"
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
