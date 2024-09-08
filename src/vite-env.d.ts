/// <reference types="vite/client" />

import * as Types from './types'

declare global {
  type UserRole = Types.USER_ROLE
  type User = Types.IUser
  // Ajoutez d'autres types globaux si nécessaire
}
