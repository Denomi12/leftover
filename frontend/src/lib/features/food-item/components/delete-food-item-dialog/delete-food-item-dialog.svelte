<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import * as AlertDialog from '#lib/shared/ui/alert-dialog/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { foodItemApi } from '../../api/food-item.api.js';
  import { mapDeleteFoodItemError } from '../../api/food-item-errors.js';
  import { formatExpiration } from '../../lib/expiration.js';
  import { FOOD_ITEMS_DEPENDENCY } from '../../lib/food-item-routes.js';
  import { formatQuantity } from '../../lib/food-units.js';
  import type { FoodItem } from '../../types/food-item.js';

  let {
    open = $bindable(false),
    householdId,
    item,
  }: { open?: boolean; householdId: string; item: FoodItem | null } = $props();

  let isDeleting = $state(false);

  async function confirmDelete(event: MouseEvent) {
    event.preventDefault();
    if (!item) return;

    isDeleting = true;
    try {
      await foodItemApi.remove(householdId, item.id);
      await invalidate(FOOD_ITEMS_DEPENDENCY);
      toast.success(`${item.name} je odstranjeno iz hladilnika.`);
      open = false;
    } catch (error) {
      toast.error(mapDeleteFoodItemError(error));
    } finally {
      isDeleting = false;
    }
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Odstranim {item?.name}?</AlertDialog.Title>
      <AlertDialog.Description>
        {#if item}
          Iz hladilnika bo odstranjeno {formatQuantity(item.quantity, item.unit)}
          ({item.expirationDate
            ? `rok ${formatExpiration(item.expirationDate)}`
            : 'brez roka uporabe'}). Tega ni mogoče razveljaviti.
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
