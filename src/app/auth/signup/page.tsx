"use client";

import React from "react";
import SignupForm from "@/components/user/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-primary to-secondary py-10">
      <SignupForm />
    </div>
  );
}
