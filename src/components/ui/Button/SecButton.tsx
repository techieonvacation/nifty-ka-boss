"use client";
import { LuMessageCircle } from "react-icons/lu";

export default function Button({
  title = "Book Now",
  Icon = LuMessageCircle,
  className = "",
  onClick = () => {},
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-primary flex items-center gap-2 rounded-full px-5.5 py-3.5 text-lg font-semibold text-primary-foreground transition hover:-rotate-3 ${className}`}
    >
      <Icon className="size-6" />
      {title}
    </button>
  );
}
