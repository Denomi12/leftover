<script lang="ts">
  import { invalidate } from '$app/navigation';
  import PencilIcon from '@lucide/svelte/icons/pencil';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import { formatQuantity } from '#lib/features/food-item/index.js';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import { Checkbox } from '#lib/shared/ui/checkbox/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import * as Item from '#lib/shared/ui/item/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { shoppingItemApi } from '../../api/shopping-item.api.js';
  import {
    mapDeleteShoppingItemError,
    mapUpdateShoppingItemError,
  } from '../../api/shopping-item-errors.js';
  import { SHOPPING_ITEMS_DEPENDENCY } from '../../lib/shopping-list.js';
  import type { ShoppingItem } from '../../types/shopping-item.js';
  import ShoppingItemDialog from '../shopping-item-dialog/shopping-item-dialog.svelte';

  let {
    items,
    householdId,
    canEdit,
    onadd,
  }: { items: ShoppingItem[]; householdId: string; canEdit: boolean; onadd: () => void } = $props();

  let overrides = $state<Record<string, boolean>>({});
  let deleting = $state<Record<string, boolean>>({});
  let editOpen = $state(false);
  let editedItem = $state<ShoppingItem | null>(null);

  function openEdit(item: ShoppingItem) {
    editedItem = item;
    editOpen = true;
  }

  const isCompleted = (item: ShoppingItem) => overrides[item.id] ?? item.completed;
  const toBuy = $derived(items.filter((item) => !isCompleted(item)));
  const bought = $derived(items.filter(isCompleted));

  async function toggle(item: ShoppingItem, completed: boolean) {
    overrides[item.id] = completed;
    try {
      await shoppingItemApi.update(householdId, item.id, { completed });
      await invalidate(SHOPPING_ITEMS_DEPENDENCY);
    } catch (error) {
      toast.error(mapUpdateShoppingItemError(error));
    } finally {
      delete overrides[item.id];
    }
  }

  async function remove(item: ShoppingItem) {
    deleting[item.id] = true;
    try {
      await shoppingItemApi.remove(householdId, item.id);
      await invalidate(SHOPPING_ITEMS_DEPENDENCY);
      toast.success(`${item.name} je odstranjeno s seznama.`);
    } catch (error) {
      toast.error(mapDeleteShoppingItemError(error));
    } finally {
      delete deleting[item.id];
    }
  }
</script>

{#snippet section(title: string, list: ShoppingItem[])}
  <Card.Root>
    <Card.Header>
      <Card.Title
        class="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase"
      >
        {title}
        <Badge variant="secondary">{list.length}</Badge>
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <Item.Group class="gap-2">
        {#each list as item (item.id)}
          {@const completed = isCompleted(item)}
          <Item.Root variant="outline">
            {#snippet child({ props })}
              <label
                {...props}
                class={cn(props.class as string, 'cursor-pointer hover:bg-muted/50')}
              >
                <Item.Media>
                  <Checkbox
                    checked={completed}
                    onCheckedChange={(checked) => toggle(item, checked)}
                    aria-label={`${item.name} kupljeno`}
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title
                    class={cn('text-base', completed && 'text-muted-foreground line-through')}
                  >
                    {item.name}
                  </Item.Title>
                  {#if item.source === 'MEAL_PLAN'}
                    <Item.Description>Iz načrta obrokov</Item.Description>
                  {/if}
                </Item.Content>
                <Item.Actions
                  class={cn('font-medium tabular-nums', completed && 'text-muted-foreground')}
                >
                  {formatQuantity(item.quantity, item.unit)}
                  {#if canEdit && item.source === 'MANUAL'}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Uredi ${item.name}`}
                      class="text-muted-foreground"
                      onclick={(event) => {
                        event.preventDefault();
                        openEdit(item);
                      }}
                    >
                      <PencilIcon />
                    </Button>
                  {/if}
                  {#if canEdit && (item.source === 'MANUAL' || completed)}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Odstrani ${item.name}`}
                      class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      disabled={deleting[item.id]}
                      onclick={(event) => {
                        event.preventDefault();
                        remove(item);
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  {/if}
                </Item.Actions>
              </label>
            {/snippet}
          </Item.Root>
        {/each}
      </Item.Group>
    </Card.Content>
  </Card.Root>
{/snippet}

{#if items.length === 0}
  <Empty.Root class="border border-dashed bg-card py-16">
    <Empty.Header>
      <Empty.Media variant="icon" class="bg-secondary text-primary">
        <ShoppingCartIcon />
      </Empty.Media>
      <Empty.Title>Nakupovalni seznam je prazen</Empty.Title>
      <Empty.Description>
        Ko načrtuješ obrok, se sestavine, ki jih ni doma, samodejno dodajo sem. Postavke lahko dodaš
        tudi sam.
      </Empty.Description>
    </Empty.Header>
    {#if canEdit}
      <Empty.Content>
        <Button onclick={onadd}>
          <PlusIcon data-icon="inline-start" />
          Dodaj postavko
        </Button>
      </Empty.Content>
    {/if}
  </Empty.Root>
{:else}
  <div class="flex flex-col gap-6">
    {#if toBuy.length > 0}
      {@render section('Za nakup', toBuy)}
    {/if}
    {#if bought.length > 0}
      {@render section('Kupljeno', bought)}
    {/if}
  </div>
{/if}

{#if canEdit}
  <ShoppingItemDialog bind:open={editOpen} {householdId} item={editedItem} />
{/if}
