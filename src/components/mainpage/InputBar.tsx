"use client"

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ALL_REGIONS = [
  '서울','경기','인천','부산','대구','광주','대전','세종',
  '강원','충북','충남','전북','전남','경북','경남','제주'
]

const CHO_SEONG_MAP: Record<string, string[]> = {
  'ㄱ': ['강원','경기','경남','경북','광주'],
  'ㄷ': ['대구','대전'],
  'ㅂ': ['부산'],
  'ㅅ': ['서울','세종'],
  'ㅈ': ['전남','전북','제주']
}

const POPULAR_REGIONS = [
  '서울','경기','인천','부산','대구','광주','대전','세종'
]

export default function InputBar() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  // 입력 변화 시 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setActiveIndex(-1)

    if (!value) {
      setSuggestions([])
      return
    }

    if (CHO_SEONG_MAP[value]) {
      setSuggestions(CHO_SEONG_MAP[value])
    } else {
      const filtered = ALL_REGIONS.filter(region =>
        region.startsWith(value)
      )
      setSuggestions(filtered)
    }
  }

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // 자동완성 리스트가 있으면 먼저 닫기
      if (suggestions.length > 0) {
        setSuggestions([])
        return
      }
      // 자동완성 리스트가 없으면 검색 실행
      handleSearch(inputValue)
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (suggestions.length === 0) return

      const nextIndex = activeIndex < suggestions.length - 1 
        ? activeIndex + 1 
        : 0
      setActiveIndex(nextIndex)
      setInputValue(suggestions[nextIndex])
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (suggestions.length === 0) return

      const nextIndex = activeIndex > 0 
        ? activeIndex - 1 
        : suggestions.length - 1
      setActiveIndex(nextIndex)
      setInputValue(suggestions[nextIndex])
    }
  }

  // 검색 처리
  const handleSearch = (value: string) => {
    const allPossible = new Set([...ALL_REGIONS])
    Object.values(CHO_SEONG_MAP).forEach(list => {
      list.forEach(item => allPossible.add(item))
    })

    if (allPossible.has(value)) {
      router.push(`/listings?region=${value}`)
    } else {
      alert("검색 불가능한 지역입니다. 자동완성 중에서 선택해주세요.")
    }
  }

  const handleSuggestionClick = (region: string) => {
    setInputValue(region)
    setSuggestions([])
    handleSearch(region)
  }

  const handlePopularRegionClick = (region: string) => {
    router.push(`/listings?region=${region}`)
  }

  return (
    <div className="w-full max-w-2xl relative md:mb-10">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="지역을 검색해보세요 (예: 서울, 경기, 인천 등)"
        className="w-full px-6 py-4 rounded-full border border-gray-200 text-black
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   shadow-lg text-lg pr-14"
      />

      <button
        onClick={() => handleSearch(inputValue)}
        className="absolute top-1/4 right-4 -translate-y-1/2 
                   flex justify-center w-10 h-10 rounded-full
                   hover:bg-gray-100 transition-colors md:items-center"
      >
        <Search className="w-6 h-6 text-blue-500" />
      </button>

      {suggestions.length > 0 && (
        <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 text-black">
          {suggestions.map((region, idx) => (
            <li
              key={region}
              onClick={() => handleSuggestionClick(region)}
              className={
                "px-4 py-2 text-black cursor-pointer hover:bg-gray-100 " +
                (idx === activeIndex ? "bg-gray-200" : "")
              }
            >
              {region}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {POPULAR_REGIONS.map((region) => (
          <button
            key={region}
            className="px-4 py-2 text-sm text-gray-600 
                       hover:text-blue-500 transition-colors 
                       border border-gray-200 rounded-full"
            onClick={() => handlePopularRegionClick(region)}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  )
}
