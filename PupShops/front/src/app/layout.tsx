import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

import NavbarAdminComponent from "@/components/Navbar/NavbarAdmin";
import { UserProvider } from "@/context/userContext";
import { CartProvider } from "@/context/cartContext"; // Asegúrate de usar la ruta correcta

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pups Pet Shop",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <UserProvider>
        <CartProvider>
          <NavbarAdminComponent/>
            <Navbar />
            {children}
            <Footer />
         </CartProvider>
          </UserProvider>

      </body>
    </html>
  );
}
