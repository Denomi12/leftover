<script lang="ts">
  import { cn } from '#lib/shared/utils.js';
  import { formatGroupQuantity, type FoodGroup } from '../../lib/food-groups.js';
  import { formatBatchCount } from '../../lib/food-units.js';

  let {
    group,
    selected = false,
    onselect,
  }: {
    group: FoodGroup;
    selected?: boolean;
    onselect: (group: FoodGroup) => void;
  } = $props();

  const quantity = $derived(formatGroupQuantity(group.items));
  const batches = $derived(group.items.length);
  const label = $derived(
    batches > 1
      ? `${group.name}, ${quantity}, ${formatBatchCount(batches)}`
      : `${group.name}, ${quantity}`,
  );
</script>

<button
  type="button"
  data-food-item={group.key}
  aria-label={label}
  aria-pressed={selected}
  title={label}
  onclick={() => onselect(group)}
  class="group/item flex w-[4.75rem] shrink-0 flex-col items-center gap-2 rounded-xl pt-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
>
  <span
    class={cn(
      'relative flex size-16 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-card p-1 shadow-[0_6px_14px_-10px_rgb(11_21_48/0.45)] transition-[translate,box-shadow,border-color] duration-200 group-hover/item:-translate-y-0.5 group-hover/item:border-primary/60 group-hover/item:shadow-[0_12px_20px_-12px_rgb(37_99_235/0.55)] group-active/item:translate-y-0',
      selected && 'border-solid border-primary ring-2 ring-primary/25',
    )}
  >
    <span
      lang="sl"
      class="line-clamp-2 w-full overflow-hidden text-center text-[10px] leading-tight font-medium break-words hyphens-auto text-muted-foreground"
    >
      {group.name}
    </span>
    {#if batches > 1}
      <span
        class="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground tabular-nums"
      >
        {batches}
      </span>
    {/if}
  </span>
  <span
    class={cn(
      'max-w-full truncate rounded-full border bg-card px-2 py-0.5 text-xs font-medium tabular-nums transition-colors',
      selected && 'border-primary bg-primary text-primary-foreground',
    )}
  >
    {quantity}
  </span>
</button>
