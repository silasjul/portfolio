import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silas — Project gallery",
  description:
    "Selected real-time 3D, XR and simulation work by Silas. Drag to explore an infinite plane of projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} h-dvh antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
