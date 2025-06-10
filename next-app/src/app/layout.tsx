import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import UserHeaderMenu from "./components/UserHeaderMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strapi Next.js Blog",
  description: "A blog built with Strapi and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600"
                  >
                    Strapi Blog
                  </Link>
                  <nav className="ml-10 flex items-center space-x-8">
                    <Link
                      href="/"
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      href="/articles"
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                    >
                      Articles
                    </Link>
                    <Link
                      href="/team-members"
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                    >
                      Team Members
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center">
                  <UserHeaderMenu />
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-gray-50 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Strapi Next.js Blog. All rights
                reserved.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
