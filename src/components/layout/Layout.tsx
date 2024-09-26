import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Navigation/Sidebar";
import Navbar from "../Navigation/Navbar";
import MainContent from "./MainContent";
import { useLogout } from "@/hooks/useLogout";
import { FullPageLoader } from "./FullPageLoader";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { status } = useLogout();
  const isLoading = useMemo(() => status === "pending", [status]);

  if (isLoading) return <FullPageLoader />;

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-40">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
}
