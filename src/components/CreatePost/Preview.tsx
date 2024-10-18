import React, { useMemo, useRef, useCallback } from "react";
import { Page, VideoRatio, PostType, Media } from "@/types";
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatLight } from "react-icons/pi";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import {
  SingleImageDisplay,
  TwoImageDisplay,
  ThreeImageDisplay,
  FourImageDisplay,
} from "./ImagesDisplay";
import { usePostCreation } from "@/hooks/usePostCreation";

const TextPreview = ({
  content,
  useOneLine,
}: {
  content: string;
  useOneLine?: boolean;
}) => {
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIndex) => {
      const parts = line.split(/(#\w+)/g);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) =>
            part.startsWith("#") ? (
              <span key={partIndex} className="text-info-500">
                {part}
              </span>
            ) : (
              part
            )
          )}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };
  const renderedContent = useMemo(() => renderContent(content), [content]);
  return (
    <p
      className={`whitespace-pre-line px-4  ${useOneLine ? "text-xs line-clamp-1" : "text-sm"}`}
    >
      {renderedContent}
    </p>
  );
};

const ImagePreview = ({
  medias,
  content,
}: {
  medias: { blob: Blob; fileName: string }[];
  content: string;
}) => {
  const displays: { [key: number]: React.ReactElement } = {
    1: <SingleImageDisplay {...medias[0]} />,
    2: <TwoImageDisplay medias={medias} />,
    3: <ThreeImageDisplay medias={medias} />,
    4: <FourImageDisplay medias={medias} />,
  };
  return (
    <div className="flex flex-col gap-2">
      <TextPreview content={content} />
      <div className="mb-0 flex items-center justify-center">
        {displays[medias.length]}
      </div>
    </div>
  );
};

interface VideoPreviewProps {
  medias: Media[];
  aspectRatio: number;
  content: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  medias,
  aspectRatio,
  content,
}) => {
  // const containerStyle = useMemo(
  //   () => ({
  //     width: "100%",
  //     paddingTop: `${(1 / aspectRatio) * 100}%`,
  //     position: "relative" as const,
  //     margin: "auto",
  //     overflow: "hidden",
  //   }),
  //   [aspectRatio]
  // );

  const videoStyle = useCallback(
    () => ({
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: aspectRatio === 9 / 16 ? `${(400 * 9) / 16}px` : "100%",
      height: aspectRatio === 1 || aspectRatio === 9 / 16 ? "100%" : "auto",
      objectFit: "cover" as const,
    }),
    [aspectRatio]
  );

  const Video = useMemo(() => {
    if (medias.length > 0) {
      return (
        <video
          controls
          src={URL.createObjectURL(medias[0].blob)}
          style={{
            height: "100%",
            aspectRatio: "auto",
            margin: "auto",
          }}
        />
      );
    }
    return null;
  }, [medias, videoStyle]);

  if (!medias.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <TextPreview content={content} />
      <div
        className="flex items-center justify-center bg-primary-950 relative"
        style={{
          width: "100%",
          height: "300px",
        }}
      >
        {Video}
      </div>
    </div>
  );
};

