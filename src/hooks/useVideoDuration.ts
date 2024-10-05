import { useEffect, useState, useMemo, useCallback, RefObject } from "react";

type VideoInput = RefObject<HTMLVideoElement> | Blob;

export const useVideoDuration = (input: VideoInput) => {
  const [duration, setDuration] = useState<number | null>(null);

  const videoElement = useMemo(() => {
    if (input instanceof Blob) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(input);
      return video;
    }
    return null;
  }, [input]);

  const handleLoadedMetadata = useCallback(() => {
    const video = input instanceof Blob ? videoElement : input.current;
    if (video) {
      setDuration(video.duration);
    }
  }, [input, videoElement]);

  useEffect(() => {
    const video = input instanceof Blob ? videoElement : input.current;
    if (!video) return;

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (input instanceof Blob && videoElement) {
        URL.revokeObjectURL(videoElement.src);
      }
    };
  }, [input, videoElement, handleLoadedMetadata]);

  return duration;
};

export function getVideoDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error("Erreur lors du chargement de la vidéo"));
    };

    video.src = window.URL.createObjectURL(blob);
  });
}
