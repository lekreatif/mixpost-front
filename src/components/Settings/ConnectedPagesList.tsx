import React from "react";
import { Page } from "@/types";

interface ConnectedPagesListProps {
  pages: Page[];
  onPageClick: (page: Page) => void;
  isLoading: boolean;
}

const ConnectedPagesList: React.FC<ConnectedPagesListProps> = ({
  pages,
  onPageClick,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="group flex flex-col justify-center gap-1 items-center">
              <div className="relative inline-block aspect-square w-9 cursor-pointer rounded-full border-2 border-primary-100 bg-primary-200 animate-pulse">
                <div className="aspect-square w-full rounded-full bg-primary-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3 lg:grid-cols-5">
      {pages.map(page => (
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
  );
};

export default ConnectedPagesList;
