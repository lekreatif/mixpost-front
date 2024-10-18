import React from "react";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { CreatePostProvider } from "@/contexts/CreatePostContext";
import PageSelection from "@/components/CreatePost/PageSelection";
import MediaSelection from "@/components/CreatePost/MediaSelection";
import ContentEditor from "@/components/CreatePost/ContentEditor";
// import ScheduleSection from "@/components/CreatePost/ScheduleSection";
import VisibilitySection from "@/components/CreatePost/VisibilitySection";
import ActionButtons from "@/components/CreatePost/ActionButtons";
import PostTypeSelection from "@/components/CreatePost/PostTypeSelection";
import Preview from "@/components/CreatePost/Preview";
import { PostType } from "@/types";
import { usePostCreation } from "@/hooks/usePostCreation";

const ProgressBar = ({
  isPublishing,
  progress,
}: {
  isPublishing: boolean;
  progress: number;
}) => {
  return (
    <>
      {isPublishing ? (
        <div className="absolute inset-0 bg-primary-50/80 flex items-center justify-center z-[99] text-primary-950">
          <div className="w-40 h-10 bg-primary-50 border rounded relative overflow-hidden flex justify-center items-center">
            <div className="absolute top-0 left-0 w-full animate-pulse z-[1] h-full"></div>
            <div
              className="absolute top-0 left-0 bg-secondary-300 h-full z-[2] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="relative z-[3] w-full h-full flex items-center justify-center overflow-hidden">
              <span className="text-sm font-light relative mix-blend-difference">
                {progress < 100 ? (
                  <>En cours {progress}%</>
                ) : (
                  <div role="status" className="flex gap-2 items-center">
                    <span>Finalisation...</span>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-primary-950 animate-spin  fill-secondary-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const CreatePostPage: React.FC = () => {
  const { postType, isPublishing, progress } = usePostCreation();

  const renderContentBasedOnPostType = () => {
    switch (postType) {
      case PostType.TEXT:
        return (
          <>
            <ContentEditor />
            <VisibilitySection />
          </>
        );
      case PostType.STORY:
        return (
          <>
            <MediaSelection />
            <VisibilitySection />
          </>
        );
      case PostType.IMAGE:
      case PostType.VIDEO:
      case PostType.REEL:
        return (
          <>
            <MediaSelection />
            <ContentEditor />
            <VisibilitySection />
          </>
        );
      default:
        return null;
    }
  };

  const tabs = [
    {
      name: "Édition",
      content: (
        <>
          <PostTypeSelection />
          <PageSelection />
          {renderContentBasedOnPostType()}
        </>
      ),
    },
    { name: "Aperçu", content: <Preview /> },
  ];

  return (
    <div className="relative pt-4">
      <div className="flex flex-col md:flex-row md:justify-between md:gap-8 pt-0 relative overflow-auto">
        <div className="flex-1 space-y-8 pt-4 hidden md:block  h-[calc(100dvh_-_40px)] overflow-auto relative">
          {tabs[0].content}
          <div className="w-full sticky -bottom-0 left-0 bg-primary-50 z-[99] p-2">
            <ActionButtons />
          </div>
        </div>
        <div className="hidden md:block max-w-[32rem] flex-1 overflow-hidden p-4">
          <div className="mx-auto max-w-[32rem] rounded-xl border overflow-hidden">
            {tabs[1].content}
          </div>
        </div>
      </div>
      <TabGroup
        as="div"
        className="flex-1 md:max-w-[40rem] md:hidden h-[calc(100dvh_-_40px)] overflow-auto"
      >
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
        <div className="z-10 hidden md:block w-full max-w-xs pb-4 pt-2 font-medium text-lg  overflow-hidden">
          Créer une publication
        </div>
        <TabPanels className="mt-2 md:mt-0">
          <TabPanel className="rounded-xl bg-transparent p-3 md:p-0 md:bg-transparent">
            <div className="relative flex-grow pb-4 space-y-8 overflow-hidden max-h-full">
              {tabs[0].content}
            </div>
          </TabPanel>
          <TabPanel className="rounded-xl bg-white p-3 md:hidden">
            <div className="overflow-y-auto">{tabs[1].content}</div>
          </TabPanel>
        </TabPanels>
        <div className="w-full sticky -bottom-0 left-0 bg-primary-50 z-[99] p-2">
          <ActionButtons />
        </div>
      </TabGroup>
      <ProgressBar isPublishing={isPublishing} progress={progress} />
    </div>
  );
};

export default function Page() {
  return (
    <CreatePostProvider>
      <CreatePostPage />
    </CreatePostProvider>
  );
}
