"use client"

// 파일: src/app/listings/components/PaginationBar.tsx

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationBarProps {
  currentPage: number
  totalCount: number
  itemsPerPage: number
}

export default function PaginationBar({
  currentPage,
  totalCount,
  itemsPerPage
}: PaginationBarProps) {

  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handlePageClick = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageNum))
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageIndex = index + 1
        return (
          <button
            key={pageIndex}
            onClick={() => handlePageClick(pageIndex)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
              currentPage === pageIndex
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
            }`}
          >
            {pageIndex}
          </button>
        )
      })}
    </div>
  )
}
