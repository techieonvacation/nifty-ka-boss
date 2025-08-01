// "use client";

// import { useEffect, useState } from "react";
// import { Sun, Moon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "@/lib/theme-provider";

// interface ThemeToggleProps {
//   variant?:
//     | "primary"
//     | "secondary"
//     | "outline"
//     | "ghost"
//     | "destructive"
//     | "success"
//     | "warning"
//     | "info"
//     | "link";
//   size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
//   className?: string;
//   showLabel?: boolean;
// }

// export function ThemeToggle({
//   variant = "ghost",
//   size = "icon",
//   className = "",
//   showLabel = false,
// }: ThemeToggleProps) {
//   const { theme, toggleTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <Button
//       variant={variant}
//       size={size}
//       onClick={toggleTheme}
//       className={className}
//       aria-label={
//         mounted
//           ? `Switch to ${theme === "light" ? "dark" : "light"} theme`
//           : "Toggle theme"
//       }
//       title={
//         mounted
//           ? `Current: ${theme} theme. Click to switch to ${
//               theme === "light" ? "dark" : "light"
//             } theme.`
//           : "Toggle between light and dark theme"
//       }
//     >
//       {!mounted ? (
//         <Moon className="h-4 w-4" />
//       ) : theme === "dark" ? (
//         <Sun className="h-4 w-4" />
//       ) : (
//         <Moon className="h-4 w-4" />
//       )}
//       {showLabel && mounted && (
//         <span className="ml-2">
//           {theme === "light" ? "Dark" : "Light"} Mode
//         </span>
//       )}
//     </Button>
//   );
// }

// export default ThemeToggle;
