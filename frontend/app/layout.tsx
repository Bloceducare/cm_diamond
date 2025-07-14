import type { Metadata } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Raleway as FontSans } from "next/font/google";
import { Toaster } from 'sonner';
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import Web3ModalProvider from '@/context'
import { config } from '@/config'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Classmate",
  description: "Classmate - LMS system onchain",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(config, headers().get('cookie'))

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-white",
          fontSans.variable
        )}
      >
        <Web3ModalProvider initialState={initialState}>
          {children}
          <Toaster richColors position="top-right" />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
