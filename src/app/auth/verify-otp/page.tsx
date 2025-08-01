"use server";

import OtpForm from "@/components/user/auth/OtpForm";
import { redirect } from "next/navigation";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const params = await searchParams; // Await the searchParams
  const email = params?.email;

  if (!email) {
    redirect("/auth/signup");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center text-gray-900 font-urbanist">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-600 font-inter">
            We&apos;ve sent a verification code to your email
          </p>
        </div>

        <OtpForm email={email} redirectUrl="/auth/login" />
      </div>
    </div>
  );
}
