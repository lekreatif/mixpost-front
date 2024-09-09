export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Page {
  name: string
  pageId: string
  profilePicture: string
}

export interface IUser {
  id: number
  email: string
  role: USER_ROLE
}

export interface SocialAccount {
  id: number;
  platform: string;
  appClientId: string;
  appClientSecret: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
  createdAt: Date;
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
}
