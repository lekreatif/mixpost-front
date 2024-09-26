import React, { createContext, useState } from "react";
import { MediaType, Page, VideoRatio } from "@/types";
import { useLocalStoragePost } from "@/hooks/useLocalStoragePost";

export interface MediaSize {
  width: number;
  height: number;
}

export interface Media {
  blob: Blob;
  fileName: string;
  size?: MediaSize;
}

interface CreatePostContextType {
  selectedPages: Page[];
  setSelectedPages: (pages: Page[]) => void;
  mediaType: MediaType | null;
  setMediaType: (type: MediaType | null) => void;
  content: string;
  setContent: (content: string) => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
  scheduledDate: Date | null;
  setScheduledDate: (date: Date | null) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  thumbnail: Blob | null;
  setThumbnail: (thumbnail: Blob | null) => void;
  isPublishing: boolean;
  setIsPublishing: (isPublishing: boolean) => void;
  videoRatio: VideoRatio;
  setVideoRatio: (ratio: VideoRatio) => void;
}

export const CreatePostContext = createContext<
  CreatePostContextType | undefined
>(undefined);

export const CreatePostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPages, setSelectedPages] = useLocalStoragePost<Page[]>(
    "selectedPages",
    []
  );

  const [content, setContent] = useLocalStoragePost<string>("content", "");
  const [isScheduled, setIsScheduled] = useLocalStoragePost<boolean>(
    "isScheduled",
    false
  );
  const [mediaType, setMediaType] = useLocalStoragePost<MediaType | null>(
    "mediaType",
    null
  );
  const [scheduledDate, setScheduledDate] = useLocalStoragePost<Date | null>(
    "scheduledDate",
    null
  );
  const [isPublic, setIsPublic] = useLocalStoragePost<boolean>(
    "isPublic",
    true
  );
  const [medias, setMedias] = useLocalStoragePost<Media[]>("medias", []);

  const [videoTitle, setVideoTitle] = useLocalStoragePost("videoTitle", "");

  const [thumbnail, setThumbnail] = useLocalStoragePost<Blob | null>(
    "thumbnail",
    null
  );

  const [videoRatio, setVideoRatio] = useLocalStoragePost<VideoRatio>(
    "videoRatio",
    VideoRatio.ORIGINAL
  );

  const [isPublishing, setIsPublishing] = useState(false);
  return (
    <CreatePostContext.Provider
      value={{
        selectedPages,
        setSelectedPages,
        mediaType,
        setMediaType,
        content,
        setContent,
        isScheduled,
        setIsScheduled,
        scheduledDate,
        setScheduledDate,
        isPublic,
        setIsPublic,
        medias,
        setMedias,
        videoTitle,
        setVideoTitle,
        thumbnail,
        setThumbnail,
        isPublishing,
        setIsPublishing,
        videoRatio,
        setVideoRatio,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};
