import { Media } from "@/types";
import api from "../services/api";

const sanitizeFileName = (fileName: string): string => {
  const [name, ext] = fileName.split(".");
  const sanitized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
  return `${sanitized}.${ext}`;
};

export const useS3Upload = () => {
  const uploadBlob = async (
    media: Media,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      const sanitizedFileName = sanitizeFileName(media.fileName);

      const { data: initData } = await api.post("/upload/init", {
        fileName: sanitizedFileName,
      });

      const { uploadId, key } = initData;
      const chunkSize = 5 * 1024 * 1024;
      const chunks = Math.ceil(media.blob.size / chunkSize);
      const completedParts = [];

      for (let index = 0; index < chunks; index++) {
        const start = index * chunkSize;
        const end = Math.min(start + chunkSize, media.blob.size);
        const chunk = media.blob.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("key", key);
        formData.append("uploadId", uploadId);
        formData.append("partNumber", String(index + 1));

        const response = await api.post("/upload/chunk", formData, {
          onUploadProgress: progressEvent => {
            if (onProgress && progressEvent.total) {
              const chunkProgress =
                (progressEvent.loaded / progressEvent.total) * 100;
              const totalProgress =
                ((index + chunkProgress / 100) / chunks) * 100;
              onProgress(Math.round(totalProgress));
            }
          },
        });

        completedParts.push({
          PartNumber: index + 1,
          ETag: response.data.ETag.replace(/"/g, ""), // Retirer les guillemets
        });
      }

      completedParts.sort((a, b) => a.PartNumber - b.PartNumber);

      const { data: finalResult } = await api.post("/upload/complete", {
        uploadId,
        key,
        parts: completedParts.map(part => ({
          ETag: part.ETag, // Gardons l'ETag tel que retourné par S3
          PartNumber: part.PartNumber,
        })),
      });

      return finalResult.medias[0].url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const uploadMultipleBlobs = async (
    medias: Media[],
    onTotalProgress?: (progress: number) => void
  ): Promise<string[]> => {
    const totalSize = medias.reduce((acc, media) => acc + media.blob.size, 0);
    let uploadedSize = 0;

    try {
      const uploadPromises = medias.map(async media => {
        return uploadBlob(media, progress => {
          if (onTotalProgress) {
            const mediaSize = media.blob.size;
            const mediaUploadedSize = (progress / 100) * mediaSize;
            uploadedSize = uploadedSize + mediaUploadedSize;
            const totalProgress = Math.round((uploadedSize / totalSize) * 100);
            onTotalProgress(totalProgress);
          }
        });
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Multiple upload error:", error);
      throw error;
    }
  };

  return { uploadBlob, uploadMultipleBlobs };
};
