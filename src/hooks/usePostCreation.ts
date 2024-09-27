import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { CreatePostContext } from "@/contexts/CreatePostContext";
import localforage from "localforage";
import { MediaType, PostType, Media } from "@/types";
import api from "../services/api";

export function determinePostType(medias: Media[]): PostType {
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
    videoRatio,
  } = context;

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("description", content);
      formData.append("isPublic", isPublic.toString());
      formData.append("postType", determinePostType(medias));
      if (mediaType) {
        formData.append("mediaType", mediaType);
      }
      formData.append("videoRatio", videoRatio);
      selectedPages.forEach(page => {
        formData.append("pagesIds[]", page.pageId);
      });

      if (isScheduled && scheduledDate) {
        formData.append("scheduledFor", scheduledDate.getTime().toString());
      }

      if (mediaType === MediaType.VIDEO && medias.length > 0) {
        formData.append("video", medias[0].blob);
        if (videoTitle) {
          formData.append("videoTitle", videoTitle);
        }
        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }
      } else if (mediaType === MediaType.IMAGE) {
        medias.forEach(media => formData.append(`images`, media.blob));
      }

      return api.post("/post/publish", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
