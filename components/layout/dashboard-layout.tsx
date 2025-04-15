'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, LayoutDashboard, Box, BarChart, UserCog, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">FAMS</h1>
          <nav className="space-y-4">
            <Link 
              href="/dashboard" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                pathname === "/dashboard" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link 
              href="/assets" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                pathname === "/assets" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Box size={18} /> Assets
            </Link>
            <Link 
              href="/reports" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                pathname === "/reports" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <BarChart size={18} /> Reports
            </Link>
            <Link 
              href="/admin" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                pathname === "/admin" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <UserCog size={18} /> Admin
            </Link>
            <Link 
              href="/settings" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                pathname === "/settings" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>
        <Link 
          href="/assets/new"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
        >
          Add Asset
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
          <h1 className="text-2xl font-semibold">
            {pathname === "/dashboard" && "Dashboard"}
            {pathname === "/assets" && "Assets"}
            {pathname === "/reports" && "Reports"}
            {pathname === "/admin" && "Admin"}
            {pathname === "/settings" && "Settings"}
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 