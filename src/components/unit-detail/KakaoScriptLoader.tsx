// src/components/KakaoScriptLoader.tsx
'use client';

import Script from 'next/script';

export default function KakaoScriptLoader() {
  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.min.js"
      strategy="beforeInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY!);
        }
      }}
    />
  );
}
