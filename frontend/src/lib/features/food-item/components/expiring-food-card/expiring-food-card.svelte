<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import * as Card from '#lib/shared/ui/card/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { EXPIRING_SOON_DAYS, formatExpiration } from '../../lib/expiration.js';
  import { foodGroupKey } from '../../lib/food-groups.js';
  import type { FoodItem } from '../../types/food-item.js';
  import ExpirationBadge from '../expiration-badge/expiration-badge.svelte';

  let {
    items,
    selectedKey,
    onselect,
  }: {
    items: FoodItem[];
    selectedKey: string | null;
    onselect: (item: FoodItem) => void;
  } = $props();
</script>

<Card.Root class="gap-3">
  <Card.Header>
    <Card.Title class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      Kmalu potečejo in potekla · {items.length}
    </Card.Title>
  </Card.Header>
  <Card.Content class="px-0">
    {#if items.length === 0}
      <p
        class="mx-(--card-spacing) flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-3 text-sm text-secondary-foreground"
      >
        <CircleCheckIcon class="size-4 shrink-0 text-primary" />
        Nobeno živilo ne poteče v naslednjih {EXPIRING_SOON_DAYS} dneh
      </p>
    {:else}
      <ul
        class="flex max-h-72 flex-col gap-1.5 overflow-y-auto px-(--card-spacing) py-1 scrollbar-soft"
      >
        {#each items as item (item.id)}
          {@const expired = item.expirationStatus === 'EXPIRED'}
          <li>
            <button
              type="button"
              aria-pressed={foodGroupKey(item) === selectedKey}
              onclick={() => onselect(item)}
              class={cn(
                'flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2 text-left text-sm outline-none transition-[border-color,translate] duration-200 hover:-translate-y-px hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50',
                expired && 'border-brand-dark/50',
                foodGroupKey(item) === selectedKey && 'border-primary ring-1 ring-primary',
              )}
            >
              <ExpirationBadge status={item.expirationStatus} marker />
              <span class="min-w-0 flex-1 truncate font-medium">{item.name}</span>
              {#if item.expirationDate}
                <span class="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {expired ? 'poteklo' : 'rok'}
                  {formatExpiration(item.expirationDate)}
                </span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </Card.Content>
</Card.Root>
