"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.min.css";

import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <title>OFF Brindes</title>
      </head>
      <body className={`${font.className}`}>
        <ToastContainer />
        <main className="bg-gray-100 h-full w-full">{children}</main>
      </body>
    </html>
  );
}
