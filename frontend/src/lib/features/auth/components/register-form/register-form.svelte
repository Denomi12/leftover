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
  import {
    getFieldErrors,
    PASSWORD_MIN_LENGTH,
    registerSchema,
    type RegisterValues,
  } from '../../validations/auth';

  let { onSwitchToLogin }: { onSwitchToLogin: () => void } = $props();

  let values = $state<RegisterValues>({ name: '', email: '', password: '', confirmPassword: '' });
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);
  let emailTakenFor = $state<string | null>(null);

  const result = $derived(registerSchema.safeParse(values));
  const errors = $derived.by(() => {
    const fieldErrors = submitted && !result.success ? getFieldErrors(result.error) : {};
    if (!fieldErrors.email && emailTakenFor && emailTakenFor === values.email) {
      fieldErrors.email = 'Račun s tem e-naslovom že obstaja.';
    }
    return fieldErrors;
  });

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    const { name, email, password } = result.data;
    isSubmitting = true;
    try {
      const session = await authApi.register({ name, email, password });
      auth.setSession(session);
      toast.success(`Dobrodošel, ${session.user.name}!`);
      await goto('/app');
    } catch (error) {
      const { field, message } = mapAuthError(error);
      if (field === 'email') {
        emailTakenFor = values.email;
      } else {
        formError = message;
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Dialog.Header>
  <Dialog.Title>Ustvari račun</Dialog.Title>
  <Dialog.Description>Pridruži se in začni voditi zalogo svojega gospodinjstva</Dialog.Description>
</Dialog.Header>

<form {onsubmit} class="flex flex-col gap-4" novalidate>
  <Field.Group class="gap-3">
    <Field.Field data-invalid={!!errors.name}>
      <Field.Label for="register-name">Ime</Field.Label>
      <Input
        id="register-name"
        autocomplete="name"
        placeholder="Janez Novak"
        bind:value={values.name}
        aria-invalid={!!errors.name}
      />
      <Field.Error errors={[{ message: errors.name }]} />
    </Field.Field>

    <Field.Field data-invalid={!!errors.email}>
      <Field.Label for="register-email">E-naslov</Field.Label>
      <Input
        id="register-email"
        type="email"
        autocomplete="email"
        placeholder="ti@primer.si"
        bind:value={values.email}
        aria-invalid={!!errors.email}
      />
      <Field.Error errors={[{ message: errors.email }]} />
    </Field.Field>

    <Field.Field data-invalid={!!errors.password}>
      <Field.Label for="register-password">Geslo</Field.Label>
      <PasswordInput
        id="register-password"
        autocomplete="new-password"
        placeholder={`Vsaj ${PASSWORD_MIN_LENGTH} znakov`}
        bind:value={values.password}
        aria-invalid={!!errors.password}
      />
      <Field.Error errors={[{ message: errors.password }]} />
    </Field.Field>

    <Field.Field data-invalid={!!errors.confirmPassword}>
      <Field.Label for="register-confirm-password">Ponovi geslo</Field.Label>
      <PasswordInput
        id="register-confirm-password"
        autocomplete="new-password"
        placeholder="Ponovi geslo"
        bind:value={values.confirmPassword}
        aria-invalid={!!errors.confirmPassword}
      />
      <Field.Error errors={[{ message: errors.confirmPassword }]} />
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
      Ustvari račun
    {/if}
  </Button>
</form>

<p class="text-center text-sm text-muted-foreground">
  Že imaš račun?
  <Button variant="link" size="sm" class="px-1" onclick={onSwitchToLogin}>Prijavi se</Button>
</p>
