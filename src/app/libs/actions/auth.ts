'use server';

import { redirect } from 'next/navigation';

export const login = async () => {
  redirect('/api/auth/signin/github?callbackUrl=/');
};

export const logout = async () => {
  redirect('/api/auth/signout?callbackUrl=/');
};
