import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { request } from '@/utils/api/request';

import { LoginResponse, RefreshResponse } from '../../../../services/auth/dto';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'userName', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const loginData = {
            username: credentials.username,
            password: credentials.password,
          };
          const user = await request<LoginResponse>('POST', '/login', loginData);
          return user;
        } catch (error) {
          console.error('로그인 중 오류 발생:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expireAt: user.expireAt,
        };
      }

      if (Date.now() < token.expireAt) {
        return token;
      } else {
        try {
          const response = await request<RefreshResponse>('POST', '/auth/refresh', {
            refreshToken: token.refreshToken,
          });

          return {
            ...token,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expireAt: response.expireAt,
          };
        } catch (error) {
          console.error('토큰 갱신 실패', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
