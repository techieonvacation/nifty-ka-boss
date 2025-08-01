"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpFormProps {
  email: string;
  redirectUrl: string;
}

export default function OtpForm({ email, redirectUrl }: OtpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      toast.success("New verification code sent!");
      setTimeLeft(120);
      setCanResend(false);
    } catch (error) {
      console.error("Failed to send verification code:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<OtpFormData> = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      if (!response.ok) throw new Error("Invalid verification code");

      toast.success("Email verified successfully!");
      router.push(redirectUrl);
    } catch (error) {
      console.error("Failed to verify email:", error);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^[0-9]$/)) {
                    if (index < 5 && inputRefs.current[index + 1]) {
                      inputRefs.current[index + 1]?.focus();
                    }
                    const currentOtp = watch("otp") || "";
                    const newOtp = currentOtp.split("");
                    newOtp[index] = value;
                    setValue("otp", newOtp.join(""));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    index > 0 &&
                    !e.currentTarget.value
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-sm text-red-500 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          {canResend
            ? "Didn't receive the code?"
            : `Resend code in ${formatTime(timeLeft)}`}
        </p>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={!canResend || isLoading}
          className="text-primary hover:text-primary/80 disabled:text-gray-400 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Resend Code
        </button>
      </div>
    </div>
  );
}
