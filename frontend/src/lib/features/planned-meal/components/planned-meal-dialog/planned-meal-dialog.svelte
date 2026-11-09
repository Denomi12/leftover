<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { parseDate, type DateValue } from '@internationalized/date';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import XIcon from '@lucide/svelte/icons/x';
  import { untrack } from 'svelte';
  import { toast } from 'svelte-sonner';
  import {
    currentDate,
    FOOD_UNIT_LABELS,
    FOOD_UNITS,
    type FoodUnit,
  } from '#lib/features/food-item/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import { Calendar } from '#lib/shared/ui/calendar/index.js';
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import { Input } from '#lib/shared/ui/input/index.js';
  import * as Popover from '#lib/shared/ui/popover/index.js';
  import * as Select from '#lib/shared/ui/select/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { plannedMealApi } from '../../api/planned-meal.api.js';
  import { mapSavePlannedMealError } from '../../api/planned-meal-errors.js';
  import { formatDay, PLANNED_MEALS_DEPENDENCY } from '../../lib/meal-plan.js';
  import {
    createPlannedMealSchema,
    PLANNED_MEAL_INGREDIENTS_MAX,
  } from '../../validations/planned-meal.js';
  import type { PlannedMeal } from '../../types/planned-meal.js';

  let {
    open = $bindable(false),
    householdId,
    meal = null,
  }: { open?: boolean; householdId: string; meal?: PlannedMeal | null } = $props();

  const newIngredient = (
    ingredient: { name: string; quantity: string; unit: FoodUnit } = {
      name: '',
      quantity: '',
      unit: 'g',
    },
  ) => ({ key: crypto.randomUUID(), ...ingredient });

  const editing = $derived(meal !== null);

  let name = $state('');
  let date = $state<DateValue | undefined>(currentDate());
  let ingredients = $state([newIngredient()]);
  let calendarOpen = $state(false);
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  const result = $derived(
    createPlannedMealSchema.safeParse({
      name,
      date: date?.toString(),
      ingredients: ingredients.map(({ name, quantity, unit }) => ({ name, quantity, unit })),
    }),
  );

  const errors = $derived.by(() => {
    const map: Record<string, string | undefined> = {};
    if (!submitted || result.success) return map;
    for (const issue of result.error.issues) map[issue.path.join('.')] ??= issue.message;
    return map;
  });

  const dateLabel = $derived.by(() => {
    if (!date) return 'Izberi datum';
    const { weekday, dayMonth, relative } = formatDay(date.toString());
    return `${weekday}, ${dayMonth}${relative ? ` · ${relative}` : ''}`;
  });

  $effect(() => {
    if (!open) return;
    untrack(() => {
      name = meal?.name ?? '';
      date = meal ? parseDate(meal.date) : currentDate();
      ingredients = meal
        ? meal.ingredients.map((ingredient) =>
            newIngredient({
              name: ingredient.name,
              quantity: String(ingredient.quantity).replace('.', ','),
              unit: ingredient.unit,
            }),
          )
        : [newIngredient()];
      submitted = false;
      formError = null;
    });
  });

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const saved = meal
        ? await plannedMealApi.update(householdId, meal.id, result.data)
        : await plannedMealApi.create(householdId, result.data);
      await invalidate(PLANNED_MEALS_DEPENDENCY);
      toast.success(meal ? `${saved.name} je posodobljeno.` : `${saved.name} je v načrtu.`);
      open = false;
    } catch (error) {
      formError = mapSavePlannedMealError(error, editing);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
    <Dialog.Header>
      <Dialog.Title>{editing ? 'Uredi obrok' : 'Nov obrok'}</Dialog.Title>
      <Dialog.Description>
        {editing
          ? 'Spremembe sestavin se takoj upoštevajo na nakupovalnem seznamu.'
          : 'Ob vsaki sestavini boš videl, ali jo imaš doma in koliko je manjka.'}
      </Dialog.Description>
    </Dialog.Header>

    <form {onsubmit} class="flex flex-col gap-5" novalidate>
      <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,13rem)]">
        <Field.Field data-invalid={!!errors.name}>
          <Field.Label for="meal-name">Ime obroka *</Field.Label>
          <Input
            id="meal-name"
            autocomplete="off"
            placeholder="npr. Piščanec z rižem"
            bind:value={name}
            aria-invalid={!!errors.name}
          />
          {#if errors.name}
            <Field.Error errors={[{ message: errors.name }]} />
          {/if}
        </Field.Field>

        <Field.Field data-invalid={!!errors.date}>
          <Field.Label for="meal-date">Datum *</Field.Label>
          <Popover.Root bind:open={calendarOpen}>
            <Popover.Trigger id="meal-date">
              {#snippet child({ props })}
                <Button {...props} variant="outline" class="justify-start font-normal">
                  <CalendarIcon data-icon="inline-start" />
                  {dateLabel}
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" align="end">
              <Calendar
                type="single"
                value={date}
                onValueChange={(value) => {
                  date = value;
                  calendarOpen = false;
                }}
                placeholder={date ?? currentDate()}
                locale="sl-SI"
                weekdayFormat="short"
              />
            </Popover.Content>
          </Popover.Root>
          {#if errors.date}
            <Field.Error errors={[{ message: errors.date }]} />
          {/if}
        </Field.Field>
      </div>

      <Field.Set>
        <Field.Legend variant="label">Sestavine *</Field.Legend>
        <ul class="flex flex-col gap-2">
          {#each ingredients as ingredient, index (ingredient.key)}
            {@const nameError = errors[`ingredients.${index}.name`]}
            {@const quantityError = errors[`ingredients.${index}.quantity`]}
            <li class="flex flex-col gap-1">
              <div
                class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_6.5rem_auto]"
              >
                <Input
                  class="max-sm:col-span-3"
                  placeholder="Sestavina"
                  autocomplete="off"
                  aria-label={`Sestavina ${index + 1}`}
                  bind:value={ingredient.name}
                  aria-invalid={!!nameError}
                />
                <Input
                  inputmode="decimal"
                  placeholder="Količina"
                  autocomplete="off"
                  aria-label={`Količina sestavine ${index + 1}`}
                  bind:value={ingredient.quantity}
                  aria-invalid={!!quantityError}
                />
                <Select.Root type="single" bind:value={ingredient.unit as string}>
                  <Select.Trigger class="w-full" aria-label={`Enota sestavine ${index + 1}`}>
                    {FOOD_UNIT_LABELS[ingredient.unit]}
                  </Select.Trigger>
                  <Select.Content>
                    {#each FOOD_UNITS as option (option)}
                      <Select.Item value={option} label={FOOD_UNIT_LABELS[option]}>
                        {FOOD_UNIT_LABELS[option]}
                      </Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Odstrani sestavino ${index + 1}`}
                  class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  disabled={ingredients.length === 1}
                  onclick={() => ingredients.splice(index, 1)}
                >
                  <XIcon />
                </Button>
              </div>
              {#if nameError || quantityError}
                <Field.Error errors={[{ message: nameError ?? quantityError }]} />
              {/if}
            </li>
          {/each}
        </ul>
        {#if errors.ingredients}
          <Field.Error errors={[{ message: errors.ingredients }]} />
        {/if}
        <Button
          variant="outline"
          class="border-dashed text-primary"
          disabled={ingredients.length >= PLANNED_MEAL_INGREDIENTS_MAX}
          onclick={() => ingredients.push(newIngredient())}
        >
          <PlusIcon data-icon="inline-start" />
          Dodaj sestavino
        </Button>
      </Field.Set>

      {#if formError}
        <p class="text-sm text-destructive" role="alert">{formError}</p>
      {/if}

      <Dialog.Footer class="gap-2 sm:gap-2">
        <Button type="button" variant="outline" onclick={() => (open = false)}>Prekliči</Button>
        <Button type="submit" class="sm:min-w-28" disabled={isSubmitting}>
          {#if isSubmitting}
            <Spinner data-icon="inline-start" />
            Shranjujem ...
          {:else}
            {editing ? 'Shrani spremembe' : 'Shrani obrok'}
          {/if}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
