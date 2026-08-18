import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Directory Dashboard",
  description: "A premium, responsive User Directory built using Next.js 16, Tailwind CSS v4, TypeScript, and Axios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50/50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center dark:bg-zinc-50">
                <span className="text-sm font-bold text-zinc-50 dark:text-zinc-900">UD</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">UserDirectory</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/bibekkd/assignment-user-directory"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="w-full border-t border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-950 py-6 text-center text-xs text-zinc-450">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} UserDirectory. Built with Next.js & Tailwind CSS v4.
          </div>
        </footer>
      </body>
    </html>
  );
}
