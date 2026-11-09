<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import * as AlertDialog from '#lib/shared/ui/alert-dialog/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { plannedMealApi } from '../../api/planned-meal.api.js';
  import { mapDeletePlannedMealError } from '../../api/planned-meal-errors.js';
  import { formatDay, PLANNED_MEALS_DEPENDENCY } from '../../lib/meal-plan.js';
  import type { PlannedMeal } from '../../types/planned-meal.js';

  let {
    open = $bindable(false),
    householdId,
    meal,
  }: { open?: boolean; householdId: string; meal: PlannedMeal | null } = $props();

  let isDeleting = $state(false);

  const day = $derived(meal ? formatDay(meal.date) : null);

  async function confirmDelete(event: MouseEvent) {
    event.preventDefault();
    if (!meal) return;

    isDeleting = true;
    try {
      await plannedMealApi.remove(householdId, meal.id);
      await invalidate(PLANNED_MEALS_DEPENDENCY);
      toast.success(`${meal.name} je odstranjeno iz načrta.`);
      open = false;
    } catch (error) {
      toast.error(mapDeletePlannedMealError(error));
    } finally {
      isDeleting = false;
    }
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Odstranim {meal?.name}?</AlertDialog.Title>
      <AlertDialog.Description>
        {#if meal && day}
          Obrok za {day.weekday.toLowerCase()}, {day.dayMonth} bo odstranjen iz načrta.
          {meal.completed
            ? 'Zaloga, porabljena za ta obrok, se ne povrne.'
            : 'Njegove sestavine se umaknejo z nakupovalnega seznama.'}
          Tega ni mogoče razveljaviti.
        {/if}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={isDeleting}>Prekliči</AlertDialog.Cancel>
      <AlertDialog.Action
        variant="destructive"
        disabled={isDeleting}
        onclick={confirmDelete}
        class="sm:min-w-28"
      >
        {#if isDeleting}
          <Spinner data-icon="inline-start" />
          Odstranjujem ...
        {:else}
          Odstrani
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
