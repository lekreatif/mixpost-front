import { useEffect, useState } from "react";

export const useVideoDuration = (
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  return duration;
};
