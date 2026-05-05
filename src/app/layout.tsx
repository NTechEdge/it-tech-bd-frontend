import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SecurityProtection from "@/components/SecurityProtection";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Tech BD - E-Learning Platform",
  description: "Learn programming and technology skills with IT Tech BD",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
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
