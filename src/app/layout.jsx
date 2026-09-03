import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/providers/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DSA Hub - Master Data Structures & Algorithms",
  description: "Learn, practice, and master data structures and algorithms with comprehensive lessons, 500+ problems, and interview preparation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
