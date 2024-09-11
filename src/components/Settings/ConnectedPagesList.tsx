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
          className="flex cursor-pointer items-center justify-between rounded-lg border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
          onClick={() => onPageClick(page)}
        >
          <img
            src={page.profilePictureUrl}
            alt={page.name}
            className="aspect-square h-10 rounded-full object-cover object-center"
          />
          <div className="">
            <h3 className="text-xs font-semibold">{page.name}</h3>
            <p className="text-primary-600 line-clamp-1 text-xs font-light">
              ID: {page.pageId}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConnectedPagesList
