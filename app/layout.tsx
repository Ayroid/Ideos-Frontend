import Navbar from "@/components/Navbar";
import SidebarComponent from "@/components/SidePanel";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ideos",
  description: "Productivity app for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ideos.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-screen overflow-hidden">
            <div>
              <SidebarComponent />
            </div>
            <main className="box-border w-full overflow-y-auto">
              <Navbar />
              <Separator />
              {children}
            </main>
            <Toaster expand visibleToasts={1} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
