import { goto } from '$app/navigation';
import { auth } from '../stores/auth.svelte.js';

export async function logout(): Promise<void> {
  auth.logout();
  await goto('/');
}
