import React, { useRef, useMemo, useCallback } from "react";
import { FaImage, FaVideo, FaRegTrashAlt } from "react-icons/fa";
import { Button, Field, Input, Label } from "@headlessui/react";
import { useMediaSelection } from "@/hooks/useMediaSelection";
import VideoThumbnailSelector from "./VideoThumbnailSelector";
import DraggableImageList from "./DraggableImageList";
import { MediaType, VideoRatio } from "@/types";
import { RadioGroup, Radio } from "@headlessui/react";

const MediaSelection: React.FC = () => {
  const {
    mediaType,
    setMediaType,
    handleFileSelection,
    removeFile,
    videoTitle,
    setVideoTitle,
    thumbnail,
    setThumbnail,
    handleCustomThumbnailSelection,
    suggestedThumbnails,
    setSuggestedThumbnails,
    customThumbnail,
    medias,
    videoRatio,
    setVideoRatio,
  } = useMediaSelection();

  const ratioOptions = [
    { id: VideoRatio.ORIGINAL, name: "Original" },
    { id: VideoRatio.SQUARE, name: "Carré (1:1)" },
    { id: VideoRatio.LANDSCAPE, name: "Paysage (16:9)" },
    { id: VideoRatio.PORTRAIT, name: "Vertical (9:16)" },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaTypeSelection = useCallback(
    (type: MediaType) => {
      if (type !== mediaType) setMediaType(type);

      if (fileInputRef.current) {
        fileInputRef.current.accept =
          type === MediaType.IMAGE
            ? "image/jpeg, image/png, image/jpg"
            : "video/mp4";
        fileInputRef.current.multiple = type === MediaType.IMAGE;
        fileInputRef.current.click();
      }
    },
    [setMediaType, mediaType]
  );

  const renderedSelectedFiles = useMemo(() => {
    if (medias.length === 0) {
      return null;
    }
    if (mediaType === MediaType.VIDEO && medias.length > 0) {
      return (
        <div className="flex items-center justify-between rounded-md bg-primary-50 p-2">
          <div className="flex items-center gap-4">
            {suggestedThumbnails.length > 0 && (
              <img
                src={URL.createObjectURL(suggestedThumbnails[1])}
                alt="Video thumbnail"
                className="mr-2 aspect-auto h-16 shrink-0 rounded object-cover"
              />
            )}
            <span className="line-clam-1 block w-60 text-xs font-light">
              {medias[0].fileName}
            </span>
          </div>
          <Button
            onClick={() => removeFile(0)}
            className="bg-primary-50-md rounded border p-1.5 text-red-500"
          >
            <FaRegTrashAlt />
          </Button>
        </div>
      );
    }

    if (mediaType === MediaType.IMAGE) {
      return (
        <>
          {medias.length > 0 ? (
            <DraggableImageList medias={medias} removeFile={removeFile} />
          ) : (
            <p className="text-center text-gray-500">No images selected</p>
          )}
          {medias.length > 0 && medias.length < 10 && (
            <Button
              onClick={() => handleMediaTypeSelection(MediaType.IMAGE)}
              className="mt-4 flex w-52 items-center justify-center rounded-md border border-primary-300 bg-primary-50 p-2 text-sm font-light text-primary-500 data-[hover]:border-secondary-300 data-[hover]:bg-primary-300"
            >
              <FaImage className="mr-2" />
              <span>choisir plus d'images</span>
            </Button>
          )}
        </>
      );
    }

    return null;
  }, [
    mediaType,
    handleMediaTypeSelection,
    removeFile,
    suggestedThumbnails,
    medias,
  ]);

  return (
    <>
      <div className="mb-4 rounded-xl border bg-primary-100 p-4">
        <h2 className="font-sans text-base font-medium">Média</h2>
        <p className="mb-2 text-xs font-light">
          Partagez des photos ou une vidéo. Vous ne pouvez pas excéder 10
          photos.
        </p>
        {medias.length === 0 && (
          <div className="mt-4 flex space-x-4">
            <Button
              onClick={() => handleMediaTypeSelection(MediaType.IMAGE)}
              className="flex flex-1 items-center justify-center rounded-md border border-primary-300 bg-primary-50 p-2 text-sm text-primary-500 data-[hover]:border-secondary-300 data-[hover]:bg-primary-300"
            >
              <FaImage className="mr-2" />
              <span>Images</span>
            </Button>
            <Button
              onClick={() => handleMediaTypeSelection(MediaType.VIDEO)}
              className="flex flex-1 items-center justify-center rounded-md border border-primary-300 bg-primary-50 p-2 text-sm text-primary-500 data-[hover]:border-secondary-300 data-[hover]:bg-primary-300"
            >
              <FaVideo className="mr-2" />
              <span>Vidéo</span>
            </Button>
            <span className="inline-block flex-1"></span>
          </div>
        )}

        {renderedSelectedFiles}

        <Input
          ref={fileInputRef}
          type="file"
          accept={mediaType === MediaType.IMAGE ? "image/*" : "video/*"}
          multiple={mediaType === MediaType.IMAGE}
          onChange={e => {
            handleFileSelection(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>
      {mediaType === MediaType.VIDEO && medias.length > 0 && (
        <div className="mb-4 rounded-xl border bg-primary-100 p-4">
          <Field>
            <Label
              htmlFor="videoTitle"
              className="block text-sm font-medium text-primary-700"
            >
              Titre de la vidéo
            </Label>
            <Input
              type="text"
              id="videoTitle"
              value={videoTitle}
              placeholder={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md border border-primary-300 bg-primary-50 px-4 text-sm font-light text-primary-700 data-[focus]:border-secondary-300 data-[focus]:outline-none sm:text-sm"
            />
          </Field>
          <Field>
            <RadioGroup
              value={videoRatio}
              onChange={setVideoRatio}
              className="mt-4"
            >
              <Label className="block text-sm font-medium text-primary-700">
                Ratio de la vidéo
              </Label>
              <div className="mt-2 flex space-x-3">
                {ratioOptions.map(option => (
                  <Radio
                    key={option.id}
                    value={option.id}
                    className={({ checked }) =>
                      `
          ${checked ? "bg-secondary-500 text-primary-50" : "border bg-primary-50"}
          relative flex cursor-pointer rounded-lg px-3 py-2 focus:outline-none data-[hover]:ring-secondary-300 data-[hover]:ring-1 text-sm font-light`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <Label
                              as="p"
                              className={`font-light text-xs ${checked ? "text-primary-50" : "text-primary-700"}`}
                            >
                              {option.name}
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          </Field>
        </div>
      )}
      {mediaType === MediaType.VIDEO && medias.length > 0 && (
        <div className="mb-4 rounded-xl border bg-primary-100 p-4">
          <VideoThumbnailSelector
            media={medias[0]}
            selectedThumbnail={thumbnail}
            onThumbnailSelect={setThumbnail}
            onCustomThumbnailSelect={handleCustomThumbnailSelection}
            setThumbnails={setSuggestedThumbnails}
            thumbnails={suggestedThumbnails}
            customThumbnail={customThumbnail}
          />
        </div>
      )}
    </>
  );
};

export default MediaSelection;
