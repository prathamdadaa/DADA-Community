import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DADA Community",
  description: "Educational and knowledge-sharing community.",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
