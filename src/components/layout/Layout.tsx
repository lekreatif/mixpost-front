import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Navigation/Sidebar";
import Navbar from "../Navigation/Navbar";
import MainContent from "./MainContent";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
