import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// import {
//   ClerkProvider,
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "My Next App",
  description: "Practice with separate layouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
 

    <html lang='en'> 
      <body className="min-h-screen bg-background">
       
          <SessionProvider>{children}</SessionProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>

  );
}