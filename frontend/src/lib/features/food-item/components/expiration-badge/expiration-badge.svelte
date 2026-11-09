<script lang="ts">
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { EXPIRATION_LABELS, isExpirationWarning } from '../../lib/expiration.js';
  import type { ExpirationStatus } from '../../types/food-item.js';

  let {
    status,
    marker = false,
    class: className,
  }: { status: ExpirationStatus | null; marker?: boolean; class?: string } = $props();
</script>

{#if isExpirationWarning(status)}
  <Badge
    variant={status === 'EXPIRED' ? 'default' : 'outline'}
    title={EXPIRATION_LABELS[status]}
    class={cn(
      status === 'EXPIRED' ? 'bg-brand-dark text-white' : 'border-primary bg-card text-primary',
      marker && 'size-5 rounded-full p-0 text-[11px] font-bold',
      className,
    )}
  >
    {#if marker}
      <span aria-hidden="true">!</span>
      <span class="sr-only">{EXPIRATION_LABELS[status]}</span>
    {:else}
      {EXPIRATION_LABELS[status]}
    {/if}
  </Badge>
{/if}
