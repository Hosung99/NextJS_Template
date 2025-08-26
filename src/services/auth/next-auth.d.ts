import { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    expireAt: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    expireAt: number;
  }
}

// JWT 타입을 명시적으로 사용하여 lint 오류 방지
export type { JWT };
