export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum PostType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  REEL = "REEL",
  STORY = "STORY",
  TEXT = "TEXT"
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface Page {
  name: string
  pageId: string
  profilePicture: string
  users: { userId: number }[]
  profilePictureUrl: string
}

export interface IUser {
  id: number
  email: string
  role: USER_ROLE
}

export interface SocialAccount {
  id: number
  platform: SocialPlatform
  appClientId: string
  appClientSecret: string
  accessToken?: string
  tokenExpiresAt?: Date
  createdAt: Date
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
}

export interface PostData {
  description: string
  isPublic: boolean
  mediaType: MediaType | null
  postType: PostType
  scheduledFor?: number
  pagesIds: string[]
  medias: { url: string, type: MediaType }[]
  videoTitle?: string
  thumbnailUrl?: string
}

export interface Media {
  blob: Blob
  fileName: string
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}
