// 파일: src/app/listings/[unitId]/page.tsx

import Header from '@/components/unit-detail/Header';
import ImageGallery from '@/components/unit-detail/ImageGallery';
import PropertyInfo from '@/components/unit-detail/PropertyInfo';
import ReceptionInfo from '@/components/unit-detail/ReceptionInfo';
import RentalOptions from '@/components/unit-detail/RentalOptions';
import { ScheduleInfo } from '@/components/unit-detail/ScheduleInfo';
import { fetchUnitDetail } from '@/service/api/fetchUnitDetail';
import { formatSizeKR } from '@/utils/formatUtils';
import { use } from 'react';

interface UnitDetailPageProps {
  params: Promise<{
    unitId: string;
  }>;
}

export default function UnitDetailPage({ params }: UnitDetailPageProps) {
  // Next.js 14 app router에서 params를 Promise로 받는 경우 → use()로 언wrap
  const { unitId } = use(params);
  const data = use(fetchUnitDetail(unitId));

  // 데이터가 없는 경우 방어
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">데이터가 없습니다.</div>;
  }

  // 주택정보
  const unitInfo = {
    area: `${formatSizeKR(data.exclusive_area_pyeong)} (${data.exclusive_area_m2}m²)`,
    residents: data.eligible_residents,
    period: data.default_residence_period,
    supply: data.current_supply,
    type: data.house_types,
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title={data.complex_name} type={data.house_types} region={data.region} />

      <main className="max-w-[1728px] mx-auto px-5 py-8 lg:px-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 xl:gap-24">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-16">
            {/* 모바일 전용 주택정보 */}
            <ImageGallery orderedImages={data.house_images_ordered} />
            <div className="block lg:hidden">
              <PropertyInfo unitInfo={unitInfo} />
            </div>

            <RentalOptions contracts={data.contracts} />
            <ScheduleInfo schedule={data.schedule} />
            <ReceptionInfo info={data.reception_info} />
          </div>

          {/* 오른쪽 컬럼 (데스크톱 전용) */}
          <div className="space-y-12 hidden lg:block">
            <div className="sticky top-40">
              <PropertyInfo unitInfo={unitInfo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
