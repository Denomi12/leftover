import { redirect } from '@sveltejs/kit';
import { auth } from '#lib/features/auth/index.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  await auth.init(fetch);
  if (!auth.isAuthenticated) {
    redirect(307, '/');
  }
};
