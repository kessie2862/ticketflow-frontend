// src/types/next-auth.d.ts

import { DefaultSession } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    username: string;
  }

  interface Session {
    user: {
      id: string;
      accessToken: string;
      refreshToken: string;
      role: string;
      username: string;
      error?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    username: string;
    accessTokenExpires: number;
    error?: string;
  }
}
