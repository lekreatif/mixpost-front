import React from "react";
import { RadioGroup, Radio, Label } from "@headlessui/react";
import { PostType } from "@/types";
import { usePostCreation } from "@/hooks/usePostCreation";

const PostTypeSelection: React.FC = () => {
  const { postType, setPostType, setMedias } = usePostCreation();

  const postTypeOptions = [
    { type: PostType.TEXT, label: "Texte" },
    { type: PostType.IMAGE, label: "Image" },
    { type: PostType.VIDEO, label: "Vidéo" },
    { type: PostType.REEL, label: "Reel" },
    { type: PostType.STORY, label: "Story" },
  ];

  return (
    <div className="mb-4 rounded-xl border bg-primary-100 p-4">
      <h2 className="mb-2 font-sans text-base font-medium">
        Type de publication
      </h2>
      <RadioGroup
        value={postType}
        onChange={next => {
          setMedias([]);
          setPostType(next);
        }}
      >
        <div className="mt-2 flex space-x-3">
          {postTypeOptions.map(option => (
            <Radio
              key={option.type}
              value={option.type}
              className={({ checked }) =>
                `${
                  checked
                    ? "bg-secondary-500 text-primary-50"
                    : "border bg-primary-50"
                } relative flex cursor-pointer rounded-lg px-3 py-2 focus:outline-none data-[hover]:ring-secondary-300 data-[hover]:ring-1 text-sm font-light`
              }
            >
              {({ checked }) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <Label
                        as="p"
                        className={`font-light text-xs ${
                          checked ? "text-primary-50" : "text-primary-700"
                        }`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default PostTypeSelection;
