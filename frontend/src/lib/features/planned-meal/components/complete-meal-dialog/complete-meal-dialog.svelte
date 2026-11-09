<script lang="ts">
  import { invalidate } from '$app/navigation';
  import ChefHatIcon from '@lucide/svelte/icons/chef-hat';
  import { toast } from 'svelte-sonner';
  import { formatQuantity } from '#lib/features/food-item/index.js';
  import * as AlertDialog from '#lib/shared/ui/alert-dialog/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { plannedMealApi } from '../../api/planned-meal.api.js';
  import { mapCompletePlannedMealError } from '../../api/planned-meal-errors.js';
  import { PLANNED_MEALS_DEPENDENCY } from '../../lib/meal-plan.js';
  import type { PlannedMeal } from '../../types/planned-meal.js';

  let {
    open = $bindable(false),
    householdId,
    meal,
  }: { open?: boolean; householdId: string; meal: PlannedMeal | null } = $props();

  let isCompleting = $state(false);

  const hasMissing = $derived(
    meal?.ingredients.some((ingredient) => ingredient.stockStatus === 'MISSING') ?? false,
  );

  async function confirmComplete(event: MouseEvent) {
    event.preventDefault();
    if (!meal) return;

    isCompleting = true;
    try {
      await plannedMealApi.complete(householdId, meal.id);
      await invalidate(PLANNED_MEALS_DEPENDENCY);
      toast.success(`${meal.name} je pripravljeno. Sestavine so odštete od zaloge.`);
      open = false;
    } catch (error) {
      toast.error(mapCompletePlannedMealError(error));
      await invalidate(PLANNED_MEALS_DEPENDENCY);
    } finally {
      isCompleting = false;
    }
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Media class="bg-secondary text-primary">
        <ChefHatIcon />
      </AlertDialog.Media>
      <AlertDialog.Title>Označim {meal?.name} kot pripravljeno?</AlertDialog.Title>
      <AlertDialog.Description>
        Iz zaloge bodo odštete spodnje sestavine, živila brez preostale količine pa odstranjena.
        Tega ni mogoče razveljaviti.
      </AlertDialog.Description>
    </AlertDialog.Header>

    {#if meal}
      <ul class="flex max-h-56 flex-col gap-2 overflow-y-auto rounded-md border p-3 text-sm">
        {#each meal.ingredients as ingredient (ingredient.id)}
          <li class="flex items-center justify-between gap-3">
            <span class="truncate">{ingredient.name}</span>
            <span class="shrink-0 text-muted-foreground tabular-nums">
              −{formatQuantity(ingredient.quantity, ingredient.unit)}
            </span>
          </li>
        {/each}
      </ul>
      {#if hasMissing}
        <p class="text-sm text-brand-dark">
          Nekaterih sestavin je premalo, zato bo porabljeno le, kar je na zalogi.
        </p>
      {/if}
    {/if}

    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={isCompleting}>Prekliči</AlertDialog.Cancel>
      <AlertDialog.Action disabled={isCompleting} onclick={confirmComplete} class="sm:min-w-36">
        {#if isCompleting}
          <Spinner data-icon="inline-start" />
          Označujem ...
        {:else}
          Označi kot pripravljeno
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
