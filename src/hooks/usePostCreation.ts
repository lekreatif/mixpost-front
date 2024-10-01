import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { CreatePostContext } from "@/contexts/CreatePostContext";
import localforage from "localforage";
import { MediaType, PostType } from "@/types";
import api from "../services/api";

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
    postType,
    videoDuration,
  } = context;

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("description", content);
      formData.append("isPublic", isPublic.toString());
      formData.append("postType", postType);
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

  const validateContent = useCallback(
    () =>
      !content && medias.length === 0
        ? "Vous devez ajouter du texte ou au moins un média."
        : null,
    [content, medias.length]
  );

  const validateVideoTitle = useCallback(
    () =>
      mediaType === MediaType.VIDEO && !videoTitle
        ? "Un titre est requis pour la vidéo."
        : null,
    [mediaType, videoTitle]
  );

  const validateVideoDuration = useCallback(
    () =>
      mediaType === MediaType.VIDEO &&
      (!videoDuration ||
        (postType === PostType.REEL &&
          (videoDuration < 3 || videoDuration > 90)) ||
        (postType === PostType.STORY &&
          (videoDuration < 3 || videoDuration > 60)))
        ? "La vidéo doit être d'au moins 3 secondes et ne dois pas dépasser 90s pour les réels et 60s pour les story."
        : null,
    [mediaType, videoDuration, postType]
  );

  const validateSchedule = useCallback(
    () =>
      isScheduled && !scheduledDate
        ? "Veuillez sélectionner une date de programmation."
        : null,
    [isScheduled, scheduledDate]
  );

  const validatePageSelection = useCallback(
    () =>
      selectedPages.length === 0
        ? "Veuillez sélectionner au moins une page pour publier."
        : null,
    [selectedPages.length]
  );

  const validatePost = useCallback((): string[] => {
    const validationFunctions = [
      validateContent,
      validateVideoTitle,
      validateVideoDuration,
      validateSchedule,
      validatePageSelection,
    ];

    return validationFunctions
      .map(fn => fn())
      .filter(
        (
          error
        ): error is
          | "Vous devez ajouter du texte ou au moins un média."
          | "Veuillez sélectionner au moins une page pour publier."
          | "Un titre est requis pour la vidéo."
          | "La vidéo doit être d'au moins 3 secondes et ne dois pas dépasser 90s pour les réels et 60s pour les story."
          | "Veuillez sélectionner une date de programmation." => error !== null
      );
  }, [
    validateContent,
    validateVideoTitle,
    validateVideoDuration,
    validateSchedule,
    validatePageSelection,
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
