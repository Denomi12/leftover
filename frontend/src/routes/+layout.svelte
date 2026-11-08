<script lang="ts">
  import '../app.css';
  import favicon from '#lib/assets/favicon.svg';
  import { Toaster } from '#lib/shared/ui/sonner/index.js';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Leftover</title>
</svelte:head>

<Toaster position="top-center" />
{@render children()}
