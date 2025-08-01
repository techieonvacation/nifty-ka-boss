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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Crown, Star } from "lucide-react";

// --- Validation schema ---
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^\d{10,15}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
});

type SignupFormData = z.infer<typeof signupSchema>;

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington DC",
];

export default function SignupForm() {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [phoneForOtp, setPhoneForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userDetails, setUserDetails] = useState<SignupFormData | null>(null);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when OTP is shown
  useEffect(() => {
    if (showOtp) {
      setResendTimer(60);
      setCanResend(false);
    }
  }, [showOtp]);

  // Timer countdown
  useEffect(() => {
    if (showOtp && resendTimer > 0) {
      resendIntervalRef.current = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
    } else if (showOtp && resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (resendIntervalRef.current) clearTimeout(resendIntervalRef.current);
    };
  }, [resendTimer, showOtp]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneForOtp }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to resend OTP");
        return;
      }
      setSuccess(result.message || "OTP resent to your phone");
      setResendTimer(120);
      setCanResend(false);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      state: "",
      city: "",
      gender: "male",
    },
  });

  // Handle signup submit
  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Signup failed");
        return;
      }
      setSuccess(result.message || "OTP sent to your phone");
      setPhoneForOtp(data.phone);
      setUserDetails(data); // Store user details for OTP verification
      setShowOtp(true);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");
    setSuccess("");
    try {
      // Send all user details + OTP for verification
      const res = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(userDetails || {}),
          phone: phoneForOtp,
          otp,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "OTP verification failed");
        return;
      }
      setSuccess(result.message || "Phone verified. Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch {
      setError("OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Main form UI
  return (
    <div className="max-w-lg w-full">
      <Card>
        <CardHeader className="text-center pb-6 border-b border-border">
          <CardTitle className="text-2xl text-foreground mb-2 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-foreground" />
            Premium Membership
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Unlock exclusive trading opportunities and premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {error && <div className="text-destructive text-center">{error}</div>}
          {success && <div className="text-accent text-center">{success}</div>}
          {!showOtp ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-foreground font-medium flex items-center gap-2"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-foreground font-medium"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">
                  Gender
                </Label>
                <Select
                  value={watch("gender") || ""}
                  onValueChange={(val: "male" | "female" | "other" | "prefer-not-to-say") => setValue("gender", val)}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="male"
                      className="text-foreground focus:bg-accent"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="text-foreground focus:bg-accent"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="text-foreground focus:bg-accent"
                    >
                      Other
                    </SelectItem>
                    <SelectItem
                      value="prefer-not-to-say"
                      className="text-foreground focus:bg-accent"
                    >
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-destructive text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-foreground font-medium"
                  >
                    State
                  </Label>
                  <Select
                    value={watch("state") || ""}
                    onValueChange={(val) => setValue("state", val)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem
                          key={state}
                          value={state}
                          className="text-foreground focus:bg-accent"
                        >
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-destructive text-xs">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground font-medium">
                    City
                  </Label>
                  <Select
                    value={watch("city") || ""}
                    onValueChange={(val) => setValue("city", val)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                          className="text-foreground focus:bg-accent"
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-destructive text-xs">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground"
                disabled={loading}
              >
                <Crown className="mr-2 h-5 w-5" />
                {loading ? "Processing..." : "Join Premium Circle"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-accent hover:text-accent-hover font-semibold underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleOtpVerify}>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground font-medium">
                  Enter OTP sent to your phone
                </Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground"
                  disabled={otpLoading}
                >
                  {otpLoading
                    ? "Verifying..."
                    : "Verify & Complete Registration"}
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
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
