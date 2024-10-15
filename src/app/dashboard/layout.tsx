// Path: src\app\dashboard\layout.tsx
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 bg-[#ECF0F6] dark:bg-[#171717]">
        <Header />
        <div className="overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
