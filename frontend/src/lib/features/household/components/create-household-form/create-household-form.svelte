<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import { Input } from '#lib/shared/ui/input/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { householdApi } from '../../api/household.api.js';
  import { mapHouseholdError } from '../../api/household-errors.js';
  import { HOUSEHOLDS_DEPENDENCY, householdPath } from '../../lib/household-routes.js';
  import { createHouseholdSchema, HOUSEHOLD_NAME_MAX_LENGTH } from '../../validations/household.js';

  let {
    id = 'household-name',
    submitLabel = 'Ustvari gospodinjstvo',
    onCreated,
  }: { id?: string; submitLabel?: string; onCreated?: () => void } = $props();

  let name = $state('');
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  const result = $derived(createHouseholdSchema.safeParse({ name }));
  const nameError = $derived(
    submitted && !result.success ? result.error.issues[0]?.message : undefined,
  );

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const household = await householdApi.create(result.data);
      await invalidate(HOUSEHOLDS_DEPENDENCY);
      onCreated?.();
      toast.success(`Gospodinjstvo ${household.name} je ustvarjeno.`);
      await goto(householdPath(household.id));
    } catch (error) {
      formError = mapHouseholdError(error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form {onsubmit} class="flex w-full flex-col gap-4" novalidate>
  <Field.Field data-invalid={!!nameError}>
    <Field.Label for={id}>Ime gospodinjstva</Field.Label>
    <Input
      {id}
      autocomplete="off"
      placeholder="Stanovanje Kotnikova"
      bind:value={name}
      aria-invalid={!!nameError}
    />
    {#if nameError}
      <Field.Error errors={[{ message: nameError }]} />
    {:else}
      <Field.Description>Videli ga bodo vsi člani gospodinjstva.</Field.Description>
    {/if}
  </Field.Field>

  {#if formError}
    <p class="text-sm text-destructive" role="alert">{formError}</p>
  {/if}

  <Button type="submit" class="w-full" disabled={isSubmitting}>
    {#if isSubmitting}
      <Spinner data-icon="inline-start" />
      Počakaj ...
    {:else}
      {submitLabel}
    {/if}
  </Button>
</form>
