import { Amiri, Poppins, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { AppSettingsProvider } from "@/context/AppSettingsContext";

const poppins = Poppins({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-arabic-a",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-arabic-b",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Quran | Read, Search & Reflect",
  description: "A calm and premium Quran reading and search experience.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${amiri.variable} ${scheherazade.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <AppSettingsProvider>{children}</AppSettingsProvider>
      </body>
    </html>
  );
}
