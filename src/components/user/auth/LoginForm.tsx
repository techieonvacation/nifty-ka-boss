"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Lock, ArrowRight, Star } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

// --- Validation schemas ---
const emailLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
const phoneSchema = z.object({
  phone: z.string().regex(/^\d{10,15}$/, "Enter a valid phone number"),
});
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailLoginData = z.infer<typeof emailLoginSchema>;
type PhoneData = z.infer<typeof phoneSchema>;
type OtpData = z.infer<typeof otpSchema>;

export default function LoginForm() {
  const router = useRouter();
  useSession();
  // State for phone/OTP login
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when OTP is shown
  useEffect(() => {
    if (showOTP) {
      setResendTimer(60);
      setCanResend(false);
    }
  }, [showOTP]);

  // Timer countdown
  useEffect(() => {
    if (showOTP && resendTimer > 0) {
      resendIntervalRef.current = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
    } else if (showOTP && resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (resendIntervalRef.current) clearTimeout(resendIntervalRef.current);
    };
  }, [resendTimer, showOTP]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to resend OTP");
        return;
      }
      setSuccess(result.message || "OTP resent to your phone");
      setResendTimer(60);
      setCanResend(false);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Email/password form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailLoginData>({
    resolver: zodResolver(emailLoginSchema),
  });

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneData>({
    resolver: zodResolver(phoneSchema),
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
  });

  // Handle email/password login
  const onEmailLogin = async (data: EmailLoginData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res?.error) {
        setError(res.error || "Login failed");
        setLoading(false);
        return;
      }
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle phone number submit (send OTP)
  const onPhoneSubmit = async (data: PhoneData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to send OTP");
        return;
      }
      setSuccess("OTP sent to your phone");
      setPhoneNumber(data.phone);
      setShowOTP(true);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification (phone login)
  const onOtpSubmit = async (data: OtpData) => {
    setOtpLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phoneNumber,
        otp: data.otp,
      });
      if (res?.error) {
        setError(res.error || "OTP verification failed");
        setOtpLoading(false);
        return;
      }
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      setError("OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <Card>
        <CardHeader className="text-center pb-6 border-b border-border">
          <CardTitle className="text-2xl text-foreground mb-2 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-foreground" />
            Premium Access
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Continue your premium trading experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="text-destructive text-center mb-2">{error}</div>
          )}
          {success && (
            <div className="text-accent text-center mb-2">{success}</div>
          )}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background border border-border">
              <TabsTrigger
                value="email"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:border-accent-foreground"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:border-accent-foreground"
              >
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email/Password Login */}
            <TabsContent value="email" className="space-y-5 mt-6">
              <form
                className="space-y-5"
                onSubmit={handleEmailSubmit(onEmailLogin)}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...registerEmail("email")}
                      className="pl-10"
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="text-red-400 text-xs">
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerEmail("password")}
                      className="pl-10"
                    />
                  </div>
                  {emailErrors.password && (
                    <p className="text-destructive text-xs">
                      {emailErrors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-accent hover:text-accent-hover font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Access Premium Dashboard"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Phone/OTP Login */}
            <TabsContent value="phone" className="space-y-5 mt-6">
              {!showOTP ? (
                <form
                  className="space-y-5"
                  onSubmit={handlePhoneSubmit(onPhoneSubmit)}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-foreground font-medium"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10 digit mobile number"
                        {...registerPhone("phone")}
                        className="pl-10"
                      />
                    </div>
                    {phoneErrors.phone && (
                      <p className="text-destructive text-xs">
                        {phoneErrors.phone.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Premium Code"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={handleOtpSubmit(onOtpSubmit)}
                >
                  <div className="text-center p-4 bg-background border border-border">
                    <p className="text-muted-foreground text-sm font-medium">
                      Premium verification code sent to
                    </p>
                    <p className="text-foreground font-bold">{phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-foreground font-medium"
                    >
                      Enter Premium Code
                    </Label>
                    <Input
                      id="otp"
                      placeholder="000000"
                      maxLength={6}
                      {...registerOtp("otp")}
                      className="text-center text-xl tracking-widest font-mono"
                    />
                    {otpErrors.otp && (
                      <p className="text-destructive text-xs">
                        {otpErrors.otp.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground"
                      disabled={otpLoading}
                    >
                      {otpLoading ? "Verifying..." : "Verify Premium Access"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-accent border-accent hover:bg-accent/10"
                      onClick={handleResendOtp}
                      disabled={!canResend || resendLoading}
                    >
                      {resendLoading
                        ? "Resending..."
                        : canResend
                        ? "Resend OTP"
                        : `Resend in ${Math.floor(resendTimer / 60)}:${(
                            resendTimer % 60
                          )
                            .toString()
                            .padStart(2, "0")}`}
                    </Button>
                    {error && (
                      <div className="text-destructive text-center text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-accent text-center text-sm">
                        {success}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setShowOTP(false);
                        setOtp("");
                        setSuccess("");
                        setError("");
                      }}
                      className="w-full text-muted-foreground hover:text-foreground hover:bg-background"
                    >
                      Change Phone Number
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-center text-sm text-muted-foreground font-inter">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
