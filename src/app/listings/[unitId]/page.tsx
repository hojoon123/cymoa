// 파일: src/app/listings/[unitId]/page.tsx

import Header from '@/components/unit-detail/Header';
// import ImageGallery from '@/components/unit-detail/ImageGallery';
import RoadviewWithMiniMap from '@/components/unit-detail/MapInfo';
import PropertyInfo from '@/components/unit-detail/PropertyInfo';
import ReceptionInfo from '@/components/unit-detail/ReceptionInfo';
import RentalOptions from '@/components/unit-detail/RentalOptions';
import { ScheduleInfo } from '@/components/unit-detail/ScheduleInfo';
import { fetchUnitDetail } from '@/service/api/fetchUnitDetail';
import { formatSizeKR } from '@/utils/formatUtils';
import { Metadata } from 'next';
import { use } from 'react';

// 1) "use(params)"가 Promise<{ unitId: string }> 형태라고 가정
interface UnitDetailPageProps {
    params: Promise<{
        unitId: string;
    }>;
}

/**
 * (선택적) generateMetadata 함수
 *  - use(params)와 동일하게 "params"가 Promise 형태이므로,
 *    async/await로 언랩(unwrap)해야 함
 */
export async function generateMetadata({ params }: UnitDetailPageProps): Promise<Metadata> {
    // 1) use(params) 대신, 서버사이드에서 직접 await
    const unwrappedParams = await params;
    const data = await fetchUnitDetail(unwrappedParams.unitId);

    if (!data) {
        return {
            title: '청약 임대모집공고 - 국민을 위한 맞춤형 청약 정보 플랫폼',
            description: '임대형 주택 청약에 대한 모집 공고를 확인해보세요.',
        };
    }

    const { complex_name, eligible_residents, exclusive_area_m2, region, reception_info } = data;

    const officeAddress = reception_info?.officeAddress || '접수처 정보 없음';

    return {
        title: `${complex_name} - 청약 임대모집공고`,
        description: `${complex_name} 임대모집공고 안내. 입주대상자: ${eligible_residents}, 전용면적: ${exclusive_area_m2}m², 접수처: ${officeAddress}, 위치: ${region}.`,
    };
}

/**
 * 2) 페이지 컴포넌트
 *    - Client/Server 구분 없이 "use(params)"가 정상 작동했던 예전 실험 기능 코드 형태
 */
export default function UnitDetailPage({ params }: UnitDetailPageProps) {
    // 1) use()로 Promise<{ unitId: string }> 언랩
    const { unitId } = use(params);
    // 2) 주택 정보 fetch도 동일하게 use()로 처리
    const data = use(fetchUnitDetail(unitId));

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

    // 공유 URL
    const shareUrl = `https://www.cybs2025.co.kr/listings/${unitId}`;

    return (
        <div className="min-h-screen bg-white">
            <Header title={data.complex_name} type={data.house_types} region={data.region} shareUrl={shareUrl} />

            <main className="max-w-[1728px] mx-auto px-5 py-8 lg:px-16">
                <div className="grid lg:grid-cols-[1fr_400px] gap-16 xl:gap-24">
                    {/* 왼쪽 컬럼 */}
                    <div className="space-y-16">
                        {/*<ImageGallery orderedImages={data.house_images_ordered} />*/}
                        <RoadviewWithMiniMap info={data.reception_info} />

                        {/* 모바일 전용 정보 */}
                        <div className="block lg:hidden">
                            <PropertyInfo unitInfo={unitInfo} />
                        </div>

                        <RentalOptions contracts={data.cotrancts} />
                        <ScheduleInfo schedule={data.schedule} />
                        <ReceptionInfo info={data.reception_info} />
                    </div>

                    {/* 오른쪽 컬럼(데스크톱 전용) */}
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
