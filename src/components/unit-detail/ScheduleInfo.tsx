// 파일: src/components/unit-detail/ScheduleInfo.tsx

'use client';

import { Calendar } from 'lucide-react';

interface Schedule {
  announcement_date: string | null;
  application_period_start: string | null;  // 기존: general_supply_date_start
  application_period_end: string | null;    // 기존: general_supply_date_end
  winner_announcement_date: string | null;
}

interface ScheduleInfoProps {
  schedule?: Schedule;
}

export function ScheduleInfo({ schedule }: ScheduleInfoProps) {
  if (!schedule) return null;

  // 원하는 항목만 골라 라벨 붙이기
  const scheduleItems = [
    {
      label: '공고일',
      value: schedule.announcement_date || '미정',
    },
    {
      label: '신청 기간',
      value: schedule.application_period_start && schedule.application_period_end
        ? `${schedule.application_period_start} ~ ${schedule.application_period_end}`
        : '미정',
    },
    {
      label: '당첨자 발표',
      value: schedule.winner_announcement_date || '미정',
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-yellow-50">
          <Calendar className="w-6 h-6 text-yellow-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">공고 일정</h2>
      </div>

      <div className="grid gap-4 rounded-lg border p-4">
        {scheduleItems.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <h3 className="flex items-center gap-2 text-base font-medium text-gray-500">
              {item.label}
            </h3>
            <p className="text-xl font-semibold md:text-lg text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
