"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAVBAR_CONSTANT } from "./constant";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoize dropdown toggle handler
  const toggleDropdown = useCallback((title: string) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  }, []);

  // Memoize setUser handler for UserMenu
  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    > 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="max-w-[80px] sm:max-w-[100px] w-full block"
            >
              <Image
                src="/images/logo.webp"
                width={150}
                height={150}
                alt="header-logo"
                className="w-full h-auto"
                priority
              />
            </Link>
          </div>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAVBAR_CONSTANT.map((group) => (
                <div key={group.title} className="relative group">
                  {group.items.length === 1 ? (
                    <Link
                      href={group.items[0].href}
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
                    >
                      {group.title}
                    </Link>
                  ) : (
                    <>
                      <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50 group">
                        {group.title}
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        <div className="py-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                            >
                              {item.name}
                              {item.isPdf && (
                                <ExternalLink className="ml-2 h-3 w-3" />
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Only render after loading is false to avoid flicker */}
            {session?.user ? (
              <UserMenu
                user={{
                  id: session.user.id || "",
                  email: session.user.email || "",
                  fullName: session.user.name || undefined,
                  imageUrl: session.user.image || undefined,
                  // Add any custom fields if available
                }}
                onLogout={handleLogout}
                // onLogin={handleLogin}
              />
            ) : (
              <>
                <Link href="/nifty-ka-boss" passHref>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ChevronRight className="size-5" />}
                    className="hidden rounded-none lg:flex bg-accent text-accent-foreground hover:bg-accent/80 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
                  >
                    Nifty Ka Boss
                  </Button>
                </Link>
                <Link href="/nifty-ka-boss" passHref>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ChevronRight className="size-5" />}
                    className="lg:hidden bg-accent rounded-none text-accent-foreground hover:bg-accent/80 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
                  >
                    Nifty Ka Boss
                  </Button>
                </Link>
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-2">
            {NAVBAR_CONSTANT.map((group) => (
              <div key={group.title}>
                {group.items.length === 1 ? (
                  <Link
                    href={group.items[0].href}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {group.title}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleDropdown(group.title)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    >
                      {group.title}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeDropdown === group.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        activeDropdown === group.title ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="pl-4 space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                            {item.isPdf && (
                              <ExternalLink className="ml-2 h-3 w-3" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="pt-4 border-t">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
