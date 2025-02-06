"use client"

import { Badge } from "@/components/ui/badge"
import { Clipboard, Share2 } from "lucide-react"
import { useEffect, useState } from "react"


interface HeaderProps {
  title: string
  type: string
  region: string
  shareUrl: string
}

export default function Header({ title, type, region, shareUrl }: HeaderProps) {
  // --- 모바일 여부 감지 ---
  const [isMobile, setIsMobile] = useState(false)

  // --- 모바일 공유 실패(=fallback) 토스트 보여줄지 여부 ---
  const [showMobileFallback, setShowMobileFallback] = useState(false)

  // --- 데스크톱 복사 완료 토스트 보여줄지 여부 ---
  const [showCopyToast, setShowCopyToast] = useState(false)

  useEffect(() => {
    // DevTools에서 Device Toolbar 전환 시에는 새로고침해 주셔야 제대로 인식될 때가 많습니다.
    const userAgent = navigator.userAgent
    const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  // ─────────────────────────────────────────────────────
  // 1) 모바일(Web Share API)
  // ─────────────────────────────────────────────────────
  const handleMobileShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - ${region}`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("공유 취소 또는 실패:", error)
      }
    } else {
      // alert 대신, 버튼 위에 작은 토스트 표시
      setShowMobileFallback(true)
      setTimeout(() => setShowMobileFallback(false), 2000) // 1.5초 후 사라짐
    }
  }

  // ─────────────────────────────────────────────────────
  // 2) 데스크톱 - 카카오톡 공유
  // ─────────────────────────────────────────────────────
  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert("Kakao SDK 로딩 실패")
      return
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY!)
    }

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: region,
        imageUrl: "https://www.cybs2025.co.kr/cymoa/assets/Logo11.png",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "바로가기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    })
  }

  // ─────────────────────────────────────────────────────
  // 3) 데스크톱 - 클립보드 복사
  // ─────────────────────────────────────────────────────
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // alert 대신 버튼 위 작은 토스트 표시
        setShowCopyToast(true)
        setTimeout(() => setShowCopyToast(false), 2000) // 1.5초 후 사라짐
      })
      .catch((err) => {
        console.error("복사 실패:", err)
      })
  }

  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <header className="px-4 py-3 md:px-6 md:py-4 lg:px-16 lg:py-6 max-w-[1728px] mx-auto">
        <div className="flex items-start justify-between gap-3">
          {/* --------- 왼쪽: 제목/뱃지 --------- */}
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 truncate pr-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 rounded-full text-sm px-2 py-0.5">
                {type}
              </Badge>
              <Badge variant="secondary" className="bg-gray-50 text-gray-600 rounded-full text-sm px-2 py-0.5">
                {region}
              </Badge>
            </div>
          </div>

          {/* --------- 오른쪽: 공유 영역 --------- */}
          <div className="flex items-center gap-3">
            {isMobile ? (
              // ─────────────────────────────────────────────────────────────────
              //  모바일인 경우 → "Web Share 버튼" ( + fallback 토스트 )
              // ─────────────────────────────────────────────────────────────────
              <div className="relative">
                <button
                  onClick={handleMobileShare}
                  className="flex-shrink-0 p-2 hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                </button>
                {showMobileFallback && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-gray-600 text-xs py-1 px-2 rounded-md pointer-events-none animate-fadeInOut whitespace-nowrap">
                    공유 기능 미지원
                  </div>
                )}
              </div>
            ) : (
              // ─────────────────────────────────────────────────────────────────
              //  데스크톱인 경우 → 카카오톡 공유 버튼 + 복사 버튼( + 복사 토스트 )
              // ─────────────────────────────────────────────────────────────────
              <>
                {/* 카카오톡 공유 버튼 */}
                <div className="relative">
                  <button
                    onClick={handleKakaoShare}
                    className="flex-shrink-0 p-2 hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </button>
                  {/* 카카오톡은 별도 토스트 없음 */}
                </div>

                {/* 클립보드 복사 버튼 + 토스트 */}
                <div className="relative">
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 p-2 hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors"
                  >
                    <Clipboard className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </button>
                  {showCopyToast && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-gray-600 text-xs py-1 px-2 rounded-md pointer-events-none animate-fadeInOut whitespace-nowrap">
                      복사 완료
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/*
        토스트의 서서히 등장 & 사라짐 처리를 위해
        간단한 keyframes를 추가했습니다.
        아래 style 부분은 Next.js에서 컴포넌트 단위로 삽입 가능한 예시입니다.
        (Tailwind config에 커스텀 keyframes를 등록해도 무방)
      */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, 4px);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -4px);
          }
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}

