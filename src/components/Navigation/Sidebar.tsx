import React, { useMemo, MouseEvent } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  Button,
} from "@headlessui/react";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { USER_ROLE } from "@/types";
import Logo from "../layout/Logo";
import { IoIosClose } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useMe";
import { logout } from "@/services/api";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: userData } = useUser();

  const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      await logout();
      queryClient.clear();
      return (window.location.href = "/login");
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const isSuperAdmin = useMemo(
    () => (userData ? userData.data.role === USER_ROLE.SUPER_ADMIN : false),
    [userData]
  );
  return (
    <>
      <Transition show={sidebarOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          {/* Backdrop */}
          <TransitionChild
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-primary-900/80" />
          </TransitionChild>

          {/* Sidebar */}
          <div className="fixed inset-0 flex">
            <TransitionChild
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-40 flex-1">
                <TransitionChild
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <Button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Fermer</span>
                      <IoIosClose className="h-5 w-5 text-primary-50" />
                    </Button>
                  </div>
                </TransitionChild>
                <SidebarContent
                  isSuperAdmin={isSuperAdmin}
                  handleLogout={handleLogout}
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-40 lg:flex-col">
        <SidebarContent
          isSuperAdmin={isSuperAdmin}
          handleLogout={handleLogout}
        />
      </div>
    </>
  );
}

function SidebarContent({
  isSuperAdmin,
  handleLogout,
}: {
  isSuperAdmin: boolean;
  handleLogout: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-50 px-6 pb-4 border-r shadow-sm">
      <div className="flex h-12 shrink-0 items-center">
        <NavLink
          className="flex w-full items-center gap-1 border-b py-2 text-center font-sans text-lg font-bold"
          to="/"
        >
          <span className="inline-block h-4 w-4">
            <Logo />
          </span>
          <span className="text-lg font-medium">LeKreatif</span>
        </NavLink>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          <li>
            <div className="text-center">
              <NavLink
                to="/creer"
                className="mx-auto inline-flex items-center justify-center rounded bg-secondary-600 px-6 py-2 text-sm font-light text-primary-50 hover:bg-secondary-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>

                <span>Créer</span>
              </NavLink>
            </div>
          </li>
          <li>
            <NavLink
              to="/"
              className="flex items-center rounded p-2 text-primary-600 hover:bg-primary-100"
            >
              <RxDashboard className="mr-2 h-4 w-4" />
              Accueil
            </NavLink>
          </li>
          <li></li>
          <li>
            <div className="text-xs font-semibold leading-6 text-primary-400"></div>
            <ul role="list" className="-mx-2 mt-2 space-y-1"></ul>
          </li>

          <li className="m-auto"></li>

          {isSuperAdmin && (
            <li>
              <NavLink
                to="/settings"
                className="flex items-center rounded p-2 text-primary-600 hover:bg-primary-100"
              >
                <IoSettingsOutline className="mr-1 h-4 w-4" />
                Paramètres
              </NavLink>
            </li>
          )}

          <li>
            <Button
              className="mt-3 flex cursor-pointer items-center justify-center text-xs font-medium"
              onClick={handleLogout}
            >
              <IoLogOutOutline className="mr-2 h-4 w-4" />
              <span className="">Déconnexion</span>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
