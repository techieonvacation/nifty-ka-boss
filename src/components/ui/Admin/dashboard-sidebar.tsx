"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CircleUser,
  Cog,
  LayoutDashboard,
  LifeBuoy,
  NotebookPen,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/Admin/sidebar-provider";

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
  isActive?: boolean;
  children?: React.ReactNode;
  isCollapsed?: boolean;
}

function NavItem({
  title,
  href,
  icon: Icon,
  isActive,
  children,
  isCollapsed,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <li className="relative">
      {hasChildren ? (
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
            isActive && "bg-muted font-medium text-foreground",
            isCollapsed && "justify-center px-2"
          )}
          rightIcon={
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          }
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            {!isCollapsed && <span>{title}</span>}
          </div>
        </Button>
      ) : (
        <Link href={href}>
          <Button
            variant="ghost"
            leftIcon={<Icon className="h-5 w-5" />}
            className={cn(
              "flex w-full items-center justify-start px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-muted font-medium text-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            {!isCollapsed && <span className="ml-3">{title}</span>}
          </Button>
        </Link>
      )}
      {hasChildren && isOpen && !isCollapsed && (
        <ul className="ml-4 mt-1 border-l pl-2">{children}</ul>
      )}
    </li>
  );
}

function NavSubItem({
  title,
  href,
  isActive,
}: {
  title: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <li>
      <Link href={href}>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full justify-start px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
            isActive && "bg-muted font-medium text-foreground"
          )}
        >
          {title}
        </Button>
      </Link>
    </li>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Package className="h-6 w-6" />
          {isOpen && (
            <span className="font-montserrat font-bold">Iamrakeshbansal</span>
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          <ul className="space-y-1">
            <NavItem
              title="Dashboard"
              href="/dashboard"
              icon={LayoutDashboard}
              isActive={pathname === "/dashboard"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Manage Blogs"
              href="/dashboard/blogcms"
              icon={NotebookPen}
              isActive={pathname === "/dashboard/blogcms"}
              isCollapsed={!isOpen}
            >
              <NavSubItem
                title="Blog CMS"
                href="/admin/dashboard/blogcms"
                isActive={pathname === "/admin/dashboard/blogcms"}
              />
              <NavSubItem
                title="Blog Comments"
                href="/admin/dashboard/comments"
                isActive={pathname === "/admin/dashboard/comments"}
              />
            </NavItem>
          </ul>
          <div className="my-2 border-t" />
          <ul className="space-y-1">
            <NavItem
              title="Settings"
              href="#"
              icon={Cog}
              isActive={pathname === "/settings"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Help & Support"
              href="#"
              icon={LifeBuoy}
              isActive={pathname === "/support"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Profile"
              href="#"
              icon={CircleUser}
              isActive={pathname === "/profile"}
              isCollapsed={!isOpen}
            />
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
