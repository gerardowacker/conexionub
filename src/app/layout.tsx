import type { Metadata } from "next";
import {Barlow} from "next/font/google";
import "./globals.css";
import Header from "@/components/menu/headermenu/Header";
import Footer from "@/components/footer/Footer";

const barlowSans = Barlow({
    weight: ['400', '500', '600', '700'],
    variable: '--font-barlow',
    subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Universidad de Belgrano - Carreras de Ciencias y Tecnologías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlowSans.variable}`}>
        <Header/>
        <main className="landing">
            <div className={'view-container'}>
                {children}
            </div>
        </main>
        <Footer/>
      </body>
    </html>
  );
}
