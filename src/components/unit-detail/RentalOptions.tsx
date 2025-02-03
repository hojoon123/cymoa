// 파일: src/components/unit-detail/RentalOptions.tsx

'use client';

import { formatKoreanMoney } from '@/utils/formatUtils';
import { Building2, Wallet } from 'lucide-react';
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
  contracts: Contract[];
}

export default function RentalOptions({ contracts }: RentalOptionsProps) {
  if (!contracts || contracts.length === 0) return null;

  // 탭(버튼) 형태로 보여줄 것이므로, 첫 번째 계약을 기본 활성
  const [activeContract, setActiveContract] = useState<Contract>(contracts[0]);

  return (
    <section className="space-y-4">
      {/* 제목 */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gray-50">
          <Wallet className="w-4 h-4 text-gray-900" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">임대 조건</h2>
      </div>

      {/* 그룹 선택 버튼들 */}
      <div className="bg-white p-2 rounded-lg border">
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="flex flex-wrap gap-2">
            {contracts.map((contract) => {
              const isActive = activeContract.group === contract.group;
              return (
                <button
                  key={contract.group}
                  onClick={() => setActiveContract(contract)}
                  className={`
                    px-4 py-2 rounded-lg text-sm md:text-base transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-medium'
                    }
                  `}
                >
                  {contract.group}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2열 레이아웃: 최대 보증금 옵션 / 최소 보증금 옵션 */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* 최대 보증금 옵션 */}
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gray-50">
              <Building2 className="w-4 h-4 text-gray-900" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              최대 보증금 옵션
            </h3>
          </div>

          <div className="space-y-4">
            {/* 보증금 */}
            <div>
              <p className="text-base font-medium text-gray-500 mb-0.5">보증금</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.deposit_max)}
              </p>
            </div>

            {/* 월세 */}
            <div>
              <p className="text-base font-medium text-gray-500 mb-0.5">월세</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.monthly_rent_max)}
              </p>
            </div>

            {/* 계약금 */}
            <div className="pt-2 border-t">
              <p className="text-base font-medium text-gray-500 mb-0.5">계약금</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.down_payment)}
              </p>
            </div>
          </div>
        </div>

        {/* 최소 보증금 옵션 */}
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gray-50">
              <Building2 className="w-4 h-4 text-gray-900" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              최소 보증금 옵션
            </h3>
          </div>

          <div className="space-y-4">
            {/* 보증금 */}
            <div>
              <p className="text-base font-medium text-gray-500 mb-0.5">보증금</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.deposit_min)}
              </p>
            </div>

            {/* 월세 */}
            <div>
              <p className="text-base font-medium text-gray-500 mb-0.5">월세</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.monthly_rent_min)}
              </p>
            </div>

            {/* 계약금 */}
            <div className="pt-2 border-t">
              <p className="text-base font-medium text-gray-500 mb-0.5">계약금</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {formatKoreanMoney(activeContract.down_payment)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 슬라이더 계산기 */}
      <div className="rounded-lg border bg-white p-4">
        <DepositCalculator
          depositMin={activeContract.deposit_min}
          depositMax={activeContract.deposit_max}
          rentMin={activeContract.monthly_rent_min}
          rentMax={activeContract.monthly_rent_max}
        />
      </div>
    </section>
  );
}
