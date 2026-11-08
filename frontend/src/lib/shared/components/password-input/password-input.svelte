<script lang="ts">
  import EyeIcon from '@lucide/svelte/icons/eye';
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import type { ComponentProps } from 'svelte';
  import { Input } from '#lib/shared/ui/input/index.js';
  import { cn } from '#lib/shared/utils.js';

  let {
    value = $bindable(''),
    class: className,
    ...restProps
  }: Omit<ComponentProps<typeof Input>, 'type' | 'files'> = $props();

  let visible = $state(false);
</script>

<div class="relative">
  <Input
    bind:value
    type={visible ? 'text' : 'password'}
    class={cn('pr-9', className)}
    {...restProps}
  />
  <button
    type="button"
    onclick={() => (visible = !visible)}
    aria-label={visible ? 'Skrij geslo' : 'Pokaži geslo'}
    aria-pressed={visible}
    tabindex={-1}
    class="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground"
  >
    {#if visible}
      <EyeOffIcon class="size-4" />
    {:else}
      <EyeIcon class="size-4" />
    {/if}
  </button>
</div>
