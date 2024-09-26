import React, { useMemo } from "react";
import { MediaType, Page } from "@/types";
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatLight } from "react-icons/pi";
import {
  SingleImageDisplay,
  TwoImageDisplay,
  ThreeImageDisplay,
  FourImageDisplay,
} from "./ImagesDisplay";
import { usePostCreation } from "@/hooks/usePostCreation";

const RenderMediaPreview = ({
  mediaType,
  medias,
  videoRatio,
}: {
  mediaType: MediaType | null;
  medias: { blob: Blob; fileName: string }[];
  videoRatio: string;
}) => {
  if (
    !mediaType ||
    medias.length === 0 ||
    (mediaType !== MediaType.VIDEO && mediaType !== MediaType.IMAGE)
  )
    return null;

  if (mediaType === MediaType.IMAGE) {
    const displays: { [key: number]: React.ReactElement } = {
      1: <SingleImageDisplay {...medias[0]} />,
      2: <TwoImageDisplay medias={medias} />,
      3: <ThreeImageDisplay medias={medias} />,
      4: <FourImageDisplay medias={medias} />,
    };
    return (
      <div className="mb-0 flex items-center justify-center">
        {displays[medias.length]}
      </div>
    );
  }

  const aspectRatio =
    videoRatio === "1:1"
      ? 1
      : videoRatio === "16:9"
        ? 16 / 9
        : videoRatio === "9:16"
          ? 9 / 16
          : 16 / 9;
  const containerStyle = {
    width: "100%",
    paddingTop: videoRatio === "9:16" ? "400px" : `${(1 / aspectRatio) * 100}%`,
    position: "relative" as const,
    margin: "auto",
  };

  const videoStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: videoRatio === "9:16" ? `${(400 * 9) / 16}px` : "100%",
    height: videoRatio === "1:1" || videoRatio === "9:16" ? "100%" : "auto",
    objectFit: "cover" as const,
  };

  return (
    <div
      className="flex items-center justify-center bg-primary-950"
      style={containerStyle}
    >
      <video
        controls
        src={URL.createObjectURL(medias[0].blob)}
        style={videoStyle}
      />
    </div>
  );
};

const ContentPreview = React.memo(({ content }: { content: string }) => {
  const renderContent = (text: string) => {
    // Séparer le texte en lignes
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
  return <p className="whitespace-pre-line px-4 text-sm">{renderedContent}</p>;
});

const RenderPagePreview = ({
  page,
  isPublic,
  content,
  mediaType,
  medias,
  videoRatio,
}: {
  page: Page;
  isPublic: boolean;
  content: string;
  mediaType: MediaType | null;
  medias: { blob: Blob; fileName: string }[];
  videoRatio: string;
}) => {
  const MediaPreviewMemo = useMemo(
    () => (
      <RenderMediaPreview
        mediaType={mediaType}
        medias={medias}
        videoRatio={videoRatio}
      />
    ),
    [mediaType, medias, videoRatio]
  );

  const ContentPreviewMemo = useMemo(
    () => <ContentPreview content={content} />,
    [content]
  );
  return (
    <div
      key={page.pageId}
      className="mb-4 space-y-4 overflow-hidden rounded-lg border bg-primary-50 pt-4"
    >
      <div className="mb-2 flex items-center px-4">
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
      {ContentPreviewMemo}
      {MediaPreviewMemo}
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
    </div>
  );
};

const Preview: React.FC = React.memo(() => {
  const { selectedPages, content, mediaType, isPublic, medias, videoRatio } =
    usePostCreation();

  const RenderedPreviewsMemo = useMemo(
    () =>
      selectedPages.map(page => (
        <RenderPagePreview
          isPublic={isPublic}
          page={page}
          content={content}
          mediaType={mediaType}
          medias={medias}
          key={page.pageId}
          videoRatio={videoRatio}
        />
      )),
    [selectedPages, isPublic, content, mediaType, medias, videoRatio]
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
