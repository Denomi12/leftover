<script lang="ts">
  import LeafIcon from '@lucide/svelte/icons/leaf';
  import { cn } from '#lib/shared/utils.js';

  let { size = 'default', class: className }: { size?: 'default' | 'lg'; class?: string } =
    $props();
</script>

<span class={cn('inline-flex items-center gap-2', className)}>
  <span
    class={cn(
      'flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground',
      size === 'lg' ? 'size-9' : 'size-7',
    )}
  >
    <LeafIcon class={size === 'lg' ? 'size-5' : 'size-4'} />
  </span>
  <span
    class={cn('font-display font-medium tracking-[-0.02em]', size === 'lg' ? 'text-xl' : 'text-lg')}
  >
    Leftover
  </span>
</span>
