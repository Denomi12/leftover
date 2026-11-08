<script lang="ts">
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { PasswordInput } from '#lib/shared/components/password-input/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import { Input } from '#lib/shared/ui/input/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { authApi } from '../../api/auth.api';
  import { mapAuthError } from '../../api/auth-errors';
  import { auth } from '../../stores/auth.svelte';
  import { getFieldErrors, loginSchema, type LoginValues } from '../../validations/auth';

  let { onSwitchToRegister }: { onSwitchToRegister: () => void } = $props();

  let values = $state<LoginValues>({ email: '', password: '' });
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  const result = $derived(loginSchema.safeParse(values));
  const errors = $derived(submitted && !result.success ? getFieldErrors(result.error) : {});

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const session = await authApi.login(result.data);
      auth.setSession(session);
      toast.success(`Dobrodošel nazaj, ${session.user.name}!`);
      await goto('/app');
    } catch (error) {
      formError = mapAuthError(error).message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Dialog.Header>
  <Dialog.Title>Dobrodošel nazaj</Dialog.Title>
  <Dialog.Description>Prijavi se v svoj račun</Dialog.Description>
</Dialog.Header>

<form {onsubmit} class="flex flex-col gap-4" novalidate>
  <Field.Group class="gap-3">
    <Field.Field data-invalid={!!errors.email}>
      <Field.Label for="login-email">E-naslov</Field.Label>
      <Input
        id="login-email"
        type="email"
        autocomplete="email"
        placeholder="ti@primer.si"
        bind:value={values.email}
        aria-invalid={!!errors.email}
      />
      <Field.Error errors={[{ message: errors.email }]} />
    </Field.Field>

    <Field.Field data-invalid={!!errors.password}>
      <Field.Label for="login-password">Geslo</Field.Label>
      <PasswordInput
        id="login-password"
        autocomplete="current-password"
        placeholder="Vnesi geslo"
        bind:value={values.password}
        aria-invalid={!!errors.password}
      />
      <Field.Error errors={[{ message: errors.password }]} />
    </Field.Field>
  </Field.Group>

  {#if formError}
    <p class="text-sm text-destructive" role="alert">{formError}</p>
  {/if}

  <Button type="submit" class="w-full" disabled={isSubmitting}>
    {#if isSubmitting}
      <Spinner data-icon="inline-start" />
      Počakaj ...
    {:else}
      Prijava
    {/if}
  </Button>
</form>

<p class="text-center text-sm text-muted-foreground">
  Še nimaš računa?
  <Button variant="link" size="sm" class="px-1" onclick={onSwitchToRegister}>Registriraj se</Button>
</p>
