import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Navigation/Sidebar'
import { LiaGripLinesSolid } from 'react-icons/lia'
import { Button } from '@headlessui/react'

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div className="bg-primary-50 relative flex h-dvh w-dvw max-w-[100rem] mx-auto">
      <Sidebar
        handleClose={toggleSidebar}
        className={`bg-primary-50 fixed left-0 top-0 z-50 h-full w-40 border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      />
      <div className="fixed flex flex-1 flex-col md:hidden">
        <Button
          className="bg-primary-50 fixed left-4 top-4 z-20 rounded-md border p-1 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <LiaGripLinesSolid className="" />
        </Button>
      </div>
      <main className="bg-primary-50 flex-1 overflow-y-auto overflow-x-hidden p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