const StoryPreview = ({
  medias,
  page,
  // content,
}: {
  medias: Media[];
  page: Page;
  content: string;
}) => {
  if (!medias.length) return null;

  const media = medias[0];

  return (
    <div className="flex items-center justify-center bg-transparent h-[512px] relative aspect-[9/16] mx-auto">
      {media.type === "VIDEO" ? (
        <video
          src={URL.createObjectURL(media.blob)}
          className="h-full object-cover object-center aspect-[9/16] mx-auto border rounded-xl shadow-sm"
        />
      ) : (
        <img
          src={URL.createObjectURL(media.blob)}
          alt={media.fileName}
          className="h-full object-cover aspect-[9/16] mx-auto border rounded-xl shadow-sm"
        />
      )}
      <div className="absolute p-2 bg-gradient-to-b from-primary-950 to to-transparent to-[20%] inset-0 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="mb-2 flex items-center mt-2">
            <img
              src={page.profilePictureUrl}
              alt={page.name}
              className="mr-2 h-8 w-8 rounded-full border"
            />
            <div>
              <h3 className="font-normal text-primary-50">{page.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary-50">
            <MdOutlineMoreHoriz />
            <IoMdClose />
          </div>
        </div>
        {/* <TextPreview useOneLine={true} content={content} /> */}
      </div>
    </div>
  );
};

const ReelPreview = ({
  medias,
  page,
  content,
}: {
  medias: Media[];
  page: Page;
  content: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, []);

  if (!medias.length) return null;

  const media = medias[0];

  return (
    <div
      className="flex items-center justify-center bg-transparent h-[512px] relative aspect-[9/16] mx-auto"
      onClick={togglePlayPause}
    >
      {media.type === "VIDEO" ? (
        <video
          ref={videoRef}
          onClick={togglePlayPause}
          src={URL.createObjectURL(media.blob)}
          className="h-full object-cover object-center aspect-[9/16] mx-auto border rounded-xl shadow-sm"
          // loop
          autoPlay
        />
      ) : (
        <img
          src={URL.createObjectURL(media.blob)}
          alt={media.fileName}
          className="h-full object-cover aspect-[9/16] mx-auto border rounded-xl shadow-sm"
        />
      )}
      <div className="absolute p-2 bg-gradient-to-b to-primary-950 from-transparent from-[80%] inset-0 rounded-xl z-[10]">
        <div className="absolute bottom-3">
          <div className="flex items-center justify-start gap-2">
            <div className="mb-2 flex items-center mt-2">
              <img
                src={page.profilePictureUrl}
                alt={page.name}
                className="mr-2 h-8 w-8 rounded-full border"
              />
              <div>
                <h3 className="font-normal text-primary-50">{page.name}</h3>
              </div>
            </div>
            <span className="border-primary-50 p-1 border rounded-md text-xs font-normal text-primary-50">
              Suivre
            </span>
          </div>
          <div className="-ml-2 text-primary-50">
            <TextPreview useOneLine={true} content={content} />
          </div>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-50 space-y-4">
          <div className="">
            <SlLike className="stroke-2" />
          </div>
          <div>
            <FaRegComment />
          </div>
          <div>
            <PiShareFatLight className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderPagePreview = ({
  page,
  isPublic,
  content,
  postType,
  medias,
  videoRatio,
}: {
  page: Page;
  isPublic: boolean;
  content: string;
  postType: PostType;
  medias: Media[];
  videoRatio: string;
}) => {
  const MediaPreviewMemo = useMemo(() => {
    switch (postType) {
      case PostType.IMAGE:
        return <ImagePreview content={content} medias={medias} />;
      case PostType.VIDEO:
        return (
          <VideoPreview
            medias={medias}
            aspectRatio={videoRatio === VideoRatio.SQUARE ? 1 : 16 / 9}
            content={content}
          />
        );
      case PostType.REEL:
        return <ReelPreview medias={medias} page={page} content={content} />;
      case PostType.STORY:
        return <StoryPreview medias={medias} page={page} content={content} />;
      case PostType.TEXT:
      default:
        return null;
    }
  }, [postType, medias, videoRatio, content, page]);

  const ContentPreviewMemo = useMemo(() => {
    if (postType === PostType.TEXT) {
      return <TextPreview content={content} />;
    }
    return null;
  }, [content, postType]);

  return (
    <div
      key={page.pageId}
      className={`mb-4 space-y-4 overflow-hidden rounded-lg  bg-primary-50 pt-0 ${postType !== PostType.STORY && postType !== PostType.REEL && "border"}`}
    >
      {postType !== PostType.STORY && postType !== PostType.REEL ? (
        <div className="mb-2 flex items-center px-4 pt-4">
          <img
            src={page.profilePictureUrl}
            alt={page.name}
            className="mr-2 h-10 w-10 rounded-full border"
          />
          <div>
            <h3 className="font-semibold">{page.name}</h3>
            <p className="text-xs text-primary-500">
              {isPublic ? "Public" : "Privé"} • Juste maintenant
            </p>
          </div>
        </div>
      ) : null}
      {ContentPreviewMemo}
      {MediaPreviewMemo}
      {postType !== PostType.STORY && postType !== PostType.REEL ? (
        <div className="flex justify-around pb-6 pt-1">
          <div className="flex items-center justify-center">
            <SlLike className="mr-2" />
            <span>J'aime</span>
          </div>
          <div className="flex items-center justify-center">
            <FaRegComment className="mr-2" />
            <span>Commenter</span>
          </div>
          <div className="flex items-center justify-center">
            <PiShareFatLight className="mr-2 h-6" />
            <span>Partager</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Preview: React.FC = React.memo(() => {
  const { selectedPages, content, postType, isPublic, medias, videoRatio } =
    usePostCreation();

  const RenderedPreviewsMemo = useMemo(
    () =>
      selectedPages.map(page => (
        <RenderPagePreview
          isPublic={isPublic}
          page={page}
          content={content}
          postType={postType}
          medias={medias}
          key={page.pageId}
          videoRatio={videoRatio}
        />
      )),
    [selectedPages, isPublic, content, postType, medias, videoRatio]
  );

  return (
    <div className="rounded-lg bg-primary-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">Aperçu</h2>
      {selectedPages.length === 0 ? (
        <p className="text-primary-500">
          Sélectionnez au moins une page pour voir l'aperçu.
        </p>
      ) : (
        <div className="space-y-4">{RenderedPreviewsMemo}</div>
      )}
    </div>
  );
});

export default Preview;
