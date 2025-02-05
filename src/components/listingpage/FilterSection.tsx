"use client"

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ArrowUpDown, Building2, ChevronDown, ChevronUp, MapPin, Package2, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function FilterSection() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showAllRegions, setShowAllRegions] = useState(false)

  // ─────────────────────────
  // 지역 필터
  // ─────────────────────────
  const mainRegions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산']
  const additionalRegions = ['세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
  
  const regionParam = searchParams.get('region') || ''
  const regionsInURL = regionParam ? regionParam.split(',') : []
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionsInURL)

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    )
  }

  // ─────────────────────────
  // 주택유형
  // ─────────────────────────
  const houseTypes = ['행복주택', '국민임대', '공공임대', '전세임대']
  const houseTypesParam = searchParams.get('houseTypes') || ''
  const houseTypesInURL = houseTypesParam ? houseTypesParam.split(',') : []
  const [selectedHouseTypes, setSelectedHouseTypes] = useState<string[]>(houseTypesInURL)

  const toggleHouseType = (type: string) => {
    setSelectedHouseTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // ─────────────────────────
  // 평수
  // ─────────────────────────
  const sizeLabelToRange: Record<string, string> = {
    '10평 이하': '0.0,10.0',
    '10평~15평': '10.0,15.0',
    '15평~20평': '15.0,20.0',
    '20평~25평': '20.0,25.0',
    '25평 이상': '25.0,'
  }
  const sizes = Object.keys(sizeLabelToRange)
  const sizesParam = searchParams.get('sizes') || ''
  const sizesInURL = sizesParam ? sizesParam.split('|') : []
  const [selectedSizes, setSelectedSizes] = useState<string[]>(sizesInURL)

  const toggleSize = (label: string) => {
    const rangeStr = sizeLabelToRange[label]
    if (!rangeStr) return

    setSelectedSizes(prev => {
      if (prev.includes(rangeStr)) {
        return prev.filter(r => r !== rangeStr)
      } else {
        return [...prev, rangeStr]
      }
    })
  }

  // ─────────────────────────
  // 보증금/월세 슬라이더
  // ─────────────────────────
  const [deposit, setDeposit] = useState<[number, number]>([0, 10000])
  const [rent, setRent] = useState<[number, number]>([0, 100])

  // ─────────────────────────
  // 입주 대상자
  // ─────────────────────────
  // 기본 목록
  const baseResidents = [
    "청년(소득X)", "청년(소득O)", "고령자", "주거급여수급자",
    "대학생", "신혼부부", "한부모가족", "가군", "나군", "기타"
  ];
  // 주거약자 목록
  const yakjaResidents = [
    "청년(소득X)(주거약자용)", "청년(소득O)(주거약자용)", "고령자(주거약자용)", "주거급여수급자(주거약자용)",
    "대학생(주거약자용)", "신혼부부(주거약자용)", "한부모가족(주거약자용)"
    // 필요하면 추가
  ];

  // “주거약자 대상 보기 / 접기” 토글
  const [showYakja, setShowYakja] = useState(false);

  const residentsParam = searchParams.get('residents') || ''
  const residentsInURL = residentsParam ? residentsParam.split(',') : []
  const [selectedResidents, setSelectedResidents] = useState<string[]>(residentsInURL)

  const toggleResident = (res: string) => {
    setSelectedResidents(prev =>
      prev.includes(res)
        ? prev.filter(x => x !== res)
        : [...prev, res]
    )
  }

  // ─────────────────────────
  // 공고상태
  // ─────────────────────────
  const statusParam = searchParams.get('status') || ''
  const [selectedStatus, setSelectedStatus] = useState(statusParam)

  // ─────────────────────────
  // 검색 실행
  // ─────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams()

    // 지역
    if (selectedRegions.length > 0) {
      params.set('region', selectedRegions.join(','))
    }
    // 주택유형
    if (selectedHouseTypes.length > 0) {
      params.set('houseTypes', selectedHouseTypes.join(','))
    }
    // 평수
    if (selectedSizes.length > 0) {
      params.set('sizes', selectedSizes.join('|'))
    }

    // 보증금/월세 => 만원 -> 원
    params.set('deposit_min', (deposit[0] * 10000).toString())
    params.set('deposit_max', (deposit[1] * 10000).toString())
    params.set('rent_min', (rent[0] * 10000).toString())
    params.set('rent_max', (rent[1] * 10000).toString())

    // 입주대상자
    if (selectedResidents.length>0) {
      params.set('residents', selectedResidents.join(','))
    }

    // 공고상태
    if (selectedStatus) {
      params.set('status', selectedStatus)
    }

    params.set('page', '1')

    router.push(`/listings?${params.toString()}`)
  }

  const currentRegions = showAllRegions
    ? [...mainRegions, ...additionalRegions]
    : mainRegions


  return ( // bg-gray-50 p-6 rounded-lg shadow-md
    <div className="p-4 bg-transparent md:p-6 md:rounded-lg md:shadow-md md:bg-gray-50">
      {/* ───────────────────────────────────────────────── */}
      {/* 지역 선택 섹션 */}
      {/* ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> 지역
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {currentRegions.map((region) => (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedRegions.includes(region)
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-medium'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAllRegions(!showAllRegions)}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            {showAllRegions ? (
              <>
                지역 접기
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                더 많은 지역 보기
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────── */}
      {/* 보증금/월세 + 주택유형 + 평수 */}
      {/* ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 보증금 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Package2 className="w-4 h-4 text-blue-500" /> 보증금 (만원)
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
              <span>{deposit[0].toLocaleString()}만원</span>
              <span>{deposit[1].toLocaleString()}만원</span>
            </div>
            <div className="px-3 py-6">
              <Slider
                className="h-2"
                min={0}
                max={10000}
                step={100}
                value={deposit}
                defaultValue={[0, 10000]}
                onValueChange={(value: [number, number]) => setDeposit(value)}
              />
            </div>
          </div>
        </div>

        {/* 월세 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <ArrowUpDown className="w-4 h-4 text-blue-500" /> 월세 (만원)
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
              <span>{rent[0].toLocaleString()}만원</span>
              <span>{rent[1].toLocaleString()}만원</span>
            </div>
            <div className="px-3 py-6">
              <Slider
                min={0}
                max={100}
                step={1}
                value={rent}
                defaultValue={[0, 100]}
                onValueChange={(value: [number, number]) => setRent(value)}
              />
            </div>
          </div>
        </div>

        {/* 주택유형 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-blue-500" /> 주택유형
          </h3>
          <div className="flex flex-wrap gap-2">
            {houseTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleHouseType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedHouseTypes.includes(type)
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 평수 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-blue-500" /> 평수
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((label) => {
              const rangeStr = sizeLabelToRange[label]
              return (
                <button
                  key={label}
                  onClick={() => toggleSize(label)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    selectedSizes.includes(rangeStr)
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                      : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────── */}
      {/* (추가) 입주대상자 + 공고상태 */}
      {/* ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* 입주 대상자 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-blue-500" /> 입주 대상자
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* 기본 대상자 */}
            {baseResidents.map(r => (
              <button
                key={r}
                onClick={()=> toggleResident(r)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedResidents.includes(r)
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* 주거약자: 보기/접기 */}
          <div className="mt-3">
            <button
              onClick={()=> setShowYakja(!showYakja)}
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              {showYakja ? '주거약자 대상 접기' : '주거약자 대상 보기'}
              {showYakja ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            </button>
            {showYakja && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {yakjaResidents.map(r => (
                  <button
                    key={r}
                    onClick={()=> toggleResident(r)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      selectedResidents.includes(r)
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                        : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 공고 일정(공고상태) */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <ArrowUpDown className="w-4 h-4 text-blue-500" /> 공고 일정
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={()=> setSelectedStatus("")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                selectedStatus===""
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={()=> setSelectedStatus("planned")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                selectedStatus==="planned"
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              공고예정
            </button>
            <button
              onClick={()=> setSelectedStatus("ongoing")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                selectedStatus==="ongoing"
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              공고중
            </button>
            <button
              onClick={()=> setSelectedStatus("closed")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                selectedStatus==="closed"
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              마감
            </button>
          </div>
        </div>
      </div>

      {/* 조회하기 버튼 */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSearch}
          variant="outline"
          className="px-6 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 font-semibold
            bg-white hover:bg-gray-100 hover:text-gray-900 text-gray-700 border border-gray-200"
        >
          <Search className="w-4 h-4" />
          조회하기
        </Button>
      </div>
    </div>
  )
}
