'use client';

import { DetailSlider } from "@/components/ui/detail-slider"; // 기존에 만든 컴포넌트
import { formatKoreanMoney } from "@/utils/formatUtils";

function calcMonthlyRent(
  deposit: number,
  d1: number,
  d2: number,
  r1: number,
  r2: number
): number {
  let dd1 = d1,
    dd2 = d2,
    rr1 = r1,
    rr2 = r2;
  if (dd1 > dd2) {
    const tempD = dd1;
    dd1 = dd2;
    dd2 = tempD;
    const tempR = rr1;
    rr1 = rr2;
    rr2 = tempR;
  }
  if (Math.abs(dd2 - dd1) < 1e-9) return rr1;

  let ratio = (deposit - dd1) / (dd2 - dd1);
  if (ratio < 0) ratio = 0;
  if (ratio > 1) ratio = 1;
  return rr1 + ratio * (rr2 - rr1);
}

interface Props {
  depositMin: number;
  depositMax: number;
  rentMin: number;
  rentMax: number;
  downPayment: number;
  sliderValue: number; // 컨트롤드 상태로 전달됨
  onSliderChange: (value: number) => void; // 변경 시 호출
}

/**
 * Radix Slider 기반 Deposit Calculator
 */
export default function DepositCalculator({
  depositMin,
  depositMax,
  rentMin,
  rentMax,
  downPayment,
  sliderValue,
  onSliderChange,
}: Props) {
  // 보증금 최소값과 최대값이 동일하면 슬라이더 없이 간략화된 UI를 렌더링
  if (depositMin === depositMax) {
    const realDeposit = depositMin; // 변경 불가능한 보증금
    const monthlyRent = calcMonthlyRent(realDeposit, depositMin, depositMax, rentMax, rentMin);

    return (
      <div className="space-y-3 mb-2">
        {/* 제목 및 안내문 */}
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">전월세</h3>
        <p className="text-xs text-gray-500">
          이 상품은 전월세 전환이 이루어지지 않습니다.
        </p>

        {/* 계약금 */}
        <div className="p-3 mt-3 border rounded">
          <p className="text-sm font-medium text-gray-500 mb-1">계약금</p>
          <p className="text-xl font-semibold text-gray-900">
            {formatKoreanMoney(Math.round(downPayment))}
          </p>
        </div>
        {/* 보증금 */}
        <div className="p-3 mt-3 border rounded">
          <p className="text-sm font-medium text-gray-500 mb-1">보증금</p>
          <p className="text-xl font-semibold text-gray-900">
            {formatKoreanMoney(Math.round(realDeposit))}
          </p>
        </div>
        {/* 예상 월세 */}
        <div className="p-3 mt-3 border rounded">
          <p className="text-sm font-medium text-gray-500 mb-1">예상 월세</p>
          <p className="text-xl font-semibold text-gray-900">
            {formatKoreanMoney(Math.round(monthlyRent))}
          </p>
        </div>
      </div>
    );
  }

  // 전월세 전환이 가능한 경우(보증금 범위가 있을 경우)의 기존 UI
  const floorMin = Math.floor(depositMin);
  const ceilMax = Math.ceil(depositMax);
  const offset = depositMin - floorMin;

  let realDeposit = sliderValue + offset;
  if (realDeposit > depositMax) {
    realDeposit = depositMax;
  }

  const monthlyRent = calcMonthlyRent(realDeposit, depositMin, depositMax, rentMax, rentMin);

  // Radix Slider의 onValueChange가 number[] 반환하므로 단일 값 추출
  const handleValueChange = (values: number[]) => {
    const v = values[0];
    onSliderChange(v);
  };

  return (
    <div className="space-y-3 mb-2">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
        전월세 계산기
      </h3>

      <div className="mt-4">
        <p className="text-sm text-gray-700 font-medium mb-2">
          현재 보증금: {formatKoreanMoney(Math.round(realDeposit))}
        </p>

        <DetailSlider
          value={[sliderValue]}
          min={floorMin}
          max={ceilMax}
          step={1}
          onValueChange={handleValueChange}
        />

        <div className="mt-2 flex justify-between mb-8 md:mb-6">
          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
            <span className="text-sm text-blue-600 font-medium">최소</span>
            <span className="text-sm text-blue-800">
              {formatKoreanMoney(depositMin)}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded">
            <span className="text-sm text-green-600 font-medium">최대</span>
            <span className="text-sm text-green-800">
              {formatKoreanMoney(depositMax)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 mt-3 border rounded">
        <p className="text-sm font-medium text-gray-500 mb-1">계약금</p>
        <p className="text-xl font-semibold text-gray-900">
          {formatKoreanMoney(Math.round(downPayment))}
        </p>
      </div>
      <div className="p-3 mt-3 border rounded">
        <p className="text-sm font-medium text-gray-500 mb-1">보증금</p>
        <p className="text-xl font-semibold text-gray-900">
          {formatKoreanMoney(Math.round(realDeposit))}
        </p>
      </div>
      <div className="p-3 mt-3 border rounded">
        <p className="text-sm font-medium text-gray-500 mb-1">예상 월세</p>
        <p className="text-xl font-semibold text-gray-900">
          {formatKoreanMoney(Math.round(monthlyRent))}
        </p>
      </div>
    </div>
  );
}
