<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import * as Card from '#lib/shared/ui/card/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { formatExpiration } from '../../lib/expiration.js';
  import { FOOD_CATEGORIES } from '../../lib/food-categories.js';
  import { formatQuantity } from '../../lib/food-units.js';
  import type { FoodItem } from '../../types/food-item.js';

  let {
    items,
    selectedId,
    onselect,
  }: {
    items: FoodItem[];
    selectedId: string | null;
    onselect: (item: FoodItem) => void;
  } = $props();
</script>

<Card.Root class="gap-4">
  <Card.Header>
    <Card.Title class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      Vsa živila · {items.length}
    </Card.Title>
  </Card.Header>

  <Card.Content class="px-0">
    {#if items.length === 0}
      <Empty.Root class="mx-(--card-spacing) border border-dashed py-8">
        <Empty.Header>
          <Empty.Media variant="icon" class="bg-secondary text-primary">
            <ArchiveIcon />
          </Empty.Media>
          <Empty.Title class="text-base">V hladilniku še ni živil</Empty.Title>
          <Empty.Description>
            Dodana živila se prikažejo tukaj in na svojem mestu v hladilniku.
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    {:else}
      <div data-food-list class="max-h-[34rem] overflow-y-auto scrollbar-soft">
        <ul class="flex flex-col gap-1.5 px-(--card-spacing) py-1">
          {#each items as item (item.id)}
            {@const meta = FOOD_CATEGORIES[item.category]}
            <li>
              <button
                type="button"
                data-food-row={item.id}
                aria-pressed={item.id === selectedId}
                onclick={() => onselect(item)}
                class={cn(
                  'flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left outline-none transition-[border-color,background-color,box-shadow,translate] duration-200 hover:-translate-y-px hover:border-primary/40 hover:shadow-[0_10px_20px_-16px_rgb(37_99_235/0.6)] focus-visible:ring-3 focus-visible:ring-ring/50',
                  item.id === selectedId && 'border-primary bg-secondary/60 ring-1 ring-primary',
                )}
              >
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:size-4"
                >
                  <meta.icon />
                </span>
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span class="truncate text-sm font-medium">{item.name}</span>
                  <span class="truncate text-xs text-muted-foreground">
                    {meta.label} · {formatQuantity(item.quantity, item.unit)}
                    {#if item.expirationDate}
                      · rok {formatExpiration(item.expirationDate)}
                    {/if}
                  </span>
                </span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
