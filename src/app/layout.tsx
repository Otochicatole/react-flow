import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProjectStoreProvider } from "@/context/project-store";
import { ProjectProvider } from "@/context/project-context";
import { ReactFlowProvider } from "@xyflow/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Flow V2",
  description: "Flow diagram application with custom nodes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ProjectStoreProvider>
          <ProjectProvider>
            <ReactFlowProvider>
              {children}
            </ReactFlowProvider>
          </ProjectProvider>
        </ProjectStoreProvider>
      </body>
    </html>
  );
}
