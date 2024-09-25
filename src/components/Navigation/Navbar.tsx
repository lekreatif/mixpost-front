import { Button } from "@headlessui/react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { LuSunDim } from "react-icons/lu";

export default function Navbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (val: boolean) => void;
}) {
  return (
    <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-4 border-b border-primary-200 bg-primary-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        type="button"
        className="-m-2.5 p-2.5 text-primary-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Ouvrir le menu</span>

        <HiOutlineMenuAlt4 className="" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-primary-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 ms-auto me-0">
          <Button className="-m-1.5 flex items-center border p-0.5 text-primary-600 rounded">
            <span className="sr-only">Mode</span>
            <LuSunDim className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
