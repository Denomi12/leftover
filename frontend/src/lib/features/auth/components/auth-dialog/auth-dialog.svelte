<script lang="ts">
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import type { AuthMode } from '../../types/auth';
  import LoginForm from '../login-form/login-form.svelte';
  import RegisterForm from '../register-form/register-form.svelte';

  let {
    open = $bindable(false),
    mode = $bindable<AuthMode>('register'),
  }: { open?: boolean; mode?: AuthMode } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    {#if mode === 'login'}
      <LoginForm onSwitchToRegister={() => (mode = 'register')} />
    {:else}
      <RegisterForm onSwitchToLogin={() => (mode = 'login')} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
