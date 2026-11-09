<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { parseDate, type DateValue } from '@internationalized/date';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import XIcon from '@lucide/svelte/icons/x';
  import { untrack } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Button } from '#lib/shared/ui/button/index.js';
  import { Calendar } from '#lib/shared/ui/calendar/index.js';
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import { Input } from '#lib/shared/ui/input/index.js';
  import * as Popover from '#lib/shared/ui/popover/index.js';
  import * as Select from '#lib/shared/ui/select/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { foodItemApi } from '../../api/food-item.api.js';
  import { mapSaveFoodItemError } from '../../api/food-item-errors.js';
  import { currentDate, formatExpiration } from '../../lib/expiration.js';
  import { FOOD_CATEGORIES, FOOD_CATEGORY_OPTIONS } from '../../lib/food-categories.js';
  import { FOOD_ITEMS_DEPENDENCY } from '../../lib/food-item-routes.js';
  import { FOOD_UNIT_LABELS, FOOD_UNITS } from '../../lib/food-units.js';
  import type { FoodCategory, FoodItem, FoodUnit } from '../../types/food-item.js';
  import { createFoodItemSchema } from '../../validations/food-item.js';

  let {
    householdId,
    item = null,
    initialCategory = null,
    onsaved,
    oncancel,
  }: {
    householdId: string;
    item?: FoodItem | null;
    initialCategory?: FoodCategory | null;
    onsaved?: (item: FoodItem) => void;
    oncancel?: () => void;
  } = $props();

  const initial = untrack(() => item);
  const editing = initial !== null;

  let name = $state(initial?.name ?? '');
  let quantity = $state(initial ? String(initial.quantity).replace('.', ',') : '1');
  let unit = $state<FoodUnit>(initial?.unit ?? 'kos');
  let category = $state<string>(initial?.category ?? untrack(() => initialCategory) ?? '');
  let expiration = $state<DateValue | undefined>(
    initial?.expirationDate ? parseDate(initial.expirationDate) : undefined,
  );
  let calendarOpen = $state(false);

  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  const result = $derived(
    createFoodItemSchema.safeParse({
      name,
      quantity,
      unit,
      category: category || undefined,
      expirationDate: expiration?.toString() ?? null,
    }),
  );

  const errors = $derived.by(() => {
    if (!submitted || result.success) return {} as Record<string, string | undefined>;
    const map: Record<string, string | undefined> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      map[key] ??= issue.message;
    }
    return map;
  });

  const categoryMeta = $derived(category ? FOOD_CATEGORIES[category as FoodCategory] : null);

  function selectDate(value: DateValue | undefined) {
    expiration = value;
    calendarOpen = false;
  }

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const saved = initial
        ? await foodItemApi.update(householdId, initial.id, result.data)
        : await foodItemApi.create(householdId, result.data);
      await invalidate(FOOD_ITEMS_DEPENDENCY);
      toast.success(editing ? `${saved.name} je posodobljeno.` : `${saved.name} je v hladilniku.`);
      onsaved?.(saved);
    } catch (error) {
      formError = mapSaveFoodItemError(error, editing);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form {onsubmit} class="flex flex-col gap-5" novalidate>
  <Field.Field data-invalid={!!errors.name}>
    <Field.Label for="food-name">Ime *</Field.Label>
    <Input
      id="food-name"
      autocomplete="off"
      placeholder="Jogurt"
      bind:value={name}
      aria-invalid={!!errors.name}
    />
    {#if errors.name}
      <Field.Error errors={[{ message: errors.name }]} />
    {/if}
  </Field.Field>

  <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
    <Field.Field data-invalid={!!errors.quantity}>
      <Field.Label for="food-quantity">Količina *</Field.Label>
      <Input
        id="food-quantity"
        inputmode="decimal"
        autocomplete="off"
        bind:value={quantity}
        aria-invalid={!!errors.quantity}
      />
      {#if errors.quantity}
        <Field.Error errors={[{ message: errors.quantity }]} />
      {/if}
    </Field.Field>

    <Field.Field data-invalid={!!errors.unit}>
      <Field.Label for="food-unit">Merska enota *</Field.Label>
      <Select.Root type="single" bind:value={unit as string}>
        <Select.Trigger id="food-unit" class="w-full" aria-invalid={!!errors.unit}>
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

  <Field.Field>
    <Field.Label for="food-expiration">Rok uporabe</Field.Label>
    <div class="flex gap-2">
      <Popover.Root bind:open={calendarOpen}>
        <Popover.Trigger id="food-expiration">
          {#snippet child({ props })}
            <Button
              {...props}
              variant="outline"
              class={cn('flex-1 justify-start font-normal', !expiration && 'text-muted-foreground')}
            >
              <CalendarIcon data-icon="inline-start" />
              {expiration ? formatExpiration(expiration.toString()) : 'Izberi datum'}
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto p-0" align="start">
          <Calendar
            type="single"
            value={expiration}
            onValueChange={selectDate}
            placeholder={expiration ?? currentDate()}
            locale="sl-SI"
            weekdayFormat="short"
          />
        </Popover.Content>
      </Popover.Root>
      {#if expiration}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Odstrani rok uporabe"
          onclick={() => (expiration = undefined)}
        >
          <XIcon />
        </Button>
      {/if}
    </div>
    <Field.Description>Neobvezno. Brez roka je živilo na koncu seznama.</Field.Description>
  </Field.Field>

  <Field.Field data-invalid={!!errors.category}>
    <Field.Label for="food-category">Mesto v hladilniku *</Field.Label>
    <Select.Root type="single" bind:value={category}>
      <Select.Trigger
        id="food-category"
        class={cn('w-full', !categoryMeta && 'text-muted-foreground')}
        aria-invalid={!!errors.category}
      >
        {#if categoryMeta}
          <span class="flex items-center gap-2">
            <categoryMeta.icon class="text-muted-foreground" />
            {categoryMeta.label}
          </span>
        {:else}
          Izberi kategorijo
        {/if}
      </Select.Trigger>
      <Select.Content>
        {#each FOOD_CATEGORY_OPTIONS as option (option.value)}
          <Select.Item value={option.value} label={option.label}>
            <option.icon class="text-muted-foreground" />
            {option.label}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    {#if errors.category}
      <Field.Error errors={[{ message: errors.category }]} />
    {/if}
  </Field.Field>

  {#if formError}
    <p class="text-sm text-destructive" role="alert">{formError}</p>
  {/if}

  <Dialog.Footer class="gap-2 sm:gap-2">
    <Button type="button" variant="outline" onclick={() => oncancel?.()}>Prekliči</Button>
    <Button type="submit" class="sm:min-w-28" disabled={isSubmitting}>
      {#if isSubmitting}
        <Spinner data-icon="inline-start" />
        Shranjujem ...
      {:else}
        Shrani
      {/if}
    </Button>
  </Dialog.Footer>
</form>
