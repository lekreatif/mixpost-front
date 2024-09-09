import React from 'react';
import { Page } from '@/types';

interface ConnectedPagesListProps {
  pages: Page[];
}

const ConnectedPagesList: React.FC<ConnectedPagesListProps> = ({ pages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pages.map((page) => (
        <div key={page.pageId} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="font-semibold">{page.name}</h3>
          <p className="text-sm text-gray-600">ID: {page.pageId}</p>
        </div>
      ))}
    </div>
  );
};

export default ConnectedPagesList;
