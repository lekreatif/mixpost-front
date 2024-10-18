import { Media } from "@/types";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";

export const useS3Upload = () => {
  const {
    VITE_S3_ACCESS_KEY,
    VITE_S3_SECRET_KEY,
    VITE_S3_REGION,
    VITE_S3_BUCKET,
  } = import.meta.env;

  // Valider les variables d'environnement
  if (
    !VITE_S3_ACCESS_KEY ||
    !VITE_S3_SECRET_KEY ||
    !VITE_S3_REGION ||
    !VITE_S3_BUCKET
  ) {
    throw new Error(
      "Configuration S3 manquante dans les variables d'environnement."
    );
  }

  // Configuration AWS
  AWS.config.update({
    accessKeyId: VITE_S3_ACCESS_KEY,
    secretAccessKey: VITE_S3_SECRET_KEY,
  });

  const s3 = new S3({
    params: {
      Bucket: VITE_S3_BUCKET,
    },
    region: VITE_S3_REGION,
  });

  const uploadBlob = async (
    file: Media,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const params = {
      Bucket: VITE_S3_BUCKET,
      Key: file.fileName,
      Body: file.blob,
      ContentType: file.blob.type,
    };

    try {
      const managedUpload = s3.upload(params);

      managedUpload.on("httpUploadProgress", evt => {
        const progress = Math.round((evt.loaded * 100) / evt.total);
        if (onProgress) {
          onProgress(progress);
        }
      });

      const result = await managedUpload.promise();
      return result.Location; // Retourne l'URL du fichier téléchargé
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      if (error instanceof Error) {
        if (error.name === "RequestAbortedError") {
          console.error("Le téléchargement a été interrompu.");
        } else if (error.name === "NetworkingError") {
          console.error("Erreur réseau lors du téléchargement.");
        }
      }
      throw error;
    }
  };

  const uploadMultipleBlobs = async (
    files: Media[],
    onTotalProgress?: (progress: number) => void
  ): Promise<string[]> => {
    const totalSize = files.reduce((acc, file) => acc + file.blob.size, 0);
    let uploadedSize = 0;

    const uploadPromises = files.map(file => {
      return uploadBlob(file, progress => {
        const blobSize = file.blob.size;
        const blobUploadedSize = (progress / 100) * blobSize;
        uploadedSize += blobUploadedSize;
        const totalProgress = Math.round((uploadedSize / totalSize) * 100);
        if (onTotalProgress) {
          onTotalProgress(totalProgress);
        }
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error(
        "Erreur lors du téléchargement multiple de fichiers:",
        error
      );
      throw error;
    }
  };

  return { uploadBlob, uploadMultipleBlobs };
};
