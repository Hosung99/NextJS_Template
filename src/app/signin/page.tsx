'use client';

import { login } from '@/app/libs/actions/auth';

export default function Signin() {
  return (
    <div>
      <p>You Are Not Signed In</p>
      <button onClick={() => login()}>Sign in With Github</button>
    </div>
  );
}
