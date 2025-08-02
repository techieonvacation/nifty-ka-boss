import { Moon, Sun } from "lucide-react";

interface ThemeButtonProps {
  className?: string;
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeButton({ className, isDark, onToggle }: ThemeButtonProps) {
  return (
    <div
      className={`flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
        isDark 
          ? "bg-gray-900 border border-gray-700 shadow-gray-900/50" 
          : "bg-white border border-gray-300 shadow-gray-200/50"
      } ${className}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        {/* Left Icon (Theme Switcher Knob) */}
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${
            isDark 
              ? "translate-x-8 bg-gray-700 text-white" 
              : "translate-x-0 bg-gray-100 text-gray-700"
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-white" strokeWidth={2} />
          ) : (
            <Moon className="w-4 h-4 text-gray-700" strokeWidth={2} />
          )}
        </div>

        {/* Right Icon (Decorative Side) */}
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300 ${
            isDark ? "-translate-x-8" : "bg-transparent"
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  ); 
}
