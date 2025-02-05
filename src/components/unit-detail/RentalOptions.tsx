'use client';

import { Wallet } from 'lucide-react';
import { useState } from 'react';
import DepositCalculator from './DepositCalculator';

interface Contract {
  group: string;
  deposit_min: number;        // 최소 보증금
  deposit_max: number;        // 최대 보증금
  monthly_rent_min: number;   // 최소 월세
  monthly_rent_max: number;   // 최대 월세
  down_payment: number;       // 계약금
}

interface RentalOptionsProps {
  contracts?: Contract[]; // 기본값이 undefined 가능
}

export default function RentalOptions({ contracts = [] }: RentalOptionsProps) {
  // 계약 탭 관련 상태
  const [activeContract, setActiveContract] = useState<Contract | undefined>(
    contracts.length > 0 ? contracts[0] : undefined
  );

  // 각 계약(group)마다 슬라이더 값을 저장하는 객체
  const [sliderMap, setSliderMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    contracts.forEach((contract) => {
      initial[contract.group] = Math.floor(contract.deposit_min);
    });
    return initial;
  });

  // 현재 활성 탭의 슬라이더 값 업데이트
  const handleSliderChange = (value: number) => {
    if (activeContract) {
      setSliderMap((prev) => ({
        ...prev,
        [activeContract.group]: value,
      }));
    }
  };

  if (contracts.length === 0 || !activeContract) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gray-50">
          <Wallet className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">임대 조건</h2>
      </div>

      {/* 탭과 내용이 통합된 카드 */}
      <div className="bg-white border rounded-lg shadow-sm">
        {/* 탭 헤더 */}
        <div className="grid grid-cols-2 gap-2 border-b border-gray-200 p-2 sm:flex sm:overflow-x-auto sm:gap-2">
          {contracts.map((contract) => {
            const isActive = activeContract.group === contract.group;
            return (
              <button
                key={contract.group}
                onClick={() => setActiveContract(contract)}
                className={`px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'font-semibold text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {contract.group}
              </button>
            );
          })}
        </div>
        {/* DepositCalculator 내용 영역 */}
        <div className="p-4 mt-4">
          <DepositCalculator
            depositMin={activeContract.deposit_min}
            depositMax={activeContract.deposit_max}
            rentMin={activeContract.monthly_rent_min}
            rentMax={activeContract.monthly_rent_max}
            downPayment={activeContract.down_payment}
            // 각 탭별 저장된 슬라이더 값 전달 (없으면 depositMin의 floor값)
            sliderValue={
              sliderMap[activeContract.group] ?? Math.floor(activeContract.deposit_min)
            }
            onSliderChange={handleSliderChange}
          />
        </div>
      </div>
    </section>
  );
}
