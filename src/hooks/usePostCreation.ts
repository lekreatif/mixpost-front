import { useCallback } from "react";
import { useUpload } from "./useUpload";
import { usePostApi } from "./usePostApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostData } from "@/types";
import { useContext } from "react";
import { CreatePostContext } from "@/contexts/CreatePostContext";
import localforage from "localforage";
import { MediaType, PostType } from "@/types";

export function determinePostType(
  description: string,
  medias: { type: MediaType }[]
): PostType {
  if (medias.length === 0) {
    return PostType.TEXT;
  }

  if (medias.length === 1) {
    return medias[0].type === MediaType.VIDEO ? PostType.VIDEO : PostType.IMAGE;
  }

  return PostType.IMAGE; // Si plusieurs médias, c'est forcément un post de type IMAGE
}

export const usePostCreation = () => {
  const context = useContext(CreatePostContext);
  const { uplaodVideo, uploadMultipleImages, uploadImage } = useUpload();
  const { publish } = usePostApi();
  const queryClient = useQueryClient();

  if (!context)
    throw new Error("useCreatePost must be used within a CreatePostProvider");
  const {
    medias,
    content,
    selectedPages,
    isPublic,
    mediaType,
    videoTitle,
    thumbnail,
    isScheduled,
    scheduledDate,
  } = context;

  const createPostMutation = useMutation({
    mutationFn: async () => {
      let mediaUrls: { url: string; type: MediaType }[] = [];
      let thumbnailUrl = null;

      if (mediaType === MediaType.VIDEO) {
        const [mediaRes, thumbnailRes] = await Promise.all([
          uplaodVideo.mutateAsync(medias[0].blob),
          thumbnail ? uploadImage.mutateAsync(thumbnail) : null,
        ]);
        mediaUrls = mediaRes.data.medias.map(m => ({
          ...m,
          type: MediaType.VIDEO,
        }));
        thumbnailUrl = thumbnailRes?.data.medias[0].url;
      } else if (mediaType === MediaType.IMAGE) {
        const mediaRes = await uploadMultipleImages.mutateAsync(
          medias.map(media => media.blob)
        );
        mediaUrls = mediaRes.data.medias.map(m => ({
          ...m,
          type: MediaType.IMAGE,
        }));
      }

      const postType = determinePostType(content, mediaUrls);

      const postData: PostData = {
        description: content,
        medias: mediaUrls,
        pagesIds: selectedPages.map(p => p.pageId),
        isPublic,
        mediaType,
        postType,
        videoTitle: mediaType === MediaType.VIDEO ? videoTitle : undefined,
        thumbnailUrl: thumbnailUrl ? thumbnailUrl : undefined,
      };

      return publish.mutateAsync(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const validatePost = useCallback((): string[] => {
    const errors: string[] = [];

    if (!content && medias.length === 0) {
      errors.push("Vous devez ajouter du texte ou au moins un média.");
    }

    if (mediaType === MediaType.VIDEO) {
      if (!videoTitle) {
        errors.push("Un titre est requis pour la vidéo.");
      }
    }

    if (isScheduled && !scheduledDate) {
      errors.push("Veuillez sélectionner une date de programmation.");
    }

    if (selectedPages.length === 0) {
      errors.push("Veuillez sélectionner au moins une page pour publier.");
    }

    return errors;
  }, [
    videoTitle,
    content,
    isScheduled,
    mediaType,
    medias.length,
    scheduledDate,
    selectedPages.length,
  ]);

  const clearStoredData = async () => {
    context.setSelectedPages([]);
    context.setContent("");
    context.setMediaType(null);
    context.setMedias([]);
    context.setIsScheduled(false);
    context.setScheduledDate(null);
    context.setIsPublic(true);

    await localforage.clear();
  };

  return { createPostMutation, ...context, clearStoredData, validatePost };
};
