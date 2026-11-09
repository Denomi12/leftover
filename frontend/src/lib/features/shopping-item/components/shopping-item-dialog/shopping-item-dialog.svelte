<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { FOOD_UNIT_LABELS, FOOD_UNITS, type FoodUnit } from '#lib/features/food-item/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import { Input } from '#lib/shared/ui/input/index.js';
  import * as Select from '#lib/shared/ui/select/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { shoppingItemApi } from '../../api/shopping-item.api.js';
  import { mapSaveShoppingItemError } from '../../api/shopping-item-errors.js';
  import { SHOPPING_ITEMS_DEPENDENCY } from '../../lib/shopping-list.js';
  import type { ShoppingItem } from '../../types/shopping-item.js';
  import { createShoppingItemSchema } from '../../validations/shopping-item.js';

  let {
    open = $bindable(false),
    householdId,
    item = null,
  }: { open?: boolean; householdId: string; item?: ShoppingItem | null } = $props();

  const editing = $derived(item !== null);

  let name = $state('');
  let quantity = $state('');
  let unit = $state<FoodUnit>('kos');
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  const result = $derived(createShoppingItemSchema.safeParse({ name, quantity, unit }));

  const errors = $derived.by(() => {
    const map: Record<string, string | undefined> = {};
    if (!submitted || result.success) return map;
    for (const issue of result.error.issues) map[issue.path.join('.')] ??= issue.message;
    return map;
  });

  $effect(() => {
    if (!open) return;
    name = item?.name ?? '';
    quantity = item ? String(item.quantity).replace('.', ',') : '';
    unit = item?.unit ?? 'kos';
    submitted = false;
    formError = null;
  });

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const saved = item
        ? await shoppingItemApi.update(householdId, item.id, result.data)
        : await shoppingItemApi.create(householdId, result.data);
      await invalidate(SHOPPING_ITEMS_DEPENDENCY);
      toast.success(
        item ? `${saved.name} je posodobljeno.` : `${saved.name} je na nakupovalnem seznamu.`,
      );
      open = false;
    } catch (error) {
      formError = mapSaveShoppingItemError(error, editing);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editing ? 'Uredi postavko' : 'Dodaj postavko'}</Dialog.Title>
      <Dialog.Description>
        {editing
          ? 'Popravi ime, količino ali enoto postavke.'
          : 'Dodaj živilo, ki ga želiš kupiti ob naslednjem nakupu.'}
      </Dialog.Description>
    </Dialog.Header>

    <form {onsubmit} class="flex flex-col gap-5" novalidate>
      <Field.Field data-invalid={!!errors.name}>
        <Field.Label for="shopping-item-name">Živilo *</Field.Label>
        <Input
          id="shopping-item-name"
          autocomplete="off"
          placeholder="npr. Mleko"
          bind:value={name}
          aria-invalid={!!errors.name}
        />
        {#if errors.name}
          <Field.Error errors={[{ message: errors.name }]} />
        {/if}
      </Field.Field>

      <div class="grid grid-cols-2 gap-3">
        <Field.Field data-invalid={!!errors.quantity}>
          <Field.Label for="shopping-item-quantity">Količina *</Field.Label>
          <Input
            id="shopping-item-quantity"
            inputmode="decimal"
            autocomplete="off"
            placeholder="npr. 2"
            bind:value={quantity}
            aria-invalid={!!errors.quantity}
          />
          {#if errors.quantity}
            <Field.Error errors={[{ message: errors.quantity }]} />
          {/if}
        </Field.Field>

        <Field.Field data-invalid={!!errors.unit}>
          <Field.Label for="shopping-item-unit">Enota *</Field.Label>
          <Select.Root type="single" bind:value={unit as string}>
            <Select.Trigger id="shopping-item-unit" class="w-full">
              {FOOD_UNIT_LABELS[unit]}
            </Select.Trigger>
            <Select.Content>
              {#each FOOD_UNITS as option (option)}
                <Select.Item value={option} label={FOOD_UNIT_LABELS[option]}>
                  {FOOD_UNIT_LABELS[option]}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
          {#if errors.unit}
            <Field.Error errors={[{ message: errors.unit }]} />
          {/if}
        </Field.Field>
      </div>

      {#if formError}
        <p class="text-sm text-destructive" role="alert">{formError}</p>
      {/if}

      <Dialog.Footer class="gap-2 sm:gap-2">
        <Button type="button" variant="outline" onclick={() => (open = false)}>Prekliči</Button>
        <Button type="submit" class="sm:min-w-28" disabled={isSubmitting}>
          {#if isSubmitting}
            <Spinner data-icon="inline-start" />
            {editing ? 'Shranjujem ...' : 'Dodajam ...'}
          {:else}
            {editing ? 'Shrani' : 'Dodaj'}
          {/if}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
