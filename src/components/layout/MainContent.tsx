import React from "react";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <div className="px-4 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
