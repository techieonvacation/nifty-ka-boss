"use client";

import React from "react";
import LoginForm from "@/components/user/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-primary to-secondary py-10">
      <LoginForm />
    </div>
  );
}
