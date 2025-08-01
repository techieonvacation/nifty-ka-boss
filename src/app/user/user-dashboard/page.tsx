"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  LogOut,
  Mail,
  ShieldCheck,
  User,
  Calendar,
  Edit3,  
  Lock,
  Key,
  Shield,
  Clock,
  UserCheck,
  AlertCircle,
  ShieldCheckIcon,
} from "lucide-react";

export default function UserDashboard() {
  // Use next-auth session for authentication
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Helper to get user initials (copied from UserMenu.tsx for consistency)
  function getInitials(nameOrEmail: string) {
    if (!nameOrEmail) return "?";
    const parts = nameOrEmail.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (
      (parts[0][0] || "").toUpperCase() + (parts[1][0] || "").toUpperCase()
    );
  }

  // Use next-auth signOut for logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.replace("/auth/login");
    } catch {
      setError("Failed to logout. Please try again.");
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setError("");
        alert("Password reset link sent to your email!");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  // Remove sensitive or non-existent fields from displayUser
  const displayUser = { ...user };

  return (
    <div className="bg-primary/30 py-10">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Cover Photo & Profile Section */}
        <Card className="mb-6 overflow-hidden shadow-xl border-0">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Profile Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarFallback className="text-6xl font-bold bg-accent">
                      {getInitials(user.name || user.email || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="primary"
                    className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0"
                  >
                    <ShieldCheckIcon className="size-5" />
                  </Button>
                </div>

                {/* Name and Basic Info */}
                <div className="flex-1 md:ml-4 md:mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-primary-foreground">
                      {user.name || user.email || "User"}
                    </h1>
                    <Badge
                      variant="outline"
                      className="text-primary-foreground hover:bg-primary/10"
                      icon={<ShieldCheck className="size-4" />}
                    >
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 md:mt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 md:flex-none"
                      leftIcon={<Edit3 className="size-4" />}
                    >
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue={user.name || ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          defaultValue={user.email || ""}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(displayUser).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-sm font-medium text-gray-500">
                          {key === "_id"
                            ? "User ID"
                            : key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-900 break-all">
                          {typeof value === "string" ||
                          typeof value === "number"
                            ? value
                            : JSON.stringify(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Verification
                      </span>
                      <Badge
                        variant="premium"
                        className="text-primary-foreground"
                        icon={<UserCheck className="size-4" />}
                      >
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge
                        variant="premium"
                        className="text-primary-foreground"
                      >
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Last login: Today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Password updated: 30 days ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Email verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        ••••••••••••
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4 mr-2" />
                            Change
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">
                                Current Password
                              </Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">
                                Confirm New Password
                              </Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Update Password</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Forgot Password</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Reset your password if you've forgotten it
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Reset Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            We'll send a password reset link to your email
                            address.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              defaultValue={user.email || ""}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => user.email && handlePasswordReset(user.email)}
                          >
                            Send Reset Link
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Get notified of new logins
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Active Sessions</Label>
                      <p className="text-sm text-gray-600">
                        Manage your active sessions
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Logout Section */}
        <Card className="mt-6 border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-800">Sign Out</h3>
                <p className="text-sm text-red-600">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mt-4 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
