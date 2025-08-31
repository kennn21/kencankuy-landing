import { AuthProvider } from "@/hooks/useAuth";
import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google"; // 1. Import new fonts
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

// 2. Configure the fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair", // Assign to a CSS variable
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato", // Assign to a CSS variable
});

export const metadata: Metadata = {
  title: "KencanKuy | Your Perfect Date Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. Apply the font variables to the HTML tag
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
