import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Role - Zephvion Careers",
  description: "Apply for your dream job at Zephvion",
};

export default function ApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
