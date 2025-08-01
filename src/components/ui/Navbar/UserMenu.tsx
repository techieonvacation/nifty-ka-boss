"use client";

import { User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Helper to get user initials
function getInitials(nameOrEmail: string) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] || "").toUpperCase() + (parts[1][0] || "").toUpperCase();
}

interface UserMenuProps {
  user: {
    id?: string;
    email?: string | null;
    fullName?: string | null;
    name?: string | null; // for next-auth compatibility
    phone?: string;
    imageUrl?: string | null;
    image?: string | null; // for next-auth compatibility
    isPremium?: boolean;
  };
  onLogout?: () => void;
}

const UserMenuComponent = function UserMenu({ user, onLogout }: UserMenuProps) {
  const router = useRouter();
  if (!user) return null;
  const initials = getInitials(user.fullName || user.name || user.email || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="ring-2 bg-background border border-border shadow-md ring-primary/30 cursor-pointer hover:ring-primary/60 transition-all flex items-center justify-center relative group">
          {/* User image if available, else fallback to initials or icon */}
          {user.imageUrl || user.image ? (
            <AvatarImage
              src={user.imageUrl || user.image || undefined}
              alt={user.fullName || user.name || user.email || "User"}
            />
          ) : (
            <AvatarFallback className="text-lg font-semibold text-primary-foreground bg-gradient-to-br from-primary to-accent group-hover:from-accent group-hover:to-primary transition-colors">
              {initials || <FiUser className="size-5" />}
            </AvatarFallback>
          )}
          {/* Premium badge */}
          {user.isPremium && (
            <Badge
              variant="premium"
              size="sm"
              className="absolute -bottom-1 -right-1 z-10 shadow-lg animate-pulse"
            >
              Premium
            </Badge>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl border border-border bg-popover/95 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="text-base font-semibold leading-none text-primary flex items-center gap-2">
              {user.fullName || user.name || user.email}
            </span>
            <span className="text-xs leading-none text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/user/user-dashboard")}
          className="cursor-pointer rounded-lg transition-all flex items-center gap-2 font-medium text-primary hover:bg-primary/10 focus:bg-primary/10"
        >
          <User className="h-4 w-4 text-primary" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await fetch("/api/user/logout", { method: "POST" });
            if (onLogout) onLogout();
            router.refresh();
          }}
          className="cursor-pointer rounded-lg flex items-center gap-2 font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4 text-destructive" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserMenu = React.memo(UserMenuComponent);
export default UserMenu;
