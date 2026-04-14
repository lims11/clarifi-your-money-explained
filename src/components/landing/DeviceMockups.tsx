import { ReactNode } from 'react';

export function LaptopMockup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-[#2d2d2d] rounded-t-xl pt-3 px-3 pb-0">
        <div className="flex gap-1.5 mb-2 px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="bg-[#0f0f1a] rounded-t-lg overflow-hidden">
          {children}
        </div>
      </div>
      <div className="bg-[#2d2d2d] h-3 rounded-b-sm" />
      <div className="bg-[#3d3d3d] h-2 mx-[15%] rounded-b-lg" />
    </div>
  );
}

export function PhoneMockup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-[#1a1a1a] rounded-[1.8rem] p-1.5 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1a] rounded-b-2xl z-10" />
        <div className="bg-white rounded-[1.35rem] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
