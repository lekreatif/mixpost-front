import React from 'react'
import { Page } from '@/types'

interface ConnectedPagesListProps {
  pages: Page[]
  onPageClick: (page: Page) => void
}

const ConnectedPagesList: React.FC<ConnectedPagesListProps> = ({
  pages,
  onPageClick,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3 lg:grid-cols-5">
      {pages.map((page) => (
        <div
          key={page.pageId}
          className="flex items-center justify-between p-4 transition-shadow duration-200 border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
          onClick={() => onPageClick(page)}
        >
          <img
            src={page.profilePictureUrl}
            alt={page.name}
            className="object-cover object-center h-10 rounded-full aspect-square"
          />
          <div className="">
            <h3 className="text-xs font-semibold">{page.name}</h3>
            <p className="text-xs font-light text-gray-600 line-clamp-1">
              ID: {page.pageId}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConnectedPagesList
