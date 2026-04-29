import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SecurityProtection from "@/components/SecurityProtection";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Tech BD - E-Learning Platform",
  description: "Learn programming and technology skills with IT Tech BD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>
          <AuthProvider>
            <SecurityProtection />
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
