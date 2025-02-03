// src/components/unit-detail/Header.tsx
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  type: string;
  region: string;
}

export default function Header({ title, type, region }: HeaderProps) {
  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <header className="px-4 py-3 md:px-6 md:py-4 lg:px-16 lg:py-6 max-w-[1728px] mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 truncate pr-2">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 rounded-full text-sm px-2 py-0.5"
              >
                {type}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-50 text-gray-600 rounded-full text-sm px-2 py-0.5"
              >
                {region}
              </Badge>
            </div>
          </div>
          <button className="flex-shrink-0 p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>
      </header>
    </div>
  );
}
