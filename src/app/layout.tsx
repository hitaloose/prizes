import "./globals.css";

import { Inter } from "next/font/google";

export const metadata = {
  title: "OFF Brindes",
  description: "Descubra qual será seu brinde da OFF",
};

const font = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${font.className}`}>
        <main className="bg-gray-100 h-full w-full">{children}</main>
      </body>
    </html>
  );
}
