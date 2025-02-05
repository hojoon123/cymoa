// 파일: src/components/unit-detail/ReceptionInfo.tsx

'use client';

import { Building2, Calendar, Phone } from 'lucide-react';

interface ReceptionInfoData {
  address: string;
  phone_number: string;
  operating_period_start: string | null;
  operating_period_end: string | null;
}

interface ReceptionInfoProps {
  info: ReceptionInfoData;
}

export default function ReceptionInfo({ info }: ReceptionInfoProps) {
  if (!info) return null;

  // 운영 기간
  let operatingPeriodText = '운영 기간 미정';
  if (info.operating_period_start && info.operating_period_end) {
    operatingPeriodText = `${info.operating_period_start} ~ ${info.operating_period_end}`;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-50">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">접수 정보</h2>
      </div>

      <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-base font-medium text-gray-500">
            <Building2 className="w-3.5 h-3.5" />
            접수처 위치
          </h3>
          <p className="text-xl md:text-lg text-gray-900 pl-5 break-words">
            {info.address}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <h3 className="flex items-center gap-2 text-base font-medium text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              운영 기간
            </h3>
            <p className="text-xl md:text-lg text-gray-900 pl-5">
              {operatingPeriodText}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="flex items-center gap-2 text-base font-medium text-gray-500">
              <Phone className="w-3.5 h-3.5" />
              문의 전화
            </h3>
            <p className="text-xl md:text-lg text-gray-900 pl-5">
              {info.phone_number}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
