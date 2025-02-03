import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '청약백서 - 청년과 신혼부부를 위한 맞춤형 청약 정보',
  description: '청년과 신혼부부를 위한 맞춤형 청약 정보 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-bold font-schoolsafe">🍀청약백서</span>
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/listings" className="text-gray-600 hover:text-blue-600">
                  모집공고
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  광고문의
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2025 청약백서. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
