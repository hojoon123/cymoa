"use client";

import { useState } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고 */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-schoolsafe">청약백서</span>
        </a>

        {/* 햄버거 버튼 (모바일) */}
        <button
          className="lg:hidden flex items-center text-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* 내비게이션 메뉴 */}
        <ul
          className={`absolute top-16 left-0 w-full bg-white lg:static lg:flex lg:space-x-6 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <li>
            <a
              href="/listings"
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 lg:inline lg:px-0"
            >
              모집공고
            </a>
          </li>
          <li>
            <a
              href="/calculator"
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 lg:inline lg:px-0"
            >
              가점계산기
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 lg:inline lg:px-0"
            >
              광고문의
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
