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
    <div className="relative mx-auto flex h-dvh w-dvw max-w-[100rem] bg-primary-50">
      <Sidebar
        handleClose={toggleSidebar}
        className={`fixed left-0 top-0 z-50 h-full w-40 border-r bg-primary-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      />
      <div className="fixed flex flex-col flex-1 md:hidden">
        <Button
          className="fixed z-20 p-1 border rounded-md left-4 top-4 bg-primary-50 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <LiaGripLinesSolid className="" />
        </Button>
      </div>
      <main className="flex-1 p-2 overflow-x-hidden overflow-y-auto bg-primary-50 sm:p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
