export enum USER_ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum PostType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  REEL = "REEL",
  STORY = "STORY",
  TEXT = "TEXT",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export interface Page {
  name: string;
  pageId: string;
  profilePicture: string;
  users: { userId: number }[];
  profilePictureUrl: string;
}

export interface IUser {
  id: number;
  email: string;
  role: USER_ROLE;
  passwordIsTemporary: boolean;
}

export interface SocialAccount {
  id: number;
  platform: SocialPlatform;
  appClientId: string;
  appClientSecret: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
  createdAt: Date;
}

export enum SocialPlatform {
  FACEBOOK = "facebook",
}

export enum VideoRatio {
  ORIGINAL = "original",
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
}

export interface PostData {
  description: string;
  isPublic: boolean;
  mediaType: MediaType | null;
  postType: PostType;
  scheduledFor?: number;
  pagesIds: string[];
  medias?: { url: string; type: MediaType }[];
  videoTitle?: string;
  thumbnailUrl?: string;
  videoRatio: VideoRatio;
}

export interface Media {
  blob: Blob;
  fileName: string;
  type: MediaType;
  size?: MediaSize;
}
export interface MediaSize {
  width: number;
  height: number;
}

export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
}

// src/types/upload.ts
export interface UploadMetadata {
  postId: string;
}

export interface ChunkMetadata {
  chunkIndex: number;
}

export interface UploadStatus {
  uploadId: string;
  progress: number;
}

// src/types/post.ts
export interface CreatePostResponse {
  postId: string;
}

export interface PublishPostData {
  videoUrl: string;
}

// src/types/network.ts
export interface NetworkSpeed {
  mbps: number;
}

// Pour le Web Worker
export interface WorkerMessage {
  type: "progress" | "complete" | "error";
  progress?: number;
  error?: string;
}

export interface WorkerInitData {
  file: File;
  uploadId: string;
  chunkSize: number;
  apiEndpoint: string;
}
