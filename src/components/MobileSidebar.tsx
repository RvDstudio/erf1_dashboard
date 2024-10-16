// Path: src\components\MobileSidebar.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Tractor } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menus } from '../constants/constants';

export function MobileSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;
  const [open, setOpen] = useState<boolean>(false);

  // Example usage of setOpen to toggle the sidebar
  const toggleSidebar = () => setOpen(!open);

  return (
    <Sheet key="left">
      <SheetTrigger asChild onClick={toggleSidebar}>
        <Menu className="h-6 w-6 pr-1 text-[#888888]" />
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className={`w-[300px] bg-white dark:bg-[#374c69] border-r border-[#374c69] ${open ? 'open' : 'closed'}`}
      >
        <div className="flex gap-x-2 items-center border-b border-[#425b7b] pb-[18px]">
          <Tractor strokeWidth={1} className={`text-white pl-1 dark:text-white cursor-pointer duration-500 h-8 w-8`} />
          <h1
            className={`text-white dark:text-white origin-left font-bold text-[22px] duration-200 ${
              !open && 'scale-0 hidden'
            }`}
          >
            Erf1 <span className="text-[#6699CC]"> Bestellingen</span>
          </h1>
        </div>
        <ul className="pt-6 space-y-3">
          {Menus.map((menu, index) => (
            <div key={index}>
              {menu.gap && <div className="my-4 border-t border-dashed border-[#6d9ecf] dark:border-gray-600" />}
              <li className="group">
                <Link
                  className={`w-full flex items-center space-x-2 hover:bg-[#6d9ecf]  active:bg-[#6d9ecf] py-3 px-2 rounded-lg text-gray-400 group-hover:text-white ${
                    isActive(menu.path) ? 'bg-[#6d9ecf] text-white' : ''
                  }`}
                  href={menu.path}
                >
                  {menu.icon && (
                    <span
                      className={`mr-2.5 text-[#6d9ecf] group-hover:text-white ${
                        isActive(menu.path) ? ' text-white' : 'text-white'
                      }`}
                    >
                      {menu.icon}
                    </span>
                  )}
                  <span className={`${!open && ''} origin-left duration-200 flex items-center w-full`}>
                    <div className="flex relative items-center w-full">
                      <div className="">{menu.title}</div>
                      <div className="absolute right-2 top-1">
                        {!!menu.notification && (
                          <div className="text-xs text-white rounded-[4px] h-4 w-7 flex justify-center items-center">
                            <div
                              className={`${
                                isActive(menu.path)
                                  ? 'bg-white text-xs text-[#374c69] rounded-[4px] h-4 w-7 flex justify-center items-center'
                                  : 'bg-[#ffffff] text-xs text-white rounded-[4px] h-4 w-7 flex justify-center items-center'
                              }`}
                            >
                              {menu.notification}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </span>
                </Link>
              </li>
            </div>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
