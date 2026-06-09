import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TLP Wedding CAD Studio",
  description: "Controlled preview scaffold for a wedding CAD design studio."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
