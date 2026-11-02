import type { Metadata } from "next";
import { Fira_Code, STIX_Two_Text } from "next/font/google";
import "./globals.css";

const serif = STIX_Two_Text({ subsets: ["latin"], variable: "--f-serif", style: ["normal", "italic"] });
const mono = Fira_Code({ subsets: ["latin"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: "Kalkulator Numerik | Bisection & Regula Falsi",
  description: "Hitung akar persamaan dengan metode Bisection dan Regula Falsi, lengkap dengan grafik dan tabel iterasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${serif.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
