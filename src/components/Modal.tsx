import React from 'react'
import { FaTimes } from 'react-icons/fa'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50`}
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg md:w-[30rem]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

export default Modal
