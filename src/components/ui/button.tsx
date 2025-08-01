"use client";
// If you are using the Next.js App Router and need client-side interactivity

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Using cva() to define base styles + variants for your Button.
 */
const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center cursor-pointer whitespace-nowrap justify-center font-urbanist relative font-semibold rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none",
  {
    variants: {
      /**
       * variant: Different color themes or styles.
       */
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "before:absolute before:inset-0 before:translate-x-[-100%]",
          "before:bg-white/10 before:transition-transform before:duration-300",
          "hover:before:translate-x-0 hover:bg-primary/90",
          "active:scale-95",
          "focus-visible:ring-primary/50",
          "shadow-sm",
        ].join(" "),
        gradient: [
          "bg-gradient-to-r from-purple-500 to-green-500 text-white border-0 text-nowrap hover:from-purple-600 hover:to-green-600",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "before:absolute before:inset-0 before:translate-x-[-100%]",
          "before:bg-white/10 before:transition-transform before:duration-300",
          "hover:before:translate-x-0 hover:bg-secondary/90",
          "active:scale-95",
          "focus-visible:ring-secondary/50",
          "shadow-sm",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-primary",
          "hover:bg-primary/10 dark:hover:bg-primary/20",
          "focus-visible:ring-primary/50",
          "shadow-sm",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-primary/10 dark:hover:bg-primary/20",
          "focus-visible:ring-primary/50",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "focus-visible:ring-destructive/50",
          "shadow-sm",
        ].join(" "),
        success: [
          "bg-success text-white",
          "hover:bg-success/90",
          "focus-visible:ring-success/50",
          "shadow-sm",
        ].join(" "),
        warning: [
          "bg-warning text-white",
          "hover:bg-warning/90",
          "focus-visible:ring-warning/50",
          "shadow-sm",
        ].join(" "),
        info: [
          "bg-info text-white",
          "hover:bg-info/90",
          "focus-visible:ring-info/50",
          "shadow-sm",
        ].join(" "),
        link: [
          "text-primary underline-offset-4 hover:underline",
          "hover:text-primary/80",
        ].join(" "),
      },
      /**
       * size: Controls padding, height, and font-size.
       */
      size: {
        xs: "py-2 px-2 text-xs gap-1.5",
        sm: "py-2 px-3 text-sm gap-2",
        md: "py-3 px-4 text-sm gap-2",
        lg: "py-3 px-5 text-base gap-2.5",
        xl: "py-3 px-6 text-lg gap-3",
        icon: "h-9 w-9 p-0",
      },
      /**
       * fullWidth: Stretch button to full width if desired.
       */
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    /**
     * defaultVariants: If user doesn't specify a variant or size, we use these.
     */
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

/**
 * ButtonProps extends normal button properties + adds our cva "variant" props,
 * plus optional icons, loading state, and MotionProps for Framer Motion.
 */
interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
    VariantProps<typeof buttonVariants>,
    MotionProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * We'll wrap our <button> with Framer Motion's <motion.button>.
 * Using React.forwardRef so the parent can directly reference the DOM element.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      isLoading,
      children,
      disabled,
      // Framer Motion props
      whileHover,
      whileTap,
      initial,
      animate,
      exit,
      transition,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        // Merge CVA classes + any custom classes
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        // Default (or custom) Framer Motion animations
        whileHover={whileHover ?? { scale: 1.02 }}
        whileTap={whileTap ?? { scale: 0.98 }}
        transition={
          transition ?? {
            type: "spring",
            stiffness: 400,
            damping: 25,
          }
        }
        initial={initial}
        animate={animate}
        exit={exit}
        {...props}
      >
        {/* Spinner for loading state */}
        {isLoading && (
          <svg
            className="absolute left-1/2 -translate-x-1/2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Left icon (only if not loading) */}
        {leftIcon && !isLoading && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}

        {/* Main text */}
        <span
          className={cn("flex items-center gap-2", {
            "opacity-0": isLoading,
          })}
        >
          {children}
        </span>

        {/* Right icon */}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
