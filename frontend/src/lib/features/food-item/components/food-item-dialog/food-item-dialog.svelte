<script lang="ts">
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import type { FoodCategory, FoodItem } from '../../types/food-item.js';
  import FoodItemForm from '../food-item-form/food-item-form.svelte';

  let {
    open = $bindable(false),
    householdId,
    item = null,
    initialCategory = null,
    onsaved,
  }: {
    open?: boolean;
    householdId: string;
    item?: FoodItem | null;
    initialCategory?: FoodCategory | null;
    onsaved?: (item: FoodItem) => void;
  } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{item ? 'Uredi živilo' : 'Dodaj živilo'}</Dialog.Title>
      <Dialog.Description>
        {item
          ? 'Spremembe vidijo vsi člani gospodinjstva.'
          : 'Živilo vidijo vsi člani gospodinjstva.'}
      </Dialog.Description>
    </Dialog.Header>
    {#if open}
      <FoodItemForm
        {householdId}
        {item}
        {initialCategory}
        oncancel={() => (open = false)}
        onsaved={(saved) => {
          open = false;
          onsaved?.(saved);
        }}
      />
    {/if}
  </Dialog.Content>
</Dialog.Root>
