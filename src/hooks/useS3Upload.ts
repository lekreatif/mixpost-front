import { ApiResponse, Media } from '@/types'
import api from '../services/api'
import { S3Client, ChecksumAlgorithm } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

// Type pour les erreurs d'upload
interface UploadError extends Error {
  uploadId?: string
  key?: string
  part?: number
  status?: number
}

const sanitizeFileName = (fileName: string): string => {
  const [name, ext] = fileName.split('.')
  const sanitized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
  return `${sanitized}.${ext}`
}

// export const useS3Upload = () => {
//   const uploadBlob = async (
//     media: Media,
//     onProgress?: (progress: number) => void
//   ): Promise<string> => {
//     try {
//       const sanitizedFileName = sanitizeFileName(media.fileName);

//       const { data: initData } = await api.post("/upload/init", {
//         fileName: sanitizedFileName,
//       });

//       const { uploadId, key } = initData;
//       const chunkSize = 5 * 1024 * 1024;
//       const chunks = Math.ceil(media.blob.size / chunkSize);
//       const completedParts = [];

//       for (let index = 0; index < chunks; index++) {
//         const start = index * chunkSize;
//         const end = Math.min(start + chunkSize, media.blob.size);
//         const chunk = media.blob.slice(start, end);

//         const formData = new FormData();
//         formData.append("chunk", chunk);
//         formData.append("key", key);
//         formData.append("uploadId", uploadId);
//         formData.append("partNumber", String(index + 1));

//         const response = await api.post("/upload/chunk", formData, {
//           onUploadProgress: progressEvent => {
//             if (onProgress && progressEvent.total) {
//               const chunkProgress =
//                 (progressEvent.loaded / progressEvent.total) * 100;
//               const totalProgress =
//                 ((index + chunkProgress / 100) / chunks) * 100;
//               onProgress(Math.round(totalProgress));
//             }
//           },
//         });

//         completedParts.push({
//           PartNumber: index + 1,
//           ETag: response.data.ETag.replace(/"/g, ""), // Retirer les guillemets
//         });
//       }

//       completedParts.sort((a, b) => a.PartNumber - b.PartNumber);

//       const { data: finalResult } = await api.post("/upload/complete", {
//         uploadId,
//         key,
//         parts: completedParts.map(part => ({
//           ETag: part.ETag, // Gardons l'ETag tel que retourné par S3
//           PartNumber: part.PartNumber,
//         })),
//       });

//       return finalResult.medias[0].url;
//     } catch (error) {
//       console.error("Upload error:", error);
//       throw error;
//     }
//   };

//   const uploadMultipleBlobs = async (
//     medias: Media[],
//     onTotalProgress?: (progress: number) => void
//   ): Promise<string[]> => {
//     const totalSize = medias.reduce((acc, media) => acc + media.blob.size, 0);
//     let uploadedSize = 0;

//     try {
//       const uploadPromises = medias.map(async media => {
//         return uploadBlob(media, progress => {
//           if (onTotalProgress) {
//             const mediaSize = media.blob.size;
//             const mediaUploadedSize = (progress / 100) * mediaSize;
//             uploadedSize = uploadedSize + mediaUploadedSize;
//             const totalProgress = Math.round((uploadedSize / totalSize) * 100);
//             onTotalProgress(totalProgress);
//           }
//         });
//       });

//       return await Promise.all(uploadPromises);
//     } catch (error) {
//       console.error("Multiple upload error:", error);
//       throw error;
//     }
//   };

//   return { uploadBlob, uploadMultipleBlobs };
// };

interface UploadError extends Error {
  key?: string
}

export const useS3Upload = () => {
  const uploadBlob = async (
    media: Media,
    onProgress?: (pct: number) => void
  ): Promise<string> => {
    // 1) Demande des credentials
    const sanitized = sanitizeFileName(media.fileName)
    const { data } = await api.post<
      ApiResponse<{
        bucket: string
        region: string
        key: string
        credentials: {
          accessKeyId: string
          secretAccessKey: string
          sessionToken: string
        }
      }>
    >('/upload/multipart-credentials', {
      fileName: sanitized,
      fileType: media.blob.type,
      fileSize: media.blob.size,
    })
    const { bucket, region, key, credentials } = data.data!

    // 2) Instanciation du client S3
    const s3 = new S3Client({
      region,
      credentials,
      maxAttempts: 3,
    })

    // 3) Lancement du multipart via lib-storage
    const parallelUploads = new Upload({
      client: s3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: media.blob,
        ContentType: media.blob.type,
      },
      queueSize: 2, // 2 uploads en parallèle
      partSize: 25 * 1024 * 1024, // 100 MiB par part
    })

    parallelUploads.on('httpUploadProgress', (progress) => {
      if (onProgress && progress.total) {
        const pct = Math.round((progress.loaded! / progress.total!) * 100)
        onProgress(pct)
      }
    })

    try {
      await parallelUploads.done()
      // URL publique
      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
    } catch (err) {
      const e: UploadError = err instanceof Error ? err : new Error(String(err))
      e.key = key
      throw e
    }
  }

  const uploadMultipleBlobs = async (
    medias: Media[],
    onTotalProgress?: (pct: number) => void
  ): Promise<string[]> => {
    const total = medias.reduce((sum, m) => sum + m.blob.size, 0)
    let uploaded = 0

    return Promise.all(
      medias.map((media) =>
        uploadBlob(media, (pct) => {
          if (onTotalProgress) {
            uploaded += (pct / 100) * media.blob.size
            onTotalProgress(Math.round((uploaded / total) * 100))
          }
        })
      )
    )
  }

  return { uploadBlob, uploadMultipleBlobs }
}
