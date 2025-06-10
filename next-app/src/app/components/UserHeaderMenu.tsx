"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { StrapiUser } from "../../types/strapi";

const UserHeaderMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Handle logout click
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Get user initials for the avatar
  const getUserInitials = (user: StrapiUser): string => {
    if (!user?.username) return "?";
    return user.username.substring(0, 2).toUpperCase();
  };

  // Get role name
  const getRoleName = (user: StrapiUser): string => {
    return user?.role?.name || "User";
  };

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
        aria-expanded={isOpen ? "true" : "false"}
        aria-haspopup="true"
      >
        <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
          <span className="text-sm font-semibold text-gray-900">{user.username}</span>
          <span className="text-xs text-gray-600">{getRoleName(user)}</span>
        </div>
        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
          <span className="text-sm font-medium leading-none text-white">
            {getUserInitials(user)}
          </span>
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500">{getRoleName(user)}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Account
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHeaderMenu;
