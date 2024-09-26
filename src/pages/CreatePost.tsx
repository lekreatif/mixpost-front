import React from "react";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { CreatePostProvider } from "@/contexts/CreatePostContext";
import PageSelection from "@/components/CreatePost/PageSelection";
import MediaSelection from "@/components/CreatePost/MediaSelection";
import ContentEditor from "@/components/CreatePost/ContentEditor";
import ScheduleSection from "@/components/CreatePost/ScheduleSection";
import VisibilitySection from "@/components/CreatePost/VisibilitySection";
import ActionButtons from "@/components/CreatePost/ActionButtons";
import Preview from "@/components/CreatePost/Preview";

const CreatePostPage: React.FC = () => {
  const tabs = [
    {
      name: "Édition",
      content: (
        <>
          <PageSelection />
          <MediaSelection />
          <ContentEditor />
          <ScheduleSection />
          <VisibilitySection />
        </>
      ),
    },
    { name: "Aperçu", content: <Preview /> },
  ];

  return (
    <CreatePostProvider>
      <div className="flex flex-col h-full md:flex-row md:justify-between md:gap-8 pt-0">
        <TabGroup as="div" className="flex-1 md:max-w-[40rem]">
          <TabList className="flex space-x-1 rounded-xl bg-primary-200 p-1 md:hidden">
            {tabs.map(tab => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-600
                   ring-white ring-opacity-60 ring-offset-2 ring-offset-secondary-400 focus:outline-none focus:ring-1
                   ${selected ? "bg-secondary-50 shadow text-secondary-700" : ""}`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
          <div className="z-10 hidden md:block w-full max-w-xs pb-4 pt-2 font-medium text-lg">
            Créer une publication
          </div>
          <TabPanels className="mt-2 md:mt-0">
            <TabPanel className="rounded-xl bg-transparent p-3 md:p-0 md:bg-transparent">
              <div className="relative flex-grow pb-4 space-y-8 overflow-y-auto">
                {tabs[0].content}
              </div>
            </TabPanel>
            <TabPanel className="rounded-xl bg-white p-3 md:hidden">
              <div className="overflow-y-auto">{tabs[1].content}</div>
            </TabPanel>
          </TabPanels>
          <ActionButtons />
        </TabGroup>
        <div className="hidden md:block max-w-[32rem] flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-[32rem] overflow-hidden rounded-xl border">
            <Preview />
          </div>
        </div>
      </div>
    </CreatePostProvider>
  );
};

export default CreatePostPage;
